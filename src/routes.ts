import express, { NextFunction, Request, Response } from 'express';
import Boom from '@hapi/boom';

import UserRoutes from './user/UserApi';
import RoomRoutes from './room/RoomApi';

const routes = express.Router();

export default function (app: any) {
  app.use('/api/users', UserRoutes);
  app.use('/api/rooms', RoomRoutes);

  // Error handling
  app.use(function (err: Error, req: Request, res: Response, _: NextFunction) {
    const error = Boom.isBoom(err) ? err : Boom.boomify(err);
    // tslint:disable-next-line: no-console
    if (process.env.NODE_ENV !== 'test') console.trace(error);
    return res.status(error.output.statusCode).json({
      error: error.name,
      message: error.message,
    });
  });
}
