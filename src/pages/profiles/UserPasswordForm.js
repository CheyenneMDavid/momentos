import React, { useEffect, useState } from 'react';

import Alert from 'react-bootstrap/Alert';
import Button from 'react-bootstrap/Button';
import Container from 'react-bootstrap/Container';
import Row from 'react-bootstrap/Row';
import Col from 'react-bootstrap/Col';
import Form from 'react-bootstrap/Form';

import { useHistory, useParams } from 'react-router-dom';
import { axiosRes } from '../../api/axiosDefaults';
import { useCurrentUser } from '../../contexts/CurrentUserContext';

import btnStyles from '../../styles/Button.module.css';
import appStyles from '../../App.module.css';

const UserPasswordForm = () => {
	const history = useHistory();
	const { id } = useParams();
	const currentUser = useCurrentUser();

	const [userData, setUserData] = useState({
		new_password1: '',
		new_password2: '',
	});
	const { new_password1, new_password2 } = userData;

	const [errors, setErrors] = useState({});

	const handleChange = (event) => {
		setUserData({
			...userData,
			[event.target.name]: event.target.value,
		});
	};

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
			await axiosRes.post('/dj-rest-auth/password/change/', userData);
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
					<Form onSubmit={handleSubmit}>
						<Form.Group>
							<Form.Label>New password</Form.Label>
							<Form.Control
								placeholder="new password"
								type="password"
								value={new_password1}
								onChange={handleChange}
								name="new_password1"
							/>
						</Form.Group>
						{errors?.new_password1?.map((message, idx) => (
							<Alert key={idx} variant="warning">
								{message}
							</Alert>
						))}
						<Form.Group>
							<Form.Label>Confirm password</Form.Label>
							<Form.Control
								placeholder="confirm new password"
								type="password"
								value={new_password2}
								onChange={handleChange}
								name="new_password2"
							/>
						</Form.Group>
						{errors?.new_password2?.map((message, idx) => (
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
						<Button type="submit" className={`${btnStyles.Button} ${btnStyles.Blue}`}>
							save
						</Button>
					</Form>
				</Container>
			</Col>
		</Row>
	);
};

export default UserPasswordForm;
