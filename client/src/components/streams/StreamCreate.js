import React from 'react';
// import connect, to connect the action creators to the Component as Props
import { connect } from 'react-redux';
// Import the action creator to be connected to the Component
import { createStream } from '../../actions';

// Components
import StreamForm from './StreamForm';

class StreamCreate extends React.Component {
	// Grab the formValues from the form, and pass it into the action function, as arguments.
	onSubmit = (formValues) => {
		// this.props.createStream from the Connect function
		this.props.createStream(formValues);
	};

	render() {
		return (
			<div>
				<h3>Create a Stream</h3>
				{/* send the onSubmit Helper function to the StreamForm as a prop. */}
				<StreamForm onSubmit={this.onSubmit} />
			</div>
		);
	}
}

// since we dont have a mapStateToProps, input null as the first argument. then pass in the action creator here
export default connect(null, { createStream })(StreamCreate);
