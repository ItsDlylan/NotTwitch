import React from 'react';
import Modal from '../Modal';
import history from '../../history';
import { Link } from 'react-router-dom';
import { connect } from 'react-redux';
import { fetchStream, deleteStream } from '../../actions';

class StreamDelete extends React.Component {
	// when the StreamDelete Mounts, call the actionCreator to get the stream.
	componentDidMount() {
		// This.prop.match.params.id is the id of the stream that was clicked.
		this.props.fetchStream(this.props.match.params.id);
	}
	// renderAction Helper Method that render's the action buttons to the modal
	renderActions() {
		// Deconstruct the id from the props.match.params;
		const { id } = this.props.match.params;
		return (
			// React.Fragment because the return needs a parent container for the 2 buttons
			<React.Fragment>
				<button
					className='ui button negative'
					// on button click, call the deleteStream action with the streams id
					onClick={() => this.props.deleteStream(id)}
				>
					Delete
				</button>
				<Link className='ui button' to={'/'}>
					Cancel
				</Link>
			</React.Fragment>
		);
		
	}

	// renderContent helper function to render the Content in the Modal
	renderContent() {
		// if no stream fetched yet. return a default string
		if (!this.props.stream) {
			return 'Are you sure you want to delete this stream?';
		}
		// when stream is in the Store, return the stream title.
		return `Are you sure you want to delete the stream with title: ${this.props.stream.title}`;
	}
	render() {
		return (
			<Modal
				onDismiss={() => history.push('/')}
				title={'Delete Stream'}
				content={this.renderContent()}
				actions={this.renderActions()}
			/>
		);
	}
}

const mapStateToProps = (state, ownProps) => {
	// grab the state.streams at the Id grabbed from the ownProps.match.params.id
	return { stream: state.streams[ownProps.match.params.id] };
};
// Connect the state, and the actions to the component
export default connect(mapStateToProps, { fetchStream, deleteStream })(
	StreamDelete,
);
