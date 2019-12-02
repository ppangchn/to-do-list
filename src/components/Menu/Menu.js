import React from 'react';
import { Menu as AMenu } from 'antd';
import PropTypes from 'prop-types';

const Menu = ({ selectedKeys, menuItems, handleSelect }) => {
	return (
		<AMenu onClick={handleSelect} selectedKeys={selectedKeys} mode="horizontal">
			{menuItems.map(item => (
				<AMenu.Item key={item.key}>{item.title}</AMenu.Item>
			))}
		</AMenu>
	);
};

Menu.propTypes = {
	selectedKeys: PropTypes.array,
	menuItems: PropTypes.array,
	handleSelect: PropTypes.func,
};

Menu.defaultProps = {
	handleSelect: () => {},
};

export default Menu;
