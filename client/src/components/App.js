import React from 'react';
import { Router, Route, Switch } from 'react-router-dom';
import history from '../history';
import ForgotPasswordForm from './ForgotPasswordForm';
// App Components
import Header from './Header';
// Stream Components
import StreamEdit from './streams/StreamEdit';
import StreamList from './streams/StreamList';
import StreamShow from './streams/StreamShow';

// Toastify Notifs
import { ToastContainer, toast } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';

const App = () => {
	return (
		<div className='ui container'>
			<ToastContainer
				position='top-right'
				autoClose={5000}
				hideProgressBar={false}
				newestOnTop={false}
				closeOnClick
				rtl={false}
				pauseOnFocusLoss={false}
				draggable
				pauseOnHover={false}
			/>
			{/* Custom Router to give us the ability to control the history. */}
			<Router history={history}>
				<div>
					<Header />

					{/* Switch Component to make sure only 1 Route is being shown at a time. */}
					<Switch>
						<Route path='/' exact component={StreamList} />
						<Route path='/:username' exact component={StreamShow} />
						<Route
							path='/streams/edit/:username'
							exact
							component={StreamEdit}
						></Route>
						<Route
							path='/users/forgotPassword'
							exact
							component={ForgotPasswordForm}
						/>
					</Switch>
				</div>
			</Router>
		</div>
	);
};

export default App;
