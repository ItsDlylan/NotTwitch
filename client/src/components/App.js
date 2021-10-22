import React from 'react';
import { Router, Route, Switch } from 'react-router-dom';
import history from '../history';
// App Components
import Header from './Header';
// Stream Components
import StreamCreate from './streams/StreamCreate';
import StreamDelete from './streams/StreamDelete';
import StreamEdit from './streams/StreamEdit';
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
						<Route
							path='/streams/new'
							exact
							component={StreamCreate}
						/>
						<Route
							path='/streams/edit/:id'
							exact
							component={StreamEdit}
						/>
						<Route
							path='/streams/delete/:id'
							exact
							component={StreamDelete}
						/>
						<Route
							path='/streams/:id'
							exact
							component={StreamShow}
						/>
					</Switch>
				</div>
			</Router>
		</div>
	);
};

export default App;
