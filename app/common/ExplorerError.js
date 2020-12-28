'use strict';
/*
 * SPDX-License-Identifier: Apache-2.0
 */
exports.__esModule = true;
exports.ExplorerError = void 0;
var util_1 = require('util');
/**
 *
 * @param {*} args {
 * %s - String.
 * %d - Number (both integer and float).
 * %j - JSON.
 * %% - single percent sign ('%'). This does not consume an argument.
 * }
 */
function ExplorerError() {
	var args = [];
	for (var _i = 0; _i < arguments.length; _i++) {
		args[_i] = arguments[_i];
	}
	Error.captureStackTrace(this, this.constructor);
	this.name = this.constructor.name;
	this.message = util_1['default'].format(args);
}
exports.ExplorerError = ExplorerError;
