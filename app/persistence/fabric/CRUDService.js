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
exports.CRUDService = void 0;
var helper_1 = require('../../common/helper');
var logger = helper_1.helper.getLogger('CRUDService');
/**
 *
 *
 * @class CRUDService
 */
var CRUDService = /** @class */ (function() {
	function CRUDService(sql) {
		this.sql = sql;
	}
	/**
	 * Get transactions count by block number
	 *
	 * @param {*} channel_genesis_hash
	 * @param {*} blockNum
	 * @returns
	 * @memberof CRUDService
	 */
	CRUDService.prototype.getTxCountByBlockNum = function(
		network_name,
		channel_genesis_hash,
		blockNum
	) {
		return this.sql.getRowByPkOne(
			'select blocknum ,txcount from blocks where channel_genesis_hash=$1 and blocknum=$2 and network_name = $3',
			[channel_genesis_hash, blockNum, network_name]
		);
	};
	/**
	 * Get transaction by ID
	 *
	 * @param {*} channel_genesis_hash
	 * @param {*} txhash
	 * @returns
	 * @memberof CRUDService
	 */
	CRUDService.prototype.getTransactionByID = function(
		network_name,
		channel_genesis_hash,
		txhash
	) {
		var sqlTxById =
			' select t.txhash,t.validation_code,t.payload_proposal_hash,t.creator_msp_id,t.endorser_msp_id,t.chaincodename,t.type,t.createdt,t.read_set,\n\t\t\t\tt.write_set,channel.name as channelName from TRANSACTIONS as t inner join channel on t.channel_genesis_hash=channel.channel_genesis_hash and t.network_name=channel.network_name\n\t\t\t\twhere t.txhash = $1 and t.network_name = $2 ';
		return this.sql.getRowByPkOne(sqlTxById, [txhash, network_name]);
	};
	/**
	 * Returns the latest 'n' blocks by channel
	 *
	 * @param {*} channel_genesis_hash
	 * @returns
	 * @memberof CRUDService
	 */
	CRUDService.prototype.getBlockActivityList = function(
		network_name,
		channel_genesis_hash
	) {
		var sqlBlockActivityList =
			'select blocks.blocknum,blocks.txcount ,blocks.datahash ,blocks.blockhash ,blocks.prehash,blocks.createdt, (\n      SELECT  array_agg(txhash) as txhash FROM transactions where blockid = blocks.blocknum and\n       channel_genesis_hash = $1 and network_name = $2 group by transactions.blockid ),\n      channel.name as channelname  from blocks inner join channel on blocks.channel_genesis_hash = channel.channel_genesis_hash  where\n       blocks.channel_genesis_hash = $1 and blocknum >= 0 and blocks.network_name = $2\n       order by blocks.blocknum desc limit 3';
		return this.sql.getRowsBySQlQuery(sqlBlockActivityList, [
			channel_genesis_hash,
			network_name
		]);
	};
	/**
	 * Returns the list of transactions by channel, organization, date range and greater than a block and transaction id.
	 *
	 * @param {*} channel_genesis_hash
	 * @param {*} blockNum
	 * @param {*} txid
	 * @param {*} from
	 * @param {*} to
	 * @param {*} orgs
	 * @returns
	 * @memberof CRUDService
	 */
	CRUDService.prototype.getTxList = function(
		network_name,
		channel_genesis_hash,
		blockNum,
		txid,
		from,
		to,
		orgs
	) {
		var sqlTxList =
			' select t.creator_msp_id,t.txhash,t.type,t.chaincodename,t.createdt,channel.name as channelName from transactions as t\n       inner join channel on t.channel_genesis_hash=channel.channel_genesis_hash and t.network_name = channel.network_name where  t.blockid >= $1 and t.id >= $2 and\n\t\t\t\t\t\t\tt.channel_genesis_hash = $3 and t.network_name = $4 and t.createdt between $5 and $6 ';
		var values = [blockNum, txid, channel_genesis_hash, network_name, from, to];
		if (orgs && orgs.length > 0) {
			sqlTxList += ' and t.creator_msp_id = ANY($7)';
			values.push(orgs);
		}
		sqlTxList += ' order by t.createdt desc';
		return this.sql.getRowsBySQlQuery(sqlTxList, values);
	};
	/**
	 *
	 * Returns the list of blocks and transactions by channel, organization, date range.
	 *
	 * @param {*} channel_genesis_hash
	 * @param {*} blockNum
	 * @param {*} from
	 * @param {*} to
	 * @param {*} orgs
	 * @returns
	 * @memberof CRUDService
	 */
	CRUDService.prototype.getBlockAndTxList = function(
		network_name,
		channel_genesis_hash,
		blockNum,
		from,
		to,
		orgs
	) {
		var values = [channel_genesis_hash, network_name, from, to];
		var byOrgs = '';
		if (orgs && orgs.length > 0) {
			values.push(orgs);
			byOrgs = ' and creator_msp_id = ANY($5)';
		}
		logger.debug('getBlockAndTxList.byOrgs ', byOrgs);
		var sqlBlockTxList =
			'select a.* from  (\n\t  select (select c.name from channel c where c.channel_genesis_hash =$1 and c.network_name = $2) \n\t  \tas channelname, blocks.blocknum,blocks.txcount ,blocks.datahash ,blocks.blockhash ,blocks.prehash,blocks.createdt, blocks.blksize, (\n        SELECT  array_agg(txhash) as txhash FROM transactions where blockid = blocks.blocknum ' +
			byOrgs +
			' and \n         channel_genesis_hash = $1 and network_name = $2 and createdt between $3 and $4) from blocks where\n         blocks.channel_genesis_hash =$1 and blocks.network_name = $2 and blocknum >= 0 and blocks.createdt between $3 and $4\n\t\t\t\t\t\t\t\t\torder by blocks.blocknum desc)  a where  a.txhash IS NOT NULL';
		logger.debug('sqlBlockTxList ', sqlBlockTxList);
		return this.sql.getRowsBySQlQuery(sqlBlockTxList, values);
	};
	/**
	 * Returns channel configuration
	 *
	 * @param {*} channel_genesis_hash
	 * @returns
	 * @memberof CRUDService
	 */
	CRUDService.prototype.getChannelConfig = function(
		network_name,
		channel_genesis_hash
	) {
		return __awaiter(this, void 0, void 0, function() {
			var channelConfig;
			return __generator(this, function(_a) {
				switch (_a.label) {
					case 0:
						return [
							4 /*yield*/,
							this.sql.getRowsBySQlCase(
								' select * from channel where channel_genesis_hash =$1 and network_name = $2 ',
								[channel_genesis_hash, network_name]
							)
						];
					case 1:
						channelConfig = _a.sent();
						return [2 /*return*/, channelConfig];
				}
			});
		});
	};
	/**
	 * Returns channel by name, and channel genesis hash
	 *
	 * @param {*} channelname
	 * @param {*} channel_genesis_hash
	 * @returns
	 * @memberof CRUDService
	 */
	CRUDService.prototype.getChannel = function(
		network_name,
		channelname,
		channel_genesis_hash
	) {
		return __awaiter(this, void 0, void 0, function() {
			var channel;
			return __generator(this, function(_a) {
				switch (_a.label) {
					case 0:
						return [
							4 /*yield*/,
							this.sql.getRowsBySQlCase(
								' select * from channel where name=$1 and channel_genesis_hash=$2 and network_name = $3 ',
								[channelname, channel_genesis_hash, network_name]
							)
						];
					case 1:
						channel = _a.sent();
						return [2 /*return*/, channel];
				}
			});
		});
	};
	/**
	 *
	 * @param {*} channelname
	 * @returns
	 * @memberof CRUDService
	 */
	CRUDService.prototype.existChannel = function(network_name, channelname) {
		return __awaiter(this, void 0, void 0, function() {
			var channel;
			return __generator(this, function(_a) {
				switch (_a.label) {
					case 0:
						return [
							4 /*yield*/,
							this.sql.getRowsBySQlCase(
								' select count(1) from channel where name=$1 and network_name = $2 ',
								[channelname, network_name]
							)
						];
					case 1:
						channel = _a.sent();
						return [2 /*return*/, channel];
				}
			});
		});
	};
	/**
	 *
	 *
	 * @param {*} block
	 * @returns
	 * @memberof CRUDService
	 */
	/* eslint-disable */
	CRUDService.prototype.saveBlock = function(network_name, block) {
		return __awaiter(this, void 0, void 0, function() {
			var c;
			return __generator(this, function(_a) {
				switch (_a.label) {
					case 0:
						return [
							4 /*yield*/,
							this.sql.getRowByPkOne(
								'select count(1) as c from blocks where blocknum=$1 and txcount=$2\n\t\tand channel_genesis_hash=$3 and network_name =$4 and prehash=$5 and datahash=$6 ',
								[
									block.blocknum,
									block.txcount,
									block.channel_genesis_hash,
									network_name,
									block.prehash,
									block.datahash
								]
							)
						];
					case 1:
						c = _a.sent();
						if (!isValidRow(c)) return [3 /*break*/, 4];
						block.network_name = network_name;
						return [4 /*yield*/, this.sql.saveRow('blocks', block)];
					case 2:
						_a.sent();
						return [
							4 /*yield*/,
							this.sql.updateBySql(
								'update channel set blocks =blocks+1 where channel_genesis_hash=$1 and network_name = $2 ',
								[block.channel_genesis_hash, network_name]
							)
						];
					case 3:
						_a.sent();
						return [2 /*return*/, true];
					case 4:
						return [2 /*return*/, false];
				}
			});
		});
	};
	/* eslint-enable */
	/**
	 *
	 *
	 * @param {*} transaction
	 * @returns
	 * @memberof CRUDService
	 */
	CRUDService.prototype.saveTransaction = function(network_name, transaction) {
		return __awaiter(this, void 0, void 0, function() {
			var c;
			return __generator(this, function(_a) {
				switch (_a.label) {
					case 0:
						return [
							4 /*yield*/,
							this.sql.getRowByPkOne(
								'select count(1) as c from transactions where blockid=$1 and txhash=$2 and channel_genesis_hash=$3 and network_name = $4 ',
								[
									transaction.blockid,
									transaction.txhash,
									transaction.channel_genesis_hash,
									network_name
								]
							)
						];
					case 1:
						c = _a.sent();
						if (!isValidRow(c)) return [3 /*break*/, 5];
						transaction.network_name = network_name;
						return [4 /*yield*/, this.sql.saveRow('transactions', transaction)];
					case 2:
						_a.sent();
						return [
							4 /*yield*/,
							this.sql.updateBySql(
								'update chaincodes set txcount =txcount+1 where channel_genesis_hash=$1 and network_name = $2 and name=$3',
								[
									transaction.channel_genesis_hash,
									network_name,
									transaction.chaincodename
								]
							)
						];
					case 3:
						_a.sent();
						return [
							4 /*yield*/,
							this.sql.updateBySql(
								'update channel set trans =trans+1 where channel_genesis_hash=$1 and network_name = $2 ',
								[transaction.channel_genesis_hash, network_name]
							)
						];
					case 4:
						_a.sent();
						return [2 /*return*/, true];
					case 5:
						return [2 /*return*/, false];
				}
			});
		});
	};
	/**
	 * Returns latest block from blocks table
	 *
	 * @param {*} channel_genesis_hash
	 * @returns
	 * @memberof CRUDService
	 */
	CRUDService.prototype.getCurBlockNum = function(
		network_name,
		channel_genesis_hash
	) {
		return __awaiter(this, void 0, void 0, function() {
			var curBlockNum, row, err_1;
			return __generator(this, function(_a) {
				switch (_a.label) {
					case 0:
						_a.trys.push([0, 2, , 3]);
						return [
							4 /*yield*/,
							this.sql.getRowsBySQlCase(
								'select max(blocknum) as blocknum from blocks  where channel_genesis_hash=$1 and network_name = $2 ',
								[channel_genesis_hash, network_name]
							)
						];
					case 1:
						row = _a.sent();
						if (row && row.blocknum) {
							curBlockNum = parseInt(row.blocknum);
						} else {
							curBlockNum = -1;
						}
						return [3 /*break*/, 3];
					case 2:
						err_1 = _a.sent();
						logger.error(err_1);
						return [2 /*return*/, -1];
					case 3:
						return [2 /*return*/, curBlockNum];
				}
			});
		});
	};
	/* eslint-disable */
	/**
	 *
	 *
	 * @param {*} chaincode
	 * @memberof CRUDService
	 */
	CRUDService.prototype.saveChaincode = function(network_name, chaincode) {
		return __awaiter(this, void 0, void 0, function() {
			var c;
			return __generator(this, function(_a) {
				switch (_a.label) {
					case 0:
						return [
							4 /*yield*/,
							this.sql.getRowByPkOne(
								'select count(1) as c from chaincodes where name=$1 and \n\t\tchannel_genesis_hash=$2 and network_name = $3 and version=$4 and path=$5',
								[
									chaincode.name,
									chaincode.channel_genesis_hash,
									network_name,
									chaincode.version,
									chaincode.path
								]
							)
						];
					case 1:
						c = _a.sent();
						if (!isValidRow(c)) return [3 /*break*/, 3];
						chaincode.network_name = network_name;
						return [4 /*yield*/, this.sql.saveRow('chaincodes', chaincode)];
					case 2:
						_a.sent();
						_a.label = 3;
					case 3:
						return [2 /*return*/];
				}
			});
		});
	};
	/* eslint-enable */
	/**
	 *
	 *
	 * @param {*} channel_genesis_hash
	 * @returns
	 * @memberof CRUDService
	 */
	CRUDService.prototype.getChannelByGenesisBlockHash = function(
		network_name,
		channel_genesis_hash
	) {
		return this.sql.getRowByPkOne(
			'select name from channel where channel_genesis_hash=$1 and network_name = $2 ',
			[channel_genesis_hash, network_name]
		);
	};
	/**
	 *
	 *
	 * @param {*} peers_ref_chaincode
	 * @memberof CRUDService
	 */
	CRUDService.prototype.saveChaincodPeerRef = function(
		network_name,
		peers_ref_chaincode
	) {
		return __awaiter(this, void 0, void 0, function() {
			var c;
			return __generator(this, function(_a) {
				switch (_a.label) {
					case 0:
						return [
							4 /*yield*/,
							this.sql.getRowByPkOne(
								'select count(1) as c from peer_ref_chaincode prc where prc.peerid=$1 and prc.chaincodeid=$2 and cc_version=$3 and channelid=$4 and network_name = $5 ',
								[
									peers_ref_chaincode.peerid,
									peers_ref_chaincode.chaincodeid,
									peers_ref_chaincode.cc_version,
									peers_ref_chaincode.channelid,
									network_name
								]
							)
						];
					case 1:
						c = _a.sent();
						if (!isValidRow(c)) return [3 /*break*/, 3];
						peers_ref_chaincode.network_name = network_name;
						return [
							4 /*yield*/,
							this.sql.saveRow('peer_ref_chaincode', peers_ref_chaincode)
						];
					case 2:
						_a.sent();
						_a.label = 3;
					case 3:
						return [2 /*return*/];
				}
			});
		});
	};
	/**
	 *
	 *
	 * @param {*} channel
	 * @memberof CRUDService
	 */
	CRUDService.prototype.saveChannel = function(network_name, channel) {
		return __awaiter(this, void 0, void 0, function() {
			var c;
			return __generator(this, function(_a) {
				switch (_a.label) {
					case 0:
						return [
							4 /*yield*/,
							this.sql.getRowByPkOne(
								'select count(1) as c from channel where name=$1 and channel_genesis_hash=$2 and network_name = $3 ',
								[channel.name, channel.channel_genesis_hash, network_name]
							)
						];
					case 1:
						c = _a.sent();
						if (!isValidRow(c)) return [3 /*break*/, 3];
						return [
							4 /*yield*/,
							this.sql.saveRow('channel', {
								name: channel.name,
								createdt: channel.createdt,
								blocks: channel.blocks,
								trans: channel.trans,
								channel_hash: channel.channel_hash,
								channel_genesis_hash: channel.channel_genesis_hash,
								network_name: network_name
							})
						];
					case 2:
						_a.sent();
						return [3 /*break*/, 5];
					case 3:
						return [
							4 /*yield*/,
							this.sql.updateBySql(
								'update channel set blocks=$1,trans=$2,channel_hash=$3 where name=$4 and channel_genesis_hash=$5 and network_name = $6 ',
								[
									channel.blocks,
									channel.trans,
									channel.channel_hash,
									channel.name,
									channel.channel_genesis_hash,
									network_name
								]
							)
						];
					case 4:
						_a.sent();
						_a.label = 5;
					case 5:
						return [2 /*return*/];
				}
			});
		});
	};
	/**
	 *
	 *
	 * @param {*} peer
	 * @memberof CRUDService
	 */
	CRUDService.prototype.savePeer = function(network_name, peer) {
		return __awaiter(this, void 0, void 0, function() {
			var c;
			return __generator(this, function(_a) {
				switch (_a.label) {
					case 0:
						return [
							4 /*yield*/,
							this.sql.getRowByPkOne(
								'select count(1) as c from peer where channel_genesis_hash=$1 and network_name = $2 and server_hostname=$3 ',
								[peer.channel_genesis_hash, network_name, peer.server_hostname]
							)
						];
					case 1:
						c = _a.sent();
						if (!isValidRow(c)) return [3 /*break*/, 3];
						peer.network_name = network_name;
						return [4 /*yield*/, this.sql.saveRow('peer', peer)];
					case 2:
						_a.sent();
						_a.label = 3;
					case 3:
						return [2 /*return*/];
				}
			});
		});
	};
	/**
	 *
	 *
	 * @param {*} peers_ref_Channel
	 * @memberof CRUDService
	 */
	CRUDService.prototype.savePeerChannelRef = function(
		network_name,
		peers_ref_Channel
	) {
		return __awaiter(this, void 0, void 0, function() {
			var c;
			return __generator(this, function(_a) {
				switch (_a.label) {
					case 0:
						return [
							4 /*yield*/,
							this.sql.getRowByPkOne(
								'select count(1) as c from peer_ref_channel prc where prc.peerid = $1 and network_name = $2 and prc.channelid=$3 ',
								[peers_ref_Channel.peerid, network_name, peers_ref_Channel.channelid]
							)
						];
					case 1:
						c = _a.sent();
						if (!isValidRow(c)) return [3 /*break*/, 3];
						peers_ref_Channel.network_name = network_name;
						return [
							4 /*yield*/,
							this.sql.saveRow('peer_ref_channel', peers_ref_Channel)
						];
					case 2:
						_a.sent();
						_a.label = 3;
					case 3:
						return [2 /*return*/];
				}
			});
		});
	};
	/**
	 *
	 *
	 * @param {*} peerid
	 * @returns
	 * @memberof CRUDService
	 */
	CRUDService.prototype.getChannelsInfo = function(network_name) {
		return __awaiter(this, void 0, void 0, function() {
			var channels;
			return __generator(this, function(_a) {
				switch (_a.label) {
					case 0:
						return [
							4 /*yield*/,
							this.sql.getRowsBySQlNoCondition(
								' select c.id as id,c.name as channelName,c.blocks as blocks ,c.channel_genesis_hash as channel_genesis_hash,c.trans as transactions,c.createdt as createdat,c.channel_hash as channel_hash from channel c,\n\t\tpeer_ref_channel pc where c.channel_genesis_hash = pc.channelid and c.network_name = $1 group by c.id ,c.name ,c.blocks  ,c.trans ,c.createdt ,c.channel_hash,c.channel_genesis_hash order by c.name ',
								[network_name]
							)
						];
					case 1:
						channels = _a.sent();
						return [2 /*return*/, channels];
				}
			});
		});
	};
	// Orderer BE-303
	/**
	 *
	 *
	 * @param {*} orderer
	 * @memberof CRUDService
	 */
	CRUDService.prototype.saveOrderer = function(network_name, orderer) {
		return __awaiter(this, void 0, void 0, function() {
			var c;
			return __generator(this, function(_a) {
				switch (_a.label) {
					case 0:
						return [
							4 /*yield*/,
							this.sql.getRowByPkOne(
								'select count(1) as c from orderer where requests=$1 and network_name = $2 ',
								[orderer.requests, network_name]
							)
						];
					case 1:
						c = _a.sent();
						if (!isValidRow(c)) return [3 /*break*/, 3];
						orderer.network_name = network_name;
						return [4 /*yield*/, this.sql.saveRow('orderer', orderer)];
					case 2:
						_a.sent();
						_a.label = 3;
					case 3:
						return [2 /*return*/];
				}
			});
		});
	};
	return CRUDService;
})();
exports.CRUDService = CRUDService;
/**
 *
 *
 * @param {*} rowResult
 * @returns
 */
function isValidRow(rowResult) {
	if (rowResult) {
		var val = rowResult.c;
		if (val === 0 || val === '0') {
			return true;
		}
	}
	return false;
}
