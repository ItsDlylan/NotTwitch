import React from 'react';
import { connect } from 'react-redux';
import { fetchStream } from '../../actions';
import flv from 'flv.js';

class StreamShow extends React.Component {
	//constructor to give us the ability to have a ref to the video element we created.
	constructor(props) {
		super(props);

		//Create a Ref for the video Element.
		this.videoRef = React.createRef();
	}

	componentDidMount() {
		const { id } = this.props.match.params;

		this.props.fetchStream(id);
		// attempt to build the player
		this.buildPlayer();
	}

	componentWillUnmount() {
		//When the component is Unmounted, destory the player so the user doesn't attempt to download
		//video files when its no longer needed.
		this.player.destroy();
	}

	componentDidUpdate() {
		// when it updates attempt to build the player.
		this.buildPlayer();
	}

	buildPlayer() {
		// if no stream or this.player, just return because it can't build the player yet.
		if (this.player || !this.props.stream) {
			return;
		}

		const { id } = this.props.match.params;
		//Create the Player, with type:flv' and using the URL
		// https://www.npmjs.com/package/node-media-server via flv.js over http-flv
		this.player = flv.createPlayer({
			type: 'flv',
			url: `http://not-twitch.herokuapp.com:8000/live/${id}.flv`,
		});
		// Attach the video Element to the Player.
		this.player.attachMediaElement(this.videoRef.current);
		// Load the Player.
		this.player.load();
		// Test the play later for automatic plays.
		// this.player.play();
	}

	render() {
		const { stream } = this.props;
		if (!stream) {
			return <div>Loading...</div>;
		}
		return (
			<div>
				<video ref={this.videoRef} style={{ width: '100%' }} controls />
				<h1>{stream.title}</h1>
				<h5>{stream.description}</h5>
			</div>
		);
	}
}

const mapStateToProps = (state, ownProps) => {
	return { stream: state.streams[ownProps.match.params.id] };
};

export default connect(mapStateToProps, { fetchStream })(StreamShow);
