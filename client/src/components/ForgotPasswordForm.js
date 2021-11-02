import React, { useState } from 'react';
import users from '../apis/users';
import { toast } from 'react-toastify';
const ForgotPasswordForm = () => {
	const [email, setEmail] = useState('');
	const onSubmit = async (e, formValues) => {
		e.preventDefault();
		console.log(email);

		try {
			let obj = {
				email,
			};
			const sentPassword = await users.post(
				'/api/v1/users/forgotPassword',
				obj,
			);

			toast.success(`SUCCESS: ${sentPassword.data.message}`);
		} catch (err) {
			toast.error(`ERROR: Check your email address and try again!`);
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
					Reset Password!
				</button>
			</form>
		</div>
	);
};

export default ForgotPasswordForm;
