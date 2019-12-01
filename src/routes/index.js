import React from 'react';
import { BrowserRouter as Router, Switch, Route, Link } from 'react-router-dom';
import Login from './Login';
import Registration from './Registration';
import TodoList from './TodoList';

const Routes = () => (
	<Router>
		<Switch>
			<Route exact path="/">
				<Login />
			</Route>
			<Route path="/registration" components={Registration}>
				<Registration />
			</Route>
			<Route path="/todolist/:id" components={TodoList}>
				<TodoList />
			</Route>
		</Switch>
	</Router>
);

export default Routes;
