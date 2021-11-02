/* eslint-disable import/no-anonymous-default-export */
import { SIGN_IN, SIGN_OUT, SIGN_UP } from '../actions/types';

const INITIAL_STATE = {
	isSignedIn: false,
	username: null,
	email: null,
	userId: null,
	token: null,
};

export default (state = INITIAL_STATE, action) => {
	switch (action.type) {
		case SIGN_IN:
			return {
				...state,
				isSignedIn: true,
				email: action.payload.data.user.email,
				userId: action.payload.data.user.id,
				username: action.payload.data.user.username,
				token: action.payload.token,
			};
		case SIGN_OUT:
			return {
				...state,
				isSignedIn: false,
				email: null,
				username: null,
				userId: null,
			};
		case SIGN_UP:
			return {
				...state,
				isSignedIn: true,
			};
		default:
			return state;
	}
};
