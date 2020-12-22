'use strict';
/**
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
exports.Platform = void 0;
var path = require('path');
var fs_extra_1 = require('fs-extra');
var helper_1 = require('../../common/helper');
var User_1 = require('./models/User');
var MetricService_1 = require('../../persistence/fabric/MetricService');
var CRUDService_1 = require('../../persistence/fabric/CRUDService');
var UserDataService_1 = require('../../persistence/fabric/UserDataService');
var Proxy_1 = require('./Proxy');
var ExplorerError_1 = require('../../common/ExplorerError');
var ExplorerListener_1 = require('../../sync/listener/ExplorerListener');
var ExplorerMessage_1 = require('../../common/ExplorerMessage');
var FabricConfig_1 = require('./FabricConfig');
var UserService_1 = require('./service/UserService');
var FabricUtils = require('./utils/FabricUtils');
var FabricConst = require('./utils/FabricConst');
var logger = helper_1.helper.getLogger('Platform');
var fabric_const = FabricConst.fabric['const'];
var config_path = path.resolve(__dirname, './config.json');
/**
 *
 *
 * @class Platform
 */
var Platform = /** @class */ (function() {
	/**
	 * Creates an instance of Platform.
	 * @param {*} persistence
	 * @param {*} broadcaster
	 * @memberof Platform
	 */
	function Platform(persistence, broadcaster) {
		this.persistence = persistence;
		this.broadcaster = broadcaster;
		this.networks = new Map();
		this.userService = null;
		this.proxy = null;
		this.defaultNetwork = null;
		this.network_configs = null;
		this.syncType = null;
		this.explorerListeners = [];
	}
	/**
	 *
	 *
	 * @memberof Platform
	 */
	Platform.prototype.initialize = function() {
		return __awaiter(this, void 0, void 0, function() {
			var _self, all_config, network_configs;
			return __generator(this, function(_a) {
				switch (_a.label) {
					case 0:
						_self = this;
						all_config = JSON.parse(
							fs_extra_1['default'].readFileSync(config_path, 'utf8')
						);
						network_configs = all_config[fabric_const.NETWORK_CONFIGS];
						this.syncType = all_config.syncType;
						this.userService = new UserService_1.UserService(this);
						this.proxy = new Proxy_1.Proxy(this, this.userService);
						// Build client context
						logger.debug(
							'******* Initialization started for hyperledger fabric platform ******'
						);
						logger.debug(
							'******* Initialization started for hyperledger fabric platform ******,',
							network_configs
						);
						return [4 /*yield*/, this.buildClients(network_configs)];
					case 1:
						_a.sent();
						if (this.networks.size === 0) {
							logger.error(
								'************* There is no client found for Hyperledger fabric platform *************'
							);
							throw new ExplorerError_1.ExplorerError(
								ExplorerMessage_1.explorerError.ERROR_2008
							);
						}
						return [2 /*return*/];
				}
			});
		});
	};
	/**
	 *
	 *
	 * @param {*} network_configs
	 * @memberof Platform
	 */
	Platform.prototype.buildClients = function(network_configs) {
		return __awaiter(this, void 0, void 0, function() {
			var _self,
				_a,
				_b,
				_i,
				network_id,
				network_config,
				config,
				signupResult,
				client,
				clientObj;
			return __generator(this, function(_c) {
				switch (_c.label) {
					case 0:
						_self = this;
						/* eslint-enable */
						// Setting organization enrolment files
						logger.debug('Setting admin organization enrolment files');
						this.network_configs = network_configs;
						_a = [];
						for (_b in this.network_configs) _a.push(_b);
						_i = 0;
						_c.label = 1;
					case 1:
						if (!(_i < _a.length)) return [3 /*break*/, 5];
						network_id = _a[_i];
						network_config = this.network_configs[network_id];
						if (!this.defaultNetwork) {
							this.defaultNetwork = network_id;
						}
						/*
						 * Create fabric explorer client for each
						 * Each client is connected to only a single peer and monitor that particular peer only
						 */
						logger.info(
							' network_config.id ',
							network_id,
							' network_config.profile ',
							network_config.profile
						);
						// Create client instance
						logger.debug(
							'Creating network client [%s] >> ',
							network_id,
							network_config
						);
						config = new FabricConfig_1.FabricConfig();
						config.initialize(network_id, network_config);
						return [4 /*yield*/, this.registerAdmin(config)];
					case 2:
						signupResult = _c.sent();
						if (!signupResult) {
							logger.error('Failed to register admin user : ' + network_id);
							return [3 /*break*/, 4];
						}
						return [
							4 /*yield*/,
							FabricUtils.createFabricClient(config, this.persistence)
						];
					case 3:
						client = _c.sent();
						if (client) {
							clientObj = { name: network_config.name, instance: client };
							this.networks.set(network_id, clientObj);
						}
						_c.label = 4;
					case 4:
						_i++;
						return [3 /*break*/, 1];
					case 5:
						return [2 /*return*/];
				}
			});
		});
	};
	Platform.prototype.registerAdmin = function(config) {
		return __awaiter(this, void 0, void 0, function() {
			var user, password, network_id, reqUser, resp;
			return __generator(this, function(_a) {
				switch (_a.label) {
					case 0:
						if (!config.getEnableAuthentication()) {
							logger.info('Disabled authentication');
							return [2 /*return*/, true];
						}
						user = config.getAdminUser();
						password = config.getAdminPassword();
						if (!user || !password) {
							logger.error('Invalid credentials');
							return [2 /*return*/, false];
						}
						network_id = config.getNetworkId();
						return [
							4 /*yield*/,
							User_1.User.createInstanceWithParam(
								user,
								password,
								network_id,
								'admin'
							).asJson()
						];
					case 1:
						reqUser = _a.sent();
						return [4 /*yield*/, this.userService.isExist(user, network_id)];
					case 2:
						if (_a.sent()) {
							logger.info('Already registered : admin');
							return [2 /*return*/, true];
						}
						return [4 /*yield*/, this.userService.register(reqUser)];
					case 3:
						resp = _a.sent();
						if (resp.status !== 200) {
							logger.error('Failed to register admin user: ', resp.message);
							return [2 /*return*/, false];
						}
						return [2 /*return*/, true];
				}
			});
		});
	};
	/**
	 *
	 *
	 * @param {*} syncconfig
	 * @memberof Platform
	 */
	Platform.prototype.initializeListener = function(syncconfig) {
		/* eslint-disable */
		for (var _i = 0, _a = this.networks.entries(); _i < _a.length; _i++) {
			var _b = _a[_i],
				network_id = _b[0],
				clientObj = _b[1];
			var network_name = clientObj.name;
			var network_client = clientObj.instance;
			logger.info(
				'initializeListener, network_id, network_client ',
				network_id,
				network_client.getNetworkConfig()
			);
			if (network_client.getStatus()) {
				var explorerListener = new ExplorerListener_1.ExplorerListener(
					this,
					syncconfig
				);
				explorerListener.initialize([network_id, network_name, '1']);
				explorerListener.send('Successfully send a message to child process');
				this.explorerListeners.push(explorerListener);
			}
		}
		/* eslint-enable */
	};
	/**
	 *
	 *
	 * @memberof Platform
	 */
	Platform.prototype.setPersistenceService = function() {
		// Setting platform specific CRUDService and MetricService
		this.persistence.setMetricService(
			new MetricService_1.MetricService(this.persistence.getPGService())
		);
		this.persistence.setCrudService(
			new CRUDService_1.CRUDService(this.persistence.getPGService())
		);
		this.persistence.setUserDataService(
			new UserDataService_1.UserDataService(this.persistence.getPGService())
		);
	};
	/**
	 *
	 *
	 * @returns
	 * @memberof Platform
	 */
	Platform.prototype.getNetworks = function() {
		return this.networks;
	};
	/**
	 *
	 *
	 * @param {*} network_id
	 * @returns
	 * @memberof Platform
	 */
	Platform.prototype.getClient = function(network_id) {
		logger.info('getClient (id:' + network_id + ')');
		var clientObj = this.networks.get(network_id || this.defaultNetwork);
		return clientObj.instance;
	};
	/**
	 *
	 *
	 * @returns
	 * @memberof Platform
	 */
	Platform.prototype.getPersistence = function() {
		return this.persistence;
	};
	/**
	 *
	 *
	 * @returns
	 * @memberof Platform
	 */
	Platform.prototype.getBroadcaster = function() {
		return this.broadcaster;
	};
	/**
	 *
	 *
	 * @returns
	 * @memberof Platform
	 */
	Platform.prototype.getProxy = function() {
		return this.proxy;
	};
	/**
	 *
	 *
	 * @memberof Platform
	 */
	Platform.prototype.destroy = function() {
		return __awaiter(this, void 0, void 0, function() {
			var _i, _a, explorerListener;
			return __generator(this, function(_b) {
				logger.info(
					'<<<<<<<<<<<<<<<<<<<<<<<<<< Closing explorer  >>>>>>>>>>>>>>>>>>>>>'
				);
				for (_i = 0, _a = this.explorerListeners; _i < _a.length; _i++) {
					explorerListener = _a[_i];
					explorerListener.close();
				}
				return [2 /*return*/];
			});
		});
	};
	return Platform;
})();
exports.Platform = Platform;
