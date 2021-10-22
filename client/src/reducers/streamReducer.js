/* eslint-disable import/no-anonymous-default-export */
import {
	EDIT_STREAM,
	CREATE_STREAM,
	FETCH_STREAM,
	FETCH_STREAMS,
	DELETE_STREAM,
} from '../actions/types';

import _ from 'lodash';

export default (state = {}, action) => {
	switch (action.type) {
		case FETCH_STREAM:
			// return the new Stream Object with the new item being key id: and the value payload.
			return { ...state, [action.payload.id]: action.payload };
		case FETCH_STREAMS:
			// we spread the big object that mapKeys creates from the payload, and title it 'id'
			return { ...state, ..._.mapKeys(action.payload, 'id') };
		case CREATE_STREAM:
			// return the new Stream Object with the new item being id: and the payload.
			return { ...state, [action.payload.id]: action.payload };
		case EDIT_STREAM:
			// return the new Stream Object with the new item being id: and the payload.
			return { ...state, [action.payload.id]: action.payload };
		case DELETE_STREAM:
			// using Lodashs Omit method, grab the state and delete the key-value pair with the action.payload which
			// was the ID
			return _.omit(state, action.payload);
		default:
			return state;
	}
};
