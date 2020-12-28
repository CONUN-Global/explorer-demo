'use strict';
/*
 *SPDX-License-Identifier: Apache-2.0
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
exports.getPEMfromConfig = exports.generateBlockHash = exports.generateDir = exports.getBlockTimeStamp = exports.createFabricClient = void 0;
var path = require('path');
var fs_extra_1 = require('fs-extra');
var js_sha256_1 = require('js-sha256');
var asn1_js_1 = require('asn1.js');
var fabric_common_1 = require('fabric-common');
var FabricClient_1 = require('../FabricClient');
var ExplorerError_1 = require('../../../common/ExplorerError');
var ExplorerMessage_1 = require('../../../common/ExplorerMessage');
var helper_1 = require('../../../common/helper');
var logger = helper_1.helper.getLogger('FabricUtils');
function createFabricClient(config, persistence) {
	return __awaiter(this, void 0, void 0, function() {
		var client, err_1;
		return __generator(this, function(_a) {
			switch (_a.label) {
				case 0:
					client = new FabricClient_1.FabricClient(config);
					// Initialize fabric client
					logger.debug(
						'************ Initializing fabric client for [%s]************',
						config.getNetworkId()
					);
					_a.label = 1;
				case 1:
					_a.trys.push([1, 3, , 4]);
					return [4 /*yield*/, client.initialize(persistence)];
				case 2:
					_a.sent();
					return [2 /*return*/, client];
				case 3:
					err_1 = _a.sent();
					throw new ExplorerError_1.ExplorerError(
						ExplorerMessage_1.explorerError.ERROR_2014
					);
				case 4:
					return [2 /*return*/];
			}
		});
	});
}
exports.createFabricClient = createFabricClient;
/**
 *
 *
 * @param {*} dateStr
 * @returns
 */
function getBlockTimeStamp(dateStr) {
	return __awaiter(this, void 0, void 0, function() {
		return __generator(this, function(_a) {
			try {
				return [2 /*return*/, new Date(dateStr)];
			} catch (err) {
				logger.error(err);
			}
			return [2 /*return*/, new Date(dateStr)];
		});
	});
}
exports.getBlockTimeStamp = getBlockTimeStamp;
/**
 *
 *
 * @returns
 */
function generateDir() {
	return __awaiter(this, void 0, void 0, function() {
		var tempDir;
		return __generator(this, function(_a) {
			tempDir = '/tmp/' + new Date().getTime();
			try {
				fs_extra_1['default'].mkdirSync(tempDir);
			} catch (err) {
				logger.error(err);
			}
			return [2 /*return*/, tempDir];
		});
	});
}
exports.generateDir = generateDir;
/**
 *
 *
 * @param {*} header
 * @returns
 */
function generateBlockHash(header) {
	return __awaiter(this, void 0, void 0, function() {
		var headerAsn, output;
		return __generator(this, function(_a) {
			headerAsn = asn1_js_1['default'].define('headerAsn', function() {
				this.seq().obj(
					this.key('Number').int(),
					this.key('PreviousHash').octstr(),
					this.key('DataHash').octstr()
				);
			});
			logger.info('generateBlockHash', header.number.toString());
			output = headerAsn.encode(
				{
					Number: parseInt(header.number.low),
					PreviousHash: header.previous_hash,
					DataHash: header.data_hash
				},
				'der'
			);
			return [2 /*return*/, js_sha256_1['default'].sha256(output)];
		});
	});
}
exports.generateBlockHash = generateBlockHash;
/**
 *
 *
 * @param {*} config
 * @returns
 */
function getPEMfromConfig(config) {
	var result = null;
	if (config) {
		if (config.path) {
			// Cert value is in a file
			try {
				result = readFileSync(config.path);
				result = fabric_common_1.Utils.normalizeX509(result);
			} catch (e) {
				logger.error(e);
			}
		}
	}
	return result;
}
exports.getPEMfromConfig = getPEMfromConfig;
/**
 *
 *
 * @param {*} config_path
 * @returns
 */
function readFileSync(config_path) {
	try {
		var config_loc = path.resolve(config_path);
		var data = fs_extra_1['default'].readFileSync(config_loc);
		return Buffer.from(data).toString();
	} catch (err) {
		logger.error('NetworkConfig101 - problem reading the PEM file :: ' + err);
		throw err;
	}
}
