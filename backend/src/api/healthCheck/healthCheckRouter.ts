import express, { Request, Response, Router } from 'express';
import { StatusCodes } from 'http-status-codes';
import { MessageResponse } from '../../interfaces/responses';

export const healthCheckRouter: Router = express.Router();

healthCheckRouter.get<{}, MessageResponse>('/health-check', (_req: Request, res: Response) => {
  res.status(StatusCodes.OK).send({
    status: StatusCodes.OK,
    message: 'API - 👋🌎🌍🌏',
  });
});