import React, { useState } from 'react';
import users from '../apis/users';
const ForgotPasswordForm = () => {
	const [email, setEmail] = useState('');
	const onSubmit = async (e, formValues) => {
		e.preventDefault();
		console.log(email);
		let obj = {
			email,
		};
		try {
			const sentPassword = await users.post(
				'/api/v1/users/forgotPassword',
				obj,
			);
			console.log(sentPassword);
		} catch (err) {
			console.log(err.response.data.message);
		}

		// api/v1/users/forgotPassword
	};
	return (
		<div>
			<h3>Forgot your password? Enter your Email Address to reset it!</h3>
			<form className='ui form' onSubmit={(e) => onSubmit(e)}>
				<div className='field'>
					<input
						className='ui large icon input'
						type='email'
						style={{ width: '30%' }}
						onChange={(e) => setEmail(e.target.value)}
						placeholder='email'
					></input>
				</div>

				<button className='ui button tiny positive' type='submit'>
					Sign In
				</button>
			</form>
		</div>
	);
};

export default ForgotPasswordForm;
