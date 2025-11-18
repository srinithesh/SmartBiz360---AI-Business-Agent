import jwt from 'jsonwebtoken';
import config from '../config';
import { ApiError } from '../utils/errors';
import { UserRole } from '../models/user.model';

export interface UserPayload {
  id: string;
  role: UserRole;
}

export const generateAccessToken = (payload: UserPayload): string => {
  return jwt.sign(payload, config.jwt.accessSecret, {
    expiresIn: config.jwt.accessExpiration,
  });
};

export const generateRefreshToken = (payload: UserPayload): string => {
  return jwt.sign(payload, config.jwt.refreshSecret, {
    expiresIn: config.jwt.refreshExpiration,
  });
};

export const verifyRefreshToken = (token: string): UserPayload => {
  try {
    return jwt.verify(token, config.jwt.refreshSecret) as UserPayload;
  } catch (error) {
    throw new ApiError(401, 'Invalid or expired refresh token');
  }
};


export const refreshAccessToken = (refreshToken: string): string => {
    const decoded = verifyRefreshToken(refreshToken);
    const userPayload: UserPayload = { id: decoded.id, role: decoded.role };
    return generateAccessToken(userPayload);
};
