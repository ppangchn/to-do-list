import React, { useEffect } from 'react';
import { Input } from 'antd';
import styled from 'styled-components';
import PropTypes from 'prop-types';
import * as PIXI from 'pixi.js';

const StyledInputText = styled(Input)`
	margin-left: 10px;
	border: none !important;
	outline: none !important;
	padding: 0 5px;
`;

const InputText = ({ index, value, onChange }) => {
	const app = new PIXI.Application({ width: 80, height: 20, backgroundColor: 0xffffff });
	const style = new PIXI.TextStyle({
		fontFamily: 'Arial',
		fontSize: 16,
		fill: ['#003EA8', '#005BF6'], // gradient
		stroke: '#000000',
		strokeThickness: 2,
		wordWrap: true,
		wordWrapWidth: 440,
	});

	useEffect(() => {
		const input = document.getElementById(`todo-list-item-${index}`).childNodes[1];
		console.log('input', input);
		if (input) console.log('parent', input.parentNode);
		if (input) input.parentNode.replaceChild(app.view, input);
	});

	const basicText = new PIXI.Text(value, style);
	basicText.x = 8;
	basicText.y = 1;

	app.stage.addChild(basicText);

	return <StyledInputText id={`input-text-${index}`} value={value} onChange={onChange} />;
};

InputText.propTypes = {
	index: PropTypes.number,
	value: PropTypes.string,
	onChange: PropTypes.func,
};

InputText.defaultProps = { onChange: () => {} };

export default InputText;
