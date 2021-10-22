import React from 'react';
import { connect } from 'react-redux';
import { signIn, signOut } from '../actions';

class GoogleAuth extends React.Component {
	componentDidMount() {
		window.gapi.load('client:auth2', () => {
			window.gapi.client
				.init({
					clientId:
						'847017131420-qmklm2jeu3mr2b70e4775dbie5g2ojbm.apps.googleusercontent.com',
					scope: 'email',
				})
				.then(() => {
					// this will run when the google api is good to go.

					// this.auth will now be able to be called anywhere inside of the Class.
					this.auth = window.gapi.auth2.getAuthInstance();

					// runs the isSignedIn Method from .gapi
					this.onAuthChange(this.auth.isSignedIn.get());
					this.auth.isSignedIn.listen(this.onAuthChange);
				});
		});
	}

	onAuthChange = (isSignedIn) => {
		if (isSignedIn) {
			this.props.signIn(this.auth.currentUser.get().getId());
		} else {
			this.props.signOut();
		}
	};

	onSignInClick = () => {
		this.auth.signIn();
	};
	onSignOutClick = () => {
		this.auth.signOut();
	};
	renderAuthButton() {
		if (this.props.isSignedIn === null) {
			return null;
		} else if (this.props.isSignedIn) {
			return (
				<button
					className='ui red google button'
					onClick={this.onSignOutClick}
				>
					<i className='google icon'></i>
					Sign Out
				</button>
			);
		} else {
			return (
				<button
					className='ui blue google button'
					onClick={this.onSignInClick}
				>
					<i className='google icon'></i>
					Sign In with Google
				</button>
			);
		}
	}

	render() {
		return <div>Test{this.renderAuthButton()}</div>;
	}
}

const mapStateToProps = (state) => {
	return { isSignedIn: state.auth.isSignedIn };
};

export default connect(mapStateToProps, { signIn, signOut })(GoogleAuth);
