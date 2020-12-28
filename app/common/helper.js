'use strict';
/*
 *SPDX-License-Identifier: Apache-2.0
 */
var __assign =
	(this && this.__assign) ||
	function() {
		__assign =
			Object.assign ||
			function(t) {
				for (var s, i = 1, n = arguments.length; i < n; i++) {
					s = arguments[i];
					for (var p in s)
						if (Object.prototype.hasOwnProperty.call(s, p)) t[p] = s[p];
				}
				return t;
			};
		return __assign.apply(this, arguments);
	};
exports.__esModule = true;
exports.helper = void 0;
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
var log4js_1 = require('log4js/lib/log4js');
var yn_1 = require('yn');
/*
 * Please assign the logger with the file name for the application logging and assign the logger with "PgService"
 * for database logging for any file name. Please find an example below.
 *
 * To stacktrace, please pass the error.stack object to the logger. If there is no error.stack object pass in a
 * string with description.
 *
 * const helper = require("./app/helper");
 * const logger = helper.getLogger("main");
 * logger.setLevel('INFO');
 */
/**
 *
 * Returns Logger
 * @param {*} moduleName
 * @returns
 */
var helper = /** @class */ (function() {
	function helper() {}
	helper.getLogger = function(moduleName) {
		var logger = log4js_1['default'].getLogger(moduleName);
		var appLog = 'logs/app/app.log';
		var dbLog = 'logs/db/db.log';
		var consoleLog = 'logs/console/console.log';
		if (process.env.SYNC_LOG_PATH) {
			appLog = process.env.SYNC_LOG_PATH + '/app/app.log';
			dbLog = process.env.SYNC_LOG_PATH + '/db/db.log';
			consoleLog = process.env.SYNC_LOG_PATH + '/console/console.log';
		}
		var appLevel = 'debug';
		var dbLevel = 'debug';
		var consoleLevel = 'info';
		if (process.env.LOG_LEVEL_APP) {
			appLevel = process.env.LOG_LEVEL_APP;
		}
		if (process.env.LOG_LEVEL_DB) {
			dbLevel = process.env.LOG_LEVEL_DB;
		}
		if (process.env.LOG_LEVEL_CONSOLE) {
			consoleLevel = process.env.LOG_LEVEL_CONSOLE;
		}
		var logConfig = {
			appenders: {
				app: {
					type: 'dateFile',
					filename: appLog,
					maxLogSize: 8 * 1024 * 1024,
					daysToKeep: 7
				},
				db: {
					type: 'dateFile',
					filename: dbLog,
					maxLogSize: 8 * 1024 * 1024,
					daysToKeep: 7
				},
				console: {
					type: 'dateFile',
					filename: consoleLog,
					maxLogSize: 8 * 1024 * 1024,
					daysToKeep: 7
				},
				consoleFilter: {
					type: 'logLevelFilter',
					appender: 'console',
					level: consoleLevel
				}
			},
			categories: {
				default: { appenders: ['consoleFilter', 'app'], level: appLevel },
				PgService: { appenders: ['consoleFilter', 'db'], level: dbLevel }
			}
		};
		if (process.env.LOG_CONSOLE_STDOUT) {
			if (yn_1['default'](process.env.LOG_CONSOLE_STDOUT)) {
				logConfig.appenders.console = __assign(
					__assign({}, logConfig.appenders.console),
					{ type: 'console' }
				);
			}
		}
		log4js_1['default'].configure(logConfig);
		return logger;
	};
	return helper;
})();
exports.helper = helper;
