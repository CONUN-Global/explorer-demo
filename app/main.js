'use strict';
/*
 * SPDX-License-Identifier: Apache-2.0
 */
var __extends =
	(this && this.__extends) ||
	(function() {
		var extendStatics = function(d, b) {
			extendStatics =
				Object.setPrototypeOf ||
				({ __proto__: [] } instanceof Array &&
					function(d, b) {
						d.__proto__ = b;
					}) ||
				function(d, b) {
					for (var p in b)
						if (Object.prototype.hasOwnProperty.call(b, p)) d[p] = b[p];
				};
			return extendStatics(d, b);
		};
		return function(d, b) {
			extendStatics(d, b);
			function __() {
				this.constructor = d;
			}
			d.prototype =
				b === null ? Object.create(b) : ((__.prototype = b.prototype), new __());
		};
	})();
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
/**
 *
 * Created by shouhewu on 6/8/17.
 *
 */
var express_1 = require('express');
var helmet_1 = require('helmet');
var path_1 = require('path');
var http_1 = require('http');
var https_1 = require('https');
var url_1 = require('url');
var WebSocket = require('ws');
var fs = require('fs');
var helper_1 = require('./common/helper');
var appconfig_json_1 = require('./appconfig.json');
var Explorer_1 = require('./Explorer');
var ExplorerError_1 = require('./common/ExplorerError');
var logger = helper_1.helper.getLogger('main');
var sslEnabled =
	process.env.SSL_ENABLED || appconfig_json_1['default'].sslEnabled;
var sslCertsPath =
	process.env.SSL_CERTS_PATH || appconfig_json_1['default'].sslCertsPath;
var host = process.env.HOST || appconfig_json_1['default'].host;
var port = process.env.PORT || appconfig_json_1['default'].port;
var protocol = sslEnabled ? 'https' : 'http';
/**
 *
 *
 * @class Broadcaster
 * @extends {WebSocket.Server}
 */
var Broadcaster = /** @class */ (function(_super) {
	__extends(Broadcaster, _super);
	/**
	 * Creates an instance of Broadcaster.
	 * @param {*} bServer
	 * @memberof Broadcaster
	 */
	function Broadcaster(bServer) {
		var _this =
			_super.call(this, {
				server: bServer
			}) || this;
		_this.on('connection', function connection(ws, req) {
			var location = url_1['default'].parse(req.url, true);
			this.on('message', function(message) {
				logger.info('received: %s, %s', location, message);
			});
		});
		return _this;
	}
	/**
	 *
	 *
	 * @param {*} data
	 * @memberof Broadcaster
	 */
	Broadcaster.prototype.broadcast = function(data) {
		this.clients.forEach(function(client) {
			if (client.readyState === WebSocket.OPEN) {
				logger.debug('Broadcast >> %j', data);
				client.send(JSON.stringify(data));
			}
		});
	};
	return Broadcaster;
})(WebSocket.Server);
var server;
var explorer;
function startExplorer() {
	return __awaiter(this, void 0, void 0, function() {
		var sslPath, options, broadcaster;
		return __generator(this, function(_a) {
			switch (_a.label) {
				case 0:
					explorer = new Explorer_1.Explorer();
					// Application headers
					explorer.getApp().use(helmet_1['default']());
					explorer.getApp().use(helmet_1['default'].xssFilter());
					explorer.getApp().use(helmet_1['default'].hidePoweredBy());
					explorer.getApp().use(helmet_1['default'].referrerPolicy());
					explorer.getApp().use(helmet_1['default'].noSniff());
					/* eslint-disable */
					explorer
						.getApp()
						.use(helmet_1['default'].frameguard({ action: 'SAMEORIGIN' }));
					explorer.getApp().use(
						helmet_1['default'].contentSecurityPolicy({
							directives: {
								defaultSrc: ["'self'"],
								styleSrc: ["'self'", "'unsafe-inline'"],
								scriptSrc: ["'self'", "'unsafe-inline'", "'unsafe-eval'"],
								objectSrc: ["'self'"],
								frameSrc: ["'self'"],
								fontSrc: ["'self'"],
								imgSrc: ["'self' data: https:; "]
							}
						})
					);
					sslPath = path_1['default'].join(__dirname, sslCertsPath);
					logger.debug(sslEnabled, sslCertsPath, sslPath);
					if (sslEnabled) {
						options = {
							key: fs.readFileSync(sslPath + '/privatekey.pem').toString(),
							cert: fs.readFileSync(sslPath + '/certificate.pem').toString()
						};
						server = https_1['default'].createServer(options, explorer.getApp());
					} else {
						server = http_1['default'].createServer(explorer.getApp());
					}
					broadcaster = new Broadcaster(server);
					return [4 /*yield*/, explorer.initialize(broadcaster)];
				case 1:
					_a.sent();
					explorer
						.getApp()
						.use(
							express_1['default'].static(
								path_1['default'].join(__dirname, '..', 'client/build')
							)
						);
					// ============= start server =======================
					server.listen(port, function() {
						logger.info(
							'Please open web browser to access \uFF1A' +
								protocol +
								'://' +
								host +
								':' +
								port +
								'/'
						);
						logger.info('pid is ' + process.pid);
					});
					return [2 /*return*/];
			}
		});
	});
}
startExplorer();
/* eslint-disable */
var connections = [];
server.on('connection', function(connection) {
	connections.push(connection);
	connection.on('close', function() {
		return (connections = connections.filter(function(curr) {
			return curr !== connection;
		}));
	});
});
/* eslint-enable */
/*
 * This function is called when you want the server to die gracefully
 * i.e. wait for existing connections
 */
var shutDown = function(exitCode) {
	logger.info('Received kill signal, shutting down gracefully');
	server.close(function() {
		explorer.close();
		logger.info('Closed out connections');
		process.exit(exitCode);
	});
	setTimeout(function() {
		logger.error('Could not close connections in time, forcefully shutting down');
		explorer.close();
		process.exit(1);
	}, 10000);
	connections.forEach(function(curr) {
		return curr.end();
	});
	setTimeout(function() {
		return connections.forEach(function(curr) {
			return curr.destroy();
		});
	}, 5000);
};
process.on('unhandledRejection', function(up) {
	logger.error(
		'<<<<<<<<<<<<<<<<<<<<<<<<<< Explorer Error >>>>>>>>>>>>>>>>>>>>>'
	);
	if (up instanceof ExplorerError_1.ExplorerError) {
		logger.error('Error : ', up.message);
	} else {
		logger.error(up);
	}
	setTimeout(function() {
		shutDown(1);
	}, 2000);
});
process.on('uncaughtException', function(up) {
	logger.error(
		'<<<<<<<<<<<<<<<<<<<<<<<<<< Explorer Error >>>>>>>>>>>>>>>>>>>>>'
	);
	if (up instanceof ExplorerError_1.ExplorerError) {
		logger.error('Error : ', up.message);
	} else {
		logger.error(up);
	}
	setTimeout(function() {
		shutDown(1);
	}, 2000);
});
// Listen for TERM signal .e.g. kill
process.on('SIGTERM', shutDown);
// Listen for INT signal e.g. Ctrl-C
process.on('SIGINT', shutDown);
