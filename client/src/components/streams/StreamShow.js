import React from 'react';
import { connect } from 'react-redux';
// import { fetchStream } from '../../actions';
import flv from 'flv.js';
import axios from 'axios';
class StreamShow extends React.Component {
	//constructor to give us the ability to have a ref to the video element we created.
	constructor(props) {
		super(props);
		this.state = { stream: {} };
		//Create a Ref for the video Element.
		this.videoRef = React.createRef();
	}

	fetchStream = async (username) => {
		try {
			const res = await axios.get(
				`http://localhost:3001/api/v1/streams/${username}`,
			);

			return res.data;
		} catch (err) {
			return { status: 'fail', data: {} };
		}
	};
	async componentDidMount() {
		const { username } = this.props.match.params;
		const fetchedStream = await this.fetchStream(username);
		// this.props.fetchStream(username);
		this.setState({ stream: fetchedStream });
		// attempt to build the player
		this.buildPlayer();
	}

	componentWillUnmount() {
		//When the component is Unmounted, destory the player so the user doesn't attempt to download
		//video files when its no longer needed.
		if (Object.keys(this.state.stream).length > 0) {
			this.player.destroy();
			this.setState({ stream: {} });
		}
	}

	componentDidUpdate() {
		// when it updates attempt to build the player.
		this.buildPlayer();
	}

	buildPlayer() {
		// if no stream or this.player, just return because it can't build the player yet.
		if (this.player || Object.keys(this.state.stream).length === 0) {
			return;
		}

		const { streamKEY } = this.state.stream.data.stream;
		console.log(this.state.stream.data.stream);
		// console.log(this.props.stream.data.stream);
		//Create the Player, with type:flv' and using the URL
		// https://www.npmjs.com/package/node-media-server via flv.js over http-flv
		this.player = flv.createPlayer({
			type: 'flv',
			url: `http://localhost:8000/live/${streamKEY}.flv`,
		});
		// Attach the video Element to the Player.
		this.player.attachMediaElement(this.videoRef.current);
		// Load the Player.
		this.player.load();
		// Test the play later for automatic plays.
		// this.player.play();
	}
	editStream = () => {
		console.log(this.state.stream);
	};
	renderAdmin = (stream) => {
		if (stream === undefined) {
			return;
		}

		if (stream.data.stream.userID === this.props.currentUserId) {
			return <div onClick={this.editStream}>Edit</div>;
		}
	};
	// to get the live count, go to localhost:8000/api/streams data.live.streamID.subscribers.length() will give the live count.
	render() {
		const { stream } = this.state;
		if (!stream.data) {
			return (
				<video ref={this.videoRef} style={{ width: '100%' }} controls />
			);
		}

		return (
			<div>
				{/* Update this later, with new styles. */}
				<video ref={this.videoRef} style={{ width: '100%' }} controls />

				<h1>{stream.data.stream.title}</h1>
				{this.renderAdmin(stream)}
				<ul>
					{stream.data.stream.tags.map((el) => {
						console.log(el);
						return (
							<div key={el} className='ui blue label'>
								{el}
							</div>
						);
					})}
				</ul>
			</div>
		);
	}
}

const mapStateToProps = (state, ownProps) => {
	return {
		// stream: state.streams[ownProps.match.params.userId],
		currentUserId: state.auth.userId,
		isSignedIn: state.auth.isSignedIn,
	};
};

export default connect(mapStateToProps)(StreamShow);
