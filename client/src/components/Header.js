import React from 'react';
import { Link } from 'react-router-dom';
import UserAuth from './UserAuth';

const Header = () => {
	return (
		<div className='ui secondary  pointing menu'>
			<Link to='/' className='item'>
				NotTwitch
			</Link>
			<div className='right menu'>
				<UserAuth />
			</div>
		</div>
	);
};

export default Header;
