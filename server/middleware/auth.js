const jwt = require('jsonwebtoken');
const Admin = require('../models/Admin');
const User = require('../models/User');

const getBearerToken = (req) => {
  if (req.headers.authorization && req.headers.authorization.startsWith('Bearer ')) {
    return req.headers.authorization.split(' ')[1];
  }

  return null;
};

const signToken = (payload) =>
  jwt.sign(payload, process.env.JWT_SECRET, {
    expiresIn: '30d',
  });

const buildUnauthorizedResponse = (res, message) =>
  res.status(401).json({
    success: false,
    message,
  });

const resolveActorFromToken = async (token) => {
  const decoded = jwt.verify(token, process.env.JWT_SECRET);

  if (decoded.type === 'user') {
    const user = await User.findById(decoded.id).select('+password');

    if (!user) {
      throw new Error('User not found');
    }

    return {
      decoded,
      actor: user,
      actorType: 'user',
    };
  }

  const admin = await Admin.findById(decoded.id).select('+password');

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
    const { actor, actorType } = await resolveActorFromToken(token);

    if (actorType !== 'admin' || !actor.isActive) {
      return buildUnauthorizedResponse(res, 'Admin access required.');
    }

    req.admin = actor;
    req.auth = {
      type: 'admin',
      id: actor._id,
    };

    next();
  } catch (error) {
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

const generateToken = (id) => signToken({ id, type: 'admin' });
const generateUserToken = (id) => signToken({ id, type: 'user' });

module.exports = {
  authMiddleware,
  adminMiddleware,
  userMiddleware,
  protect: adminMiddleware,
  generateToken,
  generateUserToken,
  getBearerToken,
};
