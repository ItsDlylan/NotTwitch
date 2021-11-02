import React from 'react';
import { Router, Route, Switch } from 'react-router-dom';
import history from '../history';
import ForgotPasswordForm from './ForgotPasswordForm';
// App Components
import Header from './Header';
// Stream Components
import StreamCreate from './streams/StreamCreate';
import StreamList from './streams/StreamList';
import StreamShow from './streams/StreamShow';

const App = () => {
	return (
		<div className='ui container'>
			{/* Custom Router to give us the ability to control the history. */}
			<Router history={history}>
				<div>
					<Header />
					{/* Switch Component to make sure only 1 Route is being shown at a time. */}
					<Switch>
						<Route path='/' exact component={StreamList} />
						<Route path='/:username' exact component={StreamShow} />
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
