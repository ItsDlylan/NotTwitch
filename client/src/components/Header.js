import React from 'react';
import { Link } from 'react-router-dom';
import UserAuth from './UserAuth';
import SignUp from './SignUp';

const Header = () => {
	return (
		<div
			className='ui secondary  pointing menu'
			style={{ marginTop: '1rem' }}
		>
			<Link to='/' className='item'>
				<img
					style={{ width: '17rem' }}
					src='https://fontmeme.com/permalink/211102/8d34cff348033bdb84cda8eeefaf6145.png'
					alt='Nottwitch-logo-font'
					border='0'
				/>
			</Link>
			<div className='right menu' style={{ alignItems: 'center' }}>
				<UserAuth />
				<SignUp />
			</div>
		</div>
	);
};

export default Header;
