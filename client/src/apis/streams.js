import axios from 'axios';

//  create the axios.create using the baseURL of the api's endpoint.
export default axios.create({
	baseURL: 'http://localhost:3001',
});
