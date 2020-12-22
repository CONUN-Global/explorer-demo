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
exports.platformroutes = void 0;
var requtil = require('./requestutils');
/**
 *
 *
 * @param {*} router
 * @param {*} platform
 */
function platformroutes(router, platform) {
	return __awaiter(this, void 0, void 0, function() {
		var proxy;
		return __generator(this, function(_a) {
			proxy = platform.getProxy();
			/**
			 * Transactions by Organization(s)
			 * GET /txByOrg
			 * curl -i 'http://<host>:<port>/txByOrg/<channel_genesis_hash>'
			 * Response:
			 * {'rows':[{'count':'4','creator_msp_id':'Org1'}]}
			 */
			router.get('/txByOrg/:channel_genesis_hash', function(req, res) {
				var channel_genesis_hash = req.params.channel_genesis_hash;
				if (channel_genesis_hash) {
					proxy.getTxByOrgs(req.network, channel_genesis_hash).then(function(rows) {
						return res.send({ status: 200, rows: rows });
					});
				} else {
					return requtil.invalidRequest(req, res);
				}
			});
			/**
			 * Channels
			 * GET /channels -> /channels/info
			 * curl -i 'http://<host>:<port>/channels/<info>'
			 * Response:
			 * [
			 * {
			 * 'channelName': 'mychannel',
			 * 'channel_hash': '',
			 * 'craetedat': '1/1/2018'
			 * }
			 * ]
			 */
			router.get('/channels/info', function(req, res) {
				proxy
					.getChannelsInfo(req.network)
					.then(function(data) {
						data.forEach(function(element) {
							element.createdat = new Date(element.createdat).toISOString();
						});
						res.send({ status: 200, channels: data });
					})
					['catch'](function(err) {
						return res.send({ status: 500, error: err });
					});
			});
			/**
			 * *Peer Status List
			 * GET /peerlist -> /peersStatus
			 * curl -i 'http://<host>:<port>/peersStatus/<channel>'
			 * Response:
			 * [
			 * {
			 * 'requests': 'grpcs://127.0.0.1:7051',
			 * 'server_hostname': 'peer0.org1.example.com'
			 * }
			 * ]
			 */
			router.get('/peersStatus/:channel', function(req, res) {
				var channelName = req.params.channel;
				if (channelName) {
					proxy.getPeersStatus(req.network, channelName).then(function(data) {
						res.send({ status: 200, peers: data });
					});
				} else {
					return requtil.invalidRequest(req, res);
				}
			});
			/**
			 * *
			 * Block by number
			 * GET /block/getinfo -> /block
			 * curl -i 'http://<host>:<port>/block/<channel>/<number>'
			 */
			router.get('/block/:channel_genesis_hash/:number', function(req, res) {
				var number = parseInt(req.params.number);
				var channel_genesis_hash = req.params.channel_genesis_hash;
				if (!isNaN(number) && channel_genesis_hash) {
					proxy
						.getBlockByNumber(req.network, channel_genesis_hash, number)
						.then(function(block) {
							if (typeof block === 'string') {
								res.send({ status: 500, error: block });
							} else {
								res.send({
									status: 200,
									number: block.header.number.toString(),
									previous_hash: block.header.previous_hash.toString('hex'),
									data_hash: block.header.data_hash.toString('hex'),
									transactions: block.data.data
								});
							}
						});
				} else {
					return requtil.invalidRequest(req, res);
				}
			});
			/**
			 * Return list of channels
			 * GET /channellist -> /channels
			 * curl -i http://<host>:<port>/channels
			 * Response:
			 * {
			 * 'channels': [
			 * {
			 * 'channel_id': 'mychannel'
			 * }
			 * ]
			 * }
			 */
			router.get('/channels', function(req, res) {
				proxy.getChannels(req.network).then(function(channels) {
					var response = {
						status: 200,
						channels: channels
					};
					res.send(response);
				});
			});
			/**
			 * Return current channel
			 * GET /curChannel
			 * curl -i 'http://<host>:<port>/curChannel'
			 */
			router.get('/curChannel', function(req, res) {
				proxy.getCurrentChannel(req.network).then(function(data) {
					res.send(data);
				});
			});
			/**
			 * Return change channel
			 * POST /changeChannel
			 * curl -i 'http://<host>:<port>/curChannel'
			 */
			router.get('/changeChannel/:channel_genesis_hash', function(req, res) {
				var channel_genesis_hash = req.params.channel_genesis_hash;
				proxy.changeChannel(req.network, channel_genesis_hash).then(function(data) {
					res.send({
						currentChannel: data
					});
				});
			});
			return [2 /*return*/];
		});
	});
} // End platformroutes()
exports.platformroutes = platformroutes;
