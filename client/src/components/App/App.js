/**
 *    SPDX-License-Identifier: Apache-2.0
 */

import React, { Component } from 'react';
import compose from 'recompose/compose';
import { connect } from 'react-redux';
import { withStyles } from '@material-ui/core/styles';
import { HashRouter as Router, Route, Switch } from 'react-router-dom';
import classnames from 'classnames';
import Main from '../Main';
import Header from '../Header';

import LandingPage from '../View/LandingPage';
import ErrorMessage from '../ErrorMessage';
import { chartSelectors } from '../../state/redux/charts';
import { themeSelectors, themeActions } from '../../state/redux/theme';
import { authSelectors } from '../../state/redux/auth';

import Login from '../Login';

/* istanbul ignore next */
const styles = () => {
	return {
		app: {
			backgroundColor: '#f5f7fd',

			position: 'absolute',
			top: 0,
			left: 0,
			bottom: 0,
			right: 0,
			'& ol, & ul': {
				listStyle: 'none'
			}
		}
	};
};

export class App extends Component {
	constructor(props) {
		super(props);
		this.state = {
			loading: true
		};
	}

	/* istanbul ignore next */
	updateLoadStatus = () => {
		this.setState({ loading: false });
	};

	/* istanbul ignore next */
	refreshComponent = mode => {
		this.props.changeTheme(mode);
	};

	/* istanbul ignore next */
	render() {
		const { auth } = this.props;
		const { loading } = this.state;
		if (auth && loading) {
			return <LandingPage updateLoadStatus={this.updateLoadStatus} />;
		}
		const { classes, mode, error } = this.props;
		const className = classnames(mode === 'dark' && 'dark-theme', classes.app);
		return (
			<div className={className}>
				<Header refresh={this.refreshComponent} />
				{error && <ErrorMessage message={error} />}
				<Router>
					<Switch>
						<Route
							exact
							path="/login"
							render={routeprops => <Login {...routeprops} />}
						/>
						<Route path="/" render={routeprops => <Main {...routeprops} />} />
					</Switch>
				</Router>
			</div>
		);
	}
}

const { modeSelector } = themeSelectors;
const { changeTheme } = themeActions;
const { errorMessageSelector } = chartSelectors;
const { authSelector } = authSelectors;

/* istanbul ignore next */
export default compose(
	withStyles(styles),
	connect(
		state => ({
			error: errorMessageSelector(state),
			mode: modeSelector(state),
			auth: authSelector(state)
		}),
		{ changeTheme }
	)
)(App);