import React from 'react';
import { connect } from 'react-redux';
import { editStream } from '../../actions';
import StreamForm from './StreamForm';
import _ from 'lodash';

class StreamEdit extends React.Component {
	// When the component Mounts, run the action fetchStream via the current Streams id
	// componentDidMount() {
	// 	this.props.fetchStream(this.props.match.params.username);
	// }
	// on Form Submit with the formValues, run the action edit Stream with the username, and the formValues
	onSubmit = (formValues) => {
		this.props.editStream(this.props.match.params.username, formValues);
	};

	render() {
		// if there is no stream, render a loader until the stream is returned from the fetchStream Action
		if (!this.props.stream) {
			return (
				<div className='ui container'>
					<div className='ui active inline loader'></div>
				</div>
			);
		}
		return (
			<div>
				<h3>Edit a Stream</h3>
				<StreamForm
					// Using Lodashes .pick function, pick the keys 'title, and 'description' from the stream.
					initialValues={_.pick(this.props.stream, 'title', 'tags')}
					onSubmit={this.onSubmit}
				/>
			</div>
		);
	}
}
// grab the state.streams at the Id grabbed from the ownProps.match.params.id
const mapStateToProps = (state, ownProps) => {
	console.log(ownProps);
	// return { stream: state.streams[ownProps.match.params.id] };
};
// Connect the state, and the actions to the component
export default connect(mapStateToProps, { editStream })(StreamEdit);
