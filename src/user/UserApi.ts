import express, { RequestHandler } from 'express';
import Boom from '@hapi/boom';
import { checkSchema, check, query, param, body } from 'express-validator';
import { checkValidators } from '../middlewares/errors';

const router = express.Router({ mergeParams: true });

import UserManager from './UserManager';
import errors from '../errors';
import { authenticate, isSelf } from '../middlewares/users';
import { UserRequest } from '../utils/interfaces';

router.get(
  '/list',

  query('username').isString().optional({ nullable: true }),

  <RequestHandler>async function (req, res, next) {
    try {
      const result = await UserManager.list(<string>req.query.username);

      return res.json(result);
    } catch (error) {
      next(error);
    }
  }
);

router.post(
  '/register',

  check('password')
    .isString()
    .withMessage(errors.user.PASSWORD_TOO_SHORT)
    .isLength({ min: 6 })
    .withMessage(errors.user.PASSWORD_TOO_SHORT),
  check('username')
    .isString()
    .withMessage(errors.user.USERNAME_TOO_SHORT)
    .custom((value) => {
      const regexp = new RegExp(/\s/g);

      return !regexp.test(value);
    })
    .withMessage(errors.user.USERNAME_WITH_SPACES)
    .isLength({ min: 3 })
    .withMessage(errors.user.USERNAME_TOO_SHORT),
  checkValidators(),

  <RequestHandler>async function (req, res, next) {
    try {
      const result = await UserManager.register({ ...req.body });

      return res.json(result);
    } catch (error) {
      next(error);
    }
  }
);

router.post(
  '/signin',

  check('password')
    .isString()
    .withMessage(errors.user.PASSWORD_TOO_SHORT)
    .isLength({ min: 6 })
    .withMessage(errors.user.PASSWORD_TOO_SHORT),
  check('username')
    .isString()
    .withMessage(errors.user.USERNAME_TOO_SHORT)
    .custom((value) => {
      const regexp = new RegExp(/\s/g);

      return !regexp.test(value);
    })
    .withMessage(errors.user.USERNAME_WITH_SPACES)
    .isLength({ min: 3 })
    .withMessage(errors.user.USERNAME_TOO_SHORT),
  checkValidators(),

  <RequestHandler>async function (req, res, next) {
    try {
      const result = await UserManager.signIn({ ...req.body });

      return res.json(result);
    } catch (error) {
      next(error);
    }
  }
);

router.use('/:userId', param('userId').isMongoId(), authenticate());

router.put(
  '/:userId',
  checkSchema({
    password: {
      in: 'body',
      isLength: {
        errorMessage: errors.user.PASSWORD_TOO_SHORT,
        options: { min: 6 },
      },
      optional: { options: { nullable: true } },
    },
    mobile_token: {
      in: 'body',
      optional: { options: { nullable: true } },
    },
  }),
  isSelf(),
  checkValidators(),

  <RequestHandler>async function (req: UserRequest, res, next) {
    try {
      const updatedUser = await UserManager.update({
        userId: req.params.userId,
        ...req.body,
      });

      res.json(updatedUser);
    } catch (error) {
      next(error);
    }
  }
);

router.delete(
  '/:userId',

  isSelf(),
  checkValidators(),

  <RequestHandler>async function (req, res, next) {
    try {
      const deleted = await UserManager.delete(req.params.userId);

      res.json({ deleted: true });
    } catch (error) {
      next(error);
    }
  }
);

export default router;
