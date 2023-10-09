import cors from 'cors';
import express, { Application, NextFunction, Request, Response } from 'express';
import httpStatus from 'http-status';
import globalErrorHandler from './app/middlewares/globalErrorHandler';
import routes from './app/routes';

import cookieParser from 'cookie-parser';
import config from './config';

const app: Application = express();

// Serve uploaded images statically
app.use('/avatar', express.static(config.profile_pic_dest as string));
app.use('/banner', express.static(config.blog_banner_dest as string));
// localhost:5000/avater/filename

app.use(cors());
// app.use(
//   cors({
//     origin: 'http://examplefrontend.com',
//     credentials: true,
//   })
// );
app.use(cookieParser());

//parser
app.use(express.json());
app.use(express.urlencoded({ extended: true }));

app.use('/api/v1', routes);

app.get('/', (req, res) => {
  res.send({ message: 'Server is running' });
});

//global error handler
app.use(globalErrorHandler);

//handle not found
app.use((req: Request, res: Response, next: NextFunction) => {
  res.status(httpStatus.NOT_FOUND).json({
    success: false,
    message: 'Not Found',
    errorMessages: [
      {
        path: req.originalUrl,
        message: 'API Not Found',
      },
    ],
  });
  next();
});

export default app;
