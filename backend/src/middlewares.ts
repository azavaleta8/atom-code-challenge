import { NextFunction, Request, Response } from 'express';

import { ErrorResponse } from './interfaces/ResponseType';
import { StatusCodes } from 'http-status-codes';
import jwt from 'jsonwebtoken';

const JWT_SECRET = process.env.JWT_SECRET || 'SECRET';

export function notFound(req: Request, res: Response, next: NextFunction) {
	res.status(404);
	const error = new Error(`🔍 - Not Found - ${req.originalUrl}`);
	next(error);
}

// eslint-disable-next-line @typescript-eslint/no-unused-vars
export function errorHandler(err: Error, req: Request, res: Response<ErrorResponse>, next: NextFunction) {
	const statusCode = res.statusCode !== 200 ? res.statusCode : 500;
	res.status(statusCode).send({
		status: statusCode,
		message: err.message,
		error: process.env.NODE_ENV === 'production' ? '🥞' : err.stack,
	});
}

export const asyncHandler = (fn: (req: Request, res: Response, next: NextFunction) => Promise<void>) => 
	(req: Request, res: Response, next: NextFunction) => {
		Promise.resolve(fn(req, res, next)).catch(next);
	};

declare global {
	namespace Express {
		interface Request {
			userId?: string;
		}
	}
}

interface JWTPayload {
	email: string
	id: string,
	iat: number,
	exp: number
}

export const authenticateJWT = (req: Request, res: Response, next: NextFunction) => {
	const authHeader = req.headers['authorization'];
  
	if (typeof authHeader !== 'string') {
		return res.status(StatusCodes.UNAUTHORIZED).json({
			status: StatusCodes.UNAUTHORIZED,
			error: 'Authorization header is missing or invalid'
		});
	}
  
	const parts = authHeader.split(' ');
  
	if (parts.length !== 2 || parts[0] !== 'Bearer') {
		return res.status(StatusCodes.UNAUTHORIZED).json({
			status: StatusCodes.UNAUTHORIZED,
			error: 'Authorization header must be in the format "Bearer {token}"'
		});
	}
  
	const token = parts[1];

	jwt.verify(token, JWT_SECRET, (err, decoded) => {
		if (err) {
			return res.status(StatusCodes.UNAUTHORIZED).json({
				status: StatusCodes.UNAUTHORIZED,
				error: 'Invalid token'
			});
		}
		
		const { id } = decoded as JWTPayload
		req.userId = id;
		next();
	});
};