import jwt from 'jsonwebtoken';

export const authenticateToken = (req, res, next) => {
  try {
    const authHeader = req.headers['authorization'];
    const token = authHeader && authHeader.split(' ')[1];

    if (!token) {
      return res.status(401).json({
        success: false,
        message: 'Access token required',
      });
    }

    jwt.verify(token, process.env.JWT_SECRET, (error, user) => {
      if (error) {
        return res.status(403).json({
          success: false,
          message: 'Invalid or expired token',
          error: error.message,
        });
      }

      req.user = user;
      next();
    });
  } catch (error) {
    return res.status(500).json({
      success: false,
      message: 'Authentication error',
      error: error.message,
    });
  }
};

export const authorizeAdmin = (req, res, next) => {
  try {
    if (!req.user) {
      return res.status(401).json({
        success: false,
        message: 'User not authenticated',
      });
    }

    if (req.user.role !== 'admin') {
      return res.status(403).json({
        success: false,
        message: 'Only administrators can access this resource',
      });
    }

    next();
  } catch (error) {
    return res.status(500).json({
      success: false,
      message: 'Authorization error',
      error: error.message,
    });
  }
};

export default authenticateToken;
