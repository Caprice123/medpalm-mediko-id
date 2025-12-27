import { ValidationError } from '#errors/validationError';
import authService from '#services/auth.service';

class AuthController {
  async login(req, res) {
    const { googleToken } = req.body;

    // Validate input
    if (!googleToken) {
      throw new ValidationError("Google token is required");
    }

    // Get session data from request
    const sessionData = {
      userAgent: req.headers['user-agent'],
      ipAddress: req.ip || req.connection.remoteAddress
    };

    // Call service method
    const result = await authService.login(
      googleToken,
      sessionData
    );

    return res.status(200).json({
      data: {
        user: result.user,
        accessToken: result.accessToken,
        refreshToken: result.refreshToken,
        accessTokenExpiresAt: result.accessTokenExpiresAt,
        refreshTokenExpiresAt: result.refreshTokenExpiresAt,
      }
    });
  }

  async refresh(req, res) {
    const { refreshToken } = req.body;

    // Validate input
    if (!refreshToken) {
      throw new ValidationError('Refresh token is required');
    }

    // Call service method
    const result = await authService.refreshToken(refreshToken);

    return res.status(200).json({
      data: {
        accessToken: result.accessToken,
        refreshToken: result.refreshToken,
        accessTokenExpiresAt: result.accessTokenExpiresAt,
        refreshTokenExpiresAt: result.refreshTokenExpiresAt,
      }
    });
  }

  async logout(req, res) {
    const token = req.headers.authorization?.replace('Bearer ', '');

    if (!token) {
      throw new ValidationError('Token is required');
    }

    await authService.logout(token);

    return res.status(200).json({
      message: 'Logout successful'
    });
  }
}

export default new AuthController();
