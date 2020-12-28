/**
 *    SPDX-License-Identifier: Apache-2.0
 */

import React, { Component } from 'react';

import compose from 'recompose/compose';
import { connect } from 'react-redux';

import { withStyles } from '@material-ui/core/styles';

import Paper from '@material-ui/core/Paper';

import { shape, string } from 'prop-types';

import { authSelectors, authOperations } from '../../state/redux/auth';

const styles = theme => ({
	container: {
		width: 'auto',
		display: 'block', // Fix IE 11 issue.
		marginLeft: theme.spacing.unit * 3,
		marginRight: theme.spacing.unit * 3,
		[theme.breakpoints.up(400 + theme.spacing.unit * 3 * 2)]: {
			width: 400,
			marginLeft: 'auto',
			marginRight: 'auto'
		}
	},
	paper: {
		marginTop: theme.spacing.unit * 8,
		display: 'flex',
		flexDirection: 'column',
		alignItems: 'center',
		padding: `${theme.spacing.unit * 2}px ${theme.spacing.unit * 3}px ${theme
			.spacing.unit * 3}px`
	},
	avatar: {
		margin: theme.spacing.unit,
		backgroundColor: theme.palette.secondary.main
	},
	form: {
		width: '100%', // Fix IE 11 issue.
		marginTop: theme.spacing.unit
	},
	submit: {
		marginTop: theme.spacing.unit * 3
	},
	errortext: {
		fontSize: 16,
		font: 'bold',
		color: 'red'
	}
});

export class Login extends Component {
	static propTypes = {
		classes: shape({
			avatar: string,
			form: string,
			container: string,
			paper: string,
			submit: string
		}).isRequired
	};

	constructor(props) {
		super(props);
		const { networks = [] } = props;
		this.state = {
			info: null,
			user: {
				error: null,
				value: ''
			},
			password: {
				error: null,
				value: ''
			},
			network: {
				error: null,
				value: 'My first network',
				id: 'first-network'
			},
			autoLoginAttempted: false,
			error: '',
			networks,
			authEnabled: false,
			isLoading: false
		};
	}

	componentWillReceiveProps(nextProps) {
		const { networks = [] } = nextProps;
		this.setState(() => ({
			networks,
			network: {
				error: null,
				value: networks[0].name || '',
				id: networks[0].id
			},
			authEnabled: networks[0].authEnabled
		}));
	}

	handleChange = event => {
		const { target } = event;
		const value = target.type === 'checkbox' ? target.checked : target.value;
		const { name } = target;

		const newState = {
			[name]: { value }
		};
		if (name === 'network') {
			const { networks } = this.state;
			console.log(networks);
			newState.authEnabled = (
				networks.find(n => n.name === value) || {}
			).authEnabled;
			newState.network.id = (networks.find(n => n.name === value) || {}).id;
		}

		this.setState(newState);
	};

	async performLogin({ user, password, network }) {
		const { login } = this.props;
		const { authEnabled } = this.state;

		const info = await login(
			{
				user: authEnabled ? user : 'dummy-user',
				password: authEnabled ? password : 'dummy-password'
			},
			network
		);

		this.setState(() => ({ info }));
		if (info.status === 'Success') {
			const { history } = this.props;
			history.replace('/');
			return true;
		}
	}
	doSelfLogin = async () => {
		const { user, password, network } = this.state;

		await this.performLogin({
			user: user.value,
			password: password.value,
			network: network.id
		});
	};

	submitForm = async e => {
		e.preventDefault();

		const { user, password, network } = this.state;

		await this.performLogin({
			user: user.value,
			password: password.value,
			network: network.id
		});
	};

	componentWillMount() {
		this.doSelfLogin();
	}

	async componentDidUpdate() {
		const { networks, autoLoginAttempted } = this.state;

		/*
		 * If we have only one network and it doesn't have auth enabled, perform a login
		 * autoLoginAttempted is a safety to prevent multiple tries
		 */
		if (
			networks.length === 1 &&
			!networks[0].authEnabled &&
			!autoLoginAttempted
		) {
			// eslint-disable-next-line react/no-did-update-set-state
			this.setState(() => ({
				autoLoginAttempted: true
			}));
			await this.performLogin({ network: networks[0].name });
		}
	}

	render() {
		const { classes } = this.props;

		return (
			<div className={classes.container}>
				<Paper className={classes.paper}>
					<div>You have been automatically signed in...</div>
				</Paper>
			</div>
		);
	}
}

const { authSelector, errorSelector, networkSelector } = authSelectors;

export default compose(
	withStyles(styles),
	connect(
		state => ({
			auth: authSelector(state),
			error: errorSelector(state),
			networks: networkSelector(state)
		}),
		{
			login: authOperations.login
		}
	)
)(Login);
