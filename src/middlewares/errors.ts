import { RequestHandler } from 'express';
import Boom from '@hapi/boom';
import { validationResult } from 'express-validator';

export function checkValidators() {
	return <RequestHandler> function(req, res, next) {
		const errors = validationResult(req);

		if (!errors.isEmpty()) next(Boom.badData(errors.array()[0].msg))
		else next();
	}
}
