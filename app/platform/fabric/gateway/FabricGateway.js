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
exports.FabricGateway = void 0;
var fabric_network_1 = require('fabric-network');
var fabprotos = require('fabric-protos');
var fabric_common_1 = require('fabric-common');
var concat_1 = require('lodash/concat');
var path = require('path');
var helper_1 = require('../../../common/helper');
var ExplorerMessage_1 = require('../../../common/ExplorerMessage');
var ExplorerError_1 = require('../../../common/ExplorerError');
/* eslint-disable @typescript-eslint/no-var-requires */
var _a = require('fabric-common'),
	BlockDecoder = _a.BlockDecoder,
	Client = _a.Client;
var FabricCAServices = require('fabric-ca-client');
/* eslint-enable @typescript-eslint/no-var-requires */
var logger = helper_1.helper.getLogger('FabricGateway');
var FabricGateway = /** @class */ (function() {
	/**
	 * Creates an instance of FabricGateway.
	 * @param {FabricConfig} config
	 * @memberof FabricGateway
	 */
	function FabricGateway(fabricConfig) {
		this.fabricConfig = fabricConfig;
		this.config = this.fabricConfig.getConfig();
		this.gateway = null;
		this.wallet = null;
		this.tlsEnable = false;
		this.defaultChannelName = null;
		this.gateway = new fabric_network_1.Gateway();
		this.fabricCaEnabled = false;
		this.client = null;
		this.clientTlsIdentity = null;
		this.FSWALLET = null;
		this.enableAuthentication = false;
		this.asLocalhost = false;
	}
	FabricGateway.prototype.initialize = function() {
		return __awaiter(this, void 0, void 0, function() {
			var explorerAdminId,
				info,
				walletPath,
				_a,
				identity,
				signedCertPem,
				adminPrivateKeyPem,
				connectionOptions,
				mTlsIdLabel,
				_b,
				error_1;
			return __generator(this, function(_c) {
				switch (_c.label) {
					case 0:
						this.fabricCaEnabled = this.fabricConfig.isFabricCaEnabled();
						this.tlsEnable = this.fabricConfig.getTls();
						this.enableAuthentication = false;
						this.FSWALLET = 'wallet/' + this.fabricConfig.getNetworkId();
						explorerAdminId = this.fabricConfig.getAdminUser();
						if (!explorerAdminId) {
							logger.error('Failed to get admin ID from configuration file');
							throw new ExplorerError_1.ExplorerError(
								ExplorerMessage_1.explorerError.ERROR_1010
							);
						}
						info = 'Loading configuration  ' + this.config;
						logger.debug(info.toUpperCase());
						this.defaultChannelName = this.fabricConfig.getDefaultChannel();
						_c.label = 1;
					case 1:
						_c.trys.push([1, 12, , 13]);
						walletPath = path.join(process.cwd(), this.FSWALLET);
						_a = this;
						return [
							4 /*yield*/,
							fabric_network_1.Wallets.newFileSystemWallet(walletPath)
						];
					case 2:
						_a.wallet = _c.sent();
						return [4 /*yield*/, this.wallet.get(explorerAdminId)];
					case 3:
						identity = _c.sent();
						if (!identity) return [3 /*break*/, 4];
						logger.debug(
							'An identity for the admin user: ' +
								explorerAdminId +
								' already exists in the wallet'
						);
						return [3 /*break*/, 8];
					case 4:
						if (!this.fabricCaEnabled) return [3 /*break*/, 6];
						logger.info('CA enabled');
						return [
							4 /*yield*/,
							this.enrollCaIdentity(
								explorerAdminId,
								this.fabricConfig.getAdminPassword()
							)
						];
					case 5:
						_c.sent();
						return [3 /*break*/, 8];
					case 6:
						signedCertPem = this.fabricConfig.getOrgSignedCertPem();
						adminPrivateKeyPem = this.fabricConfig.getOrgAdminPrivateKeyPem();
						return [
							4 /*yield*/,
							this.enrollUserIdentity(
								explorerAdminId,
								signedCertPem,
								adminPrivateKeyPem
							)
						];
					case 7:
						_c.sent();
						_c.label = 8;
					case 8:
						if (!this.tlsEnable) {
							Client.setConfigSetting('discovery-protocol', 'grpc');
						} else {
							Client.setConfigSetting('discovery-protocol', 'grpcs');
						}
						// Set connection options; identity and wallet
						this.asLocalhost =
							String(Client.getConfigSetting('discovery-as-localhost', 'true')) ===
							'true';
						connectionOptions = {
							identity: explorerAdminId,
							wallet: this.wallet,
							discovery: {
								enabled: true,
								asLocalhost: this.asLocalhost
							},
							clientTlsIdentity: ''
						};
						mTlsIdLabel = this.fabricConfig.getClientTlsIdentity();
						if (!mTlsIdLabel) return [3 /*break*/, 10];
						logger.info('client TLS enabled');
						_b = this;
						return [4 /*yield*/, this.wallet.get(mTlsIdLabel)];
					case 9:
						_b.clientTlsIdentity = _c.sent();
						if (this.clientTlsIdentity !== undefined) {
							connectionOptions.clientTlsIdentity = mTlsIdLabel;
						} else {
							throw new ExplorerError_1.ExplorerError(
								'Not found Identity ' + mTlsIdLabel + ' in your wallet'
							);
						}
						_c.label = 10;
					case 10:
						// Connect to gateway
						return [
							4 /*yield*/,
							this.gateway.connect(this.config, connectionOptions)
						];
					case 11:
						// Connect to gateway
						_c.sent();
						return [3 /*break*/, 13];
					case 12:
						error_1 = _c.sent();
						logger.error(
							ExplorerMessage_1.explorerError.ERROR_1010 +
								': ' +
								JSON.stringify(error_1, null, 2)
						);
						throw new ExplorerError_1.ExplorerError(
							ExplorerMessage_1.explorerError.ERROR_1010
						);
					case 13:
						return [2 /*return*/];
				}
			});
		});
	};
	FabricGateway.prototype.getEnableAuthentication = function() {
		return this.enableAuthentication;
	};
	FabricGateway.prototype.getDiscoveryProtocol = function() {
		return Client.getConfigSetting('discovery-protocol');
	};
	FabricGateway.prototype.getDefaultMspId = function() {
		return this.fabricConfig.getMspId();
	};
	FabricGateway.prototype.getTls = function() {
		return this.tlsEnable;
	};
	FabricGateway.prototype.getConfig = function() {
		return this.config;
	};
	/**
	 * @private method
	 *
	 */
	FabricGateway.prototype.enrollUserIdentity = function(
		userName,
		signedCertPem,
		adminPrivateKeyPem
	) {
		return __awaiter(this, void 0, void 0, function() {
			var identity;
			return __generator(this, function(_a) {
				switch (_a.label) {
					case 0:
						identity = {
							credentials: {
								certificate: signedCertPem,
								privateKey: adminPrivateKeyPem
							},
							mspId: this.fabricConfig.getMspId(),
							type: 'X.509'
						};
						logger.info('enrollUserIdentity: userName :', userName);
						return [4 /*yield*/, this.wallet.put(userName, identity)];
					case 1:
						_a.sent();
						return [2 /*return*/, identity];
				}
			});
		});
	};
	/**
	 * @private method
	 *
	 */
	FabricGateway.prototype.enrollCaIdentity = function(id, secret) {
		return __awaiter(this, void 0, void 0, function() {
			var caName,
				ca,
				enrollment,
				identity,
				adminUser,
				enrollmentBEAdmin,
				identityBEAdmin,
				error_2;
			return __generator(this, function(_a) {
				switch (_a.label) {
					case 0:
						if (!this.fabricCaEnabled) {
							logger.error('CA server is not configured');
							return [2 /*return*/, null];
						}
						_a.label = 1;
					case 1:
						_a.trys.push([1, 8, , 9]);
						caName = this.config.organizations[this.fabricConfig.getOrganization()]
							.certificateAuthorities[0];
						ca = new FabricCAServices(
							this.config.certificateAuthorities[caName].url,
							{
								trustedRoots: this.fabricConfig.getTlsCACertsPem(caName),
								verify: false
							}
						);
						return [
							4 /*yield*/,
							ca.enroll({
								enrollmentID: this.fabricConfig.getCaAdminUser(),
								enrollmentSecret: this.fabricConfig.getCaAdminPassword()
							})
						];
					case 2:
						enrollment = _a.sent();
						logger.info('>>>>>>>>>>>>>>>>>>>>>>>>> enrollment : ca admin');
						identity = {
							credentials: {
								certificate: enrollment.certificate,
								privateKey: enrollment.key.toBytes()
							},
							mspId: this.fabricConfig.getMspId(),
							type: 'X.509'
						};
						// Import identity wallet
						return [
							4 /*yield*/,
							this.wallet.put(this.fabricConfig.getCaAdminUser(), identity)
						];
					case 3:
						// Import identity wallet
						_a.sent();
						return [
							4 /*yield*/,
							this.getUserContext(this.fabricConfig.getCaAdminUser())
						];
					case 4:
						adminUser = _a.sent();
						return [
							4 /*yield*/,
							ca.register(
								{
									affiliation: this.fabricConfig.getAdminAffiliation(),
									enrollmentID: id,
									enrollmentSecret: secret,
									role: 'admin'
								},
								adminUser
							)
						];
					case 5:
						_a.sent();
						return [
							4 /*yield*/,
							ca.enroll({
								enrollmentID: id,
								enrollmentSecret: secret
							})
						];
					case 6:
						enrollmentBEAdmin = _a.sent();
						logger.info(
							'>>>>>>>>>>>>>>>>>>>>>>>>> registration & enrollment : BE admin'
						);
						identityBEAdmin = {
							credentials: {
								certificate: enrollmentBEAdmin.certificate,
								privateKey: enrollmentBEAdmin.key.toBytes()
							},
							mspId: this.fabricConfig.getMspId(),
							type: 'X.509'
						};
						return [4 /*yield*/, this.wallet.put(id, identityBEAdmin)];
					case 7:
						_a.sent();
						logger.debug(
							'Successfully get user enrolled and imported to wallet, ',
							id
						);
						return [2 /*return*/, identityBEAdmin];
					case 8:
						error_2 = _a.sent();
						// TODO decide how to proceed if error
						logger.error('Error instantiating FabricCAServices ', error_2);
						return [2 /*return*/, null];
					case 9:
						return [2 /*return*/];
				}
			});
		});
	};
	FabricGateway.prototype.getUserContext = function(user) {
		return __awaiter(this, void 0, void 0, function() {
			var identity, provider, userContext;
			return __generator(this, function(_a) {
				switch (_a.label) {
					case 0:
						return [4 /*yield*/, this.wallet.get(user)];
					case 1:
						identity = _a.sent();
						if (!identity) {
							logger.error('Not exist user :', user);
							return [2 /*return*/, null];
						}
						provider = this.wallet.getProviderRegistry().getProvider(identity.type);
						return [4 /*yield*/, provider.getUserContext(identity, user)];
					case 2:
						userContext = _a.sent();
						return [2 /*return*/, userContext];
				}
			});
		});
	};
	FabricGateway.prototype.getIdentityInfo = function(label) {
		return __awaiter(this, void 0, void 0, function() {
			var identityInfo, list, error_3;
			return __generator(this, function(_a) {
				switch (_a.label) {
					case 0:
						logger.info('Searching for an identity with label: ', label);
						_a.label = 1;
					case 1:
						_a.trys.push([1, 3, , 4]);
						return [4 /*yield*/, this.wallet.list()];
					case 2:
						list = _a.sent();
						identityInfo = list.filter(function(id) {
							return id.label === label;
						});
						return [3 /*break*/, 4];
					case 3:
						error_3 = _a.sent();
						logger.error(error_3);
						return [3 /*break*/, 4];
					case 4:
						return [2 /*return*/, identityInfo];
				}
			});
		});
	};
	FabricGateway.prototype.queryChannels = function() {
		return __awaiter(this, void 0, void 0, function() {
			var network, contract, result, resultJson;
			return __generator(this, function(_a) {
				switch (_a.label) {
					case 0:
						return [4 /*yield*/, this.gateway.getNetwork(this.defaultChannelName)];
					case 1:
						network = _a.sent();
						contract = network.getContract('cscc');
						return [4 /*yield*/, contract.evaluateTransaction('GetChannels')];
					case 2:
						result = _a.sent();
						resultJson = fabprotos.protos.ChannelQueryResponse.decode(result);
						logger.debug('queryChannels', resultJson);
						return [2 /*return*/, resultJson];
				}
			});
		});
	};
	FabricGateway.prototype.queryBlock = function(channelName, blockNum) {
		return __awaiter(this, void 0, void 0, function() {
			var network, contract, resultByte, resultJson, error_4;
			return __generator(this, function(_a) {
				switch (_a.label) {
					case 0:
						_a.trys.push([0, 3, , 4]);
						return [4 /*yield*/, this.gateway.getNetwork(this.defaultChannelName)];
					case 1:
						network = _a.sent();
						contract = network.getContract('qscc');
						return [
							4 /*yield*/,
							contract.evaluateTransaction(
								'GetBlockByNumber',
								channelName,
								String(blockNum)
							)
						];
					case 2:
						resultByte = _a.sent();
						resultJson = BlockDecoder.decode(resultByte);
						logger.debug('queryBlock', resultJson);
						return [2 /*return*/, resultJson];
					case 3:
						error_4 = _a.sent();
						logger.error(
							'Failed to get block ' +
								blockNum +
								' from channel ' +
								channelName +
								' : ',
							error_4
						);
						return [2 /*return*/, null];
					case 4:
						return [2 /*return*/];
				}
			});
		});
	};
	FabricGateway.prototype.queryInstantiatedChaincodes = function(channelName) {
		return __awaiter(this, void 0, void 0, function() {
			var network, contract, result, resultJson, decodedReult, _i, _a, cc, ccInfo;
			return __generator(this, function(_b) {
				switch (_b.label) {
					case 0:
						logger.info('queryInstantiatedChaincodes', channelName);
						return [4 /*yield*/, this.gateway.getNetwork(this.defaultChannelName)];
					case 1:
						network = _b.sent();
						contract = network.getContract('lscc');
						return [4 /*yield*/, contract.evaluateTransaction('GetChaincodes')];
					case 2:
						result = _b.sent();
						resultJson = fabprotos.protos.ChaincodeQueryResponse.decode(result);
						if (!(resultJson.chaincodes.length <= 0)) return [3 /*break*/, 4];
						resultJson = { chaincodes: [], toJSON: null };
						contract = network.getContract('_lifecycle');
						return [
							4 /*yield*/,
							contract.evaluateTransaction('QueryInstalledChaincodes', '')
						];
					case 3:
						result = _b.sent();
						decodedReult = fabprotos.lifecycle.QueryInstalledChaincodesResult.decode(
							result
						);
						for (
							_i = 0, _a = decodedReult.installed_chaincodes;
							_i < _a.length;
							_i++
						) {
							cc = _a[_i];
							logger.info('1:', cc);
							ccInfo = cc.references[channelName];
							if (ccInfo !== undefined) {
								logger.info('2:', ccInfo);
								resultJson.chaincodes = concat_1['default'](
									resultJson.chaincodes,
									ccInfo.chaincodes
								);
							}
						}
						_b.label = 4;
					case 4:
						logger.debug('queryInstantiatedChaincodes', resultJson);
						return [2 /*return*/, resultJson];
				}
			});
		});
	};
	FabricGateway.prototype.queryChainInfo = function(channelName) {
		return __awaiter(this, void 0, void 0, function() {
			var network, contract, resultByte, resultJson, error_5;
			return __generator(this, function(_a) {
				switch (_a.label) {
					case 0:
						_a.trys.push([0, 3, , 4]);
						return [4 /*yield*/, this.gateway.getNetwork(this.defaultChannelName)];
					case 1:
						network = _a.sent();
						contract = network.getContract('qscc');
						return [
							4 /*yield*/,
							contract.evaluateTransaction('GetChainInfo', channelName)
						];
					case 2:
						resultByte = _a.sent();
						resultJson = fabprotos.common.BlockchainInfo.decode(resultByte);
						logger.debug('queryChainInfo', resultJson);
						return [2 /*return*/, resultJson];
					case 3:
						error_5 = _a.sent();
						logger.error(
							'Failed to get chain info from channel ' + channelName + ' : ',
							error_5
						);
						return [2 /*return*/, null];
					case 4:
						return [2 /*return*/];
				}
			});
		});
	};
	FabricGateway.prototype.getDiscoveryResult = function(channelName) {
		return __awaiter(this, void 0, void 0, function() {
			var network,
				channel,
				ds,
				client,
				mspID,
				targets,
				_i,
				_a,
				peer,
				discoverer,
				url,
				pem,
				grpcOpt,
				peer_endpoint,
				idx,
				result,
				error_6;
			return __generator(this, function(_b) {
				switch (_b.label) {
					case 0:
						_b.trys.push([0, 8, , 9]);
						return [4 /*yield*/, this.gateway.getNetwork(channelName)];
					case 1:
						network = _b.sent();
						channel = network.getChannel();
						ds = new fabric_common_1.DiscoveryService(
							'be discovery service',
							channel
						);
						client = new Client('discovery client');
						if (this.clientTlsIdentity) {
							logger.info('client TLS enabled');
							client.setTlsClientCertAndKey(
								this.clientTlsIdentity.credentials.certificate,
								this.clientTlsIdentity.credentials.privateKey
							);
						} else {
							client.setTlsClientCertAndKey();
						}
						mspID = this.config.client.organization;
						targets = [];
						(_i = 0), (_a = this.config.organizations[mspID].peers);
						_b.label = 2;
					case 2:
						if (!(_i < _a.length)) return [3 /*break*/, 5];
						peer = _a[_i];
						discoverer = new fabric_common_1.Discoverer(
							'be discoverer ' + peer,
							client,
							mspID
						);
						url = this.config.peers[peer].url;
						pem = this.fabricConfig.getPeerTlsCACertsPem(peer);
						grpcOpt = {};
						if ('grpcOptions' in this.config.peers[peer]) {
							grpcOpt = this.config.peers[peer].grpcOptions;
						}
						peer_endpoint = client.newEndpoint(
							Object.assign(grpcOpt, {
								url: url,
								pem: pem
							})
						);
						return [4 /*yield*/, discoverer.connect(peer_endpoint)];
					case 3:
						_b.sent();
						targets.push(discoverer);
						_b.label = 4;
					case 4:
						_i++;
						return [3 /*break*/, 2];
					case 5:
						idx = this.gateway.identityContext;
						// do the three steps
						ds.build(idx);
						ds.sign(idx);
						return [
							4 /*yield*/,
							ds.send({
								asLocalhost: this.asLocalhost,
								refreshAge: 15000,
								targets: targets
							})
						];
					case 6:
						_b.sent();
						return [4 /*yield*/, ds.getDiscoveryResults(true)];
					case 7:
						result = _b.sent();
						return [2 /*return*/, result];
					case 8:
						error_6 = _b.sent();
						logger.error(
							'Failed to get discovery result from channel ' + channelName + ' : ',
							error_6
						);
						return [3 /*break*/, 9];
					case 9:
						return [2 /*return*/, null];
				}
			});
		});
	};
	return FabricGateway;
})();
exports.FabricGateway = FabricGateway;
