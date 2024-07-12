import { NextFunction, Request, Response } from 'express';

import { ErrorResponse } from './interfaces/ResponseType';

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