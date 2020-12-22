import React from 'react';

export default function TitleBar(props) {
	const style = {
		backgroundColor: '#f5f7fd',
		width: '100%',
		marginTop: 100,
		marginBottom: 15,
		display: 'flex',
		justifyContent: 'center',
		alignItems: 'center',
		textAlign: 'center'
	};

	return (
		<div style={{ ...style }}>
			<h1>{props.titleString}</h1>
		</div>
	);
}
