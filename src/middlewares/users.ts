import { RequestHandler, Request } from 'express';
import { UserRequest } from '../utils/interfaces';
import Boom from '@hapi/boom';
import jwt from 'jsonwebtoken';
import UserManager from '../user/UserManager';

export function authenticate() {
  return <RequestHandler>async function (req: UserRequest, res, next) {
    const token = req.header('X-Auth');

    if (!token) return next(Boom.unauthorized());

    const decoded = jwt.verify(token!, process.env.SECRET!);

    const user = await UserManager.get((<any>decoded).id);

    if (!user) return next(Boom.unauthorized());
    else req.user = user;

    next();
  };
}

export function isSelf() {
  return <RequestHandler>async function (req: UserRequest, res, next) {
    const userId = req.params.userId;
    if (req.user._id.toString() !== userId) next(Boom.unauthorized());
    next();
  };
}
