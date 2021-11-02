import React from 'react';
import { Link } from 'react-router-dom';
const SignInForm = ({
	email,
	setEmail,
	password,
	setPassword,
	loading,
	doSignIn,
	toggle,
}) => {
	return (
		<form
			onSubmit={(e) => {
				e.preventDefault();
				doSignIn();
			}}
			className={`ui form ${loading}`}
		>
			<div className='field'>
				<label htmlFor='email'>Email:</label>
				<input
					id='email'
					placeholder='Email'
					type='text'
					value={email}
					onChange={(e) => setEmail(e.target.value)}
				/>
			</div>
			<div className='field'>
				<label htmlFor='password'>Password:</label>

				<input
					id='password'
					type='password'
					placeholder='Password'
					value={password}
					onChange={(e) => setPassword(e.target.value)}
				/>
			</div>
			<div className='ui right floated'>
				<button className='ui button right positive' type='submit'>
					Sign In
				</button>
				<button className='ui button' onClick={toggle} type='button'>
					Cancel
				</button>
				<Link
					to='/users/forgotPassword'
					onClick={toggle}
					className='forgotPass'
				>
					Forgot Password?
				</Link>
			</div>
		</form>
	);
};

export default SignInForm;
