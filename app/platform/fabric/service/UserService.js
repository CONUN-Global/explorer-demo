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
exports.UserService = void 0;
/* eslint-disable quotes */
/* eslint-disable no-extra-parens */
var bcrypt = require('bcrypt');
var helper_1 = require('../../../common/helper');
var UserMeta = require('../../../model/User');
var logger = helper_1.helper.getLogger('UserService');
/**
 *
 *
 * @class UserService
 */
var UserService = /** @class */ (function() {
	/**
	 *Creates an instance of UserService.
	 * @param {*} platform
	 * @memberof UserService
	 */
	function UserService(platform) {
		this.platform = platform;
		this.userDataService = platform.getPersistence().getUserDataService();
		this.userDataService.initialize(UserMeta.attributes, UserMeta.options);
	}
	/**
	 *
	 *
	 * @param {*} user
	 * @returns
	 * @memberof UserService
	 */
	UserService.prototype.authenticate = function(user) {
		return __awaiter(this, void 0, void 0, function() {
			var enableAuth, clientObj, client, fabricConfig;
			return __generator(this, function(_a) {
				enableAuth = false;
				if (!user.user || !user.password || !user.network) {
					logger.error('Invalid parameters');
					return [2 /*return*/, false];
				}
				logger.info('user.network ', user.network);
				clientObj = this.platform.getNetworks().get(user.network);
				if (!clientObj) {
					logger.error('Failed to get client object for ' + user.network);
					return [2 /*return*/, false];
				}
				client = clientObj.instance;
				fabricConfig = client.fabricGateway.fabricConfig;
				// enableAuth = fabricConfig.getEnableAuthentication();
				// Skip authentication, if set to false in connection profile, key: enableAuthentication
				if (!enableAuth) {
					logger.info('Skip authentication');
					return [2 /*return*/, true];
				}
				logger.info(
					'Network: ' + user.network + ' enableAuthentication ' + enableAuth
				);
				return [
					2 /*return*/,
					this.userDataService
						.findUser(user.user, user.network)
						.then(function(userEntry) {
							if (userEntry == null) {
								logger.error(
									'Incorrect credential : ' + user.user + ' in ' + user.network
								);
								return false;
							}
							var hashedPassword = bcrypt.hashSync(user.password, userEntry.salt);
							if (userEntry.password === hashedPassword) {
								return true;
							}
							logger.error(
								'Incorrect credential : ' + user.user + ' in ' + user.network
							);
							return false;
						})
				];
			});
		});
	};
	/**
	 *
	 *
	 * @param {User} userObj
	 * @returns
	 * @memberof UserService
	 */
	UserService.prototype.getAdminUser = function(userObj) {
		var clientObj = this.platform.getNetworks().get(userObj.network);
		if (!clientObj) {
			throw new Error('Failed to get client object for ' + userObj.network);
		}
		var client = clientObj.instance;
		var fabricConfig = client.fabricGateway.fabricConfig;
		return fabricConfig.getAdminUser();
	};
	/**
	 *
	 *
	 * @param {User} userObj
	 * @returns {boolean} Return true if specified user has admin privilege
	 * @memberof UserService
	 */
	UserService.prototype.isAdminRole = function(userObj) {
		if (!userObj.requestUserId) {
			// That means it's requested internally
			return true;
		}
		logger.info('isAdminRole:', userObj);
		return this.userDataService
			.findUser(userObj.requestUserId, userObj.network)
			.then(function(userEntry) {
				if (userEntry === null) {
					throw new Error(
						"User who requests doesn't exist : " + userObj.requestUserId
					);
				}
				return userEntry.roles === 'admin';
			});
	};
	/**
	 *
	 *
	 * @param {*} user
	 * @returns
	 * @memberof UserService
	 */
	UserService.prototype.register = function(user) {
		return __awaiter(this, void 0, void 0, function() {
			var error_1;
			var _this = this;
			return __generator(this, function(_a) {
				switch (_a.label) {
					case 0:
						_a.trys.push([0, 3, , 4]);
						if (!user.user || !user.password || !user.network) {
							throw new Error('Invalid parameters');
						}
						return [4 /*yield*/, this.isAdminRole(user)];
					case 1:
						if (!_a.sent()) {
							throw new Error("Permission error : can't register user");
						}
						return [
							4 /*yield*/,
							this.userDataService
								.findUser(user.user, user.network)
								.then(function(userEntry) {
									return __awaiter(_this, void 0, void 0, function() {
										var salt, hashedPassword, newUser;
										return __generator(this, function(_a) {
											switch (_a.label) {
												case 0:
													if (userEntry != null) {
														throw new Error('already exists');
													}
													salt = bcrypt.genSaltSync(10);
													hashedPassword = bcrypt.hashSync(user.password, salt);
													newUser = {
														username: user.user,
														salt: salt,
														password: hashedPassword,
														networkName: user.network,
														firstName: user.firstname,
														lastName: user.lastname,
														email: user.email ? user.email : null,
														roles: user.roles
													};
													return [
														4 /*yield*/,
														this.userDataService
															.registerUser(newUser)
															.then(function() {
																return true;
															})
															['catch'](function(error) {
																throw new Error(
																	'Failed to register user : ' + user.user + ' : ' + error
																);
															})
													];
												case 1:
													_a.sent();
													return [2 /*return*/];
											}
										});
									});
								})
						];
					case 2:
						_a.sent();
						return [3 /*break*/, 4];
					case 3:
						error_1 = _a.sent();
						return [
							2 /*return*/,
							{
								status: 400,
								message: error_1.toString()
							}
						];
					case 4:
						return [
							2 /*return*/,
							{
								status: 200
							}
						];
				}
			});
		});
	};
	/**
	 *
	 *
	 * @param {*} user
	 * @returns
	 * @memberof UserService
	 */
	UserService.prototype.unregister = function(user) {
		return __awaiter(this, void 0, void 0, function() {
			var error_2;
			var _this = this;
			return __generator(this, function(_a) {
				switch (_a.label) {
					case 0:
						_a.trys.push([0, 3, , 4]);
						if (!user.user || !user.network) {
							throw new Error('Invalid parameters');
						}
						return [4 /*yield*/, this.isAdminRole(user)];
					case 1:
						if (!_a.sent()) {
							throw new Error("Permission error : can't unregister user");
						}
						if (user.user === user.requestUserId) {
							throw new Error("Permission error : can't unregister by yourself");
						}
						if (user.user === this.getAdminUser(user)) {
							throw new Error("Permission error : can't unregister root admin user");
						}
						return [
							4 /*yield*/,
							this.userDataService
								.findUser(user.user, user.network)
								.then(function(userEntry) {
									return __awaiter(_this, void 0, void 0, function() {
										return __generator(this, function(_a) {
											switch (_a.label) {
												case 0:
													if (userEntry == null) {
														throw new Error(user.user + ' does not exists');
													}
													return [
														4 /*yield*/,
														this.userDataService
															.unregisterUser(user.user, user.network)
															.then(function() {
																return true;
															})
															['catch'](function(error) {
																throw new Error(
																	'Failed to unRegister user : ' + user.user + ' : ' + error
																);
															})
													];
												case 1:
													_a.sent();
													return [2 /*return*/];
											}
										});
									});
								})
						];
					case 2:
						_a.sent();
						return [3 /*break*/, 4];
					case 3:
						error_2 = _a.sent();
						return [
							2 /*return*/,
							{
								status: 400,
								message: error_2.toString()
							}
						];
					case 4:
						return [
							2 /*return*/,
							{
								status: 200,
								message: 'Unregistered successfully!'
							}
						];
				}
			});
		});
	};
	/**
	 *
	 *
	 * @param {*} user
	 * @returns {Object} Object including status and array of user entry
	 * @memberof UserService
	 */
	UserService.prototype.userlist = function(user) {
		return __awaiter(this, void 0, void 0, function() {
			var userList, error_3;
			return __generator(this, function(_a) {
				switch (_a.label) {
					case 0:
						userList = [];
						_a.label = 1;
					case 1:
						_a.trys.push([1, 3, , 4]);
						return [4 /*yield*/, this.userDataService.getUserlist(user.network)];
					case 2:
						userList = _a.sent();
						return [3 /*break*/, 4];
					case 3:
						error_3 = _a.sent();
						return [
							2 /*return*/,
							{
								status: 400,
								message: error_3.toString()
							}
						];
					case 4:
						return [
							2 /*return*/,
							{
								status: 200,
								message: userList
							}
						];
				}
			});
		});
	};
	/**
	 *
	 *
	 * @param {string} user
	 * @param {string} network
	 * @returns {boolean} Return true if specified user has already existed in the specified network
	 * @memberof UserService
	 */
	UserService.prototype.isExist = function(user, network) {
		return this.userDataService.findUser(user, network).then(function(userEntry) {
			if (userEntry !== null) {
				return true;
			}
			return false;
		});
	};
	return UserService;
})();
exports.UserService = UserService;
