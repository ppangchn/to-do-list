import React from 'react';
import { Form as AForm, Icon, Input, Button, Checkbox } from 'antd';
import styled from 'styled-components';
import { withRouter } from 'react-router-dom';
import { LOGIN } from '../../graphql/mutation/User.mutation';
import { useMutation } from '@apollo/react-hooks';

const Container = styled.div`
	display: flex;
	flex-direction: column;
	height: 100vh;
	justify-content: center;
	align-items: center;
`;

const Form = styled(AForm)`
	max-width: 300px;
`;

const Title = styled.div`
	font-size: 50px;
	margin: 50px 0;
`;

const Login = props => {
	const [login, { loading }] = useMutation(LOGIN);
	const handleSubmit = e => {
		e.preventDefault();
		props.form.validateFields(async (err, values) => {
			if (!err) {
				const user = await login({ variables: { ...values } });
				if (user) {
					console.log('user', user);
					const { id } = user.data.login;
					props.history.push(`/todolist/${id}`);
				}
			}
		});
	};

	const { getFieldDecorator } = props.form;
	return (
		<Container>
			<Title>To do list</Title>
			<Form onSubmit={handleSubmit}>
				<Form.Item>
					{getFieldDecorator('username', {
						rules: [{ required: true, message: 'Please input your username!' }],
					})(
						<Input
							prefix={<Icon type="user" style={{ color: 'rgba(0,0,0,.25)' }} />}
							placeholder="Username"
						/>
					)}
				</Form.Item>
				<Form.Item>
					{getFieldDecorator('password', {
						rules: [{ required: true, message: 'Please input your Password!' }],
					})(
						<Input
							prefix={<Icon type="lock" style={{ color: 'rgba(0,0,0,.25)' }} />}
							type="password"
							placeholder="Password"
						/>
					)}
				</Form.Item>
				<Form.Item>
					<a href="" style={{ float: 'right' }}>
						Forgot password
					</a>
					<Button type="primary" htmlType="submit" block loading={loading}>
						Log in
					</Button>
					Or <a href="/registration">Register now!</a>
				</Form.Item>
			</Form>
		</Container>
	);
};

const WrappedLogin = Form.create({ name: 'login' })(Login);

export default withRouter(WrappedLogin);
