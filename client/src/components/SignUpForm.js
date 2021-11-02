import React from 'react';
import { Link } from 'react-router-dom';
const SignInForm = ({
	username,
	setUsername,
	email,
	setEmail,
	password,
	setPassword,
	passwordConfirm,
	setPasswordConfirm,
	loading,
	doSignUp,
	toggle,
}) => {
	return (
		<form
			onSubmit={(e) => {
				e.preventDefault();
				doSignUp();
			}}
			className={`ui form ${loading}`}
		>
			<div className='field'>
				<label htmlFor='username'>Username:</label>
				<input
					id='username'
					placeholder='Username'
					type='text'
					value={username}
					onChange={(e) => setUsername(e.target.value)}
				/>
			</div>
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
			<div className='field'>
				<label htmlFor='passwordConfirm'>Cofirm your password:</label>

				<input
					id='passwordConfirm'
					type='password'
					placeholder='Confirm your password'
					value={passwordConfirm}
					onChange={(e) => setPasswordConfirm(e.target.value)}
				/>
			</div>
			<p>
				By Signing up you accept all the Terms and Conditions.{' '}
				<span style={{ fontSize: '6px', display: 'inline-block' }}>
					They dont exist :)
				</span>
			</p>
			<div className='ui right floated'>
				<button className='ui button right positive' type='submit'>
					Sign Up!
				</button>
				<button className='ui button' onClick={toggle} type='button'>
					Cancel
				</button>
			</div>
		</form>
	);
};

export default SignInForm;
