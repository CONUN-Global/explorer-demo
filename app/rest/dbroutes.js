'use strict';
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
exports.dbroutes = void 0;
/**
 *    SPDX-License-Identifier: Apache-2.0
 */
var requtil = require('./requestutils');
/**
 *
 *
 * @param {*} router
 * @param {*} platform
 */
function dbroutes(router, platform) {
	var _this = this;
	var dbStatusMetrics = platform.getPersistence().getMetricService();
	var dbCrudService = platform.getPersistence().getCrudService();
	router.get('/status/:channel_genesis_hash', function(req, res) {
		var channel_genesis_hash = req.params.channel_genesis_hash;
		if (channel_genesis_hash) {
			var extReq = req;
			dbStatusMetrics.getStatus(extReq.network, channel_genesis_hash, function(
				data
			) {
				if (data && data.chaincodeCount && data.txCount && data.peerCount) {
					return res.send(data);
				}
				return requtil.notFound(req, res);
			});
		} else {
			return requtil.invalidRequest(req, res);
		}
	});
	/**
	 * Transaction count
	 * GET /block/get -> /block/transactions/
	 * curl -i 'http://<host>:<port>/block/transactions/<channel_genesis_hash>/<number>'
	 * Response:
	 * {
	 * 'number': 2,
	 * 'txCount': 1
	 * }
	 */
	router.get('/block/transactions/:channel_genesis_hash/:number', function(
		req,
		res
	) {
		return __awaiter(_this, void 0, void 0, function() {
			var number, channel_genesis_hash, extReq, row;
			return __generator(this, function(_a) {
				switch (_a.label) {
					case 0:
						number = parseInt(req.params.number);
						channel_genesis_hash = req.params.channel_genesis_hash;
						if (!(!isNaN(number) && channel_genesis_hash)) return [3 /*break*/, 2];
						extReq = req;
						return [
							4 /*yield*/,
							dbCrudService.getTxCountByBlockNum(
								extReq.network,
								channel_genesis_hash,
								number
							)
						];
					case 1:
						row = _a.sent();
						if (row) {
							return [
								2 /*return*/,
								res.send({
									status: 200,
									number: row.blocknum,
									txCount: row.txcount
								})
							];
						}
						return [2 /*return*/, requtil.notFound(req, res)];
					case 2:
						return [2 /*return*/, requtil.invalidRequest(req, res)];
				}
			});
		});
	});
	/**
	 * *
	 * Transaction Information
	 * GET /tx/getinfo -> /transaction/<txid>
	 * curl -i 'http://<host>:<port>/transaction/<channel_genesis_hash>/<txid>'
	 * Response:
	 * {
	 * 'tx_id': 'header.channel_header.tx_id',
	 * 'timestamp': 'header.channel_header.timestamp',
	 * 'channel_id': 'header.channel_header.channel_id',
	 * 'type': 'header.channel_header.type'
	 * }
	 */
	router.get('/transaction/:channel_genesis_hash/:txid', function(req, res) {
		var txid = req.params.txid;
		var channel_genesis_hash = req.params.channel_genesis_hash;
		if (txid && txid !== '0' && channel_genesis_hash) {
			var extReq = req;
			dbCrudService
				.getTransactionByID(extReq.network, channel_genesis_hash, txid)
				.then(function(row) {
					if (row) {
						row.createdt = new Date(row.createdt).toISOString();
						return res.send({ status: 200, row: row });
					}
				});
		} else {
			return requtil.invalidRequest(req, res);
		}
	});
	router.get('/blockActivity/:channel_genesis_hash', function(req, res) {
		var channel_genesis_hash = req.params.channel_genesis_hash;
		if (channel_genesis_hash) {
			var extReq = req;
			dbCrudService
				.getBlockActivityList(extReq.network, channel_genesis_hash)
				.then(function(row) {
					if (row) {
						return res.send({ status: 200, row: row });
					}
				});
		} else {
			return requtil.invalidRequest(req, res);
		}
	});
	/**
	 * *
	 * Transaction list
	 * GET /txList/
	 * curl -i 'http://<host>:<port>/txList/<channel_genesis_hash>/<blocknum>/<txid>/<limitrows>/<offset>'
	 * Response:
	 * {'rows':[{'id':56,'channelname':'mychannel','blockid':24,
	 * 'txhash':'c42c4346f44259628e70d52c672d6717d36971a383f18f83b118aaff7f4349b8',
	 * 'createdt':'2018-03-09T19:40:59.000Z','chaincodename':'mycc'}]}
	 */
	router.get('/txList/:channel_genesis_hash/:blocknum/:txid', function(
		req,
		res
	) {
		return __awaiter(_this, void 0, void 0, function() {
			var channel_genesis_hash, blockNum, txid, orgs, _a, from, to, extReq;
			return __generator(this, function(_b) {
				channel_genesis_hash = req.params.channel_genesis_hash;
				blockNum = parseInt(req.params.blocknum);
				txid = parseInt(req.params.txid);
				orgs = requtil.parseOrgsArray(req.query);
				(_a = requtil.queryDatevalidator(req.query.from, req.query.to)),
					(from = _a.from),
					(to = _a.to);
				if (isNaN(txid)) {
					txid = 0;
				}
				if (channel_genesis_hash) {
					extReq = req;
					dbCrudService
						.getTxList(
							extReq.network,
							channel_genesis_hash,
							blockNum,
							txid,
							from,
							to,
							orgs
						)
						.then(handleResult(req, res));
				} else {
					return [2 /*return*/, requtil.invalidRequest(req, res)];
				}
				return [2 /*return*/];
			});
		});
	});
	/**
	 * Chaincode list
	 * GET /chaincodelist -> /chaincode
	 * curl -i 'http://<host>:<port>/chaincode/<channel>'
	 * Response:
	 * [
	 * {
	 * 'channelName': 'mychannel',
	 * 'chaincodename': 'mycc',
	 * 'path': 'github.com/hyperledger/fabric/examples/chaincode/go/chaincode_example02',
	 * 'version': '1.0',
	 * 'txCount': 0
	 * }
	 * ]
	 */
	router.get('/chaincode/:channel', function(req, res) {
		var channelName = req.params.channel;
		if (channelName) {
			var extReq = req;
			dbStatusMetrics.getTxPerChaincode(extReq.network, channelName, function(
				data
			) {
				return __awaiter(_this, void 0, void 0, function() {
					return __generator(this, function(_a) {
						res.send({
							status: 200,
							chaincode: data
						});
						return [2 /*return*/];
					});
				});
			});
		} else {
			return requtil.invalidRequest(req, res);
		}
	});
	/**
	 * *Peer List
	 * GET /peerlist -> /peers
	 * curl -i 'http://<host>:<port>/peers/<channel_genesis_hash>'
	 * Response:
	 * [
	 * {
	 * 'requests': 'grpcs://127.0.0.1:7051',
	 * 'server_hostname': 'peer0.org1.example.com'
	 * }
	 * ]
	 */
	router.get('/peers/:channel_genesis_hash', function(req, res) {
		var channel_genesis_hash = req.params.channel_genesis_hash;
		if (channel_genesis_hash) {
			var extReq = req;
			dbStatusMetrics.getPeerList(extReq.network, channel_genesis_hash, function(
				data
			) {
				res.send({ status: 200, peers: data });
			});
		} else {
			return requtil.invalidRequest(req, res);
		}
	});
	/**
	 * *
	 * List of blocks and transactions
	 * GET /blockAndTxList
	 * curl -i 'http://<host>:<port>/blockAndTxList/channel_genesis_hash/<blockNum>/<limitrows>/<offset>'
	 * Response:
	 * {'rows':[{'id':51,'blocknum':50,'datahash':'374cceda1c795e95fc31af8f137feec8ab6527b5d6c85017dd8088a456a68dee',
	 * 'prehash':'16e76ca38975df7a44d2668091e0d3f05758d6fbd0aab76af39f45ad48a9c295','channelname':'mychannel','txcount':1,
	 * 'createdt':'2018-03-13T15:58:45.000Z','txhash':['6740fb70ed58d5f9c851550e092d08b5e7319b526b5980a984b16bd4934b87ac']}]}
	 */
	router.get('/blockAndTxList/:channel_genesis_hash/:blocknum', function(
		req,
		res
	) {
		return __awaiter(_this, void 0, void 0, function() {
			var channel_genesis_hash, blockNum, orgs, _a, from, to, extReq;
			return __generator(this, function(_b) {
				channel_genesis_hash = req.params.channel_genesis_hash;
				blockNum = parseInt(req.params.blocknum);
				orgs = requtil.parseOrgsArray(req.query);
				(_a = requtil.queryDatevalidator(req.query.from, req.query.to)),
					(from = _a.from),
					(to = _a.to);
				if (channel_genesis_hash && !isNaN(blockNum)) {
					extReq = req;
					return [
						2 /*return*/,
						dbCrudService
							.getBlockAndTxList(
								extReq.network,
								channel_genesis_hash,
								blockNum,
								from,
								to,
								orgs
							)
							.then(handleResult(req, res))
					];
				}
				return [2 /*return*/, requtil.invalidRequest(req, res)];
			});
		});
	});
	/**
	 * *
	 * Transactions per minute with hour interval
	 * GET /txByMinute
	 * curl -i 'http://<host>:<port>/txByMinute/<channel_genesis_hash>/<hours>'
	 * Response:
	 * {'rows':[{'datetime':'2018-03-13T17:46:00.000Z','count':'0'},{'datetime':'2018-03-13T17:47:00.000Z','count':'0'},
	 * {'datetime':'2018-03-13T17:48:00.000Z','count':'0'},{'datetime':'2018-03-13T17:49:00.000Z','count':'0'},
	 * {'datetime':'2018-03-13T17:50:00.000Z','count':'0'},{'datetime':'2018-03-13T17:51:00.000Z','count':'0'},
	 * {'datetime':'2018-03-13T17:52:00.000Z','count':'0'},{'datetime':'2018-03-13T17:53:00.000Z','count':'0'}]}
	 */
	router.get('/txByMinute/:channel_genesis_hash/:hours', function(req, res) {
		var channel_genesis_hash = req.params.channel_genesis_hash;
		var hours = parseInt(req.params.hours);
		if (channel_genesis_hash && !isNaN(hours)) {
			var extReq = req;
			return dbStatusMetrics
				.getTxByMinute(extReq.network, channel_genesis_hash, hours)
				.then(handleResult(req, res));
		}
		return requtil.invalidRequest(req, res);
	});
	/**
	 * *
	 * Transactions per hour(s) with day interval
	 * GET /txByHour
	 * curl -i 'http://<host>:<port>/txByHour/<channel_genesis_hash>/<days>'
	 * Response:
	 * {'rows':[{'datetime':'2018-03-12T19:00:00.000Z','count':'0'},
	 * {'datetime':'2018-03-12T20:00:00.000Z','count':'0'}]}
	 */
	router.get('/txByHour/:channel_genesis_hash/:days', function(req, res) {
		var channel_genesis_hash = req.params.channel_genesis_hash;
		var days = parseInt(req.params.days);
		if (channel_genesis_hash && !isNaN(days)) {
			var extReq = req;
			return dbStatusMetrics
				.getTxByHour(extReq.network, channel_genesis_hash, days)
				.then(handleResult(req, res));
		}
		return requtil.invalidRequest(req, res);
	});
	/**
	 * *
	 * Blocks per minute with hour interval
	 * GET /blocksByMinute
	 * curl -i 'http://<host>:<port>/blocksByMinute/<channel_genesis_hash>/<hours>'
	 * Response:
	 * {'rows':[{'datetime':'2018-03-13T19:59:00.000Z','count':'0'}]}
	 */
	router.get('/blocksByMinute/:channel_genesis_hash/:hours', function(req, res) {
		var channel_genesis_hash = req.params.channel_genesis_hash;
		var hours = parseInt(req.params.hours);
		if (channel_genesis_hash && !isNaN(hours)) {
			var extReq = req;
			return dbStatusMetrics
				.getBlocksByMinute(extReq.network, channel_genesis_hash, hours)
				.then(handleResult(req, res));
		}
		return requtil.invalidRequest(req, res);
	});
	function handleResult(req, res) {
		return function(rows) {
			if (rows) {
				return res.send({ status: 200, rows: rows });
			}
			return requtil.notFound(req, res);
		};
	}
	/**
	 * *
	 * Blocks per hour(s) with day interval
	 * GET /blocksByHour
	 * curl -i 'http://<host>:<port>/blocksByHour/<channel_genesis_hash>/<days>'
	 * Response:
	 * {'rows':[{'datetime':'2018-03-13T20:00:00.000Z','count':'0'}]}
	 */
	router.get('/blocksByHour/:channel_genesis_hash/:days', function(req, res) {
		var channel_genesis_hash = req.params.channel_genesis_hash;
		var days = parseInt(req.params.days);
		if (channel_genesis_hash && !isNaN(days)) {
			var extReq = req;
			return dbStatusMetrics
				.getBlocksByHour(extReq.network, channel_genesis_hash, days)
				.then(handleResult(req, res));
		}
		return requtil.invalidRequest(req, res);
	});
} // End dbroutes()
exports.dbroutes = dbroutes;
