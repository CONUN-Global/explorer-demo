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
exports.PgService = void 0;
/*
 * Copyright ONECHAIN 2017 All Rights Reserved.
 *
 * Licensed under the Apache License, Version 2.0 (the "License");
 * you may not use this file except in compliance with the License.
 * You may obtain a copy of the License at
 *
 * http://www.apache.org/licenses/LICENSE-2.0
 *
 * Unless required by applicable law or agreed to in writing, software
 * distributed under the License is distributed on an "AS IS" BASIS,
 * WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
 * See the License for the specific language governing permissions and
 * limitations under the License.
 */
var pg_1 = require('pg');
var sequelize_1 = require('sequelize');
var fs = require('fs');
var helper_1 = require('../../common/helper');
var logger = helper_1.helper.getLogger('PgService');
/**
 *
 *
 * @class PgService
 */
var PgService = /** @class */ (function() {
	/**
	 * Creates an instance of PgService.
	 * @param {*} pgconfig
	 * @memberof PgService
	 */
	function PgService(pgconfig) {
		this.pgconfig = pgconfig;
		this.pgconfig.host = process.env.DATABASE_HOST || pgconfig.host;
		this.pgconfig.port = process.env.DATABASE_PORT || pgconfig.port;
		this.pgconfig.database = process.env.DATABASE_DATABASE || pgconfig.database;
		this.pgconfig.user = process.env.DATABASE_USERNAME || pgconfig.username;
		this.pgconfig.password = process.env.DATABASE_PASSWD || pgconfig.passwd;
		this.userModel = null;
		var isPostgresSslEnabled = process.env.DATABASE_SSL_ENABLED || false;
		if (isPostgresSslEnabled) {
			var dbCertsPath =
				process.env.DATABASE_CERTS_PATH ||
				process.env.EXPLORER_APP_PATH + '/db-certs';
			this.pgconfig.ssl = {
				rejectUnauthorized: false,
				requestCert: true,
				ca: fs.readFileSync(dbCertsPath + '/db-certs/server-ca.pem').toString(),
				key: fs.readFileSync(dbCertsPath + '/db-certs/client-key.pem').toString(),
				cert: fs.readFileSync(dbCertsPath + '/db-certs/client-cert.pem').toString()
			};
			/*
			 * don't log entire config, it contains sensitive information!
			 * Value this.pgconfig.ssl.key is private key
			 */
			var _a = this.pgconfig.ssl,
				rejectUnauthorized = _a.rejectUnauthorized,
				requestCert = _a.requestCert;
			var printConfig = {
				rejectUnauthorized: rejectUnauthorized,
				requestCert: requestCert
			};
			logger.info('SSL to Postgresql enabled with settings: ', printConfig);
		} else {
			logger.info('SSL to Postgresql disabled');
		}
		// don't log password
		var connectionString =
			'postgres://' +
			this.pgconfig.username +
			':******@' +
			this.pgconfig.host +
			':' +
			this.pgconfig.port +
			'/' +
			this.pgconfig.database;
		logger.info('connecting to Postgresql ' + connectionString);
		this.client = new pg_1.Client(this.pgconfig);
	}
	/**
	 *
	 * Create and return the instance for accessing User table via Sequelize
	 * @param {*} attributes
	 * @param {*} options
	 * @returns {Sequelize.Model} Newly defined model
	 * @memberof PgService
	 */
	PgService.prototype.getUserModel = function(attributes, options) {
		var sequelize = new sequelize_1.Sequelize(
			'postgres://' +
				this.pgconfig.user +
				':' +
				this.pgconfig.password +
				'@' +
				this.pgconfig.host +
				':' +
				this.pgconfig.port +
				'/' +
				this.pgconfig.database,
			{ logging: false }
		);
		this.userModel = sequelize.define('users', attributes, options);
		return this.userModel;
	};
	/**
	 *
	 *
	 * @memberof PgService
	 */
	PgService.prototype.handleDisconnect = function() {
		return __awaiter(this, void 0, void 0, function() {
			var err_1;
			var _this = this;
			return __generator(this, function(_a) {
				switch (_a.label) {
					case 0:
						_a.trys.push([0, 2, , 3]);
						this.client.on('error', function(err) {
							logger.error('db error', err);
							if (err.code === 'PROTOCOL_CONNECTION_LOST') {
								_this.handleDisconnect();
							} else {
								throw err;
							}
						});
						return [4 /*yield*/, this.client.connect()];
					case 1:
						_a.sent();
						return [3 /*break*/, 3];
					case 2:
						err_1 = _a.sent();
						if (err_1) {
							/*
							 * We introduce a delay before attempting to reconnect,
							 * To avoid a hot loop, and to allow our node script to
							 * Process asynchronous requests in the meantime.
							 */
							logger.error('error when connecting to db:', err_1);
							setTimeout(this.handleDisconnect, 2000);
						}
						return [3 /*break*/, 3];
					case 3:
						return [2 /*return*/];
				}
			});
		});
	};
	/**
	 *
	 *
	 * @memberof PgService
	 */
	PgService.prototype.openconnection = function() {
		this.client.connect();
	};
	/**
	 *
	 *
	 * @memberof PgService
	 */
	PgService.prototype.closeconnection = function() {
		this.client.end();
	};
	/**
	 *
	 *
	 * @param {*} tablename
	 * @param {*} columnValues
	 * @returns
	 * @memberof PgService
	 */
	PgService.prototype.saveRow = function(tablename, columnValues) {
		var _this = this;
		return new Promise(function(resolve, reject) {
			var addSqlParams = [];
			var updatesqlcolumn = [];
			var updatesqlflag = [];
			var i = 1;
			Object.keys(columnValues).forEach(function(k) {
				var v = columnValues[k];
				addSqlParams.push(v);
				updatesqlcolumn.push(JSON.stringify(k));
				updatesqlflag.push('$' + i);
				i += 1;
			});
			var updatesqlparmstr = updatesqlcolumn.join(',');
			var updatesqlflagstr = updatesqlflag.join(',');
			var addSql =
				'INSERT INTO ' +
				tablename +
				'  ( ' +
				updatesqlparmstr +
				' ) VALUES( ' +
				updatesqlflagstr +
				'  ) RETURNING *;';
			logger.debug('Insert sql is ' + addSql);
			//   Console.log(`Insert sql is ${addSql}`);
			_this.client.query(addSql, addSqlParams, function(err, res) {
				if (err) {
					logger.error('[INSERT ERROR] - ', err.message);
					reject(err);
					return;
				}
				logger.debug(
					'--------------------------INSERT----------------------------'
				);
				//  Console.log('INSERT ID:', res.rows[0].id);
				logger.debug(
					'-----------------------------------------------------------------'
				);
				resolve(res.rows[0].id);
			});
		});
	};
	/**
	 * Update table
	 *
	 * @param String        tablename  the table name.
	 * @param String array  columnAndValue  the table column and value Map.
	 * @param String        pkName   the primary key name.
	 * @param String        pkValue  the primary key value.
	 *
	 * @author robertfeng <fx19800215@163.com>
	 * @author vchinoy
	 *
	 */
	PgService.prototype.updateRowByPk = function(
		tablename,
		columnAndValue,
		pkName,
		pkValue
	) {
		var _this = this;
		return new Promise(function(resolve, reject) {
			var addSqlParams = [];
			var updateParms = [];
			Object.keys(columnAndValue).forEach(function(k) {
				var v = columnAndValue[k];
				addSqlParams.push(v);
				updateParms.push(k + ' = ?');
			});
			var searchparm = {
				pkName: pkValue
			};
			Object.keys(searchparm).forEach(function(k) {
				var v = searchparm[k];
				addSqlParams.push(v);
			});
			var updateParmsStr = updateParms.join(',');
			var addSql =
				' UPDATE ' +
				tablename +
				' set ' +
				updateParmsStr +
				' WHERE ' +
				pkName +
				' = ' +
				pkValue +
				' RETURNING *';
			logger.debug('update sql is ' + addSql);
			_this.client.query(addSql, addSqlParams, function(err, res) {
				if (err) {
					logger.error('[INSERT ERROR] - ', err.message);
					reject(err);
					return;
				}
				logger.debug(
					'--------------------------UPDATE----------------------------'
				);
				logger.debug(' update result :', res);
				logger.debug(
					'-----------------------------------------------------------------\n\n'
				);
				resolve(res.rows);
			});
		});
	};
	/**
	 * Update table
	 *
	 * @param String        tablename  the table name.
	 * @param String array  columnAndValue  the table column and value Map.
	 * @param String array  condition   the primary key name.
	 * @param db object     DB          the sqllite private database visit object
	 *
	 * @author robertfeng <fx19800215@163.com>
	 * @author vchinoy
	 *
	 */
	PgService.prototype.updateRow = function(
		tablename,
		columnAndValue,
		condition
	) {
		var _this = this;
		return new Promise(function(resolve, reject) {
			var addSqlParams = [];
			var updateParms = [];
			Object.keys(columnAndValue).forEach(function(k) {
				var v = columnAndValue[k];
				addSqlParams.push(v);
				updateParms.push(k + ' = ?');
			});
			var updatewhereparm = ' (1=1)  ';
			Object.keys(condition).forEach(function(k) {
				var v = condition[k];
				addSqlParams.push(v);
				updatewhereparm += ' and ' + k + '=? ';
			});
			var updateParmsStr = updateParms.join(',');
			var addSql =
				' UPDATE ' +
				tablename +
				' set ' +
				updateParmsStr +
				' WHERE ' +
				updatewhereparm +
				' RETURNING * ';
			logger.debug('update sql is ' + addSql);
			_this.client.query(addSql, addSqlParams, function(err, res) {
				if (err) {
					logger.error('[INSERT ERROR] - ', err.message);
					reject(err);
					return;
				}
				logger.debug(
					'--------------------------UPDATE----------------------------'
				);
				logger.debug(' update result :', res);
				logger.debug(
					'-----------------------------------------------------------------\n\n'
				);
				resolve(res.rows);
			});
		});
	};
	/**
	 *  Execute update or delete  sql.
	 *  @param string  updateSql   the execute sql
	 *  @param string  values   sql query parameters
	 */
	PgService.prototype.updateBySql = function(updateSql, values) {
		var _this = this;
		return new Promise(function(resolve, reject) {
			logger.debug('update sql is :  ' + updateSql);
			_this.client.query(updateSql, values, function(err, res) {
				if (err) {
					logger.error('[INSERT ERROR] - ', err.message);
					reject(err);
					return;
				}
				logger.debug(
					'--------------------------UPDATE----------------------------'
				);
				logger.debug(' update result :', res);
				logger.debug(
					'-----------------------------------------------------------------\n\n'
				);
				resolve(res.rows);
			});
		});
	};
	/**
	 * Get row by primary key
	 * @param String tablename   the table name.
	 * @param String column      the filed of search result.
	 * @param String pkColumn	    the primary key column name.
	 * @param String value       the primary key value.
	 *
	 *
	 */
	PgService.prototype.getRowByPk = function(tablename, column, pkColumn, value) {
		var _this = this;
		return new Promise(function(resolve, reject) {
			if (column === '') {
				column = '*';
			}
			var sql =
				' select  ' +
				column +
				' from ' +
				tablename +
				' where ' +
				pkColumn +
				' = ' +
				value +
				' ';
			_this.client.query(sql, function(err, res) {
				if (err) {
					reject(err);
					return;
				}
				// Console.log(  `The solution is: ${rows.length }  `  );
				logger.debug(' the getRowByPk ');
				if (res && res.rows && res.rows[0]) {
					resolve(res.rows[0]);
				} else {
					resolve(null);
				}
			});
		});
	};
	/**
	 *
	 *
	 * @param unknown_type sql
	 * @param unknown_type DB
	 * @return unknown
	 */
	PgService.prototype.getRowByPkOne = function(sql, values) {
		var _this = this;
		return new Promise(function(resolve, reject) {
			_this.client.query(sql, values, function(err, res) {
				if (err) {
					reject(err);
					return;
				}
				if (res && res.rows && res.rows[0]) {
					resolve(res.rows[0]);
				} else {
					resolve(null);
				}
			});
		});
	};
	/**
	 * Search table
	 * @param String tablename  the table name
	 * @param String columns    the field of search result
	 * @param String condition    the search condition,it is sorted by array. exp condition = array("id"=>"1");
	 * @param String orderBy    the order desc.
	 * @param String limit      the page limit.
	 *
	 */
	PgService.prototype.getRowsByCondition = function(
		tablename,
		column,
		condition,
		orderBy,
		limit
	) {
		var _this = this;
		return new Promise(function(resolve, reject) {
			if (column === '') {
				column = '*';
			}
			var updatewhereparm = ' (1=1)  ';
			Object.keys(condition).forEach(function(k) {
				updatewhereparm += ' and ' + k + '=? ';
			});
			var sql =
				' select  ' +
				column +
				' from ' +
				tablename +
				' where ' +
				updatewhereparm +
				' ' +
				orderBy +
				' ' +
				limit;
			logger.debug(' the search sql is : ' + sql + ' ');
			_this.client.query(sql, function(err, res) {
				if (err) {
					reject(err);
					return;
				}
				logger.debug(' the getRowsByCondition ');
				resolve(res.rows);
			});
		});
	};
	/**
	 * Search table by sql
	 * @param datatype sqlchareter   the table name
	 * @param datatype condition       the search condition,it is sorted by array. exp condition = array("id"=>"1");
	 * @param datatype limit         the page limit.
	 *
	 */
	PgService.prototype.getRowsBySQl = function(sqlcharacter, condition, limit) {
		var _this = this;
		return new Promise(function(resolve, reject) {
			var updatewhereparm = ' (1=1)  ';
			var addSqlParams = [];
			Object.keys(condition).forEach(function(k) {
				var v = condition[k];
				addSqlParams.push(v);
				updatewhereparm += ' and ' + k + '=? ';
			});
			var sql = ' ' + sqlcharacter + ' where ' + updatewhereparm + '   ' + limit;
			logger.debug(' the search sql is : ' + sql + ' ');
			_this.client.query(sql, addSqlParams, function(err, res) {
				if (err) {
					reject(err);
					return;
				}
				// Console.log(` The solution is: ${res.rows.length}  `);
				logger.debug(' The getRowsBySQl  ');
				resolve(res.rows);
			});
		});
	};
	/**
	 *
	 *
	 * @param {*} sql
	 * @param {*} values
	 * @returns
	 * @memberof PgService
	 */
	PgService.prototype.getRowsBySQlQuery = function(sql, values) {
		var _this = this;
		return new Promise(function(resolve, reject) {
			_this.client.query(sql, values, function(err, res) {
				if (err) {
					reject(err);
					return;
				}
				logger.debug(' the getRowsBySQlQuery ' + res.command);
				if (res && res.rows) {
					resolve(res.rows);
				} else {
					resolve(null);
				}
			});
		});
	};
	/**
	 * Search table by sql and it's not condition
	 *
	 *
	 * @param {datatype} sqlcharacter   the table name
	 * @param {datatype} values        SQL query parameters
	 * @param {datatype} limit         the page limit.
	 *
	 */
	PgService.prototype.getRowsBySQlNoCondition = function(
		sqlcharacter,
		values,
		limit
	) {
		var _this = this;
		/* eslint-disable */
		return new Promise(function(resolve, reject) {
			var sql;
			if (limit && sqlcharacter) {
				sql = sqlcharacter + ' ' + limit;
			} else if (sqlcharacter) {
				sql = sqlcharacter;
			} else {
				reject(null);
				return;
			}
			_this.client.query(sql, values, function(err, res) {
				if (err) {
					reject(err);
					return;
				}
				logger.debug(' the getRowsBySQlNoCondition ' + sql + ' ' + values);
				if (res && res.rows) {
					resolve(res.rows);
				} else {
					resolve(null);
				}
			});
		});
		/* eslint-enable */
	};
	/**
	 * 自动橱窗日志查找/评价历史记录查找
	 * @param unknown_type sql
	 * @param unknown_type values
	 * @return unknown
	 */
	PgService.prototype.getRowsBySQlCase = function(sql, values) {
		var _this = this;
		return new Promise(function(resolve, reject) {
			_this.client.query(sql, values, function(err, res) {
				if (err) {
					reject(err);
					return;
				}
				// Console.log(  `The solution is: ${rows.length }  `  );
				logger.debug(' the getRowsBySQlCase ' + sql);
				if (res && res.rows && res.rows[0]) {
					resolve(res.rows[0]);
				} else {
					resolve(null);
				}
			});
		});
	};
	return PgService;
})();
exports.PgService = PgService;
