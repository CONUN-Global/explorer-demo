'use strict';
// @ts-check
var __awaiter =
	(this && this.__awaiter) ||
	function(thisArg, _arguments, P, generator) {
		function adopt(value) {
			return value instanceof P
				? value
				: new P(function(resolve) {
						resolve(value);
				  });
		}
		return new (P || (P = Promise))(function(resolve, reject) {
			function fulfilled(value) {
				try {
					step(generator.next(value));
				} catch (e) {
					reject(e);
				}
			}
			function rejected(value) {
				try {
					step(generator['throw'](value));
				} catch (e) {
					reject(e);
				}
			}
			function step(result) {
				result.done
					? resolve(result.value)
					: adopt(result.value).then(fulfilled, rejected);
			}
			step((generator = generator.apply(thisArg, _arguments || [])).next());
		});
	};
var __generator =
	(this && this.__generator) ||
	function(thisArg, body) {
		var _ = {
				label: 0,
				sent: function() {
					if (t[0] & 1) throw t[1];
					return t[1];
				},
				trys: [],
				ops: []
			},
			f,
			y,
			t,
			g;
		return (
			(g = { next: verb(0), throw: verb(1), return: verb(2) }),
			typeof Symbol === 'function' &&
				(g[Symbol.iterator] = function() {
					return this;
				}),
			g
		);
		function verb(n) {
			return function(v) {
				return step([n, v]);
			};
		}
		function step(op) {
			if (f) throw new TypeError('Generator is already executing.');
			while (_)
				try {
					if (
						((f = 1),
						y &&
							(t =
								op[0] & 2
									? y['return']
									: op[0]
									? y['throw'] || ((t = y['return']) && t.call(y), 0)
									: y.next) &&
							!(t = t.call(y, op[1])).done)
					)
						return t;
					if (((y = 0), t)) op = [op[0] & 2, t.value];
					switch (op[0]) {
						case 0:
						case 1:
							t = op;
							break;
						case 4:
							_.label++;
							return { value: op[1], done: false };
						case 5:
							_.label++;
							y = op[1];
							op = [0];
							continue;
						case 7:
							op = _.ops.pop();
							_.trys.pop();
							continue;
						default:
							if (
								!((t = _.trys), (t = t.length > 0 && t[t.length - 1])) &&
								(op[0] === 6 || op[0] === 2)
							) {
								_ = 0;
								continue;
							}
							if (op[0] === 3 && (!t || (op[1] > t[0] && op[1] < t[3]))) {
								_.label = op[1];
								break;
							}
							if (op[0] === 6 && _.label < t[1]) {
								_.label = t[1];
								t = op;
								break;
							}
							if (t && _.label < t[2]) {
								_.label = t[2];
								_.ops.push(op);
								break;
							}
							if (t[2]) _.ops.pop();
							_.trys.pop();
							continue;
					}
					op = body.call(thisArg, _);
				} catch (e) {
					op = [6, e];
					y = 0;
				} finally {
					f = t = 0;
				}
			if (op[0] & 5) throw op[1];
			return { value: op[0] ? op[1] : void 0, done: true };
		}
	};
exports.__esModule = true;
exports.localLoginStrategy = void 0;
/*
 * SPDX-License-Identifier: Apache-2.0
 */
var util_1 = require('util');
var jsonwebtoken_1 = require('jsonwebtoken');
var passport_local_1 = require('passport-local');
var User_1 = require('../platform/fabric/models/User');
var explorerconfig_json_1 = require('../explorerconfig.json');
var jwtSignAsync = util_1.promisify(jsonwebtoken_1['default'].sign);
var localLoginStrategy = function(platform) {
	var _this = this;
	var proxy = platform.getProxy();
	return new passport_local_1.Strategy(
		{
			usernameField: 'user',
			passwordField: 'password',
			session: false,
			passReqToCallback: true
		},
		function(req, user, password, done) {
			return __awaiter(_this, void 0, void 0, function() {
				var userData, reqUser, authResult, payload, token, data;
				return __generator(this, function(_a) {
					switch (_a.label) {
						case 0:
							userData = {
								user: user.trim(),
								password: password.trim()
							};
							return [4 /*yield*/, new User_1.User(req.body).asJson()];
						case 1:
							reqUser = _a.sent();
							return [4 /*yield*/, proxy.authenticate(reqUser)];
						case 2:
							authResult = _a.sent();
							if (!authResult) {
								return [
									2 /*return*/,
									done(null, false, { message: 'Incorrect credentials' })
								];
							}
							payload = {
								user: reqUser.user,
								network: reqUser.network
							};
							return [
								4 /*yield*/,
								jwtSignAsync(payload, explorerconfig_json_1['default'].jwt.secret, {
									expiresIn: explorerconfig_json_1['default'].jwt.expiresIn
								})
							];
						case 3:
							token = _a.sent();
							data = {
								message: 'logged in',
								name: userData.user
							};
							return [2 /*return*/, done(null, token, data)];
					}
				});
			});
		}
	);
};
exports.localLoginStrategy = localLoginStrategy;
