import React from 'react';
import { connect } from 'react-redux';
import { signIn, signUp } from '../actions';
import Modal from './Modal';
import SignUpForm from './SignUpForm';
import { toast } from 'react-toastify';

class SignUp extends React.Component {
	constructor(props) {
		super(props);
		this.state = {
			modal: false,
			modalClasses: '',
			username: '',
			email: '',
			password: '',
			passwordConfirm: '',
			isLoading: '',
		};
	}

	// Toggles Modal Classes.
	toggle = () => {
		if (this.state.modal === false) {
			this.setState({ modalClasses: 'active visible' });
			this.setState({ modal: true });
			return;
		}
		this.setState({ modal: false });
		this.setState({ modalClasses: '' });
	};

	doSignIn = async () => {
		this.setState({ isLoading: 'loading' });

		try {
			const obj = {
				email: this.state.email,
				password: this.state.password,
			};
			await this.props.signIn(obj);

			toast.success('Successfully signed in!');

			this.setState({
				modalClasses: '',
				modal: false,
				isLoading: '',
				email: '',
				password: '',
			});
		} catch (err) {
			toast.error('An Error has occured, please try again.');
			// Error Message
			// console.log(err.response.data.message);
			// '.userAuthModal'.transition('jiggle');
			setTimeout(() => {
				this.setState({
					isLoading: '',
					username: '',
					email: '',
					password: '',
					passwordConfirm: '',
				});
			}, 4000);
		}
	};

	doSignUp = async () => {
		this.setState({ isLoading: 'loading' });
		try {
			const obj = {
				username: this.state.username,
				email: this.state.email,
				password: this.state.password,
				passwordConfirm: this.state.passwordConfirm,
			};
			await this.props.signUp(obj);
			toast.success('User Successfully created');
			this.doSignIn();
		} catch (err) {
			console.log({ err });
			toast.error(err);
		}
	};

	setUsername = (value) => {
		this.setState({ username: value });
	};

	setEmail = (value) => {
		this.setState({ email: value });
	};

	setPassword = (value) => {
		this.setState({ password: value });
	};

	setPasswordConfirm = (value) => {
		this.setState({ passwordConfirm: value });
	};

	renderContent = () => {
		return (
			<SignUpForm
				loading={this.state.isLoading}
				username={this.state.username}
				setUsername={this.setUsername}
				email={this.state.email}
				setEmail={this.setEmail}
				password={this.state.password}
				setPassword={this.setPassword}
				passwordConfirm={this.state.passwordConfirm}
				setPasswordConfirm={this.setPasswordConfirm}
				toggle={this.toggle}
				doSignUp={this.doSignUp}
			/>
		);
	};

	renderActions = () => {
		return (
			<React.Fragment>
				<button
					className='ui button positive'
					// on button click, call the deleteStream action with the streams id
					onClick={() => {
						this.doSignIn();
					}}
					type='submit'
				>
					Sign Up!
				</button>
				<button
					className='ui button'
					type='button'
					onClick={() =>
						this.setState({ modalClasses: '', modal: false })
					}
				>
					Cancel
				</button>
			</React.Fragment>
		);
	};
	renderAuthButton() {
		if (this.props.isSignedIn) {
			return <> </>;
		}

		return (
			<React.Fragment>
				<Modal
					classes={`${this.state.modalClasses} userAuthModal`}
					onDismiss={() =>
						this.setState({ modal: false, modalClasses: '' })
					}
					title={'Sign Up'}
					content={this.renderContent()}
					actions={this.renderActions()}
				/>
				<button
					className='ui blue google button'
					style={{ margin: '5px 5px 5px 0px' }}
					onClick={this.toggle}
					type='button'
				>
					Sign Up
				</button>
			</React.Fragment>
		);
	}

	render() {
		return <>{this.renderAuthButton()}</>;
	}
}

const mapStateToProps = (state) => {
	return { isSignedIn: state.auth.isSignedIn, username: state.auth.username };
};

export default connect(mapStateToProps, { signIn, signUp })(SignUp);
