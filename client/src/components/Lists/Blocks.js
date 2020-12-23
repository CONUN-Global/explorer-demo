/**
 *    SPDX-License-Identifier: Apache-2.0
 */

import React, { Component } from 'react';
import { withStyles } from '@material-ui/core/styles';
import Dialog from '@material-ui/core/Dialog';

import matchSorter from 'match-sorter';
import find from 'lodash/find';
import moment from 'moment';
import { isNull } from 'util';
import ReactTable from '../Styled/Table';
import BlockView from '../View/BlockView';
import TransactionView from '../View/TransactionView';

import {
	blockListType,
	currentChannelType,
	getTransactionType,
	transactionType
} from '../types';

/* istanbul ignore next */
const styles = theme => {
	const { type } = theme.palette;
	const dark = type === 'dark';
	return {
		titleBar: {
			width: '100%',
			marginTop: 80,
			marginBottom: 80,
			display: 'flex',
			justifyContent: 'center',
			alignItems: 'center',
			textAlign: 'center'
		},
		hash: {
			'&, & li, & ul': {
				overflow: 'visible !important'
			}
		},
		partialHash: {
			textAlign: 'center',
			position: 'relative !important',
			'&:hover $fullHash': {
				display: 'block',
				position: 'absolute !important',
				padding: '4px 4px',
				backgroundColor: dark ? '#5e558e' : '#000000',
				marginTop: -30,
				marginLeft: -215,
				borderRadius: 8,
				color: '#ffffff',
				opacity: dark ? 1 : undefined
			},
			'&:hover $lastFullHash': {
				display: 'block',
				position: 'absolute !important',
				padding: '4px 4px',
				backgroundColor: dark ? '#5e558e' : '#000000',
				marginTop: -30,
				marginLeft: -415,
				borderRadius: 8,
				color: '#ffffff',
				opacity: dark ? 1 : undefined
			}
		},
		fullHash: {
			display: 'none'
		},
		lastFullHash: {
			display: 'none'
		},
		filter: {
			width: '100%',
			textAlign: 'center',
			margin: '0px !important'
		},
		filterButton: {
			opacity: 0.8,
			margin: 'auto',
			width: '100% !important',
			'margin-bottom': '4px'
		},
		searchButton: {
			opacity: 0.8,
			margin: 'auto',
			width: '100% !important',
			backgroundColor: dark ? undefined : '#086108',
			'margin-bottom': '4px'
		},
		filterElement: {
			textAlign: 'center',
			display: 'flex',
			padding: '0px !important',
			'& > div': {
				width: '100% !important',
				marginTop: 20
			},
			'& .label': {
				margin: '25px 10px 0px 10px'
			}
		}
	};
};

export class Blocks extends Component {
	constructor(props) {
		super(props);
		this.state = {
			dialogOpen: false,
			dialogOpenBlockHash: false,
			err: false,
			search: false,
			to: moment(),
			orgs: ['Org1MSP', 'Org2MSP'],
			options: [],
			filtered: [],
			sorted: [],
			from: moment('19991201', 'YYYYMMDD'),
			blockHash: {}
		};
	}

	componentDidMount() {
		console.log(new Date(this.state.from).toString());
		const { blockList } = this.props;
		const selection = {};
		blockList.forEach(element => {
			selection[element.blocknum] = false;
		});
		const opts = [];
		this.props.transactionByOrg.forEach(val => {
			opts.push({ label: val.creator_msp_id, value: val.creator_msp_id });
		});
		this.setState({ selection, options: opts });
	}

	componentWillReceiveProps(nextProps) {
		if (
			this.state.search &&
			nextProps.currentChannel !== this.props.currentChannel
		) {
			if (this.interval !== undefined) {
				clearInterval(this.interval);
			}
			this.interval = setInterval(() => {
				this.searchBlockList(nextProps.currentChannel);
			}, 60000);
			this.searchBlockList(nextProps.currentChannel);
		}
	}

	componentWillUnmount() {
		clearInterval(this.interVal);
	}

	handleCustomRender(selected, options) {
		if (selected.length === 0) {
			return 'Select Orgs';
		}
		if (selected.length === options.length) {
			return 'All Orgs Selected';
		}

		return selected.join(',');
	}

	// searchBlockList = async channel => {
	// 	let query = `from=${new Date(this.state.from).toString()}&&to=${new Date(
	// 		this.state.to
	// 	).toString()}`;
	// 	for (let i = 0; i < this.state.orgs.length; i++) {
	// 		query += `&&orgs=${this.state.orgs[i]}`;
	// 	}
	// 	let channelhash = "fdfd720dc97577884b7d9fc7a5a347da6e61f7a5f80f9f6a6be982764554a884";
	// 	console.log(query)
	// 	await this.props.getBlockListSearch(channelhash, query);
	// };

	handleDialogOpen = async tid => {
		const { getTransaction, currentChannel } = this.props;
		await getTransaction(currentChannel, tid);
		this.setState({ dialogOpen: true });
	};

	handleMultiSelect = value => {
		this.setState({ orgs: value });
	};

	handleDialogClose = () => {
		this.setState({ dialogOpen: false });
	};

	handleSearch = async () => {
		if (this.interval !== undefined) {
			clearInterval(this.interval);
		}
		this.interval = setInterval(() => {
			this.searchBlockList();
		}, 600);
		await this.searchBlockList();
		this.setState({ search: true });
	};

	handleClearSearch = () => {
		if (this.interval !== undefined) {
			clearInterval(this.interval);
		}
		this.setState({
			search: false,
			to: moment(),
			orgs: ['Org1MSP', 'Org2MSP'],
			err: false,
			from: moment('19991201', 'YYYYMMDD')
		});
	};

	handleDialogOpenBlockHash = blockHash => {
		const blockList = this.state.search
			? this.props.blockListSearch
			: this.props.blockList;
		const data = find(blockList, item => item.blockhash === blockHash);

		this.setState({
			dialogOpenBlockHash: true,
			blockHash: data
		});
	};

	handleDialogCloseBlockHash = () => {
		this.setState({ dialogOpenBlockHash: false });
	};

	handleEye = (row, val) => {
		const { selection } = this.state;
		const data = Object.assign({}, selection, { [row.index]: !val });
		this.setState({ selection: data });
	};

	reactTableSetup = classes => [
		{
			Header: 'Block Number',
			accessor: 'blocknum',
			filterMethod: (filter, rows) =>
				matchSorter(
					rows,
					filter.value,
					{ keys: ['blocknum'] },
					{ threshold: matchSorter.rankings.SIMPLEMATCH }
				),
			filterAll: true,
			width: 150
		},
		{
			Header: 'Number of Tx',
			accessor: 'txcount',
			filterMethod: (filter, rows) =>
				matchSorter(
					rows,
					filter.value,
					{ keys: ['txcount'] },
					{ threshold: matchSorter.rankings.SIMPLEMATCH }
				),
			filterAll: true,
			width: 150
		},
		{
			Header: 'Data Hash',
			accessor: 'datahash',
			className: classes.hash,
			Cell: row => (
				<span>
					<ul className={classes.partialHash} href="#/blocks">
						<div className={classes.fullHash} id="showTransactionId">
							{row.value}
						</div>{' '}
						{row.value.slice(0, 20)} {!row.value ? '' : '... '}
					</ul>{' '}
				</span>
			),
			filterMethod: (filter, rows) =>
				matchSorter(
					rows,
					filter.value,
					{ keys: ['datahash'] },
					{ threshold: matchSorter.rankings.SIMPLEMATCH }
				),
			filterAll: true
		},
		{
			Header: 'Block Hash',
			accessor: 'blockhash',
			className: classes.hash,
			Cell: row => (
				<span>
					<a
						data-command="block-partial-hash"
						className={classes.partialHash}
						onClick={() => this.handleDialogOpenBlockHash(row.value)}
						href="#/blocks"
					>
						<div className={classes.fullHash} id="showTransactionId">
							{row.value}
						</div>{' '}
						{row.value.slice(0, 20)} {!row.value ? '' : '... '}
					</a>{' '}
				</span>
			),
			filterMethod: (filter, rows) =>
				matchSorter(
					rows,
					filter.value,
					{ keys: ['blockhash'] },
					{ threshold: matchSorter.rankings.SIMPLEMATCH }
				),
			filterAll: true
		},
		{
			Header: 'Previous Hash',
			accessor: 'prehash',
			className: classes.hash,
			Cell: row => (
				<span>
					<ul
						className={classes.partialHash}
						onClick={() => this.handleDialogOpenBlockHash(row.value)}
						href="#/blocks"
					>
						<div className={classes.fullHash} id="showTransactionId">
							{row.value}
						</div>{' '}
						{row.value.slice(0, 10)} {!row.value ? '' : '... '}
					</ul>{' '}
				</span>
			),
			filterMethod: (filter, rows) =>
				matchSorter(
					rows,
					filter.value,
					{ keys: ['prehash'] },
					{ threshold: matchSorter.rankings.SIMPLEMATCH }
				),
			filterAll: true,
			width: 150
		},
		{
			Header: 'Transactions',
			accessor: 'txhash',
			className: classes.hash,
			Cell: row => (
				<ul>
					{!isNull(row.value)
						? row.value.map(tid => (
								<li
									key={tid}
									style={{
										overflow: 'hidden',
										whiteSpace: 'nowrap',
										textOverflow: 'ellipsis'
									}}
								>
									<a
										className={classes.partialHash}
										onClick={() => this.handleDialogOpen(tid)}
										href="#/blocks"
									>
										<div className={classes.lastFullHash} id="showTransactionId">
											{tid}
										</div>{' '}
										{tid.slice(0, 20)} {!tid ? '' : '... '}
									</a>
								</li>
						  ))
						: 'null'}
				</ul>
			),
			filterMethod: (filter, rows) =>
				matchSorter(
					rows,
					filter.value,
					{ keys: ['txhash'] },
					{ threshold: matchSorter.rankings.SIMPLEMATCH }
				),
			filterAll: true
		},
		{
			Header: 'Size(KB)',
			accessor: 'blksize',
			filterMethod: (filter, rows) =>
				matchSorter(
					rows,
					filter.value,
					{ keys: ['blksize'] },
					{ threshold: matchSorter.rankings.SIMPLEMATCH }
				),
			filterAll: true,
			width: 150
		}
	];

	render() {
		const blockList = this.state.search
			? this.props.blockListSearch
			: this.props.blockList;
		const { transaction, classes } = this.props;
		const { blockHash, dialogOpen, dialogOpenBlockHash } = this.state;
		return (
			<div>
				<ReactTable
					data={blockList}
					columns={this.reactTableSetup(classes)}
					defaultPageSize={10}
					list
					filterable
					sorted={this.state.sorted}
					onSortedChange={sorted => {
						this.setState({ sorted });
					}}
					filtered={this.state.filtered}
					onFilteredChange={filtered => {
						this.setState({ filtered });
					}}
					minRows={0}
					style={{ height: '750px' }}
					showPagination={blockList.length >= 5}
				/>

				<Dialog
					open={dialogOpen}
					onClose={this.handleDialogClose}
					fullWidth
					maxWidth="md"
				>
					<TransactionView
						transaction={transaction}
						onClose={this.handleDialogClose}
					/>
				</Dialog>

				<Dialog
					open={dialogOpenBlockHash}
					onClose={this.handleDialogCloseBlockHash}
					fullWidth
					maxWidth="md"
				>
					<BlockView
						blockHash={blockHash}
						onClose={this.handleDialogCloseBlockHash}
					/>
				</Dialog>
			</div>
		);
	}
}

Blocks.propTypes = {
	blockList: blockListType.isRequired,
	currentChannel: currentChannelType.isRequired,
	getTransaction: getTransactionType.isRequired,
	transaction: transactionType
};

Blocks.defaultProps = {
	transaction: null
};

export default withStyles(styles)(Blocks);
