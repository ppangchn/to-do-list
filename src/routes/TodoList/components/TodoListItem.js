import React from 'react';
import { List, Checkbox, Button } from 'antd';
import styled from 'styled-components';
import PropTypes from 'prop-types';
import InputText from './InputText';

const Item = styled.div`
	display: flex;
	margin: 0 20px;
`;

const TodoListItem = ({ item, index, handleComplete, handleChange, handleAddItem }) => {
	return (
		<List.Item>
			<Item id={`todo-list-item-${index}`}>
				<Checkbox checked={item.isCompleted} onChange={() => handleComplete(index)} />
				<InputText
					index={index}
					value={item.description}
					onChange={e => handleChange(e, index)}
				/>
			</Item>
			<Button onClick={() => handleAddItem(item)}>Save</Button>
		</List.Item>
	);
};

TodoListItem.propTypes = {
	item: PropTypes.object,
	index: PropTypes.number,
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
