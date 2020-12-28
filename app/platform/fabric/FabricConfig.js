'use strict';
/*
 * SPDX-License-Identifier: Apache-2.0
 */
exports.__esModule = true;
exports.FabricConfig = void 0;
var fs = require('fs');
var path = require('path');
var helper_1 = require('../../common/helper');
var ExplorerMessage_1 = require('../../common/ExplorerMessage');
var ExplorerError_1 = require('../../common/ExplorerError');
var logger = helper_1.helper.getLogger('FabricConfig');
/**
 *
 *
 * @class FabricConfig
 */
var FabricConfig = /** @class */ (function() {
	/**
	 * Creates an instance of FabricConfig.
	 * @memberof FabricConfig
	 */
	/*eslint-disable */
	function FabricConfig() {}
	/* eslint-enable */
	/**
	 *
	 *
	 * @param {*} configPath
	 * @memberof FabricConfig
	 */
	FabricConfig.prototype.initialize = function(network_id, network_config) {
		this.network_id = network_id;
		var profile_path = path.resolve(__dirname, network_config.profile);
		var configJson = fs.readFileSync(profile_path, 'utf8');
		this.config = JSON.parse(configJson);
	};
	/**
	 *
	 *
	 * @returns
	 * @memberof FabricConfig
	 */
	FabricConfig.prototype.getConfig = function() {
		return this.config;
	};
	/**
	 *
	 *
	 * @returns
	 * @memberof FabricConfig
	 */
	FabricConfig.prototype.isFabricCaEnabled = function() {
		if (this.config.certificateAuthorities === undefined) {
			return false;
		}
		var org = this.getOrganization();
		var caArray = this.config.organizations[org].certificateAuthorities;
		if (caArray === undefined) {
			return false;
		}
		var caName = caArray[0];
		if (this.config.certificateAuthorities[caName] === undefined) {
			return false;
		}
		logger.info('Fabric CA: Enabled');
		return true;
	};
	/**
	 *
	 *
	 * @returns
	 * @memberof FabricConfig
	 */
	FabricConfig.prototype.getOrganization = function() {
		return this.config.client.organization;
	};
	/**
	 *
	 *
	 * @returns
	 * @memberof FabricConfig
	 */
	FabricConfig.prototype.getTls = function() {
		logger.info('config.client.tlsEnable ', this.config.client.tlsEnable);
		return this.config.client.tlsEnable;
	};
	/**
	 *
	 *
	 * @returns
	 * @memberof FabricConfig
	 */
	FabricConfig.prototype.getEnableAuthentication = function() {
		return this.config.client.enableAuthentication;
	};
	/**
	 *
	 *
	 * @returns
	 * @memberof FabricConfig
	 */
	FabricConfig.prototype.getClientTlsIdentity = function() {
		return this.config.client.clientTlsIdentity;
	};
	/**
	 *
	 *
	 * @returns
	 * @memberof FabricConfig
	 */
	FabricConfig.prototype.getAdminUser = function() {
		if (
			!this.config.client ||
			!this.config.client.adminCredential ||
			!this.config.client.adminCredential.id
		) {
			logger.error('client.adminCredential.id is undefined');
			return null;
		}
		return this.config.client.adminCredential.id;
	};
	/**
	 *
	 *
	 * @returns
	 * @memberof FabricConfig
	 */
	FabricConfig.prototype.getAdminPassword = function() {
		if (
			!this.config.client ||
			!this.config.client.adminCredential ||
			!this.config.client.adminCredential.password
		) {
			logger.error('client.adminCredential.password is undefined');
			return null;
		}
		return this.config.client.adminCredential.password;
	};
	/**
	 *
	 *
	 * @returns
	 * @memberof FabricConfig
	 */
	FabricConfig.prototype.getAdminAffiliation = function() {
		return this.config.client.adminCredential.affiliation;
	};
	/**
	 *
	 *
	 * @returns
	 * @memberof FabricConfig
	 */
	FabricConfig.prototype.getCaAdminUser = function() {
		return this.config.client.caCredential.id;
	};
	/**
	 *
	 *
	 * @returns
	 * @memberof FabricConfig
	 */
	FabricConfig.prototype.getCaAdminPassword = function() {
		return this.config.client.caCredential.password;
	};
	/**
	 *
	 *
	 * @returns
	 * @memberof FabricConfig
	 */
	FabricConfig.prototype.getNetworkId = function() {
		return this.network_id;
	};
	/**
	 *
	 *
	 * @returns
	 * @memberof FabricConfig
	 */
	FabricConfig.prototype.getDefaultChannel = function() {
		var defChannel;
		for (var x in this.config.channels) {
			// Getting default channel
			logger.info('FabricConfig, this.config.channels ', x);
			if (x) {
				defChannel = x;
			}
		}
		return defChannel;
	};
	/**
	 *
	 *
	 * @returns
	 * @memberof FabricConfig
	 */
	FabricConfig.prototype.getPeersConfig = function() {
		var peers = [];
		for (var x in this.config.peers) {
			// TODO may need to handle multiple fabric-ca server ??
			if (this.config.peers[x].url) {
				var peer = {
					name: x,
					url: this.config.peers[x].url,
					tlsCACerts: this.config.peers[x].tlsCACerts,
					eventUrl: this.config.peers[x].eventUrl,
					grpcOptions: this.config.peers[x].grpcOptions
				};
				peers.push(peer);
			}
		}
		return peers;
	};
	/**
	 *
	 *
	 * @returns
	 * @memberof FabricConfig
	 */
	FabricConfig.prototype.getOrgSignedCertPem = function() {
		var organization = this.config.organizations[this.getOrganization()];
		if (
			organization.signedCert === undefined ||
			(organization.signedCert.path === undefined &&
				organization.signedCert.pem === undefined)
		) {
			logger.error('Not found signedCert configuration');
			throw new ExplorerError_1.ExplorerError(
				ExplorerMessage_1.explorerError.ERROR_2015
			);
		}
		if (organization.signedCert.path !== undefined) {
			return fs.readFileSync(
				path.resolve(__dirname, '../../..', organization.signedCert.path),
				'utf8'
			);
		}
		return organization.signedCert.pem;
	};
	/**
	 *
	 *
	 * @returns
	 * @memberof FabricConfig
	 */
	FabricConfig.prototype.getOrgAdminPrivateKeyPem = function() {
		var organization = this.config.organizations[this.getOrganization()];
		if (
			organization.adminPrivateKey === undefined ||
			(organization.adminPrivateKey.path === undefined &&
				organization.adminPrivateKey.pem === undefined)
		) {
			logger.error('Not found adminPrivateKey configuration');
			throw new ExplorerError_1.ExplorerError(
				ExplorerMessage_1.explorerError.ERROR_2015
			);
		}
		if (organization.adminPrivateKey.path !== undefined) {
			return fs.readFileSync(
				path.resolve(__dirname, '../../..', organization.adminPrivateKey.path),
				'utf8'
			);
		}
		return organization.adminPrivateKey.pem;
	};
	/**
	 *
	 *
	 * @returns
	 * @memberof FabricConfig
	 */
	FabricConfig.prototype.getPeerTlsCACertsPem = function(peer) {
		var tlsCACerts = this.config.peers[peer].tlsCACerts;
		if (
			tlsCACerts === undefined ||
			(tlsCACerts.path === undefined && tlsCACerts.pem === undefined)
		) {
			logger.error('Not found tlsCACerts configuration: ' + peer.url);
			return '';
		}
		if (tlsCACerts.path !== undefined) {
			return fs.readFileSync(
				path.resolve(__dirname, '../../..', tlsCACerts.path),
				'utf8'
			);
		}
		return tlsCACerts.pem;
	};
	/**
	 *
	 *
	 * @returns
	 * @memberof FabricConfig
	 */
	FabricConfig.prototype.getMspId = function() {
		var organization = this.config.organizations[this.getOrganization()];
		return organization.mspid;
	};
	/**
	 *
	 *
	 * @returns
	 * @memberof FabricConfig
	 */
	FabricConfig.prototype.getTlsCACertsPem = function(certificateAuthority) {
		var tlsCACerts = this.config.certificateAuthorities[certificateAuthority]
			.tlsCACerts;
		if (
			tlsCACerts === undefined ||
			(tlsCACerts.path === undefined && tlsCACerts.pem === undefined)
		) {
			logger.error(
				'Not found tlsCACerts configuration: ' + certificateAuthority.url
			);
			return '';
		}
		if (tlsCACerts.path !== undefined) {
			return fs.readFileSync(
				path.resolve(__dirname, '../../..', tlsCACerts.path),
				'utf8'
			);
		}
		return tlsCACerts.pem;
	};
	/**
	 *
	 *
	 * @returns
	 * @memberof FabricConfig
	 */
	FabricConfig.prototype.getPeers = function() {
		var peers = [];
		for (var x in this.config.peers) {
			if (this.config.peers[x].url) {
				var peer = {
					name: x,
					url: this.config.peers[x].url,
					tlsCACerts: this.config.peers[x].tlsCACerts,
					eventUrl: this.config.peers[x].eventUrl,
					grpcOptions: this.config.peers[x].grpcOptions
				};
				peers.push(peer);
			}
		}
		return peers;
	};
	FabricConfig.prototype.getRWSetEncoding = function() {
		return this.config.client.rwSetEncoding || 'utf8';
	};
	return FabricConfig;
})();
exports.FabricConfig = FabricConfig;
