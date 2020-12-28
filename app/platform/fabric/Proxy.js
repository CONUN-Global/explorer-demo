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
exports.Proxy = void 0;
var helper_1 = require('../../common/helper');
var NetworkService_1 = require('./service/NetworkService');
var ExplorerError_1 = require('../../common/ExplorerError');
var ExplorerMessage_1 = require('../../common/ExplorerMessage');
var FabricConst = require('./utils/FabricConst');
var fabric_const = FabricConst.fabric['const'];
var logger = helper_1.helper.getLogger('Proxy');
/**
 *
 *
 * @class Proxy
 */
var Proxy = /** @class */ (function() {
	/**
	 * Creates an instance of Proxy.
	 * @param {*} platform
	 * @memberof Proxy
	 */
	function Proxy(platform, userService) {
		this.platform = platform;
		this.persistence = platform.getPersistence();
		this.broadcaster = platform.getBroadcaster();
		this.userService = userService;
	}
	/**
	 *
	 *
	 * @param {*} user
	 * @returns
	 * @memberof Proxy
	 */
	Proxy.prototype.authenticate = function(user) {
		return __awaiter(this, void 0, void 0, function() {
			var response;
			return __generator(this, function(_a) {
				switch (_a.label) {
					case 0:
						return [4 /*yield*/, this.userService.authenticate(user)];
					case 1:
						response = _a.sent();
						logger.debug('result of authentication >> %j', response);
						return [2 /*return*/, response];
				}
			});
		});
	};
	/**
	 *
	 *
	 * @returns
	 * @memberof Proxy
	 */
	Proxy.prototype.networkList = function() {
		return __awaiter(this, void 0, void 0, function() {
			var networkService, response;
			return __generator(this, function(_a) {
				switch (_a.label) {
					case 0:
						networkService = new NetworkService_1.NetworkService(this.platform);
						return [4 /*yield*/, networkService.networkList()];
					case 1:
						response = _a.sent();
						if (!response) {
							response = [
								{
									status: false,
									message: 'Failed to get network list '
								}
							];
						}
						logger.debug('networkList >> %s', response);
						return [2 /*return*/, response];
				}
			});
		});
	};
	/**
	 *
	 *
	 * @returns
	 * @memberof Proxy
	 */
	Proxy.prototype.getCurrentChannel = function(network_id) {
		return __awaiter(this, void 0, void 0, function() {
			var client, channel_name, channel_genesis_hash, respose;
			return __generator(this, function(_a) {
				switch (_a.label) {
					case 0:
						logger.debug('getCurrentChannel: network_id', network_id);
						return [4 /*yield*/, this.platform.getClient(network_id)];
					case 1:
						client = _a.sent();
						channel_name = Object.keys(client.fabricGateway.config.channels)[0];
						channel_genesis_hash = client.getChannelGenHash(channel_name);
						if (channel_genesis_hash) {
							respose = {
								currentChannel: channel_genesis_hash
							};
						} else {
							respose = {
								status: 1,
								message: 'Channel not found in the Context ',
								currentChannel: ''
							};
						}
						logger.debug('getCurrentChannel >> %j', respose);
						return [2 /*return*/, respose];
				}
			});
		});
	};
	/**
	 *
	 *
	 * @param {*} channel_genesis_hash
	 * @returns
	 * @memberof Proxy
	 */
	Proxy.prototype.getPeersStatus = function(network_id, channel_genesis_hash) {
		return __awaiter(this, void 0, void 0, function() {
			var client,
				channel_name,
				nodes,
				discover_results,
				e_1,
				peers,
				_i,
				nodes_1,
				node,
				org,
				_a,
				_b,
				peer;
			return __generator(this, function(_c) {
				switch (_c.label) {
					case 0:
						return [4 /*yield*/, this.platform.getClient(network_id)];
					case 1:
						client = _c.sent();
						channel_name = client.getChannelNameByHash(channel_genesis_hash);
						return [
							4 /*yield*/,
							this.persistence
								.getMetricService()
								.getPeerList(network_id, channel_genesis_hash)
						];
					case 2:
						nodes = _c.sent();
						if (!client.status) return [3 /*break*/, 6];
						_c.label = 3;
					case 3:
						_c.trys.push([3, 5, , 6]);
						return [4 /*yield*/, client.initializeChannelFromDiscover(channel_name)];
					case 4:
						discover_results = _c.sent();
						return [3 /*break*/, 6];
					case 5:
						e_1 = _c.sent();
						logger.debug('getPeersStatus >> ', e_1);
						return [3 /*break*/, 6];
					case 6:
						peers = [];
						for (_i = 0, nodes_1 = nodes; _i < nodes_1.length; _i++) {
							node = nodes_1[_i];
							if (node.peer_type === 'PEER') {
								node.status = 'DOWN';
								if (discover_results && discover_results.peers_by_org) {
									org = discover_results.peers_by_org[node.mspid];
									if (org === undefined) {
										continue;
									}
									for (_a = 0, _b = org.peers; _a < _b.length; _a++) {
										peer = _b[_a];
										if (peer.endpoint === node.requests) {
											node.ledger_height_low = peer.ledgerHeight.low;
											node.ledger_height_high = peer.ledgerHeight.high;
											node.ledger_height_unsigned = peer.ledgerHeight.unsigned;
										}
									}
								}
								peers.push(node);
							} else if (node.peer_type === 'ORDERER') {
								node.status = 'DOWN';
								node.ledger_height_low = '-';
								node.ledger_height_high = '-';
								node.ledger_height_unsigned = '-';
								peers.push(node);
							}
						}
						logger.debug('getPeersStatus >> %j', peers.length);
						return [2 /*return*/, peers];
				}
			});
		});
	};
	/**
	 *
	 *
	 * @param {*} channel_genesis_hash
	 * @returns
	 * @memberof Proxy
	 */
	Proxy.prototype.changeChannel = function(network_id, channel_genesis_hash) {
		return __awaiter(this, void 0, void 0, function() {
			return __generator(this, function(_a) {
				return [2 /*return*/, channel_genesis_hash];
			});
		});
	};
	/**
	 *
	 *
	 * @returns
	 * @memberof Proxy
	 */
	Proxy.prototype.getChannelsInfo = function(network_id) {
		return __awaiter(this, void 0, void 0, function() {
			var client,
				channels,
				currentchannels,
				_i,
				channels_1,
				channel,
				channel_genesis_hash;
			return __generator(this, function(_a) {
				switch (_a.label) {
					case 0:
						client = this.platform.getClient(network_id);
						return [
							4 /*yield*/,
							this.persistence.getCrudService().getChannelsInfo(network_id)
						];
					case 1:
						channels = _a.sent();
						currentchannels = [];
						for (_i = 0, channels_1 = channels; _i < channels_1.length; _i++) {
							channel = channels_1[_i];
							channel_genesis_hash = client.getChannelGenHash(channel.channelname);
							if (
								channel_genesis_hash &&
								channel_genesis_hash === channel.channel_genesis_hash
							) {
								currentchannels.push(channel);
							}
						}
						logger.debug('getChannelsInfo >> %j', currentchannels);
						return [2 /*return*/, currentchannels];
				}
			});
		});
	};
	/**
	 *
	 *
	 * @param {*} channel_genesis_hash
	 * @returns
	 * @memberof Proxy
	 */
	Proxy.prototype.getTxByOrgs = function(network_id, channel_genesis_hash) {
		return __awaiter(this, void 0, void 0, function() {
			var rows,
				organizations,
				_i,
				rows_1,
				organization,
				index,
				_a,
				organizations_1,
				org_id;
			return __generator(this, function(_b) {
				switch (_b.label) {
					case 0:
						return [
							4 /*yield*/,
							this.persistence
								.getMetricService()
								.getTxByOrgs(network_id, channel_genesis_hash)
						];
					case 1:
						rows = _b.sent();
						return [
							4 /*yield*/,
							this.persistence
								.getMetricService()
								.getOrgsData(network_id, channel_genesis_hash)
						];
					case 2:
						organizations = _b.sent();
						for (_i = 0, rows_1 = rows; _i < rows_1.length; _i++) {
							organization = rows_1[_i];
							index = organizations.indexOf(organization.creator_msp_id);
							if (index > -1) {
								organizations.splice(index, 1);
							}
						}
						for (
							_a = 0, organizations_1 = organizations;
							_a < organizations_1.length;
							_a++
						) {
							org_id = organizations_1[_a];
							rows.push({
								count: '0',
								creator_msp_id: org_id
							});
						}
						return [2 /*return*/, rows];
				}
			});
		});
	};
	/**
	 *
	 *
	 * @param {*} channel_genesis_hash
	 * @param {*} number
	 * @returns
	 * @memberof Proxy
	 */
	Proxy.prototype.getBlockByNumber = function(
		network_id,
		channel_genesis_hash,
		number
	) {
		return __awaiter(this, void 0, void 0, function() {
			var client, channelName, block, e_2;
			return __generator(this, function(_a) {
				switch (_a.label) {
					case 0:
						client = this.platform.getClient(network_id);
						channelName = client.getChannelNameByHash(channel_genesis_hash);
						_a.label = 1;
					case 1:
						_a.trys.push([1, 3, , 4]);
						return [
							4 /*yield*/,
							client.fabricGateway.queryBlock(channelName, parseInt(number))
						];
					case 2:
						block = _a.sent();
						return [3 /*break*/, 4];
					case 3:
						e_2 = _a.sent();
						logger.debug('queryBlock >> ', e_2);
						return [3 /*break*/, 4];
					case 4:
						if (block) {
							return [2 /*return*/, block];
						}
						logger.error('response_payloads is null');
						return [2 /*return*/, 'response_payloads is null'];
				}
			});
		});
	};
	/**
	 *
	 *
	 * @returns
	 * @memberof Proxy
	 */
	Proxy.prototype.getClientStatus = function() {
		var client = this.platform.getClient();
		return client.getStatus();
	};
	/**
	 *
	 *
	 * @returns
	 * @memberof Proxy
	 */
	Proxy.prototype.getChannels = function(network_id) {
		return __awaiter(this, void 0, void 0, function() {
			var client, client_channels, channels, respose, i, index;
			return __generator(this, function(_a) {
				switch (_a.label) {
					case 0:
						client = this.platform.getClient(network_id);
						client_channels = client.getChannelNames();
						return [
							4 /*yield*/,
							this.persistence.getCrudService().getChannelsInfo(network_id)
						];
					case 1:
						channels = _a.sent();
						respose = [];
						i = 0;
						_a.label = 2;
					case 2:
						if (!(i < channels.length)) return [3 /*break*/, 6];
						index = client_channels.indexOf(channels[i].channelname);
						if (!(index <= -1)) return [3 /*break*/, 4];
						return [
							4 /*yield*/,
							client.initializeNewChannel(channels[i].channelname)
						];
					case 3:
						_a.sent();
						_a.label = 4;
					case 4:
						respose.push(channels[i].channelname);
						_a.label = 5;
					case 5:
						i++;
						return [3 /*break*/, 2];
					case 6:
						logger.debug('getChannels >> %j', respose);
						return [2 /*return*/, respose];
				}
			});
		});
	};
	/**
	 *
	 *
	 * @param {*} reqUser
	 * @returns
	 * @memberof Proxy
	 */
	Proxy.prototype.register = function(reqUser) {
		return __awaiter(this, void 0, void 0, function() {
			var response;
			return __generator(this, function(_a) {
				switch (_a.label) {
					case 0:
						return [4 /*yield*/, this.userService.register(reqUser)];
					case 1:
						response = _a.sent();
						logger.debug('register >> %s', response);
						return [2 /*return*/, response];
				}
			});
		});
	};
	/**
	 *
	 *
	 * @param {*} reqUser
	 * @returns
	 * @memberof Proxy
	 */
	Proxy.prototype.unregister = function(reqUser) {
		return __awaiter(this, void 0, void 0, function() {
			var response;
			return __generator(this, function(_a) {
				switch (_a.label) {
					case 0:
						return [4 /*yield*/, this.userService.unregister(reqUser)];
					case 1:
						response = _a.sent();
						logger.debug('unregister >> %s', response);
						return [2 /*return*/, response];
				}
			});
		});
	};
	/**
	 *
	 *
	 * @returns
	 * @memberof Proxy
	 */
	Proxy.prototype.userlist = function(reqUser) {
		return __awaiter(this, void 0, void 0, function() {
			var response;
			return __generator(this, function(_a) {
				switch (_a.label) {
					case 0:
						return [4 /*yield*/, this.userService.userlist(reqUser)];
					case 1:
						response = _a.sent();
						logger.debug('userlist >> %s', response);
						return [2 /*return*/, response];
				}
			});
		});
	};
	/**
	 *
	 *
	 * @param {*} msg
	 * @memberof Proxy
	 */
	Proxy.prototype.processSyncMessage = function(msg) {
		// Get message from child process
		logger.debug('Message from child %j', msg);
		if (fabric_const.NOTITY_TYPE_NEWCHANNEL === msg.notify_type) {
			// Initialize new channel instance in parent
			if (msg.network_id) {
				var client = this.platform.getClient(msg.network_id);
				if (msg.channel_name) {
					client.initializeNewChannel(msg.channel_name);
				} else {
					logger.error(
						'Channel name should pass to process the notification from child process'
					);
				}
			} else {
				logger.error(
					'Network name and client name should pass to process the notification from child process'
				);
			}
		} else if (
			fabric_const.NOTITY_TYPE_UPDATECHANNEL === msg.notify_type ||
			fabric_const.NOTITY_TYPE_CHAINCODE === msg.notify_type
		) {
			// Update channel details in parent
			if (msg.network_id) {
				var client = this.platform.getClient(msg.network_id);
				if (msg.channel_name) {
					client.initializeChannelFromDiscover(msg.channel_name);
				} else {
					logger.error(
						'Channel name should pass to process the notification from child process'
					);
				}
			} else {
				logger.error(
					'Network name and client name should pass to process the notification from child process'
				);
			}
		} else if (fabric_const.NOTITY_TYPE_BLOCK === msg.notify_type) {
			// Broad cast new block message to client
			var notify = {
				title: msg.title,
				type: msg.type,
				message: msg.message,
				time: msg.time,
				txcount: msg.txcount,
				datahash: msg.datahash
			};
			this.broadcaster.broadcast(notify);
		} else if (fabric_const.NOTITY_TYPE_EXISTCHANNEL === msg.notify_type) {
			throw new ExplorerError_1.ExplorerError(
				ExplorerMessage_1.explorerError.ERROR_2009,
				msg.channel_name
			);
		} else if (msg.error) {
			throw new ExplorerError_1.ExplorerError(
				ExplorerMessage_1.explorerError.ERROR_2010,
				msg.error
			);
		} else {
			logger.error(
				'Child process notify is not implemented for this type %s ',
				msg.notify_type
			);
		}
	};
	return Proxy;
})();
exports.Proxy = Proxy;
