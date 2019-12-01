import React from 'react';
import { Form as AForm, Input, Button, message } from 'antd';
import styled from 'styled-components';
import { withRouter } from 'react-router-dom';
import { CREATE_USER } from '../../graphql/mutation/User.mutation';
import { useMutation } from '@apollo/react-hooks';

const Container = styled.div`
	display: flex;
	flex-direction: column;
	height: 100vh;
	align-items: center;
	/* margin: 30px 200px; */
`;

const Form = styled(AForm)`
	width: 300px;
`;

const Title = styled.div`
	font-size: 50px;
	margin: 50px 0;
`;

const Flex = styled.div`
	display: flex;
	justify-content: space-between;
`;

const ConfirmButton = styled(Button)`
	margin-left: 20px;
`;

const Registration = props => {
	const [createUser, { loading }] = useMutation(CREATE_USER);
	const handleSubmit = e => {
		e.preventDefault();
		props.form.validateFields(async (err, values) => {
			if (!err) {
				const { name, username, password } = values;
				try {
					const user = await createUser({
						variables: { data: { name, username, password } },
					});
					if (user) props.history.push('/');
				} catch (error) {
					message.error(`${error}`);
				}
			}
		});
	};

	const compareToFirstPassword = (rule, value, callback) => {
		const { form } = props;
		if (value && value !== form.getFieldValue('password')) {
			callback('Two passwords that you enter is inconsistent!');
		} else {
			callback();
		}
	};

	const { getFieldDecorator } = props.form;
	return (
		<Container>
			<Title>Create an account</Title>
			<Form onSubmit={handleSubmit}>
				<Form.Item label="Name">
					{getFieldDecorator('name', {
						rules: [{ required: true, message: 'Please input your username!' }],
					})(<Input placeholder="Name" />)}
				</Form.Item>
				<Form.Item label="Username">
					{getFieldDecorator('username', {
						rules: [{ required: true, message: 'Please input your username!' }],
					})(<Input placeholder="Username" />)}
				</Form.Item>
				<Form.Item label="Password">
					{getFieldDecorator('password', {
						rules: [{ required: true, message: 'Please input your Password!' }],
					})(<Input.Password placeholder="Password" />)}
				</Form.Item>
				<Form.Item label="Confirm Password" hasFeedback>
					{getFieldDecorator('confirm', {
						rules: [
							{
								required: true,
								message: 'Please confirm your password!',
							},
							{
								validator: compareToFirstPassword,
							},
						],
					})(<Input.Password placeholder="Confirm Password" />)}
				</Form.Item>
				<Flex>
					<Button type="danger" block onClick={() => props.history.push('/')}>
						Cancel
					</Button>
					<ConfirmButton type="primary" htmlType="submit" block loading={loading}>
						Register
					</ConfirmButton>
				</Flex>
			</Form>
		</Container>
	);
};

const WrappedRegistration = Form.create({ name: 'registration' })(Registration);

export default withRouter(WrappedRegistration);
