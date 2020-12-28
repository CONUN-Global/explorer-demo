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
exports.MetricService = void 0;
var helper_1 = require('../../common/helper');
var logger = helper_1.helper.getLogger('MetricService');
/**
 *
 *
 * @class MetricService
 */
var MetricService = /** @class */ (function() {
	function MetricService(sql) {
		this.sql = sql;
	}
	/**
	 *
	 *
	 * @param {*} channel_genesis_hash
	 * @returns
	 * @memberof MetricService
	 */
	MetricService.prototype.getChaincodeCount = function(
		network_name,
		channel_genesis_hash
	) {
		return this.sql.getRowsBySQlCase(
			'select count(1) c from chaincodes where channel_genesis_hash=$1 and network_name=$2 ',
			[channel_genesis_hash, network_name]
		);
	};
	/**
	 *
	 *
	 * @param {*} channel_genesis_hash
	 * @returns
	 * @memberof MetricService
	 */
	MetricService.prototype.getPeerlistCount = function(
		network_name,
		channel_genesis_hash
	) {
		/* eslint-disable quotes */
		return this.sql.getRowsBySQlCase(
			"select count(1) c from peer where channel_genesis_hash=$1 and peer_type='PEER' and network_name=$2 ",
			[channel_genesis_hash, network_name]
		);
		/* eslint-enable quotes */
	};
	/**
	 *
	 *
	 * @param {*} channel_genesis_hash
	 * @returns
	 * @memberof MetricService
	 */
	MetricService.prototype.getTxCount = function(
		network_name,
		channel_genesis_hash
	) {
		return this.sql.getRowsBySQlCase(
			'select count(1) c from transactions where channel_genesis_hash=$1 and network_name=$2 ',
			[channel_genesis_hash, network_name]
		);
	};
	/**
	 *
	 *
	 * @param {*} channel_genesis_hash
	 * @returns
	 * @memberof MetricService
	 */
	MetricService.prototype.getBlockCount = function(
		network_name,
		channel_genesis_hash
	) {
		return this.sql.getRowsBySQlCase(
			'select count(1) c from blocks where channel_genesis_hash=$1 and network_name=$2 ',
			[channel_genesis_hash, network_name]
		);
	};
	/**
	 *
	 *
	 * @param {*} channel_genesis_hash
	 * @returns
	 * @memberof MetricService
	 */
	MetricService.prototype.getPeerData = function(
		network_name,
		channel_genesis_hash
	) {
		return __awaiter(this, void 0, void 0, function() {
			var peerArray, c1, i, len, item;
			return __generator(this, function(_a) {
				switch (_a.label) {
					case 0:
						peerArray = [];
						return [
							4 /*yield*/,
							this.sql.getRowsBySQlNoCondition(
								'select channel.name as channelName,c.requests as requests,c.channel_genesis_hash as channel_genesis_hash ,\n    c.server_hostname as server_hostname, c.mspid as mspid, c.peer_type as peer_type  from peer as c inner join  channel on\n\tc.channel_genesis_hash=channel.channel_genesis_hash and c.network_name=channel.network_name where c.channel_genesis_hash=$1 and c.network_name=$2 ',
								[channel_genesis_hash, network_name]
							)
						];
					case 1:
						c1 = _a.sent();
						for (i = 0, len = c1.length; i < len; i++) {
							item = c1[i];
							peerArray.push({
								name: item.channelName,
								requests: item.requests,
								server_hostname: item.server_hostname,
								channel_genesis_hash: item.channel_genesis_hash,
								mspid: item.mspid,
								peer_type: item.peer_type
							});
						}
						return [2 /*return*/, peerArray];
				}
			});
		});
	};
	/**
	 *
	 *
	 * @returns
	 * @memberof MetricService
	 */
	MetricService.prototype.getOrdererData = function(network_name) {
		return __awaiter(this, void 0, void 0, function() {
			var ordererArray, c1, i, len, item;
			return __generator(this, function(_a) {
				switch (_a.label) {
					case 0:
						ordererArray = [];
						return [
							4 /*yield*/,
							this.sql.getRowsBySQlNoCondition(
								'select c.requests as requests,c.server_hostname as server_hostname,c.channel_genesis_hash as channel_genesis_hash from orderer c where network_name=$1 ',
								[network_name]
							)
						];
					case 1:
						c1 = _a.sent();
						for (i = 0, len = c1.length; i < len; i++) {
							item = c1[i];
							ordererArray.push({
								requests: item.requests,
								server_hostname: item.server_hostname,
								channel_genesis_hash: item.channel_genesis_hash
							});
						}
						return [2 /*return*/, ordererArray];
				}
			});
		});
	};
	/**
	 *
	 *
	 * @param {*} channel_genesis_hash
	 * @returns
	 * @memberof MetricService
	 */
	MetricService.prototype.getTxPerChaincodeGenerate = function(
		network_name,
		channel_genesis_hash
	) {
		return __awaiter(this, void 0, void 0, function() {
			var txArray, c;
			return __generator(this, function(_a) {
				switch (_a.label) {
					case 0:
						txArray = [];
						return [
							4 /*yield*/,
							this.sql.getRowsBySQlNoCondition(
								'select  c.name as chaincodename,channel.name as channelname ,c.version as version,c.channel_genesis_hash\n\t   as channel_genesis_hash,c.path as path ,txcount  as c from chaincodes as c inner join channel on c.channel_genesis_hash=channel.channel_genesis_hash and c.network_name=channel.network_name where  c.channel_genesis_hash=$1 and  c.network_name=$2 ',
								[channel_genesis_hash, network_name]
							)
						];
					case 1:
						c = _a.sent();
						if (c) {
							c.forEach(function(item) {
								logger.debug(' item ------------> ', item);
								txArray.push({
									chaincodename: item.chaincodename,
									channelName: item.channelname,
									path: item.path,
									version: item.version,
									txCount: item.c,
									channel_genesis_hash: item.channel_genesis_hash
								});
							});
						}
						return [2 /*return*/, txArray];
				}
			});
		});
	};
	/**
	 *
	 *
	 * @param {*} channel_genesis_hash
	 * @returns
	 * @memberof MetricService
	 */
	MetricService.prototype.getOrgsData = function(
		network_name,
		channel_genesis_hash
	) {
		return __awaiter(this, void 0, void 0, function() {
			var orgs, rows, i, len;
			return __generator(this, function(_a) {
				switch (_a.label) {
					case 0:
						orgs = [];
						return [
							4 /*yield*/,
							this.sql.getRowsBySQlNoCondition(
								'select distinct on (mspid) mspid from peer  where channel_genesis_hash=$1 and network_name=$2',
								[channel_genesis_hash, network_name]
							)
						];
					case 1:
						rows = _a.sent();
						for (i = 0, len = rows.length; i < len; i++) {
							orgs.push(rows[i].mspid);
						}
						return [2 /*return*/, orgs];
				}
			});
		});
	};
	/**
	 *
	 *
	 * @param {*} channel_genesis_hash
	 * @param {*} cb
	 * @returns
	 * @memberof MetricService
	 */
	MetricService.prototype.getTxPerChaincode = function(
		network_name,
		channel_genesis_hash,
		cb
	) {
		return __awaiter(this, void 0, void 0, function() {
			var txArray, err_1;
			return __generator(this, function(_a) {
				switch (_a.label) {
					case 0:
						_a.trys.push([0, 2, , 3]);
						return [
							4 /*yield*/,
							this.getTxPerChaincodeGenerate(network_name, channel_genesis_hash)
						];
					case 1:
						txArray = _a.sent();
						return [2 /*return*/, cb(txArray)];
					case 2:
						err_1 = _a.sent();
						logger.error(err_1);
						return [2 /*return*/, cb([])];
					case 3:
						return [2 /*return*/];
				}
			});
		});
	};
	/**
	 *
	 *
	 * @param {*} channel_genesis_hash
	 * @returns
	 * @memberof MetricService
	 */
	MetricService.prototype.getStatusGenerate = function(
		network_name,
		channel_genesis_hash
	) {
		return __awaiter(this, void 0, void 0, function() {
			var chaincodeCount, txCount, blockCount, peerCount;
			return __generator(this, function(_a) {
				switch (_a.label) {
					case 0:
						return [
							4 /*yield*/,
							this.getChaincodeCount(network_name, channel_genesis_hash)
						];
					case 1:
						chaincodeCount = _a.sent();
						if (!chaincodeCount) {
							chaincodeCount = 0;
						}
						return [4 /*yield*/, this.getTxCount(network_name, channel_genesis_hash)];
					case 2:
						txCount = _a.sent();
						if (!txCount) {
							txCount = 0;
						}
						txCount.c = txCount.c ? txCount.c : 0;
						return [
							4 /*yield*/,
							this.getBlockCount(network_name, channel_genesis_hash)
						];
					case 3:
						blockCount = _a.sent();
						if (!blockCount) {
							blockCount = 0;
						}
						blockCount.c = blockCount.c ? blockCount.c : 0;
						return [
							4 /*yield*/,
							this.getPeerlistCount(network_name, channel_genesis_hash)
						];
					case 4:
						peerCount = _a.sent();
						if (!peerCount) {
							peerCount = 0;
						}
						peerCount.c = peerCount.c ? peerCount.c : 0;
						return [
							2 /*return*/,
							{
								chaincodeCount: chaincodeCount.c,
								txCount: txCount.c,
								latestBlock: blockCount.c,
								peerCount: peerCount.c
							}
						];
				}
			});
		});
	};
	/**
	 *
	 *
	 * @param {*} channel_genesis_hash
	 * @param {*} cb
	 * @returns
	 * @memberof MetricService
	 */
	MetricService.prototype.getStatus = function(
		network_name,
		channel_genesis_hash,
		cb
	) {
		return __awaiter(this, void 0, void 0, function() {
			var data, err_2;
			return __generator(this, function(_a) {
				switch (_a.label) {
					case 0:
						_a.trys.push([0, 2, , 3]);
						return [
							4 /*yield*/,
							this.getStatusGenerate(network_name, channel_genesis_hash)
						];
					case 1:
						data = _a.sent();
						return [2 /*return*/, cb(data)];
					case 2:
						err_2 = _a.sent();
						logger.error(err_2);
						return [2 /*return*/, cb([])];
					case 3:
						return [2 /*return*/];
				}
			});
		});
	};
	/**
	 *
	 *
	 * @param {*} channel_genesis_hash
	 * @param {*} cb
	 * @returns
	 * @memberof MetricService
	 */
	MetricService.prototype.getPeerList = function(
		network_name,
		channel_genesis_hash,
		cb
	) {
		return __awaiter(this, void 0, void 0, function() {
			var peerArray, err_3;
			return __generator(this, function(_a) {
				switch (_a.label) {
					case 0:
						_a.trys.push([0, 2, , 3]);
						return [
							4 /*yield*/,
							this.getPeerData(network_name, channel_genesis_hash)
						];
					case 1:
						peerArray = _a.sent();
						if (cb) {
							return [2 /*return*/, cb(peerArray)];
						}
						return [2 /*return*/, peerArray];
					case 2:
						err_3 = _a.sent();
						logger.error(err_3);
						return [2 /*return*/, cb([])];
					case 3:
						return [2 /*return*/];
				}
			});
		});
	};
	/**
	 *
	 *
	 * @param {*} cb
	 * @returns
	 * @memberof MetricService
	 */
	MetricService.prototype.getOrdererList = function(network_name, cb) {
		return __awaiter(this, void 0, void 0, function() {
			var ordererArray, err_4;
			return __generator(this, function(_a) {
				switch (_a.label) {
					case 0:
						_a.trys.push([0, 2, , 3]);
						return [4 /*yield*/, this.getOrdererData(network_name)];
					case 1:
						ordererArray = _a.sent();
						return [2 /*return*/, cb(ordererArray)];
					case 2:
						err_4 = _a.sent();
						logger.error(err_4);
						return [2 /*return*/, cb([])];
					case 3:
						return [2 /*return*/];
				}
			});
		});
	};
	/**
	 *
	 *
	 * @param {*} channel_genesis_hash
	 * @param {*} hours
	 * @returns
	 * @memberof MetricService
	 */
	MetricService.prototype.getTxByMinute = function(
		network_name,
		channel_genesis_hash,
		hours
	) {
		var sqlPerMinute =
			" with minutes as (\n            select generate_series(\n              date_trunc('min', now()) - '" +
			hours +
			" hour'::interval,\n              date_trunc('min', now()),\n              '1 min'::interval\n            ) as datetime\n          )\n          select\n            minutes.datetime,\n            count(createdt)\n          from minutes\n          left join TRANSACTIONS on date_trunc('min', TRANSACTIONS.createdt) = minutes.datetime and channel_genesis_hash =$1 and network_name=$2\n          group by 1\n          order by 1 ";
		return this.sql.getRowsBySQlQuery(sqlPerMinute, [
			channel_genesis_hash,
			network_name
		]);
	};
	/**
	 *
	 *
	 * @param {*} channel_genesis_hash
	 * @param {*} day
	 * @returns
	 * @memberof MetricService
	 */
	MetricService.prototype.getTxByHour = function(
		network_name,
		channel_genesis_hash,
		day
	) {
		var sqlPerHour =
			" with hours as (\n            select generate_series(\n              date_trunc('hour', now()) - interval '1 day' * $1,\n              date_trunc('hour', now()),\n              '1 hour'::interval\n            ) as datetime\n          )\n          select\n            hours.datetime,\n            count(createdt)\n          from hours\n          left join TRANSACTIONS on date_trunc('hour', TRANSACTIONS.createdt) = hours.datetime and channel_genesis_hash=$2 and network_name=$3\n          group by 1\n          order by 1 ";
		return this.sql.getRowsBySQlQuery(sqlPerHour, [
			day,
			channel_genesis_hash,
			network_name
		]);
	};
	/**
	 *
	 *
	 * @param {*} channel_genesis_hash
	 * @param {*} days
	 * @returns
	 * @memberof MetricService
	 */
	MetricService.prototype.getTxByDay = function(
		network_name,
		channel_genesis_hash,
		days
	) {
		var sqlPerDay =
			" with days as (\n            select generate_series(\n              date_trunc('day', now()) - interval '1 day' * $1,\n              date_trunc('day', now()),\n              '1 day'::interval\n            ) as datetime\n          )\n          select\n            days.datetime,\n            count(createdt)\n          from days\n          left join TRANSACTIONS on date_trunc('day', TRANSACTIONS.createdt) =days.datetime and channel_genesis_hash=$2 and network_name=$3\n          group by 1\n          order by 1 ";
		return this.sql.getRowsBySQlQuery(sqlPerDay, [
			days,
			channel_genesis_hash,
			network_name
		]);
	};
	/**
	 *
	 *
	 * @param {*} channel_genesis_hash
	 * @param {*} weeks
	 * @returns
	 * @memberof MetricService
	 */
	MetricService.prototype.getTxByWeek = function(
		network_name,
		channel_genesis_hash,
		weeks
	) {
		var sqlPerWeek =
			" with weeks as (\n            select generate_series(\n              date_trunc('week', now()) - '$1 week'::interval,\n              date_trunc('week', now()),\n              '1 week'::interval\n            ) as datetime\n          )\n          select\n            weeks.datetime,\n            count(createdt)\n          from weeks\n          left join TRANSACTIONS on date_trunc('week', TRANSACTIONS.createdt) =weeks.datetime and channel_genesis_hash=$2 and network_name=$3\n          group by 1\n          order by 1 ";
		return this.sql.getRowsBySQlQuery(sqlPerWeek, [
			weeks,
			channel_genesis_hash,
			network_name
		]);
	};
	/**
	 *
	 *
	 * @param {*} channel_genesis_hash
	 * @param {*} months
	 * @returns
	 * @memberof MetricService
	 */
	MetricService.prototype.getTxByMonth = function(
		network_name,
		channel_genesis_hash,
		months
	) {
		var sqlPerMonth =
			" with months as (\n            select generate_series(\n              date_trunc('month', now()) - '$1 month'::interval,\n              date_trunc('month', now()),\n              '1 month'::interval\n            ) as datetime\n          )\n\n          select\n            months.datetime,\n            count(createdt)\n          from months\n          left join TRANSACTIONS on date_trunc('month', TRANSACTIONS.createdt) =months.datetime and channel_genesis_hash=$2 and network_name=$3\n          group by 1\n          order by 1 ";
		return this.sql.getRowsBySQlQuery(sqlPerMonth, [
			months,
			channel_genesis_hash,
			network_name
		]);
	};
	/**
	 *
	 *
	 * @param {*} channel_genesis_hash
	 * @param {*} years
	 * @returns
	 * @memberof MetricService
	 */
	MetricService.prototype.getTxByYear = function(
		network_name,
		channel_genesis_hash,
		years
	) {
		var sqlPerYear =
			" with years as (\n            select generate_series(\n              date_trunc('year', now()) - '$1 year'::interval,\n              date_trunc('year', now()),\n              '1 year'::interval\n            ) as year\n          )\n          select\n            years.year,\n            count(createdt)\n          from years\n          left join TRANSACTIONS on date_trunc('year', TRANSACTIONS.createdt) =years.year and channel_genesis_hash=$2 and network_name=$3\n          group by 1\n          order by 1 ";
		return this.sql.getRowsBySQlQuery(sqlPerYear, [
			years,
			channel_genesis_hash,
			network_name
		]);
	};
	// Block metrics API
	/**
	 *
	 *
	 * @param {*} channel_genesis_hash
	 * @param {*} hours
	 * @returns
	 * @memberof MetricService
	 */
	MetricService.prototype.getBlocksByMinute = function(
		network_name,
		channel_genesis_hash,
		hours
	) {
		var sqlPerMinute =
			" with minutes as (\n            select generate_series(\n              date_trunc('min', now()) - interval '1 hour' * $1,\n              date_trunc('min', now()),\n              '1 min'::interval\n            ) as datetime\n          )\n          select\n            minutes.datetime,\n            count(createdt)\n          from minutes\n          left join BLOCKS on date_trunc('min', BLOCKS.createdt) = minutes.datetime and channel_genesis_hash=$2 and network_name=$3\n          group by 1\n          order by 1  ";
		return this.sql.getRowsBySQlQuery(sqlPerMinute, [
			hours,
			channel_genesis_hash,
			network_name
		]);
	};
	/**
	 *
	 *
	 * @param {*} channel_genesis_hash
	 * @param {*} days
	 * @returns
	 * @memberof MetricService
	 */
	MetricService.prototype.getBlocksByHour = function(
		network_name,
		channel_genesis_hash,
		days
	) {
		var sqlPerHour =
			" with hours as (\n            select generate_series(\n              date_trunc('hour', now()) - interval '1 day' * $1,\n              date_trunc('hour', now()),\n              '1 hour'::interval\n            ) as datetime\n          )\n          select\n            hours.datetime,\n            count(createdt)\n          from hours\n          left join BLOCKS on date_trunc('hour', BLOCKS.createdt) = hours.datetime and channel_genesis_hash=$2 and network_name=$3\n          group by 1\n          order by 1 ";
		return this.sql.getRowsBySQlQuery(sqlPerHour, [
			days,
			channel_genesis_hash,
			network_name
		]);
	};
	/**
	 *
	 *
	 * @param {*} channel_genesis_hash
	 * @param {*} days
	 * @returns
	 * @memberof MetricService
	 */
	MetricService.prototype.getBlocksByDay = function(
		network_name,
		channel_genesis_hash,
		days
	) {
		var sqlPerDay =
			"  with days as (\n            select generate_series(\n              date_trunc('day', now()) - '" +
			days +
			"day'::interval,\n              date_trunc('day', now()),\n              '1 day'::interval\n            ) as datetime\n          )\n          select\n            days.datetime,\n            count(createdt)\n          from days\n          left join BLOCKS on date_trunc('day', BLOCKS.createdt) =days.datetime and channel_genesis_hash=$2 and network_name=$3\n          group by 1\n          order by 1 ";
		return this.sql.getRowsBySQlQuery(sqlPerDay, [
			days,
			channel_genesis_hash,
			network_name
		]);
	};
	/**
	 *
	 *
	 * @param {*} channel_genesis_hash
	 * @param {*} weeks
	 * @returns
	 * @memberof MetricService
	 */
	MetricService.prototype.getBlocksByWeek = function(
		network_name,
		channel_genesis_hash,
		weeks
	) {
		var sqlPerWeek =
			" with weeks as (\n            select generate_series(\n              date_trunc('week', now()) - '$1 week'::interval,\n              date_trunc('week', now()),\n              '1 week'::interval\n            ) as datetime\n          )\n          select\n            weeks.datetime,\n            count(createdt)\n          from weeks\n          left join BLOCKS on date_trunc('week', BLOCKS.createdt) =weeks.datetime and channel_genesis_hash=$2 and network_name=$3\n          group by 1\n          order by 1 ";
		return this.sql.getRowsBySQlQuery(sqlPerWeek, [
			weeks,
			channel_genesis_hash,
			network_name
		]);
	};
	/**
	 *
	 *
	 * @param {*} channel_genesis_hash
	 * @param {*} months
	 * @returns
	 * @memberof MetricService
	 */
	MetricService.prototype.getBlocksByMonth = function(
		network_name,
		channel_genesis_hash,
		months
	) {
		var sqlPerMonth =
			"  with months as (\n            select generate_series(\n              date_trunc('month', now()) - '$1 month'::interval,\n              date_trunc('month', now()),\n              '1 month'::interval\n            ) as datetime\n          )\n          select\n            months.datetime,\n            count(createdt)\n          from months\n          left join BLOCKS on date_trunc('month', BLOCKS.createdt) =months.datetime and channel_genesis_hash=$2 and network_name=$3\n          group by 1\n          order by 1 ";
		return this.sql.getRowsBySQlQuery(sqlPerMonth, [
			months,
			channel_genesis_hash,
			network_name
		]);
	};
	/**
	 *
	 *
	 * @param {*} channel_genesis_hash
	 * @param {*} years
	 * @returns
	 * @memberof MetricService
	 */
	MetricService.prototype.getBlocksByYear = function(
		network_name,
		channel_genesis_hash,
		years
	) {
		var sqlPerYear =
			" with years as (\n            select generate_series(\n              date_trunc('year', now()) - '" +
			years +
			"year'::interval,\n              date_trunc('year', now()),\n              '1 year'::interval\n            ) as year\n          )\n          select\n            years.year,\n            count(createdt)\n          from years\n          left join BLOCKS on date_trunc('year', BLOCKS.createdt) =years.year and channel_genesis_hash=$2 and network_name=$3\n          group by 1\n          order by 1 ";
		return this.sql.getRowsBySQlQuery(sqlPerYear, [
			years,
			channel_genesis_hash,
			network_name
		]);
	};
	/**
	 *
	 *
	 * @param {*} channel_genesis_hash
	 * @returns
	 * @memberof MetricService
	 */
	MetricService.prototype.getTxByOrgs = function(
		network_name,
		channel_genesis_hash
	) {
		var sqlPerOrg =
			' select count(creator_msp_id), creator_msp_id\n      from transactions\n      where channel_genesis_hash =$1 and network_name=$2\n      group by  creator_msp_id';
		return this.sql.getRowsBySQlQuery(sqlPerOrg, [
			channel_genesis_hash,
			network_name
		]);
	};
	/**
	 *
	 *
	 * @param {*} channel_genesis_hash
	 * @param {*} maxHeight
	 * @returns
	 * @memberof MetricService
	 */
	MetricService.prototype.findMissingBlockNumber = function(
		network_name,
		channel_genesis_hash,
		maxHeight
	) {
		return __awaiter(this, void 0, void 0, function() {
			var sqlQuery;
			return __generator(this, function(_a) {
				sqlQuery =
					'SELECT s.id AS missing_id\n    FROM generate_series(0, $1) s(id) WHERE NOT EXISTS (SELECT 1 FROM blocks WHERE blocknum = s.id and channel_genesis_hash=$2 and network_name=$3 )';
				return [
					2 /*return*/,
					this.sql.getRowsBySQlQuery(sqlQuery, [
						maxHeight,
						channel_genesis_hash,
						network_name
					])
				];
			});
		});
	};
	return MetricService;
})();
exports.MetricService = MetricService;
