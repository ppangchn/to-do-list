import gql from 'graphql-tag';

export const CREATE_TODOLIST_ITEM_BY_USER = gql`
	mutation createTodoListItemByUser($data: TodoListItemCreateInput!, $userId: ID!) {
		createTodoListItemByUser(data: $data, userId: $userId) {
			id
		}
	}
`;
