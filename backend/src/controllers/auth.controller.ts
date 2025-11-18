import { Request, Response, NextFunction } from 'express';
import * as UserModel from '../models/user.model';
import * as PasswordService from '../services/password.service';
import * as TokenService from '../services/token.service';
import { ApiError } from '../utils/errors';

export const register = async (req: Request, res: Response, next: NextFunction) => {
  try {
    const { name, email, password, role } = req.body;
    if (!name || !email || !password || !role) {
      throw new ApiError(400, 'All fields are required');
    }

    const existingUser = await UserModel.findUserByEmail(email);
    if (existingUser) {
      throw new ApiError(409, 'User with this email already exists');
    }

    const passwordHash = await PasswordService.hashPassword(password);
    const newUser = await UserModel.createUser({ name, email, passwordHash, role });

    res.status(201).json({
      message: 'User registered successfully',
      user: { id: newUser.id, name: newUser.name, email: newUser.email, role: newUser.role },
    });
  } catch (error) {
    next(error);
  }
};

export const login = async (req: Request, res: Response, next: NextFunction) => {
  try {
    const { email, password } = req.body;
    if (!email || !password) {
      throw new ApiError(400, 'Email and password are required');
    }

    const user = await UserModel.findUserByEmail(email);
    if (!user) {
      throw new ApiError(401, 'Invalid credentials');
    }

    const isPasswordValid = await PasswordService.comparePassword(password, user.password_hash);
    if (!isPasswordValid) {
      throw new ApiError(401, 'Invalid credentials');
    }
    
    const userPayload = { id: user.id, role: user.role };
    const accessToken = TokenService.generateAccessToken(userPayload);
    const refreshToken = TokenService.generateRefreshToken(userPayload);
    
    res.cookie('refreshToken', refreshToken, {
        httpOnly: true,
        secure: process.env.NODE_ENV === 'production',
        sameSite: 'strict',
        maxAge: 7 * 24 * 60 * 60 * 1000, // 7 days
    });

    res.json({
      accessToken,
      user: { id: user.id, name: user.name, email: user.email, role: user.role },
    });
  } catch (error) {
    next(error);
  }
};

export const refreshToken = (req: Request, res: Response, next: NextFunction) => {
    try {
        const { refreshToken: tokenFromCookie } = req.cookies;
        if (!tokenFromCookie) {
            throw new ApiError(401, 'Refresh token not found');
        }

        const newAccessToken = TokenService.refreshAccessToken(tokenFromCookie);
        res.json({ accessToken: newAccessToken });
    } catch (error) {
        next(error);
    }
};

export const logout = (req: Request, res: Response) => {
    res.clearCookie('refreshToken');
    res.status(200).json({ message: 'Logged out successfully' });
};
