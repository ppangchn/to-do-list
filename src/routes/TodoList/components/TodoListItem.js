import React from 'react';
import { List, Checkbox as ACheckbox } from 'antd';
import styled from 'styled-components';
import PropTypes from 'prop-types';
import InputText from './InputText';

const Item = styled.div`
	display: flex;
	margin: 0 20px;
`;

const Checkbox = styled(ACheckbox)`
	display: flex !important;
	align-items: center !important;
`;

const TodoListItem = ({ item, index, length }) => {
	const handleComplete = index => {};

	return (
		<List.Item>
			<Item id={`todo-list-item-${index}`}>
				<Checkbox checked={item.isCompleted} onChange={handleComplete} />
				<InputText
					index={index}
					length={length}
					showInput={index === length - 1 || length === 1}
					defaultValue={item.description}
				/>
			</Item>
		</List.Item>
	);
};

TodoListItem.propTypes = {
	item: PropTypes.object,
	index: PropTypes.number,
	length: PropTypes.number,
};

export default TodoListItem;
