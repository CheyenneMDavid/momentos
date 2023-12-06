import React, { useState } from 'react';

import Form from 'react-bootstrap/Form';
import Button from 'react-bootstrap/Button';
import Row from 'react-bootstrap/Row';
import Col from 'react-bootstrap/Col';
import Container from 'react-bootstrap/Container';

import Upload from '../../assets/upload.png';

import styles from '../../styles/PostCreateEditForm.module.css';
import appStyles from '../../App.module.css';
import btnStyles from '../../styles/Button.module.css';
import Asset from '../../components/Asset';
import { Image } from 'react-bootstrap';

// == State for handling form errors ==
function PostCreateForm() {
	const [errors, setErrors] = useState({});

	// == State for handling form data: title, content, and image ==
	// Create the postData and setPostData variables with the useState hook:
	// This is done at the beginning of the PostCreateForm function. The useState
	// hook is used to initialize the postData state variable and it's
	// updater function setPostData.
	// Inside the useState hook, set the object defaults for title, content, and
	// the image keys to empty strings:
	const [postData, setPostData] = useState({
		title: '',
		content: '',
		image: '',
	});

	// == Destructuring postData state into individual variables ==
	// Destructure all of the postData object attributes:
	// Remember to do this right after the useState declaration. The title,
	// content, and image attributes are destructured from postData.
	const { title, content, image } = postData;

	// == Function to handle changes in text input fields (title and content) ==
	// Create a handleChange function to handle the input field's state changes:
	// The handleChange function is defined to update the postData state based on
	// input field changes.This function is used to handle changes in the
	// title and content fields.
	const handleChange = (event) => {
		setPostData({
			...postData,
			[event.target.name]: event.target.value,
		});
	};

	// == Function to handle image file changes ==
	const handleChangeImage = (event) => {
		// checks if user has chosen a file to upload by checking in the
		// files array.
		if (event.target.files.length) {
			// In case the user decides to change their image file after adding one,
			// we also need to call URL.revokeObjectURL to clear the browser's
			// reference to the previous file.
			URL.revokeObjectURL(image);
			// Call the setPostData function
			setPostData({
				// and use the spread operator to spread the postData
				...postData,
				// and then set the image attribute's value using URL.createObjectURL
				// and pass it the file in the files array.
				// To access the file that has just been chosen, we have to access the
				// files array on event.target and choose the first one.
				image: URL.createObjectURL(event.target.files[0]),
			});
		}
	};

	const textFields = (
		<div className="text-center">
			<Form.Group>
				<Form.Label>Title</Form.Label>

				{/* Set the appropriate value props for the Form.Control components:
				// In the textFields JSX, the Form.Control for the title and content fields are
				// set with the value prop linked to the corresponding destructured state variables. */}
				{/* Set the onChange prop for the Form.Control components to use the {handleChange} function: */}
				<Form.Control type="text" name="title" value={title} onChange={handleChange} />
			</Form.Group>
			<Form.Group>
				<Form.Label>Content</Form.Label>

				{/* Set the appropriate value props for the Form.Control components:
				// In the textFields JSX, the Form.Control for the title and content fields are
				// set with the value prop linked to the corresponding destructured state variables. */}
				{/* Set the onChange prop for the Form.Control components to use the {handleChange} function: */}
				<Form.Control
					as="textarea"
					rows={6}
					name="content"
					value={content}
					onChange={handleChange}
				/>
			</Form.Group>

			<Button className={`${btnStyles.Button} ${btnStyles.Blue}`} onClick={() => {}}>
				cancel
			</Button>
			<Button className={`${btnStyles.Button} ${btnStyles.Blue}`} type="submit">
				create
			</Button>
		</div>
	);

	// == Logic to display the image preview ==
	return (
		<Form>
			<Row>
				<Col className="py-2 p-0 p-md-2" md={7} lg={8}>
					<Container
						className={`${appStyles.Content} ${styles.Container} d-flex flex-column justify-content-center`}
					>
						<Form.Group className="text-center">
							{/* Add a ternary to show a preview of the user's image if they have chosen one.
							Otherwise, just show the upload icon and the message saying 
							// "Click or tap to upload an image" */}
							{image ? (
								// Use the fragment element " <>  </>" within React to group
								// children without adding extra nodes to the DOM
								<>
									{/* Use the <Figure> element in React Bootstrap to ensure
									semantic structure, accessibility, consistent styling, ease
									of use, and responsiveness. */}
									<figure>
										{/* Self closing image tag. Use src= to define whatever is
										in the curly brackets as a variable and then dynaically
										display the image. The rounded prop just rounds off the
										images, making it look nicer.*/}
										<Image className={appStyles.Image} src={image} rounded />
									</figure>
									<div>
										<Form.Label
											// Form label has styling in order to look like a button.
											className={`${btnStyles.Button} ${btnStyles.Blue} btn`}
											// JSX equivelent to a label for the input.
											htmlFor="image-upload"
										>
											Change the image
										</Form.Label>
									</div>
								</>
							) : (
								<Form.Label className="d-flex justify-content-center" htmlFor="image-upload">
									{/* Message to user if they haven't chosen an image to upload */}
									<Asset src={Upload} message="Click or tap to upload an image" />
								</Form.Label>
							)}
							{/* Create a new input field for the users to upload their image.
							Use the react-bootstrap Form.File component.
							Set it’s id to image-upload, and give it an accept prop of image/*,  
							so that only images can be uploaded.  */}
							{/* Add the onChange prop to the Form.File component and set it
							to use the functions called "handleChangeImage" */}
							<Form.File id="image-upload" accept="image/*" onChange={handleChangeImage} />
						</Form.Group>
						<div className="d-md-none">{textFields}</div>
					</Container>
				</Col>
				<Col md={5} lg={4} className="d-none d-md-block p-0 p-md-2">
					<Container className={appStyles.Content}>{textFields}</Container>
				</Col>
			</Row>
		</Form>
	);
}

export default PostCreateForm;
