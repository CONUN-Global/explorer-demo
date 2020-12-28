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
exports.FabricClient = void 0;
var lodash_1 = require('lodash');
var helper_1 = require('../../common/helper');
var ExplorerError_1 = require('../../common/ExplorerError');
var ExplorerMessage_1 = require('../../common/ExplorerMessage');
var FabricGateway_1 = require('../../platform/fabric/gateway/FabricGateway');
var FabricUtils = require('./utils/FabricUtils');
var logger = helper_1.helper.getLogger('FabricClient');
/**
 *
 *
 * @class FabricClient
 */
var FabricClient = /** @class */ (function() {
	/**
	 * Creates an instance of FabricClient.
	 * @param {FabricConfig} config
	 * @memberof FabricClient
	 */
	function FabricClient(config) {
		this.network_id = config.getNetworkId();
		this.fabricGateway = null;
		this.channelsGenHash = new Map();
		this.config = config;
		this.status = false;
		this.channels = [];
	}
	/**
	 *
	 *
	 * @param {*} persistence
	 * @memberof FabricClient
	 */
	FabricClient.prototype.initialize = function(persistence) {
		return __awaiter(this, void 0, void 0, function() {
			var error_1, channels, e_1, _i, _a, channel, error_2;
			return __generator(this, function(_b) {
				switch (_b.label) {
					case 0:
						// Before initializing a channel
						// Loading client from network configuration file
						logger.debug(
							'Client configuration [%s]  ...',
							this.config.getNetworkId()
						);
						_b.label = 1;
					case 1:
						_b.trys.push([1, 3, , 4]);
						// Use Gateway to connect to fabric network
						this.fabricGateway = new FabricGateway_1.FabricGateway(this.config);
						return [4 /*yield*/, this.fabricGateway.initialize()];
					case 2:
						_b.sent();
						return [3 /*break*/, 4];
					case 3:
						error_1 = _b.sent();
						// TODO in case of the failure, should terminate explorer?
						logger.error(error_1);
						throw new ExplorerError_1.ExplorerError(error_1);
					case 4:
						_b.trys.push([4, 6, , 7]);
						return [4 /*yield*/, this.fabricGateway.queryChannels()];
					case 5:
						channels = _b.sent();
						return [3 /*break*/, 7];
					case 6:
						e_1 = _b.sent();
						logger.error(e_1);
						return [3 /*break*/, 7];
					case 7:
						if (!channels) return [3 /*break*/, 14];
						this.status = true;
						logger.debug('Client channels >> %j', channels.channels);
						(_i = 0), (_a = channels.channels);
						_b.label = 8;
					case 8:
						if (!(_i < _a.length)) return [3 /*break*/, 13];
						channel = _a[_i];
						logger.debug('Initializing channel ', channel.channel_id);
						_b.label = 9;
					case 9:
						_b.trys.push([9, 11, , 12]);
						return [4 /*yield*/, this.initializeNewChannel(channel.channel_id)];
					case 10:
						_b.sent();
						logger.debug('Initialized channel >> %s', channel.channel_id);
						return [3 /*break*/, 12];
					case 11:
						error_2 = _b.sent();
						logger.error('Failed to initialize new channel: ', channel.channel_id);
						return [3 /*break*/, 12];
					case 12:
						_i++;
						return [3 /*break*/, 8];
					case 13:
						return [3 /*break*/, 15];
					case 14:
						if (persistence) {
							logger.info('********* call to initializeDetachClient **********');
							this.initializeDetachClient(persistence);
						} else {
							logger.error('Not found any channels');
						}
						_b.label = 15;
					case 15:
						return [2 /*return*/];
				}
			});
		});
	};
	/**
	 *
	 *
	 * @param {*} persistence
	 * @memberof FabricClient
	 */
	FabricClient.prototype.initializeDetachClient = function(persistence) {
		return __awaiter(this, void 0, void 0, function() {
			var network_config,
				peers,
				channels,
				_i,
				channels_1,
				channel,
				nodes,
				_a,
				nodes_1,
				node,
				peer_config,
				pem,
				msps;
			var _b;
			return __generator(this, function(_c) {
				switch (_c.label) {
					case 0:
						logger.debug('initializeDetachClient', this.config.getNetworkId());
						network_config = this.config.getConfig();
						peers = this.config.getPeersConfig();
						logger.info('initializeDetachClient, network config) ', network_config);
						logger.info(
							'************************************* initializeDetachClient *************************************************'
						);
						logger.info('Error :', ExplorerMessage_1.explorerError.ERROR_1009);
						logger.info('Info : ', ExplorerMessage_1.explorerError.MESSAGE_1001);
						logger.info(
							'************************************** initializeDetachClient ************************************************'
						);
						return [
							4 /*yield*/,
							persistence.getCrudService().getChannelsInfo(this.network_id)
						];
					case 1:
						channels = _c.sent();
						if (channels.length === 0) {
							throw new ExplorerError_1.ExplorerError(
								ExplorerMessage_1.explorerError.ERROR_2003
							);
						}
						(_i = 0), (channels_1 = channels);
						_c.label = 2;
					case 2:
						if (!(_i < channels_1.length)) return [3 /*break*/, 5];
						channel = channels_1[_i];
						this.setChannelGenHash(channel.channelname, channel.channel_genesis_hash);
						return [
							4 /*yield*/,
							persistence
								.getMetricService()
								.getPeerList(this.network_id, channel.channel_genesis_hash)
						];
					case 3:
						nodes = _c.sent();
						for (_a = 0, nodes_1 = nodes; _a < nodes_1.length; _a++) {
							node = nodes_1[_a];
							peer_config = peers[node.server_hostname];
							pem = void 0;
							try {
								if (peer_config && peer_config.tlsCACerts) {
									pem = FabricUtils.getPEMfromConfig(peer_config.tlsCACerts);
									msps =
										((_b = {}),
										(_b[node.mspid] = {
											tls_root_certs: pem
										}),
										_b);
									logger.debug('msps ', msps);
								}
							} catch (e) {
								logger.error(e);
							}
						}
						_c.label = 4;
					case 4:
						_i++;
						return [3 /*break*/, 2];
					case 5:
						return [2 /*return*/];
				}
			});
		});
	};
	/**
	 *
	 *
	 * @param {*} channel_name
	 * @memberof FabricClient
	 */
	FabricClient.prototype.initializeNewChannel = function(channel_name) {
		return __awaiter(this, void 0, void 0, function() {
			var block, channel_genesis_hash;
			return __generator(this, function(_a) {
				switch (_a.label) {
					case 0:
						return [4 /*yield*/, this.getGenesisBlock(channel_name)];
					case 1:
						block = _a.sent();
						logger.debug('Genesis Block for client [%s]', this.network_id);
						return [4 /*yield*/, FabricUtils.generateBlockHash(block.header)];
					case 2:
						channel_genesis_hash = _a.sent();
						// Setting channel_genesis_hash to map
						this.setChannelGenHash(channel_name, channel_genesis_hash);
						this.addChannel(channel_name);
						logger.debug(
							'Channel genesis hash for channel [' +
								channel_name +
								'] >> ' +
								channel_genesis_hash
						);
						return [2 /*return*/];
				}
			});
		});
	};
	/**
	 *
	 *
	 * @param {*} channel_name
	 * @returns
	 * @memberof FabricClient
	 */
	FabricClient.prototype.initializeChannelFromDiscover = function(channel_name) {
		return __awaiter(this, void 0, void 0, function() {
			var discover_results, org;
			return __generator(this, function(_a) {
				switch (_a.label) {
					case 0:
						logger.debug('initializeChannelFromDiscover ', channel_name);
						if (!!lodash_1.includes(this.getChannels(), channel_name))
							return [3 /*break*/, 2];
						return [4 /*yield*/, this.initializeNewChannel(channel_name)];
					case 1:
						_a.sent();
						_a.label = 2;
					case 2:
						return [4 /*yield*/, this.fabricGateway.getDiscoveryResult(channel_name)];
					case 3:
						discover_results = _a.sent();
						if ('peers_by_org' in discover_results) {
							for (org in discover_results.peers_by_org) {
								logger.info(
									'Discovered',
									org,
									discover_results.peers_by_org[org].peers
								);
							}
						}
						return [2 /*return*/, discover_results];
				}
			});
		});
	};
	/**
	 *
	 *
	 * @param {*} channel
	 * @returns
	 * @memberof FabricClient
	 */
	FabricClient.prototype.getGenesisBlock = function(channel) {
		return __awaiter(this, void 0, void 0, function() {
			var genesisBlock;
			return __generator(this, function(_a) {
				switch (_a.label) {
					case 0:
						return [4 /*yield*/, this.fabricGateway.queryBlock(channel, 0)];
					case 1:
						genesisBlock = _a.sent();
						if (!genesisBlock) {
							logger.error('Failed to get genesis block');
							return [2 /*return*/, null];
						}
						return [2 /*return*/, genesisBlock];
				}
			});
		});
	};
	/**
	 *
	 *
	 * @returns
	 * @memberof FabricClient
	 */
	FabricClient.prototype.getChannelNames = function() {
		return Array.from(this.channelsGenHash.keys());
	};
	/**
	 *
	 *
	 *
	 * @returns
	 * @memberof FabricClient
	 */
	FabricClient.prototype.getChannels = function() {
		return this.channels; // Return Array
	};
	/**
	 *
	 *
	 * @param {*} channelName
	 * @memberof FabricClient
	 */
	FabricClient.prototype.addChannel = function(channelName) {
		this.channels.push(channelName);
	};
	/**
	 *
	 *
	 * @param {*} channel_name
	 * @returns
	 * @memberof FabricClient
	 */
	FabricClient.prototype.getChannelGenHash = function(channel_name) {
		return this.channelsGenHash.get(channel_name);
	};
	/**
	 *
	 *
	 * @param {*} name
	 * @param {*} channel_genesis_hash
	 * @memberof FabricClient
	 */
	FabricClient.prototype.setChannelGenHash = function(
		name,
		channel_genesis_hash
	) {
		this.channelsGenHash.set(name, channel_genesis_hash);
	};
	/**
	 *
	 *
	 * @returns
	 * @memberof FabricClient
	 */
	FabricClient.prototype.getNetworkId = function() {
		return this.network_id;
	};
	/**
	 *
	 *
	 * @param {*} channel_genesis_hash
	 * @returns
	 * @memberof FabricClient
	 */
	FabricClient.prototype.getChannelNameByHash = function(channel_genesis_hash) {
		for (var _i = 0, _a = this.channelsGenHash.entries(); _i < _a.length; _i++) {
			var _b = _a[_i],
				channel_name = _b[0],
				hash_name = _b[1];
			if (channel_genesis_hash === hash_name) {
				return channel_name;
			}
		}
	};
	/**
	 *
	 *
	 * @returns
	 * @memberof FabricClient
	 */
	FabricClient.prototype.getStatus = function() {
		return this.status;
	};
	/**
	 *
	 *
	 * @returns
	 * @memberof FabricClient
	 */
	FabricClient.prototype.getNetworkConfig = function() {
		return this.config.getConfig();
	};
	return FabricClient;
})();
exports.FabricClient = FabricClient;
