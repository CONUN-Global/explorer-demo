'use strict';
exports.__esModule = true;
exports.Persist = void 0;
/**
 * SPDX-License-Identifier: Apache-2.0
 */
var PgService_1 = require('./PgService');
/**
 *
 *
 * @class Persist
 */
var Persist = /** @class */ (function() {
	function Persist(pgconfig) {
		this.pgservice = new PgService_1.PgService(pgconfig);
		this.metricservice = null;
		this.crudService = null;
		this.userdataservice = null;
	}
	/**
	 *
	 *
	 * @param {*} metricservice
	 * @memberof Persist
	 */
	Persist.prototype.setMetricService = function(metricservice) {
		this.metricservice = metricservice;
	};
	/**
	 *
	 *
	 * @param {*} crudService
	 * @memberof Persist
	 */
	Persist.prototype.setCrudService = function(crudService) {
		this.crudService = crudService;
	};
	/**
	 *
	 *
	 * @param {*} userdataservice
	 * @memberof Persist
	 */
	Persist.prototype.setUserDataService = function(userdataservice) {
		this.userdataservice = userdataservice;
	};
	/**
	 *
	 * @returns
	 * @memberof Persist
	 */
	Persist.prototype.getMetricService = function() {
		return this.metricservice;
	};
	/**
	 *
	 *
	 * @returns
	 * @memberof Persist
	 */
	Persist.prototype.getCrudService = function() {
		return this.crudService;
	};
	/**
	 *
	 * @returns
	 * @memberof Persist
	 */
	Persist.prototype.getUserDataService = function() {
		return this.userdataservice;
	};
	/**
	 *
	 *
	 * @returns
	 * @memberof Persist
	 */
	Persist.prototype.getPGService = function() {
		return this.pgservice;
	};
	/**
	 *
	 *
	 * @memberof Persist
	 */
	Persist.prototype.closeconnection = function() {
		this.pgservice.closeconnection();
	};
	return Persist;
})();
exports.Persist = Persist;
