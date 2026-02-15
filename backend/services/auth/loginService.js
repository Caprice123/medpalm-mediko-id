import jwt from 'jsonwebtoken';
import prisma from '#prisma/client';
import { ValidationError } from '#errors/validationError';
import { AuthorizationError } from '#errors/authorizationError';
import { verifyGoogleToken } from '#utils/googleAuth';

const JWT_SECRET = process.env.JWT_SECRET || 'your-secret-key-change-this-in-production';
const JWT_EXPIRES_IN = process.env.JWT_EXPIRES_IN || '1d'; // Access token: 15 minutes
const JWT_REFRESH_EXPIRES_IN = process.env.JWT_REFRESH_EXPIRES_IN || '30d'; // Refresh token: 30 days

class AuthService {
  async login(googleToken, sessionData = {}) {
    const { userAgent, ipAddress } = sessionData;

    // Verify Google token and get user info
    const googleUserInfo = await verifyGoogleToken(googleToken);

    if (!googleUserInfo.emailVerified) {
      throw new ValidationError('Email not verified with Google');
    }

    // Check if user exists by email or googleId
    let user = await prisma.users.findFirst({
      where: {
        OR: [
          { email: googleUserInfo.email },
          { google_id: googleUserInfo.google_id }
        ]
      }
    });

    if (!user) {
      // Create new user
      user = await prisma.users.create({
        data: {
          email: googleUserInfo.email,
          name: googleUserInfo.name,
          picture: googleUserInfo.picture,
          google_id: googleUserInfo.google_id,
          role: 'user',
          is_active: true
        }
      });
    } else {
      // Update user info from Google if changed
      user = await prisma.users.update({
        where: { id: user.id },
        data: {
          name: googleUserInfo.name,
          picture: googleUserInfo.picture,
          google_id: googleUserInfo.google_id
        }
      });

      if (!user.is_active) {
        throw new AuthorizationError('User account is inactive');
      }
    }

    // Generate access token (short-lived)
    const accessToken = jwt.sign(
      {
        user_id: user.id,
        email: user.email,
        role: user.role
      },
      JWT_SECRET,
      { expiresIn: JWT_EXPIRES_IN }
    );

    // Generate refresh token (long-lived)
    const refreshToken = jwt.sign(
      {
        user_id: user.id,
        type: 'refresh'
      },
      JWT_SECRET,
      { expiresIn: JWT_REFRESH_EXPIRES_IN }
    );

    // Calculate expiration dates
    const accessTokenExpiresAt = new Date();
    accessTokenExpiresAt.setMinutes(accessTokenExpiresAt.getMinutes() + 15); // 15 minutes from now

    const refreshTokenExpiresAt = new Date();
    refreshTokenExpiresAt.setDate(refreshTokenExpiresAt.getDate() + 30); // 30 days from now

    // Create new session with both tokens
    await prisma.user_sessions.create({
      data: {
        user_id: user.id,
        token: accessToken,
        refresh_token: refreshToken,
        refresh_token_expires_at: refreshTokenExpiresAt,
        user_agent: userAgent || null,
        ip_address: ipAddress || null,
        expires_at: accessTokenExpiresAt,
        is_active: true
      }
    });

    return {
        user,
        accessToken,
        refreshToken,
        accessTokenExpiresAt: accessTokenExpiresAt.toISOString(),
        refreshTokenExpiresAt: refreshTokenExpiresAt.toISOString(),
    };
  }

  /**
   * Deactivate all sessions for a user
   * @param {String} userId
   */
  async deactivateUserSessions(userId) {
    await prisma.user_sessions.updateMany({
      where: {
        user_id: userId,
        is_active: true
      },
      data: {
        is_active: false
      }
    });
  }

  /**
   * Verify token and get session
   * @param {String} token
   * @returns {Object} { user, session }
   */
  async verifyToken(token) {
    let decoded
    try {
      // Verify JWT
      decoded = jwt.verify(token, JWT_SECRET);
    } catch (error) {
      throw new AuthorizationError('Invalid or expired token');
    }
    console.log(decoded)

    // Check if session exists and is active
    const session = await prisma.user_sessions.findUnique({
      where: { token }
    });

    if (!session || !session.is_active) {
      throw new ValidationError('Session is invalid or expired');
    }

    // Check if session has expired
    if (new Date() > session.expires_at) {
      await prisma.user_sessions.update({
        where: { id: session.id },
        data: { is_active: false }
      });
      throw new AuthorizationError('Session has expired');
    }

    // Get user
    const user = await prisma.users.findUnique({
      where: { id: decoded.user_id },
      select: {
        id: true,
        email: true,
        name: true,
        role: true,
        permissions: true,
        is_active: true,
        created_at: true,
        updated_at: true
      }
    });

    if (!user || !user.is_active) {
      throw new ValidationError('User not found or inactive');
    }

    // Update last active time
    await prisma.user_sessions.update({
      where: { id: session.id },
      data: { last_active_at: new Date() }
    });

    return { user, session };
  }

  /**
   * Refresh access token using refresh token
   * @param {String} refreshToken
   * @returns {Object} { accessToken, refreshToken, accessTokenExpiresAt, refreshTokenExpiresAt }
   */
  async refreshToken(refreshToken) {
    let decodedRefreshToken
    try {
      // Verify refresh token
      decodedRefreshToken = jwt.verify(refreshToken, JWT_SECRET);
    } catch (error) {
      if (error instanceof AuthorizationError) {
        throw error;
      }
      throw new AuthorizationError('Invalid or expired refresh token');
    }
    // Check if this is a refresh token
    if (decodedRefreshToken.type !== 'refresh') {
      throw new AuthorizationError('Invalid token type');
    }

    // Find session with this refresh token
    const session = await prisma.user_sessions.findUnique({
      where: { refresh_token: refreshToken }
    });

    if (!session || !session.is_active) {
      throw new AuthorizationError('Silakan login kembali. Anda sudah terlogout.');
    }

    // Check if refresh token has expired
    if (new Date() > session.refresh_token_expires_at) {
      await prisma.user_sessions.update({
        where: { id: session.id },
        data: { is_active: false }
      });
      throw new AuthorizationError('Refresh token has expired');
    }

    // Get user
    const user = await prisma.users.findUnique({
      where: { id: decodedRefreshToken.user_id }
    });

    if (!user || !user.is_active) {
      throw new AuthorizationError('User not found or inactive');
    }

    // Generate new access token
    const newAccessToken = jwt.sign(
      {
        user_id: user.id,
        email: user.email,
        role: user.role
      },
      JWT_SECRET,
      { expiresIn: JWT_EXPIRES_IN }
    );

    // Generate new refresh token (token rotation for security)
    const newRefreshToken = jwt.sign(
      {
        user_id: user.id,
        type: 'refresh'
      },
      JWT_SECRET,
      { expiresIn: JWT_REFRESH_EXPIRES_IN }
    );

    // Calculate new expiration dates
    const accessTokenExpiresAt = new Date();
    accessTokenExpiresAt.setMinutes(accessTokenExpiresAt.getMinutes() + 15);

    const refreshTokenExpiresAt = new Date();
    refreshTokenExpiresAt.setDate(refreshTokenExpiresAt.getDate() + 30);

    // Update session with new tokens
    await prisma.user_sessions.update({
      where: { id: session.id },
      data: {
        token: newAccessToken,
        refresh_token: newRefreshToken,
        refresh_token_expires_at: refreshTokenExpiresAt,
        expires_at: accessTokenExpiresAt,
        last_active_at: new Date()
      }
    });

    return {
      accessToken: newAccessToken,
      refreshToken: newRefreshToken,
      accessTokenExpiresAt: accessTokenExpiresAt.toISOString(),
      refreshTokenExpiresAt: refreshTokenExpiresAt.toISOString()
    };
  }

  /**
   * Logout - deactivate session
   * @param {String} token
   */
  async logout(token) {
    const session = await prisma.user_sessions.findUnique({
      where: { token }
    });

    if (session) {
      await prisma.user_sessions.update({
        where: { id: session.id },
        data: { is_active: false }
      });
    }

    return { success: true };
  }

  /**
   * Get all active sessions for a user
   * @param {String} userId
   */
  async getUserSessions(userId) {
    return await prisma.user_sessions.findMany({
      where: {
        userId,
        is_active: true
      },
      orderBy: {
        last_active_at: 'desc'
      }
    });
  }
}

export default new AuthService();
