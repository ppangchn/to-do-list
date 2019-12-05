import React, { Fragment, useState } from 'react';
import { List, message, Button, Spin, Icon } from 'antd';
import { withRouter } from 'react-router-dom';
import styled from 'styled-components';
import { useQuery } from '@apollo/react-hooks';
import _ from 'lodash';
import Menu from '../../components/Menu';
import { GET_USER_DETAIL } from '../../graphql/query/User.query';
import TodoListItem from './components/TodoListItem';

const Container = styled.div`
	margin: 20px 20px;
`;

const Title = styled.div`
	font-size: 30px;
	font-weight: bold;
	text-align: center;
`;

const Username = styled.div`
	display: flex;
	align-items: center;
	font-size: 17px;
	padding: 0 30px;
`;

const Navbar = styled.div`
	display: flex;
	justify-content: flex-end;
	padding: 0 30px;
`;

const HeartSvg = () => (
	<svg width="1em" height="1em" fill="currentColor" viewBox="0 0 1024 1024">
		<path d="M923 283.6c-13.4-31.1-32.6-58.9-56.9-82.8-24.3-23.8-52.5-42.4-84-55.5-32.5-13.5-66.9-20.3-102.4-20.3-49.3 0-97.4 13.5-139.2 39-10 6.1-19.5 12.8-28.5 20.1-9-7.3-18.5-14-28.5-20.1-41.8-25.5-89.9-39-139.2-39-35.5 0-69.9 6.8-102.4 20.3-31.4 13-59.7 31.7-84 55.5-24.4 23.9-43.5 51.7-56.9 82.8-13.9 32.3-21 66.6-21 101.9 0 33.3 6.8 68 20.3 103.3 11.3 29.5 27.5 60.1 48.2 91 32.8 48.9 77.9 99.9 133.9 151.6 92.8 85.7 184.7 144.9 188.6 147.3l23.7 15.2c10.5 6.7 24 6.7 34.5 0l23.7-15.2c3.9-2.5 95.7-61.6 188.6-147.3 56-51.7 101.1-102.7 133.9-151.6 20.7-30.9 37-61.5 48.2-91 13.5-35.3 20.3-70 20.3-103.3 0.1-35.3-7-69.6-20.9-101.9z" />
	</svg>
);

const HeartIcon = props => <Icon component={HeartSvg} {...props} />;

const TodoList = props => {
	const { id } = props.match.params;

	const { data = {}, loading: fetchUserLoading, error: fetchUserError } = useQuery(
		GET_USER_DETAIL,
		{
			variables: { where: { id } },
		}
	);

	const { user = {} } = data;

	if (!user) props.history.push('/');

	if (fetchUserError) {
		message.error(
			fetchUserError.graphQLErrors.map(({ message }, i) => <span key={i}>{message}</span>),
			3
		);
		props.history.push('/');
	}

	const [selectedMenuKey, setSelectedMenuKey] = useState(['all']);

	const handleSelect = e => {
		setSelectedMenuKey([e.key]);
	};


	return (
		<Container>
			<Navbar>
				<Username>
					{user.name ? (
						<Fragment>
							Hi, {user.name}
							<HeartIcon style={{ color: 'hotpink', paddingLeft: '10px' }} />
						</Fragment>
					) : (
						<Spin style={{ top: '4px', position: 'relative' }} />
					)}
				</Username>
				<Button
					type="danger"
					size="large"
					onClick={() => {
						props.history.push('/');
					}}
				>
					Log out
				</Button>
			</Navbar>
			<Title>My To do list</Title>
			<Menu
				selectedKeys={selectedMenuKey}
				menuItems={[
					{ key: 'all', title: 'All' },
					{ key: 'completed', title: 'Completed' },
				]}
				handleSelect={handleSelect}
			/>
			<Spin spinning={fetchUserLoading}>
				<List
					id="todo-list"
					dataSource={[
						..._.get(user, 'todoList', []),
						{ description: '', isCompleted: false },
					]}
					renderItem={(item, index) => (
						<TodoListItem
							index={index}
							item={item}
							length={user.todoList ? user.todoList.length + 1 : 1}
						/>
					)}
				/>
			</Spin>
		</Container>
	);
};

export default withRouter(TodoList);
