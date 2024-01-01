import axios from 'axios';
import { useEffect } from 'react';
import { useHistory } from 'react-router-dom';

export const useRedirect = (userAuthStatus) => {
	const history = useHistory();

	useEffect(() => {
		const handleMount = async () => {
			try {
				// The post request will act like a check as to whether the user is currently logged in or not.
				// If a user is logged in; the access token will be refreshed successfully,
				// and any code left in the try block will be able to run. If they’re not logged in though,
				// we’ll get a response with the 401 error, and then the code in our catch block will run.
				await axios.post('/dj-rest-auth/token/refresh/');
				// if the user is logged in, then the code below will run.
				if (userAuthStatus === 'loggedIn') {
					history.push('/');
				}
			} catch (err) {
				// if the user is NOT logged in, the code below will run.
				if (userAuthStatus === 'loggedOut') {
					history.push('/');
				}
			}
		};
		handleMount();
	}, [history, userAuthStatus]);
};
