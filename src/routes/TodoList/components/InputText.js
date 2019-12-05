import React, { useState, useEffect, Fragment } from 'react';
import { Input, Button } from 'antd';
import styled from 'styled-components';
import PropTypes from 'prop-types';
import { withRouter } from 'react-router-dom';
import { useMutation } from '@apollo/react-hooks';
import * as PIXI from 'pixi.js';
import { CREATE_TODOLIST_ITEM_BY_USER } from '../../../graphql/mutation/TodoList.mutation';
import { GET_USER_DETAIL } from '../../../graphql/query/User.query';

const StyledInputText = styled(Input)`
	margin-left: 10px;
	border: none !important;
	padding: 0 5px;
	:focus {
		box-shadow: none !important;
	}
`;

const InputText = ({ match, index, length, showInput, defaultValue }) => {
	const { id } = match.params;

	const [createTodoListItemByUser, { loading }] = useMutation(CREATE_TODOLIST_ITEM_BY_USER);

	const [value, setValue] = useState(defaultValue);

	useEffect(() => {
		const input = document.getElementById(`todo-list-item-${index}`).childNodes[1];
		if (input && !showInput) input.parentNode.replaceChild(app.view, input);
		addTextInput();
		addMouseTrail();
	});

	const app = new PIXI.Application({ width: 1500, height: 25, backgroundColor: 0xffffff });

	const addTextInput = () => {
		const style = new PIXI.TextStyle({
			fontFamily: 'Helvetica',
			fontSize: 16,
			fill: ['#003EA8', '#005BF6'],
			letterSpacing: 2,
		});
		const basicText = new PIXI.Text(value, style);
		basicText.x = 8;
		basicText.y = 1;

		app.stage.addChild(basicText);
	};

	const addMouseTrail = () => {
		// Get the texture for rope.
		const trailTexture = PIXI.Texture.from('/snake.png');
		const historyX = [];
		const historyY = [];
		// historySize determines how long the trail will be.
		const historySize = 20;
		// ropeSize determines how smooth the trail will be.
		const ropeSize = 200;
		const points = [];

		// Create history array.
		for (let i = 0; i < historySize; i++) {
			historyX.push(0);
			historyY.push(0);
		}
		// Create rope points.
		for (let i = 0; i < ropeSize; i++) {
			points.push(new PIXI.Point(0, 0));
		}

		// Create the rope
		const rope = new PIXI.SimpleRope(trailTexture, points);

		// Set the blendmode
		rope.blendmode = PIXI.BLEND_MODES.ADD;

		app.stage.addChild(rope);

		// Listen for animate update
		app.ticker.add(delta => {
			// Read mouse points, this could be done also in mousemove/touchmove update. For simplicity it is done here for now.
			// When implementing this properly, make sure to implement touchmove as interaction plugins mouse might not update on certain devices.
			const mouseposition = app.renderer.plugins.interaction.mouse.global;

			// Update the mouse values to history
			historyX.pop();
			historyX.unshift(mouseposition.x);
			historyY.pop();
			historyY.unshift(mouseposition.y);
			// Update the points to correspond with history.
			for (let i = 0; i < ropeSize; i++) {
				const p = points[i];

				// Smooth the curve with cubic interpolation to prevent sharp edges.
				const ix = cubicInterpolation(historyX, (i / ropeSize) * historySize);
				const iy = cubicInterpolation(historyY, (i / ropeSize) * historySize);

				p.x = ix;
				p.y = iy;
			}
		});
	};

	const clipInput = (k, arr) => {
		if (k < 0) k = 0;
		if (k > arr.length - 1) k = arr.length - 1;
		return arr[k];
	};

	const getTangent = (k, factor, array) => {
		return (factor * (clipInput(k + 1, array) - clipInput(k - 1, array))) / 2;
	};

	const cubicInterpolation = (array, t, tangentFactor) => {
		if (tangentFactor == null) tangentFactor = 1;

		const k = Math.floor(t);
		const m = [getTangent(k, tangentFactor, array), getTangent(k + 1, tangentFactor, array)];
		const p = [clipInput(k, array), clipInput(k + 1, array)];
		t -= k;
		const t2 = t * t;
		const t3 = t * t2;
		return (
			(2 * t3 - 3 * t2 + 1) * p[0] +
			(t3 - 2 * t2 + t) * m[0] +
			(-2 * t3 + 3 * t2) * p[1] +
			(t3 - t2) * m[1]
		);
	};

	const handleChange = e => {
		setValue(e.target.value);
	};

	const handleAddItem = async () => {
		try {
			await createTodoListItemByUser({
				variables: { data: { description: value, isCompleted: false }, userId: id },
				update(cache, { data: { createTodoListItemByUser } }) {
					// get old data
					const { user = {} } = cache.readQuery({
						query: GET_USER_DETAIL,
						variables: { where: { id } },
					});
					const { todoList = [] } = user;

					// create new data
					const newTodoItem = {
						id: createTodoListItemByUser.id,
						description: value,
						isCompleted: false,
					};
					const newTodoList = [...todoList, newTodoItem];
					user['todoList'] = newTodoList;
					cache.writeQuery({
						query: GET_USER_DETAIL,
						data: { user },
					});
				},
			});
		} catch (error) {
			console.log(error);
		}
	};

	return (
		<Fragment>
			<StyledInputText id={`input-text-${index}`} value={value} onChange={handleChange} />
			{(index === length - 1 || length === 1) && (
				<Button onClick={handleAddItem} loading={loading}>
					Save
				</Button>
			)}
		</Fragment>
	);
};

InputText.propTypes = {
	index: PropTypes.number,
	length: PropTypes.number,
	showInput: PropTypes.bool,
	defaultValue: PropTypes.string,
};

export default withRouter(InputText);
