import React, { useEffect, useState } from 'react';

import Alert from 'react-bootstrap/Alert';
import Button from 'react-bootstrap/Button';
import Col from 'react-bootstrap/Col';
import Container from 'react-bootstrap/Container';
import Form from 'react-bootstrap/Form';
import Row from 'react-bootstrap/Row';

import { useHistory, useParams } from 'react-router-dom';
import { axiosRes } from '../../api/axiosDefaults';
import { useCurrentUser, useSetCurrentUser } from '../../contexts/CurrentUserContext';

import btnStyles from '../../styles/Button.module.css';
import appStyles from '../../App.module.css';

const UsernameForm = () => {
	const [username, setUsername] = useState('');
	const [errors, setErrors] = useState({});

	const history = useHistory();
	const { id } = useParams();

	const currentUser = useCurrentUser();
	const setCurrentUser = useSetCurrentUser();

	// useEffect hook to handle side effects related to user authentication and navigation
	useEffect(() => {
		// Check if currentUser is defined and if their profile_id is different from the current 'id'
		// The toString() method converts the profile_id to a string value to ensure the comparison
		// is made between values of the same type.
		if (currentUser?.profile_id?.toString() !== id) {
			// If currentUser's profile_id doesn't match the 'id', it means the currentUser is not
			// the owner of this profile and gets redirected

			// The user gets redirected to the homepage.
			// The 'history' object is used for navigation. 'push' is a method that navigates to a new path.
			// '/' represents the root route, usually the homepage.
			history.push('/');
		}
		// The useEffect hook will re-run whenever the values of currentUser, history, or id change.
		// This is because they are specified in the dependency array.
		// The dependency array is the second argument to useEffect.
	}, [currentUser, history, id]);

	const handleSubmit = async (event) => {
		event.preventDefault();
		try {
			await axiosRes.put('/dj-rest-auth/user/', {
				username,
			});
			setCurrentUser((prevUser) => ({
				...prevUser,
				username,
			}));
			history.goBack();
		} catch (err) {
			console.log(err);
			setErrors(err.response?.data);
		}
	};

	return (
		<Row>
			<Col className="py-2 mx-auto text-center" md={6}>
				<Container className={appStyles.Content}>
					<Form onSubmit={handleSubmit} className="my-2">
						<Form.Group>
							<Form.Label>Change username</Form.Label>
							<Form.Control
								placeholder="username"
								type="text"
								value={username}
								onChange={(event) => setUsername(event.target.value)}
							/>
						</Form.Group>
						{errors?.username?.map((message, idx) => (
							<Alert key={idx} variant="warning">
								{message}
							</Alert>
						))}
						<Button
							className={`${btnStyles.Button} ${btnStyles.Blue}`}
							onClick={() => history.goBack()}
						>
							cancel
						</Button>
						<Button className={`${btnStyles.Button} ${btnStyles.Blue}`} type="submit">
							save
						</Button>
					</Form>
				</Container>
			</Col>
		</Row>
	);
};

export default UsernameForm;
