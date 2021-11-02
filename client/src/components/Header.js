import React from 'react';
import { Link } from 'react-router-dom';
import UserAuth from './UserAuth';
import SignUp from './SignUp';

const Header = () => {
	return (
		<div className='ui secondary  pointing menu'>
			<Link to='/' className='item'>
				<img
					style={{ width: '7rem' }}
					src='https://fontmeme.com/permalink/211102/8d34cff348033bdb84cda8eeefaf6145.png'
					alt='Nottwitch-logo-font'
					border='0'
				/>
			</Link>
			<div className='right menu'>
				<UserAuth />
				<SignUp />
			</div>
		</div>
	);
};

export default Header;
