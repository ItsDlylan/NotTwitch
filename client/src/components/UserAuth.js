import React from 'react';
import { connect } from 'react-redux';
import { signIn, signOut } from '../actions';
import Modal from './Modal';
import SignInForm from './SignInForm';
import { Link } from 'react-router-dom';
import './UserAuth.css';
class UserAuth extends React.Component {
	constructor(props) {
		super(props);
		this.state = {
			modal: false,
			modalClasses: '',
			email: '',
			password: '',
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

	onSignOutClick = () => {
		this.props.signOut();
	};

	doSignIn = async () => {
		console.log('hey');
		this.setState({ isLoading: 'loading' });
		const obj = {
			email: this.state.email,
			password: this.state.password,
		};
		try {
			await this.props.signIn(obj);

			this.setState({
				modalClasses: '',
				modal: false,
				isLoading: '',
				email: '',
				password: '',
			});
		} catch (err) {
			// Error Message
			console.log(err.response.data.message);
			// '.userAuthModal'.transition('jiggle');
			setTimeout(() => {
				this.setState({
					isLoading: '',
					email: '',
					password: '',
				});
			}, 4000);
		}
	};

	setEmail = (value) => {
		this.setState({ email: value });
	};

	setPassword = (value) => {
		this.setState({ password: value });
	};

	renderContent = () => {
		return (
			<SignInForm
				loading={this.state.isLoading}
				email={this.state.email}
				setEmail={this.setEmail}
				password={this.state.password}
				setPassword={this.setPassword}
				toggle={this.toggle}
				doSignIn={this.doSignIn}
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
					Sign In
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
		if (this.props.isSignedIn === null) {
			return null;
		} else if (this.props.isSignedIn) {
			return (
				<div className='ui simple dropdown item'>
					{this.props.username} <i className='dropdown icon'></i>
					<div className='menu'>
						<Link className='item right' to={'/'}>
							<i className='large middle aligned icon user' />
							Profile
						</Link>
						<button
							type='button'
							className='item'
							onClick={this.onSignOutClick}
						>
							<i className='sign-out icon'></i>
							Sign Out
						</button>
					</div>
				</div>
			);
		} else {
			return (
				<React.Fragment>
					<Modal
						classes={`${this.state.modalClasses} userAuthModal`}
						onDismiss={() =>
							this.setState({ modal: false, modalClasses: '' })
						}
						title={'Log In'}
						content={this.renderContent()}
						actions={this.renderActions()}
					/>
					<button
						className='ui blue google button'
						onClick={this.toggle}
						type='button'
					>
						<i className='sign-in icon'></i>
						Sign In
					</button>
				</React.Fragment>
			);
		}
	}

	render() {
		return <>{this.renderAuthButton()}</>;
	}
}

const mapStateToProps = (state) => {
	return { isSignedIn: state.auth.isSignedIn, username: state.auth.username };
};

export default connect(mapStateToProps, { signIn, signOut })(UserAuth);
