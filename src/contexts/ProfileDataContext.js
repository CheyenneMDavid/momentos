import { createContext, useContext, useEffect, useState } from 'react';
import { axiosReq, axiosRes } from '../api/axiosDefaults';
import { useCurrentUser } from '../contexts/CurrentUserContext';
import { followHelper, unfollowHelper } from '../utils/utils';

const ProfileDataContext = createContext();
const SetProfileDataContext = createContext();

export const useProfileData = () => useContext(ProfileDataContext);
export const useSetProfileData = () => useContext(SetProfileDataContext);

export const ProfileDataProvider = ({ children }) => {
	const [profileData, setProfileData] = useState({
		pageProfile: { results: [] },
		popularProfiles: { results: [] },
	});

	const currentUser = useCurrentUser();

	const handleFollow = async (clickedProfile) => {
		try {
			const { data } = await axiosRes.post('/followers/', {
				followed: clickedProfile.id,
			});

			setProfileData((prevState) => ({
				...prevState,
				pageProfile: {
					results: prevState.pageProfile.results.map((profile) =>
						followHelper(profile, clickedProfile, data.id),
					),
				},
				popularProfiles: {
					...prevState.popularProfiles,
					results: prevState.popularProfiles.results.map((profile) =>
						followHelper(profile, clickedProfile, data.id),
					),
				},
			}));
		} catch (err) {
			console.log(err);
		}
	};

	// The handleUnfollow async function with clickedProfile as an argument.
	const handleUnfollow = async (clickedProfile) => {
		try {
			// DELETE request made to `/followers/${clickedProfile.following_id}/` with the axiosRes instance.
			await axiosRes.delete(`/followers/${clickedProfile.following_id}/`);

			// The setProfileData function is called to update the state.
			setProfileData((prevState) => ({
				// The spread operator is used to copy all properties of the current state which are carried forward
				...prevState,

				// pageProfile part of the state is updated with the results from mapping over prevState.pageProfile.results
				pageProfile: {
					// Map over the results array in pageProfile
					results: prevState.pageProfile.results.map((profile) =>
						// The unfollowHelper that is defined in the utils.js is called for each profile, and updates profiles as needed
						unfollowHelper(profile, clickedProfile),
					),
				},

				// Updates the popularProfiles part of the state in a similare way as in the handleFollow
				popularProfiles: {
					// Spread operator to maintain other properties of popularProfiles
					...prevState.popularProfiles,
					// Map over the results array in popularProfiles
					results: prevState.popularProfiles.results.map((profile) =>
						// Again, call the unfollowHelper for each profile
						unfollowHelper(profile, clickedProfile),
					),
				},
			}));
		} catch (err) {
			// If there is an error during the async operation, log it to the console
			console.log(err);
		}
	};

	useEffect(() => {
		const handleMount = async () => {
			try {
				const { data } = await axiosReq.get('/profiles/?ordering=-followers_count');
				setProfileData((prevState) => ({
					...prevState,
					popularProfiles: data,
				}));
			} catch (err) {
				console.log(err);
			}
		};

		handleMount();
	}, [currentUser]);

	return (
		<ProfileDataContext.Provider value={profileData}>
			<SetProfileDataContext.Provider value={{ setProfileData, handleFollow, handleUnfollow }}>
				{children}
			</SetProfileDataContext.Provider>
		</ProfileDataContext.Provider>
	);
};
