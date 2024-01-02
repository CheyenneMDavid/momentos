import { axiosReq } from '../api/axiosDefaults';
import jwtDecode from 'jwt-decode';

export const fetchMoreData = async (resource, setResource) => {
	try {
		const { data } = await axiosReq.get(resource.next);
		setResource((prevResource) => ({
			...prevResource,
			next: data.next,
			// Here we used the reduce method to loop through  the new page of
			// results that we got from our API.
			results: data.results.reduce((acc, cur) => {
				// Then, we used the some() method to loop  through the array of posts
				// in the accumulator.
				// Inside, we compared each accumulator item
				// id to the current post id from  the newly fetched posts array.
				return acc.some((accResult) => accResult.id === cur.id)
					? // If the some() method returned true, this means  it found a match
					  // and we are displaying that post already.
					  // So in this case we return the  accumulator without adding the
					  // post to it.
					  acc
					: // And if the some() method does not find a  match, we return an array
					  // containing our spread accumulator with the new post added to it.
					  [...acc, cur];
				// We then appended our new results to the existing  posts in our
				// posts.results array in the state.
			}, prevResource.results),
		}));
	} catch (err) {
		// console.log(err);
	}
};

// This followHelper function was initially made in the ProfileDataContext.js, where
// it was last commited and then moved here in order to make it more accessable and
// call it on every map function, making it far cleaner. Passing "profile, clickedProfile and
// following_id" as arguments.
// As data.id is being passed into the helper function as an argument named "following_id"
// the value of the same name is being updated by removing "data.id" from
// "follow_id: data.id" in the return.  The updated value is now "following_id"
export const followHelper = (profile, clickedProfile, following_id) => {
	return profile.id === clickedProfile.id
		? // This is the profile I clicked on,
		  // update it's followers count and set it's following id.
		  {
				...profile,
				followers_count: profile.followers_count + 1,
				following_id, // Previously "following_id: data.id"
		  }
		: profile.is_owner
		? // This is the profile of the logged in user
		  // update it's following count.
		  {
				...profile,
				following_count: profile.following_count + 1,
		  }
		: // This is not the profile the user clicked on or the profile
		  // the user owns, so just just return it unchanged.
		  profile;
};

// Exporting the unfollowHelper function, which is taking 'profile' and 'clickedProfile' as
// it's arguments.
// It is used to update the 'profile' object when a user decides to unfollow another user.
export const unfollowHelper = (profile, clickedProfile) => {
	// Checking if the 'profile' and 'clickedProfile' are the same.
	return profile.id === clickedProfile.id
		? {
				// Using the spread operator to carry forward the current value
				...profile,
				// The new value of followers_count is a product of the spread operator carrying
				// forward the value of profile and decreasing it by 1
				followers_count: profile.followers_count - 1,
				//  following_id, being the profile of the person clicked. The value is then set to null.
				following_id: null,
		  }
		: // Taken as a given that the person doing the clicking is the owner, in which case their
		// following count is decreased by 1
		profile.is_owner
		? { ...profile, following_count: profile.following_count - 1 }
		: // Else the profile if returned unchanged.
		  profile;
};

// ------ Cleaning up errors ----

// The below functions collectively manage the refresh token's lifecycle in the browser's
// local storage during the user's sessions in a web application.

// This function is responsible for setting a timestamp in the browser's local storage that indicates
// when the refresh token is expected to expire. It's useful for knowing when to attempt to refresh
// the authentication token without making extra network requests
export const setTokenTimestamp = (data) => {
	// It uses the jwt-decode library to decode the JWT (JSON Web Token) and extract the expiration time (exp).
	// The 'data?.refresh_token' is using optional chaining to ensure that if data is null or undefined,
	// it doesn't try to access 'refresh_token' and cause a TypeError.

	const refreshTokenTimestamp = jwtDecode(data?.refresh_token).exp;

	// The expiration time is then stored in the browser's local storage under the key 'refreshTokenTimestamp'.
	// Local storage is a key-value store that allows me to save string data across browser sessions.
	localStorage.setItem('refreshTokenTimestamp', refreshTokenTimestamp);
};

// This function checks if the timestamp for the refresh token exists in local storage, which
// means that the user's still logged in and has a valid session.
export const shouldRefreshToken = () => {
	// It retrieves the timestamp using 'localStorage.getItem'. Then, the double NOT operator '!!'
	// is used to convert the retrieved value to a boolean. If there's a timestamp present,
	// it will return true, indicating that we should consider refreshing the token.
	// If not, it returns false, indicating that there's no need to refresh the token.
	return !!localStorage.getItem('refreshTokenTimestamp');
};

// This function is used to remove the stored refresh token timestamp from the browser's local storage.
// Use it when the token's expired or the user logs out.
export const removeTokenTimestamp = () => {
	// The 'localStorage.removeItem' method removes the specified item from local storage,
	// which means that the stored timestamp and any associated expiration information is cleared.
	localStorage.removeItem('refreshTokenTimestamp');
};
