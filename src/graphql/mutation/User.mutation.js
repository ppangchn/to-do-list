import gql from 'graphql-tag';

export const LOGIN = gql`
	mutation login($username: String!, $password: String!) {
		login(username: $username, password: $password) {
			id
		}
	}
`;

export const CREATE_USER = gql`
	mutation createUser($data: UserCreateInput!) {
		createUser(data: $data) {
			id
		}
	}
`;
