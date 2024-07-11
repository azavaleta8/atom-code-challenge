import express, { Router } from 'express';
import morgan from 'morgan';
import cors from 'cors';

import * as middlewares from './middlewares';
import { healthCheckRouter } from './api/healthCheck/healthCheckRouter';

require('dotenv').config();

const app = express();

app.use(morgan('dev'));
app.use(cors());
app.use(express.json());

const apiRouter: Router = express.Router();

// Montar los routers individuales en el router combinado
apiRouter.use('/', healthCheckRouter);

// Usar el router combinado en la ruta principal
app.use('/api/v1', apiRouter);

app.use(middlewares.notFound);
app.use(middlewares.errorHandler);

export default app;
