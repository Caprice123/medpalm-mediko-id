import { AuthorizationError } from '#errors/authorizationError';
import authService from '#services/auth.service';

/**
 * Authentication middleware
 * Verifies JWT token and attaches user to request
 */
export const authenticate = async (req, res, next) => {
  try {
    // Get token from Authorization header
    const authHeader = req.headers.authorization;

    if (!authHeader || !authHeader.startsWith('Bearer ')) {
      return res.status(401).json({
        message: 'Authorization token is required'
      });
    }

    const token = authHeader.replace('Bearer ', '');

    // Verify token and get user
    console.log(authHeader)
    console.log(token)
    const { user, session } = await authService.verifyToken(token);

    // Attach user and session to request
    req.user = user;
    req.session = session;

    next();
  } catch (error) {
    console.error('Auth middleware error:', error)
    return res.status(401).json({
      success: false,
      message: 'Invalid or expired token'
    });
  }
};

/**
 * Role-based authorization middleware
 * @param {Array<String>} roles - Allowed roles
 */
export const authorize = (...roles) => {
  return (req, res, next) => {
    if (!req.user) {
      return res.status(401).json({
        message: 'Authentication required'
      });
    }

    if (!roles.includes(req.user.role)) {
      return res.status(403).json({
        message: 'Insufficient permissions'
      });
    }

    next();
  };
};

// Alias for consistency with route files
export const authenticateToken = authenticate;

// Helper middleware to require admin role
export const requireAdmin = authorize('admin');

export default {
  authenticate,
  authorize,
  authenticateToken,
  requireAdmin
};
