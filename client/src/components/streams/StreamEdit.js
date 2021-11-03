import React from 'react';
import { connect } from 'react-redux';
import { editStream } from '../../actions';
import StreamForm from './StreamForm';
import _ from 'lodash';

class StreamEdit extends React.Component {
	// on Form Submit with the formValues, run the action edit Stream with the username, and the formValues
	onSubmit = async (formValues) => {
		await this.props.editStream(this.props.username, formValues);
		this.props.editSubmit();
	};

	render() {
		return (
			<div onClick={this.props.handleClick} style={{ marginTop: '1rem' }}>
				<h3>Submit to Edit your Stream Information</h3>
				<StreamForm
					// Using Lodashes .pick function, pick the keys 'title from the stream.
					initialValues={_.pick(this.props.stream, 'title', 'tags')}
					onSubmit={this.onSubmit}
				/>
			</div>
		);
	}
}
// grab the state.streams at the Id grabbed from the ownProps.match.params.id

// Connect the state, and the actions to the component
export default connect(null, { editStream })(StreamEdit);
