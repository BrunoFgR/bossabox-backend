import 'reflect-metadata';

import express, { Request, Response, NextFunction } from 'express';
import swaggerUI from 'swagger-ui-express';

import cors from 'cors';
import 'express-async-errors';

import AppErrors from '@shared/errors/AppErrors';
import routes from './routes';
import swaggerFile from './swagger.json';

import '@shared/infra/typeorm';
import '@shared/container';

const app = express();

app.use(cors());
app.use(express.json());
app.use('/api-docs', swaggerUI.serve, swaggerUI.setup(swaggerFile));
app.use(routes);

app.use((err: Error, request: Request, response: Response, _: NextFunction) => {
    if (err instanceof AppErrors) {
        return response.status(err.statusCode).json({
            status: 'error',
            message: err.message,
        });
    }

    console.error(err);

    return response.status(500).json({
        status: 'error',
        message: 'Internal Server Error',
    });
});

app.listen(3000, () => {
    console.log('Server running port 3000');
});
