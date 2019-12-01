import React, { useState, useEffect } from 'react';
import { List, Checkbox, Button } from 'antd';
import { withRouter } from 'react-router-dom';
import styled from 'styled-components';
import { useQuery, useMutation } from '@apollo/react-hooks';
import Menu from '../../components/Menu';
import { GET_USER_DETAIL } from '../../graphql/query/User.query';
import { CREATE_TODOLIST_ITEM_BY_USER } from '../../graphql/mutation/TodoList.mutation';
import TodoListItem from './components/TodoListItem';

const Container = styled.div`
	margin: 20px 20px;
`;
const Title = styled.div`
	font-size: 30px;
	font-weight: bold;
	text-align: center;
`;

const TodoList = props => {
	const { id } = props.match.params;

	const { data = {}, loading: fetchUserLoading } = useQuery(GET_USER_DETAIL, {
		variables: { where: { id } },
	});
	const [createTodoListItemByUser, { loading }] = useMutation(CREATE_TODOLIST_ITEM_BY_USER);

	const { user = {} } = data;

	console.log('user', user);

	const [todoList, setTodoList] = useState([{ description: '', isCompleted: false }]);
	const [selectedMenuKey, setSelectedMenuKey] = useState(['all']);

	useEffect(() => {
		const todoList = user.todoList ? user.todoList : [{ description: '', isCompleted: false }];
		todoList.push({ description: '', isCompleted: false });
		setTodoList(todoList);
	}, [fetchUserLoading]);

	const handleAddItem = async item => {
		try {
			await createTodoListItemByUser({ variables: { data: { ...item }, userId: user.id } });
			const changedTodoList = new Array(...todoList);
			changedTodoList.push({ description: '', isCompleted: false });
			setTodoList(changedTodoList);
		} catch (error) {
			console.log(error);
		}
	};

	const handleChange = (e, index) => {
		const description = e.target.value;
		const changedItem = todoList.filter((todoItem, i) => i === index)[0];
		const result = { ...changedItem, description };
		const changedTodoList = new Array(...todoList);
		changedTodoList[index] = result;
		setTodoList(changedTodoList);
	};

	const handleSelect = e => {
		setSelectedMenuKey([e.key]);
	};

	const handleComplete = index => {
		const { isCompleted } = todoList[index];
		const changedItem = todoList.filter((todoItem, i) => i === index)[0];
		const result = { ...changedItem, isCompleted: !isCompleted };
		const changedTodoList = new Array(todoList);
		changedTodoList[index] = result;
		setTodoList(changedTodoList);
	};

	return (
		<Container>
			<Title>My To do list</Title>
			<Menu
				selectedKeys={selectedMenuKey}
				menuItems={[
					{ key: 'all', title: 'All' },
					{ key: 'completed', title: 'Completed' },
				]}
				handleSelect={handleSelect}
			/>
			<List
				id="todo-list"
				dataSource={todoList}
				renderItem={(item, index) => (
					<TodoListItem
						index={index}
						item={item}
						handleComplete={handleComplete}
						handleChange={handleChange}
						handleAddItem={handleAddItem}
					/>
				)}
				pagination={{ hideOnSinglePage: true }}
			/>
		</Container>
	);
};

export default withRouter(TodoList);
