/**
 *    SPDX-License-Identifier: Apache-2.0
 */

import React from 'react';
import { withStyles } from '@material-ui/core/styles';
import clientJson from '../../../package.json';
import FabricVersion from '../../FabricVersion';

const styles = theme => {
	const { type } = theme.palette;
	const dark = type === 'dark';
	return {
		footer: {
			backgroundColor: '#004a99',
			color: '#ffffff',
			textAlign: 'center',
			paddingTop: 10,
			position: 'fixed',
			width: '100vw',
			height: 50,
			left: 0,
			right: 0,
			bottom: 0,

			display: 'flex',
			justifyContent: 'flex-end'
		},
		footerCell: {
			paddingRight: 20,
			paddingLeft: 20
		},
		footerLink: {
			textDecoration: 'none',
			color: '#fff'
		}
	};
};

const FooterView = ({ classes }) => (
	<div className={classes.root}>
		<div>
			{/* <div className={classes.footer}>
				<div className={classes.footerCell}>
				<a className={classes.footerLink} href="mailto:conuncs@conun.co.kr">conuncs@conun.co.kr</a>  /   1 Raffles Place #44-01A One Raffles Place Singapore
				</div>
				<div className={classes.footerCell}>
					ⓒ 2020 CONUN, All Rights Reserved
				</div>
			</div> */}
		</div>
	</div>
);

export default withStyles(styles)(FooterView);
