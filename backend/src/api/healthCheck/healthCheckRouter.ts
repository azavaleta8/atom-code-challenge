import express, { Request, Response, Router } from 'express';
import { StatusCodes } from 'http-status-codes';
import { MessageResponse } from '../../interfaces/ResponseType';

export const healthCheckRouter: Router = express.Router();

healthCheckRouter.get('/health-check', (_req: Request, res: Response) => {
	// Creating success response object
	const response: MessageResponse = {
		status: StatusCodes.OK,
		message: 'API - 👋🌎🌍🌏',
	};

	res.status(StatusCodes.OK).send(response); // Sending success response
});