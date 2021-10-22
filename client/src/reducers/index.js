import { combineReducers } from 'redux';

import authReducer from './authReducer';
import streamReducer from './streamReducer';

// Connect all our Reducers together.
export default combineReducers({
	auth: authReducer,
	streams: streamReducer,
});
