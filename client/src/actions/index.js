// import the streams api to be able to be called.

import streams from '../apis/streams';
import users from '../apis/users';
// Import the history to be able to redirect the page.
import history from '../history';

import {
	SIGN_IN,
	SIGN_OUT,
	SIGN_UP,
	CREATE_STREAM,
	FETCH_STREAMS,
	DELETE_STREAM,
	EDIT_STREAM,
} from './types';

// dispatching the reset function allows you to reset the form fields.
import { reset } from 'redux-form';

// Sign In Action, takes an object of email and password
export const signIn = (obj) => async (dispatch) => {
	const response = await users.post('/api/v1/users/login', obj);
	dispatch({ type: SIGN_IN, payload: response.data });
};

// Sign Out Action, sends the type's action as SIGN_OUT
export const signOut = () => {
	return {
		type: SIGN_OUT,
	};
};

export const signUp = (obj) => async (dispatch) => {
	// obj.streamKEY = await crypto.createHash('sha256');
	obj.streamKEY = (Math.random() * 10000).toString();
	obj.title = 'Untitled Stream';
	const response = await users.post('/api/v1/users/signup', obj);
	return {
		type: SIGN_UP,
	};
};

// Stream Actions
// --------------

// Create Stream Action, takes in the formValues as the arguments,
// the inner function calls async and getState from Redux
// This action will create a Stream object for the Database.

export const createStream = (formValues) => async (dispatch, getState) => {
	// Grabs the userId from the .auth in the Redux Store
	const { userId } = getState().auth;
	// posts the form values and the userId into a new object into the endpoint '/streams'
	const response = await streams.post('/api/v1/streams/', {
		...formValues,
		userId,
	});
	// Sends a dispatch with a Type of 'CREATE_STREAM' with the response.data as the payload.
	dispatch({ type: CREATE_STREAM, payload: response.data });
	// Etch case, to reset the form in case the redirect doesnt work.
	dispatch(reset('streamForm'));
	// Do some programmatic navigation to get back to the root route
	history.push('/');
};

// Create FetchStreams Action, this action will get all of the streams from the endPoint
// and hook it up with the ReduxStore

export const fetchStreams = () => async (dispatch) => {
	// gets all of the streams
	const response = await streams.get('/api/v1/streams/');

	// Sends all of the streams via the FETCH_STREAMS action.type
	dispatch({ type: FETCH_STREAMS, payload: response.data.data.streams });
};

// Create deleteStream Action, this action will delete the Stream with the corresponding id that you pass in
// it'll delete from the database and the reduxStore

export const deleteStream = (username) => async (dispatch) => {
	// delete the stream from the API
	await streams.delete(`/api/v1/streams/${username}`);
	// send the dispatch action with DELETE_STREAM, and the payload just include the username
	dispatch({ type: DELETE_STREAM, payload: username });
	// Do some programmatic navigation to get back to the root route
	history.push('/');
};

// Create editStream Action, this action will edit a stream located by the username, with the formValues that you pass in.
export const editStream = (username, formValues) => async (dispatch) => {
	// using patch, to just update the new information rather than .put to override old properties.
	const response = await streams.patch(
		`/api/v1/streams/${username}`,
		formValues,
	);
	// send the dispatch with the acttion EDIT_STREAM with the payload being the edited Stream
	dispatch({ type: EDIT_STREAM, payload: response.data });
	// etch case, reset the form.
	dispatch(reset('streamForm'));
	// Do some programmatic navigation to get back to the stream
	history.push(`/${username}`);
};
