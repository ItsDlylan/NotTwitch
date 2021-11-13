import React from 'react';
import { connect } from 'react-redux';
// import { fetchStream } from '../../actions';
import flv from 'flv.js';
import axios from 'axios';
import StreamEdit from './StreamEdit';
class StreamShow extends React.Component {
	//constructor to give us the ability to have a ref to the video element we created.
	constructor(props) {
		super(props);
		this.state = {
			stream: {},
			user: {},
			editMessage: 'Edit Stream',
			isOpened: false,
			isUpdated: false,
		};
		//Create a Ref for the video Element.
		this.videoRef = React.createRef();
	}
	fetchUser = async (username) => {
		try {
			const res = await axios.get(
				`http://localhost:3001/api/v1/users/${username}`,
			);
			return res.data;
		} catch (err) {
			console.log({ err });
		}
	};

	fetchStream = async (username) => {
		try {
			const res = await axios.get(
				`http://localhost:3001/api/v1/streams/${username}`,
			);

			return res.data;
		} catch (err) {
			return err.response.data.message;
		}
	};
	async componentDidMount() {
		const { username } = this.props.match.params;

		const fetchedStream = await this.fetchStream(username);
		const fetchedUser = await this.fetchUser(username);

		// this.props.fetchStream(username);
		this.setState({ stream: fetchedStream, user: fetchedUser.data });

		// attempt to build the player
		this.buildPlayer();
	}

	componentWillUnmount() {
		//When the component is Unmounted, destory the player so the user doesn't attempt to download
		//video files when its no longer needed.

		if (!this.state.stream) {
			return;
		}
		if (Object.keys(this.state.stream).length > 0) {
			this.player.destroy();
			this.setState({ stream: {}, user: {} });
			return;
		}
	}

	componentDidUpdate() {
		// when it updates attempt to build the player.
		this.buildPlayer();
	}

	buildPlayer() {
		// if no stream or this.player, just return because it can't build the player yet.
		if (
			this.state.stream.status === 'fail' ||
			this.player ||
			Object.keys(this.state.stream).length === 0
		) {
			return;
		}

		// TODO: Gotta figure out how to make this private and not sent to the front End
		const { streamKEY } = this.state.stream.data.stream;

		//Create the Player, with type:flv' and using the URL
		// https://www.npmjs.com/package/node-media-server via flv.js over http-flv
		this.player = flv.createPlayer({
			type: 'flv',
			url: `http://localhost:8000/live/${streamKEY}.flv`,
		});
		// Attach the video Element to the Player.
		this.player.attachMediaElement(this.videoRef.current);
		// Load the Player and automatically start playing it.
		this.player.load();
		this.player.play();
	}
	editStream = async () => {
		if (this.state.isOpened === false) {
			this.setState({ isOpened: true, editMessage: 'Cancel Edit' });
		} else if (this.state.isOpened === true) {
			this.setState({ isOpened: false, editMessage: 'Edit Stream' });
		}
	};
	editSubmit = async () => {
		const { username } = this.props.match.params;

		const newFetchedStream = await this.fetchStream(username);

		this.setState({
			stream: newFetchedStream,
			isOpened: false,
			editMessage: 'Edit Stream',
		});
	};
	handleChildClick = (e) => {
		e.stopPropagation();
	};
	renderAdmin = (stream) => {
		if (stream === undefined) {
			return;
		}

		if (this.props.currentUserId === stream.data.stream.userID) {
			return (
				<div onClick={this.editStream}>
					{this.state.editMessage}
					{this.state.isOpened ? (
						<StreamEdit
							handleClick={this.handleChildClick}
							editSubmit={this.editSubmit}
							username={this.state.stream.data.stream.username}
						/>
					) : (
						false
					)}
				</div>
			);
		}
	};
	// to get the live count, go to localhost:8000/api/streams data.live.streamID.subscribers.length() will give the live count.
	render() {
		const { stream } = this.state;
		if (!stream.data) {
			return (
				<div>
					<video
						ref={this.videoRef}
						style={{ width: '100%' }}
						controls
					/>
					<h1>
						{this.props.match.params.username} is offline, or cannot
						be found.{' '}
					</h1>
				</div>
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
