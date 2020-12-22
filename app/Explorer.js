'use strict';
/**
 *    SPDX-License-Identifier: Apache-2.0
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
exports.Explorer = void 0;
var express_1 = require('express');
var body_parser_1 = require('body-parser');
var swagger_ui_express_1 = require('swagger-ui-express');
var compression_1 = require('compression');
var passport_1 = require('passport');
var express_rate_limit_1 = require('express-rate-limit');
var PlatformBuilder_1 = require('./platform/PlatformBuilder');
var explorerconfig_json_1 = require('./explorerconfig.json');
var PersistenceFactory_1 = require('./persistence/PersistenceFactory');
var authroutes_1 = require('./rest/authroutes');
var dbroutes_1 = require('./rest/dbroutes');
var platformroutes_1 = require('./rest/platformroutes');
var adminroutes_1 = require('./platform/fabric/rest/adminroutes');
var ExplorerConst_1 = require('./common/ExplorerConst');
var ExplorerMessage_1 = require('./common/ExplorerMessage');
var auth_check_1 = require('./middleware/auth-check');
var swagger_json_1 = require('./swagger.json');
var ExplorerError_1 = require('./common/ExplorerError');
var local_login_1 = require('./passport/local-login');
/**
 *
 *
 * @class Explorer
 */
var Explorer = /** @class */ (function() {
	/**
	 * Creates an instance of explorerConst.
	 * @memberof Explorer
	 */
	function Explorer() {
		// set up rate limiter: maximum of 1000 requests per minute
		this.app = express_1['default']();
		var limiter = new express_rate_limit_1['default']({
			windowMs: 1 * 60 * 1000,
			max: 1000
		});
		// apply rate limiter to all requests
		this.app.use(limiter);
		this.app.use(body_parser_1['default'].json());
		this.app.use(
			body_parser_1['default'].urlencoded({
				extended: true
			})
		);
		// eslint-disable-next-line spellcheck/spell-checker
		// handle rate limit, see https://lgtm.com/rules/1506065727959/
		this.app.use(passport_1['default'].initialize());
		if (process.env.NODE_ENV !== 'production') {
			this.app.use(
				'/api-docs',
				swagger_ui_express_1['default'].serve,
				swagger_ui_express_1['default'].setup(swagger_json_1['default'])
			);
		}
		this.app.use(compression_1['default']());
		this.persistence = null;
		this.platforms = [];
	}
	/**
	 *
	 *
	 * @returns
	 * @memberof Explorer
	 */
	Explorer.prototype.getApp = function() {
		return this.app;
	};
	/**
	 *
	 *
	 * @param {*} broadcaster
	 * @memberof Explorer
	 */
	Explorer.prototype.initialize = function(broadcaster) {
		return __awaiter(this, void 0, void 0, function() {
			var _a, _i, _b, pltfrm, platform, authrouter, apirouter;
			return __generator(this, function(_c) {
				switch (_c.label) {
					case 0:
						if (
							!explorerconfig_json_1['default'][
								ExplorerConst_1.explorerConst.PERSISTENCE
							]
						) {
							throw new ExplorerError_1.ExplorerError(
								ExplorerMessage_1.explorerError.ERROR_1001
							);
						}
						if (
							!explorerconfig_json_1['default'][
								explorerconfig_json_1['default'][
									ExplorerConst_1.explorerConst.PERSISTENCE
								]
							]
						) {
							throw new ExplorerError_1.ExplorerError(
								ExplorerMessage_1.explorerError.ERROR_1002,
								explorerconfig_json_1['default'][
									ExplorerConst_1.explorerConst.PERSISTENCE
								]
							);
						}
						_a = this;
						return [
							4 /*yield*/,
							PersistenceFactory_1.PersistenceFactory.create(
								explorerconfig_json_1['default'][
									ExplorerConst_1.explorerConst.PERSISTENCE
								],
								explorerconfig_json_1['default'][
									explorerconfig_json_1['default'][
										ExplorerConst_1.explorerConst.PERSISTENCE
									]
								]
							)
						];
					case 1:
						_a.persistence = _c.sent();
						(_i = 0),
							(_b =
								explorerconfig_json_1['default'][
									ExplorerConst_1.explorerConst.PLATFORMS
								]);
						_c.label = 2;
					case 2:
						if (!(_i < _b.length)) return [3 /*break*/, 9];
						pltfrm = _b[_i];
						return [
							4 /*yield*/,
							PlatformBuilder_1.PlatformBuilder.build(
								pltfrm,
								this.persistence,
								broadcaster
							)
						];
					case 3:
						platform = _c.sent();
						platform.setPersistenceService();
						// Initializing the platform
						return [4 /*yield*/, platform.initialize()];
					case 4:
						// Initializing the platform
						_c.sent();
						// Make sure that platform instance will be referred after its initialization
						passport_1['default'].use(
							'local-login',
							local_login_1.localLoginStrategy(platform)
						);
						this.app.use('/api', auth_check_1.authCheckMiddleware);
						authrouter = express_1['default'].Router();
						// Initializing the rest app services
						return [4 /*yield*/, authroutes_1.authroutes(authrouter, platform)];
					case 5:
						// Initializing the rest app services
						_c.sent();
						apirouter = express_1['default'].Router();
						// Initializing the rest app services
						dbroutes_1.dbroutes(apirouter, platform);
						return [
							4 /*yield*/,
							platformroutes_1.platformroutes(apirouter, platform)
						];
					case 6:
						_c.sent();
						return [4 /*yield*/, adminroutes_1.adminroutes(apirouter, platform)];
					case 7:
						_c.sent();
						this.app.use('/auth', authrouter);
						this.app.use('/api', apirouter);
						// Initializing sync listener
						platform.initializeListener(explorerconfig_json_1['default'].sync);
						this.platforms.push(platform);
						_c.label = 8;
					case 8:
						_i++;
						return [3 /*break*/, 2];
					case 9:
						return [2 /*return*/];
				}
			});
		});
	};
	/**
	 *
	 *
	 * @memberof Explorer
	 */
	Explorer.prototype.close = function() {
		if (this.persistence) {
			this.persistence.closeconnection();
		}
		for (var _i = 0, _a = this.platforms; _i < _a.length; _i++) {
			var platform = _a[_i];
			if (platform) {
				platform.destroy();
			}
		}
	};
	return Explorer;
})();
exports.Explorer = Explorer;
