import { axiosReq } from '../api/axiosDefaults';

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
		console.log(err);
	}
};
