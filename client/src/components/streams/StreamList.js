import React from 'react';
import { connect } from 'react-redux';
import { fetchStreams } from '../../actions';
import { Link } from 'react-router-dom';

class StreamList extends React.Component {
	// on Mount, run the action fetchStreams to get The Streams into the Redux Store from the API
	componentDidMount() {
		this.props.fetchStreams();
	}
	// Render Admin Helper Function that takes in the stream as an argument
	renderAdmin = (stream) => {
		// if the streams id is equal to the currentUserId from the state.auth.userId
		// then add the buttons for editing/deleting the stream.
		if (stream.userID === this.props.currentUserId) {
			return (
				<div className='right floated content'>
					<Link
						to={`/streams/edit/${stream.id}`}
						className='ui button primary'
					>
						Edit
					</Link>
					<Link
						to={`/streams/delete/${stream.id}`}
						className='ui button negative'
					>
						Delete
					</Link>
				</div>
			);
		}
	};
	// Render the List of Streams.
	renderList() {
		return this.props.streams.map((stream) => {
			// This filter is from an exercise, going to build filters later.
			// Filter to show just the user Created Streams
			// if (this.props.currentUserId !== stream.userId) {
			// 	return null;
			// }

			//Each Stream gets checked to see if the Stream is yours, if it is, the RenderAdmin buttons get rendered
			// first due to Semantic UI floating them to the right.
			return (
				<div className='item' key={stream.id}>
					<i className='large middle aligned icon video' />
					<div className='content'>
						<Link to={`/${stream.username}`} className='header'>
							{stream.title} | {stream.username}
						</Link>
					</div>
				</div>
			);
		});
	}

	render() {
		return (
			<div>
				<h2>Live Streams</h2>
				<div className='ui celled list'>{this.renderList()}</div>
			</div>
		);
	}
}

const mapStateToProps = (state) => {
	return {
		// Object.values takes in an Object, and for each value itll return an array
		//easier to map over an Array over an Object
		streams: Object.values(state.streams),
		currentUserId: state.auth.userId,
		isSignedIn: state.auth.isSignedIn,
	};
};

// Connect the state, and the actions to the component
export default connect(mapStateToProps, { fetchStreams })(StreamList);
