'use strict';
/*
 * SPDX-License-Identifier: Apache-2.0
 */
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
exports.queryDatevalidator = exports.parseOrgsArray = exports.notFound = exports.invalidRequest = exports.responder = void 0;
var query_string_1 = require('query-string');
/**
 *
 *
 * @param {*} action
 * @param {*} req
 * @param {*} res
 * @param {*} next
 */
function respond(action, req, res, next) {
	return __awaiter(this, void 0, void 0, function() {
		var value, error_1;
		return __generator(this, function(_a) {
			switch (_a.label) {
				case 0:
					_a.trys.push([0, 2, , 3]);
					return [4 /*yield*/, action(req, res, next)];
				case 1:
					value = _a.sent();
					res.status(200).send(value);
					return [3 /*break*/, 3];
				case 2:
					error_1 = _a.sent();
					res.send({
						status: 400,
						message: error_1.toString()
					});
					return [3 /*break*/, 3];
				case 3:
					return [2 /*return*/];
			}
		});
	});
}
/**
 *
 *
 * @param {*} action
 * @returns
 */
function responder(action) {
	return function(req, res, next) {
		return __awaiter(this, void 0, void 0, function() {
			return __generator(this, function(_a) {
				switch (_a.label) {
					case 0:
						return [4 /*yield*/, respond(action, req, res, next)];
					case 1:
						return [2 /*return*/, _a.sent()];
				}
			});
		});
	};
}
exports.responder = responder;
/**
 *
 *
 * @param {*} req
 * @param {*} res
 */
function invalidRequest(req, res) {
	var payload = reqPayload(req);
	res.send({
		status: 400,
		error: 'BAD REQUEST',
		payload: payload
	});
}
exports.invalidRequest = invalidRequest;
/**
 *
 *
 * @param {*} req
 * @param {*} res
 */
function notFound(req, res) {
	var payload = reqPayload(req);
	res.send({
		status: 404,
		error: 'NOT FOUND',
		payload: payload
	});
}
exports.notFound = notFound;
/**
 *
 *
 * @param {*} req
 * @returns
 */
function reqPayload(req) {
	var requestPayload = [];
	var params = req.params,
		query = req.query,
		body = req.body;
	requestPayload.push({
		params: params
	});
	requestPayload.push({
		query: query
	});
	requestPayload.push({
		body: body
	});
	return requestPayload;
}
var parseOrgsArray = function(reqQuery) {
	if (reqQuery) {
		// eslint-disable-next-line spellcheck/spell-checker
		// workaround 'Type confusion through parameter tampering', see `https //lgtm dot com/rules/1506301137371 `
		var orgsStr = query_string_1['default'].stringify(reqQuery);
		if (orgsStr) {
			var parsedReq = query_string_1['default'].parse(orgsStr);
			if (parsedReq && parsedReq.orgs) {
				return Array.isArray(parsedReq) ? parsedReq.orgs : [parsedReq.orgs];
			}
			return [];
		}
	}
};
exports.parseOrgsArray = parseOrgsArray;
var queryDatevalidator = function(from, to) {
	if (!isNaN(Date.parse(from)) && !isNaN(Date.parse(to))) {
		from = new Date(from).toISOString();
		to = new Date(to).toISOString();
	} else {
		from = new Date(Date.now() - 864e5).toISOString();
		to = new Date().toISOString();
	}
	return { from: from, to: to };
};
exports.queryDatevalidator = queryDatevalidator;
