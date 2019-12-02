import React from 'react';
import { List, Checkbox, Button } from 'antd';
import styled from 'styled-components';
import PropTypes from 'prop-types';
import InputText from './InputText';

const Item = styled.div`
	display: flex;
	margin: 0 20px;
`;

const TodoListItem = ({ item, index, length, handleComplete, handleChange, handleAddItem }) => (
	<List.Item>
		<Item id={`todo-list-item-${index}`}>
			<Checkbox checked={item.isCompleted} onChange={() => handleComplete(index)} />
			<InputText
				index={index}
				showInput={index === length - 1 || length === 1}
				value={item.description}
				onChange={e => handleChange(e, index)}
			/>
		</Item>
		{(index === length - 1 || length === 1) && (
			<Button onClick={() => handleAddItem(item)}>Save</Button>
		)}
	</List.Item>
);

TodoListItem.propTypes = {
	item: PropTypes.object,
	index: PropTypes.number,
	length: PropTypes.number,
	handleComplete: PropTypes.func,
	handleChange: PropTypes.func,
	handleAddItem: PropTypes.func,
};

TodoListItem.defaultProps = {
	handleComplete: () => {},
	handleChange: () => {},
	handleAddItem: () => {},
};

export default TodoListItem;
