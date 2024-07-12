import express, { Application, Router } from 'express';
import morgan from 'morgan';
import cors from 'cors';

import * as middlewares from './middlewares';
import { healthCheckRouter } from './api/healthCheck/healthCheckRouter';
import { userRouter } from './api/users/userRouter';
import swaggerOptions from './swaggerOptions';
import swaggerUi from 'swagger-ui-express';
import swaggerJsdoc from 'swagger-jsdoc';

const app : Application= express();

app.use(morgan('dev'));
app.use(cors());
app.use(express.json());

const swaggerDocs = swaggerJsdoc(swaggerOptions);
app.use('/api-docs', swaggerUi.serve, swaggerUi.setup(swaggerDocs));

const apiRouter: Router = express.Router();

// Montar los routers individuales en el router combinado
apiRouter.use('/', healthCheckRouter);
apiRouter.use('/', userRouter);

// Usar el router combinado en la ruta principal

app.use('/api', apiRouter);

app.use(middlewares.notFound);
app.use(middlewares.errorHandler);

export default app;
