/**
 *    SPDX-License-Identifier: Apache-2.0
 */

import React, { Component } from 'react';
import { withStyles } from '@material-ui/core/styles';
import { Row, Col } from 'reactstrap';
import FontAwesome from 'react-fontawesome';
import Card from '@material-ui/core/Card';
import TitleBar from '../TitleBar/TitleBar';
import ChartStats from '../Charts/ChartStats';

import TimelineStream from '../Lists/TimelineStream';
import Transactions from '../Lists/Transactions';

import {
	blockListType,
	dashStatsType,
	peerStatusType,
	transactionByOrgType
} from '../types';

/* istanbul ignore next */
const styles = theme => {
	const { type } = theme.palette;
	const dark = type === 'dark';
	return {
		titleBar: {
			width: '100%',
			marginTop: 80,
			marginBottom: 15,
			display: 'flex',
			justifyContent: 'center',
			alignItems: 'center',
			textAlign: 'center'
		},
		topBar: {
			marginTop: 30,
			marginBottom: 15
		},
		background: {
			backgroundColor: '#f5f7fd'
		},
		view: {
			paddingTop: 20,
			paddingLeft: 0,
			width: '80%',
			marginLeft: '10%',
			marginRight: '10%',
			marginBottom: 40
		},
		blocks: {
			backgroundColor: dark ? '#453e68' : '#ffffff',
			boxShadow:
				' 0px 1px 3px 0px rgba(0, 0, 0, 0.2), 0px 1px 1px 0px rgba(0, 0, 0, 0.14), 0px 2px 1px -1px rgba(0, 0, 0, 0.12)',
			marginBottom: 20,
			marginTop: 20,
			borderRadius: 10
		},
		count: {
			textAlign: 'center',
			color: dark ? '#ffffff' : undefined
		},
		statistic: {
			textAlign: 'center',
			fontSize: '18pt',
			color: dark ? '#ffffff' : '#000000'
		},
		vdivide: {
			'&::after': {
				borderRight: `2px ${dark ? 'rgb(40, 36, 61)' : '#dff1fe'} solid`,
				display: 'block',
				height: '45%',
				bottom: '55%',
				content: "' '",
				position: 'relative'
			}
		},
		dashColumnHeader: {
			fontSize: 20,
			fontWeight: 400
		},
		dashColumn: {
			display: 'flex',
			justifyContent: 'center',
			alignItems: 'center'
		},
		dataSpan: {
			fontSize: 30
		},

		iconColumn: {
			display: 'flex',
			justifyContent: 'center',
			alignItems: 'center',
			fontSize: 30,

			borderRadius: 10,
			textAlign: 'center',

			color: '#fff',
			backgroundColor: '#66b0ff'
		},
		node: {
			color: dark ? '#183a37' : '#21295c',
			backgroundColor: dark ? 'rgb(104, 247, 235)' : '#858aa6'
		},
		block: {
			color: dark ? '#1f1a33' : '#004d6b',
			backgroundColor: dark ? 'rgb(106, 156, 248)' : '#b9d6e1'
		},
		chaincode: {
			color: dark ? 'rgb(121, 83, 109)' : '#407b20',
			backgroundColor: dark ? 'rgb(247, 205, 234)' : '#d0ecda'
		},
		transaction: {
			color: dark ? 'rgb(216, 142, 4)' : '#ffa686',
			backgroundColor: dark ? 'rgb(252, 224, 174)' : '#ffeed8'
		},
		section: {
			height: '300px',
			marginBottom: '2%',
			color: dark ? '#ffffff' : undefined,
			backgroundColor: dark ? '#3c3558' : undefined
		},
		center: {
			textAlign: 'center'
		}
	};
};

export class DashboardView extends Component {
	constructor(props) {
		super(props);
		this.state = {
			notifications: [],
			hasDbError: false
		};
	}

	componentWillMount() {
		const {
			blockList,
			dashStats,
			peerStatus,
			transactionByOrg,
			blockActivity
		} = this.props;
		if (
			blockList === undefined ||
			dashStats === undefined ||
			peerStatus === undefined ||
			blockActivity === undefined ||
			transactionByOrg === undefined
		) {
			this.setState({ hasDbError: true });
		}
	}

	componentDidMount() {
		const { blockActivity } = this.props;
		this.setNotifications(blockActivity);
	}

	componentWillReceiveProps() {
		const { blockActivity } = this.props;
		this.setNotifications(blockActivity);
	}

	setNotifications = blockList => {
		const notificationsArr = [];
		if (blockList !== undefined) {
			for (let i = 0; i < 3 && blockList && blockList[i]; i += 1) {
				const block = blockList[i];
				const notify = {
					title: `Block ${block.blocknum} `,
					type: 'block',
					time: block.createdt,
					txcount: block.txcount,
					datahash: block.datahash,
					blockhash: block.blockhash,
					channelName: block.channelname
				};
				notificationsArr.push(notify);
			}
		}
		this.setState({ notifications: notificationsArr });
	};

	render() {
		const { dashStats, blockActivity } = this.props;
		const { hasDbError, notifications } = this.state;
		if (hasDbError) {
			return (
				<div
					style={{
						height: '100vh',
						display: 'flex',
						justifyContent: 'center',
						alignItems: 'center'
					}}
				>
					<h1>
						Please verify your network configuration, database configuration and try
						again
					</h1>
				</div>
			);
		}
		const { classes } = this.props;
		return (
			<div className={classes.background}>
				<TitleBar titleString="DASHBOARD" />
				<div className={classes.view}>
					{/* eslint-disable-next-line */}
					<Row className={(classes.topBar, classes.blocks)}>
						<Col sm="4" className={classes.count}>
							<Row>
								<Col sm="3" className={classes.iconColumn}>
									<span className={classes.iconSpan}>
										<FontAwesome name="cubes" />
									</span>
								</Col>

								<Col>
									<div>BLOCKS</div>
									<div className={classes.dataSpan}>{dashStats.latestBlock}</div>
								</Col>
							</Row>
						</Col>
						<Col sm="4" className={classes.count}>
							<Row>
								<Col sm="3" className={classes.iconColumn}>
									<span className={classes.iconSpan}>
										<FontAwesome name="link" />
									</span>
								</Col>

								<Col>
									<div>TRANSACTIONS</div>
									<div className={classes.dataSpan}>{dashStats.txCount}</div>
								</Col>
							</Row>
						</Col>
						<Col sm="4" className={classes.count}>
							<Row>
								<Col sm="3" className={classes.iconColumn}>
									<span className={classes.iconSpan}>
										<FontAwesome name="code" />
									</span>
								</Col>

								<Col>
									<div>CHAINCODES</div>
									<div className={classes.dataSpan}>{dashStats.chaincodeCount}</div>
								</Col>
							</Row>
						</Col>
					</Row>

					<Row>
						<Col>
							<Card className={classes.section}>
								<ChartStats />
							</Card>
						</Col>

						<Col>
							<Card className={classes.section}>
								<TimelineStream
									notifications={notifications}
									blockList={blockActivity}
								/>
							</Card>
						</Col>
					</Row>
					<Row>
						<Col>
							<Transactions
								currentChannel={this.props.currentChannel}
								transactionList={this.props.transactionList}
								getTransactionList={this.props.getTransactionList}
								transaction={this.props.transaction}
								transactionByOrg={this.props.transactionByOrg}
								getTransactionInfo={this.props.getTransactionInfo}
								getTransaction={this.props.getTransaction}
								getTransactionListSearch={this.props.getTransactionListSearch}
								transactionListSearch={this.props.transactionListSearch}
							/>
						</Col>
					</Row>
				</div>
			</div>
		);
	}
}

DashboardView.propTypes = {
	blockList: blockListType.isRequired,
	dashStats: dashStatsType.isRequired,
	peerStatus: peerStatusType.isRequired,
	transactionByOrg: transactionByOrgType.isRequired
};

export default withStyles(styles)(DashboardView);
