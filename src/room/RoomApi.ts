import express, { RequestHandler } from 'express';
import { checkSchema, body, query, param } from 'express-validator';

import { UserRequest } from '../utils/interfaces'
import { checkValidators } from '../middlewares/errors';
import errors from '../errors';

const router = express.Router({ mergeParams: true });

import RoomManager from './RoomManager';
import { authenticate } from '../middlewares/users';


router.post(
  '/',

	body('name').isString().withMessage(errors.room.NAME_REQUIRED),
	body('capacity').isNumeric().optional(),
	checkValidators(),
	authenticate(),

  <RequestHandler> async function(req: UserRequest, res, next) {
		try {
			const result = await RoomManager.create({ ...req.body, hostUserId: req.user._id });
			
			return res.json(result);
			
		} catch (error) {
			next(error)
		}
	}
);

router.get(
  '/userRooms',

	query('username').isString().withMessage(errors.room.NO_USERNAME_INFORMED),
	checkValidators(),

  <RequestHandler> async function(req, res, next) {
		try {
			const result = await RoomManager.getUserRooms({ username: <string> req.query.username });

			return res.json(result);
			
		} catch (error) {
			next(error)
		}
	}
);

router.use('/:roomId', param('roomId').isMongoId());

/**
 * Gets room information
 */
router.get(
  '/:roomId',

  <RequestHandler> async function(req, res, next) {
		try {
			const result = await RoomManager.get(req.params.roomId);
			
			return res.json(result);

		} catch (error) {
			next(error)
		}
	}
);

router.post(
	'/:roomId/changeHost', 
	
	authenticate(),

	body('newHost').isMongoId().withMessage(errors.room.NEW_HOST_NOT_INFORMED),
	checkValidators(),

	<RequestHandler> async function (req, res, next) {
		try {
			const updatedUser = await RoomManager.changeHost(req.params.roomId, req.body.newHost);
	
			return res.json(updatedUser);
		} catch (error) {
			next(error)
		}
	}
)

/**
 * Join/leave room
 */
router.post(
	'/:roomId/:action(join|leave)',

	authenticate(),

	<RequestHandler> async function (req: UserRequest, res, next) {
		try {
			const result = await RoomManager.joinOrLeaveRoom({ action: req.params.action, roomId: req.params.roomId, userId: req.user._id });
	
			return res.json(result);
		} catch (error) {
			next(error)
		}
	}
)

export default router;
