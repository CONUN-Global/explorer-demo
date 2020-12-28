/**
 *    SPDX-License-Identifier: Apache-2.0
 */

import React from 'react';
import View from '../Styled/View';

import TitleBar from '../TitleBar/TitleBar';

import Chaincodes from '../Lists/Chaincodes';
import { chaincodeListType } from '../types';

export const ChaincodeView = ({ chaincodeList }) => (
	<>
		<TitleBar titleString="CHAINCODES" />
		<View>
			<Chaincodes chaincodeList={chaincodeList} />
		</View>
	</>
);

ChaincodeView.propTypes = {
	chaincodeList: chaincodeListType.isRequired
};

export default ChaincodeView;
