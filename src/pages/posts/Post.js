import React from 'react';
import styles from '../../styles/Post.module.css';
import { useCurrentUser } from '../../contexts/CurrentUserContext';
import { Card, Media, OverlayTrigger, Tooltip } from 'react-bootstrap';
import { Link } from 'react-router-dom';
import Avatar from '../../components/Avatar';
import { axiosRes } from '../../api/axiosDefaults';

const Post = (props) => {
	const {
		id,
		owner,
		profile_id,
		profile_image,
		comments_count,
		likes_count,
		like_id,
		title,
		content,
		image,
		updated_at,
		postPage,
		setPosts,
	} = props;

	const currentUser = useCurrentUser();
	const is_owner = currentUser?.username === owner;

	const handleLike = async () => {
		try {
			const { data } = await axiosRes.post('/likes/', { post: id });
			setPosts((prevPosts) => ({
				...prevPosts,
				results: prevPosts.results.map((post) => {
					return post.id === id
						? { ...post, likes_count: post.likes_count + 1, like_id: data.id }
						: post;
				}),
			}));
		} catch (err) {
			console.log(err);
		}
	};

	// handleUnlike, an asynchronous function for handling the "unlike" action
	const handleUnlike = async () => {
		try {
			// Try to execute the following code block

			// Sends a DELETE request to the server to remove a like
			// The URL includes the like_id, indicating which like is being removed
			await axiosRes.delete(`/likes/${like_id}/`);

			// Updates the state of posts using setPosts
			setPosts((prevPosts) => ({
				// Copies all existing state properties from prevPosts
				...prevPosts,
				// Updates the results array within the state
				results: prevPosts.results.map((post) => {
					// Iterates over each post in the results

					// Checks if the current post's ID matches the given ID
					return post.id === id
						? // If it's a match, update the post's like count and reset like_id
						  { ...post, likes_count: post.likes_count - 1, like_id: null }
						: // If it's not a match, return the post as is
						  post;
				}),
			}));
		} catch (err) {
			// Catches any errors that occur in the try block

			// Logs the error to the console
			console.log(err);
		}
	};

	return (
		<Card className={styles.Post}>
			<Card.Body>
				<Media className="align-items-center justify-content-between">
					<Link to={`/profiles/${profile_id}`}>
						<Avatar src={profile_image} height={55} />
						{owner}
					</Link>
					<div className="d-flex align-items-center">
						<span>{updated_at}</span>
						{is_owner && postPage && '...'}
					</div>
				</Media>
			</Card.Body>
			<Link to={`/posts/${id}`}>
				<Card.Img src={image} alt={title} />
			</Link>
			<Card.Body>
				{title && <Card.Title className="text-center">{title}</Card.Title>}
				{content && <Card.Text>{content}</Card.Text>}
				<div className={styles.PostBar}>
					{is_owner ? (
						<OverlayTrigger
							placement="top"
							overlay={<Tooltip>You can't like your own post!</Tooltip>}
						>
							<i className="far fa-heart" />
						</OverlayTrigger>
					) : like_id ? (
						<span onClick={handleUnlike}>
							<i className={`fas fa-heart ${styles.Heart}`} />
						</span>
					) : currentUser ? (
						<span onClick={handleLike}>
							<i className={`far fa-heart ${styles.HeartOutline}`} />
						</span>
					) : (
						<OverlayTrigger placement="top" overlay={<Tooltip>Log in to like posts!</Tooltip>}>
							<i className="far fa-heart" />
						</OverlayTrigger>
					)}
					{likes_count}
					<Link to={`/posts/${id}`}>
						<i className="far fa-comments" />
					</Link>
					{comments_count}
				</div>
			</Card.Body>
		</Card>
	);
};

export default Post;