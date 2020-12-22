'use strict';
/*
 * SPDX-License-Identifier: Apache-2.0
 */
exports.__esModule = true;
exports.authCheckMiddleware = void 0;
var jwt = require('jsonwebtoken');
var explorerconfig_json_1 = require('../explorerconfig.json');
/**
 *  The Auth Checker middleware function.
 */
var authCheckMiddleware = function(req, res, next) {
	if (!req.headers.authorization) {
		return res.status(401).end();
	}
	// Get the last part from a authorization header string like "bearer token-value"
	var token = req.headers.authorization.split(' ')[1];
	// Decode the token using a secret key-phrase
	return jwt.verify(token, explorerconfig_json_1['default'].jwt.secret, function(
		err,
		decoded
	) {
		// The 401 code is for unauthorized status
		if (err) {
			return res.status(401).end();
		}
		var requestUserId = decoded.user;
		req.requestUserId = requestUserId;
		req.network = decoded.network;
		// TODO: check if a user exists, otherwise error
		return next();
	});
};
exports.authCheckMiddleware = authCheckMiddleware;
