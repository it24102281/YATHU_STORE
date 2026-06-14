const jwt = require('jsonwebtoken');
const Admin = require('../models/Admin');
const User = require('../models/User');

const getBearerToken = (req) => {
  if (req.headers.authorization && req.headers.authorization.startsWith('Bearer ')) {
    return req.headers.authorization.split(' ')[1];
  }

  return null;
};

const getJwtExpiry = () => process.env.JWT_EXPIRE || '30d';

const signToken = (payload) =>
  jwt.sign(payload, process.env.JWT_SECRET, {
    expiresIn: getJwtExpiry(),
  });

const buildUnauthorizedResponse = (res, message) =>
  res.status(401).json({
    success: false,
    message,
  });

const buildForbiddenResponse = (res, message) =>
  res.status(403).json({
    success: false,
    message,
  });

const resolveActorFromToken = async (token) => {
  const decoded = jwt.verify(token, process.env.JWT_SECRET);

  if (decoded.type === 'user') {
    const user = await User.findById(decoded.id);

    if (!user) {
      throw new Error('User not found');
    }

    return {
      decoded,
      actor: user,
      actorType: 'user',
    };
  }

  const admin = await Admin.findById(decoded.id);

  if (!admin) {
    throw new Error('Admin not found');
  }

  return {
    decoded,
    actor: admin,
    actorType: 'admin',
  };
};

const authMiddleware = async (req, res, next) => {
  const token = getBearerToken(req);

  if (!token) {
    return buildUnauthorizedResponse(res, 'Access denied. No token provided.');
  }

  try {
    const { actor, actorType, decoded } = await resolveActorFromToken(token);

    if (actorType === 'admin') {
      if (!actor.isActive) {
        return buildUnauthorizedResponse(res, 'Invalid token or account deactivated.');
      }

      req.admin = actor;
    }

    if (actorType === 'user') {
      if (actor.isBlocked) {
        return buildUnauthorizedResponse(res, 'Your account has been blocked. Please contact admin.');
      }

      req.user = actor;
    }

    req.auth = {
      type: actorType,
      id: actor._id,
      tokenPayload: decoded,
    };

    next();
  } catch (error) {
    return buildUnauthorizedResponse(res, 'Invalid token.');
  }
};

const adminMiddleware = async (req, res, next) => {
  const token = getBearerToken(req);

  if (!token) {
    return buildUnauthorizedResponse(res, 'Access denied. No token provided.');
  }

  try {
    const { actor, actorType, decoded } = await resolveActorFromToken(token);

    console.log('[Admin Middleware] Token resolved', {
      actorType,
      role: decoded?.role,
      email: decoded?.email || actor?.email || null,
    });

    if (actorType !== 'admin' || decoded?.role !== 'admin') {
      console.log('[Admin Middleware] Access denied: non-admin token');
      return buildForbiddenResponse(res, 'Access denied');
    }

    if (!actor.isActive) {
      console.log('[Admin Middleware] Access denied: admin inactive');
      return buildForbiddenResponse(res, 'Access denied');
    }

    req.admin = actor;
    req.auth = {
      type: 'admin',
      id: actor._id,
      tokenPayload: decoded,
    };

    console.log('[Admin Middleware] Access granted', {
      adminId: String(actor._id),
      email: actor.email,
    });

    next();
  } catch (error) {
    console.log('[Admin Middleware] Invalid token', {
      message: error.message,
    });
    return buildUnauthorizedResponse(res, 'Invalid token.');
  }
};

const userMiddleware = async (req, res, next) => {
  const token = getBearerToken(req);

  if (!token) {
    return buildUnauthorizedResponse(res, 'Access denied. No token provided.');
  }

  try {
    const { actor, actorType } = await resolveActorFromToken(token);

    if (actorType !== 'user') {
      return buildUnauthorizedResponse(res, 'Customer access required.');
    }

    if (actor.isBlocked) {
      return buildUnauthorizedResponse(res, 'Your account has been blocked. Please contact admin.');
    }

    req.user = actor;
    req.auth = {
      type: 'user',
      id: actor._id,
    };

    next();
  } catch (error) {
    return buildUnauthorizedResponse(res, 'Invalid token.');
  }
};

const generateToken = (admin) =>
  signToken({
    id: admin?._id ? String(admin._id) : undefined,
    email: admin?.email || '',
    type: 'admin',
    role: 'admin',
  });
const generateUserToken = (user) =>
  signToken({
    id: user?._id ? String(user._id) : undefined,
    email: user?.email || '',
    type: 'user',
    role: 'user',
  });

module.exports = {
  authMiddleware,
  adminMiddleware,
  userMiddleware,
  protect: adminMiddleware,
  generateToken,
  generateUserToken,
  getBearerToken,
};
