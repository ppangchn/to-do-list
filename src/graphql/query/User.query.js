import gql from 'graphql-tag';

export const GET_USER_DETAIL = gql`
	query user($where: UserWhereUniqueInput!) {
		user(where: $where) {
			id
			name
			username
			password
			todoList {
				id
				description
				isCompleted
			}
		}
	}
`;
