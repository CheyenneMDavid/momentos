import { createContext, useContext, useEffect, useMemo, useState } from 'react';
import axios from 'axios';
import { axiosReq, axiosRes } from '../api/axiosDefaults';
import { useHistory } from 'react-router';
import { removeTokenTimestamp, shouldRefreshToken } from '../utils/utils';

export const CurrentUserContext = createContext();
export const SetCurrentUserContext = createContext();

export const useCurrentUser = () => useContext(CurrentUserContext);
export const useSetCurrentUser = () => useContext(SetCurrentUserContext);

export const CurrentUserProvider = ({ children }) => {
	const [currentUser, setCurrentUser] = useState(null);
	const history = useHistory();

	const handleMount = async () => {
		try {
			const { data } = await axiosRes.get('dj-rest-auth/user/');
			setCurrentUser(data);
		} catch (err) {
			console.log(err);
		}
	};

	useEffect(() => {
		handleMount();
	}, []);

	useMemo(() => {
		axiosReq.interceptors.request.use(
			async (config) => {
				// Moved entire try-catch block inside the if statement.  The if-block
				// only runs if the token should be refreshed.  The 'shouldRefreshToken' is
				// called from the utils file.
				if (shouldRefreshToken()) {
					try {
						await axios.post('/dj-rest-auth/token/refresh/');
					} catch (err) {
						setCurrentUser((prevCurrentUser) => {
							if (prevCurrentUser) {
								history.push('/signin');
							}
							return null;
						});
						// calling 'removeTokenTimestamp' from utils
						removeTokenTimestamp();
						return config;
					}
				}

				return config;
			},
			(err) => {
				return Promise.reject(err);
			},
		);

		axiosRes.interceptors.response.use(
			(response) => response,
			async (err) => {
				if (err.response?.status === 401) {
					try {
						await axios.post('/dj-rest-auth/token/refresh/');
					} catch (err) {
						setCurrentUser((prevCurrentUser) => {
							if (prevCurrentUser) {
								history.push('/signin');
							}
							return null;
						});
						// calling 'removeTokenTimestamp' from utils
						removeTokenTimestamp();
					}
					return axios(err.config);
				}
				return Promise.reject(err);
			},
		);
	}, [history]);

	return (
		<CurrentUserContext.Provider value={currentUser}>
			<SetCurrentUserContext.Provider value={setCurrentUser}>
				{children}
			</SetCurrentUserContext.Provider>
		</CurrentUserContext.Provider>
	);
};
