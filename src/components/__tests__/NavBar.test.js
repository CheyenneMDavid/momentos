// Importing functions and components for testing.
import { render, screen, fireEvent } from '@testing-library/react';
import { BrowserRouter as Router } from 'react-router-dom';
import NavBar from '../NavBar';
import { CurrentUserProvider } from '../../contexts/CurrentUserContext';

// Test case to check if NavBar component renders correctly.
test('renders NavBar', () => {
	// Wrapping NavBar component inside Router for routing context
	render(
		<Router>
			<NavBar />
		</Router>,
	);
	// Before being commented out, the 'screen.debug()' was used in React testing
	// to print the current DOM output to the console, aiding in visualizing and
	// debugging the rendered state of components during tests.
	// screen.debug(); <--- It was commented out here.

	// Locating the 'Sign in' link in the NavBar
	const signInLink = screen.getByRole('link', { name: 'Sign in' });

	// first making it fail by including 'not' in the assertion like so:
	// "expect(signInLink).not.toBeInTheDocument();"

	// Asserting that the 'Sign in' link is present in the document
	expect(signInLink).toBeInTheDocument();
});

// Test case to ensure user profile link is rendered for logged-in users.
test('renders link to the user profile for a logged in user', async () => {
	// Rendering NavBar with CurrentUserProvider to simulate user context
	render(
		<Router>
			<CurrentUserProvider>
				<NavBar />
			</CurrentUserProvider>
		</Router>,
	);

	// Awaiting and finding the 'Profile' text in the NavBar.
	const profileAvatar = await screen.findByText('Profile');

	// first making it fail by including 'not' in the assertion like so:
	// "expect(profileAvatar).not.toBeInTheDocument();"

	// Asserting that the profile avatar is present in the document.
	expect(profileAvatar).toBeInTheDocument();
});

// Test case to verify Sign in and Sign up buttons are rendered on log out.
test('renders Sign in and Sign up buttons again on log out', async () => {
	render(
		// Rendering NavBar with user context.
		<Router>
			<CurrentUserProvider>
				<NavBar />
			</CurrentUserProvider>
		</Router>,
	);

	// Locating and clicking the 'Sign out' link.
	const signOutLink = await screen.findByRole('link', { name: 'Sign out' });
	// Utilizing the imported fireEvent from the react testing library to mimic
	// user interaction with the DOM.  In this case, the click.
	fireEvent.click(signOutLink);

	// Locating the 'Sign in' and 'Sign up' links post logout.
	const signInLink = await screen.findByRole('link', { name: 'Sign in' });
	const signUpLink = await screen.findByRole('link', { name: 'Sign up' });

	// first making it fail by including 'not' in the assertions.

	// Asserting both 'Sign in' and 'Sign up' links are present post logout.
	expect(signInLink).toBeInTheDocument();
	expect(signUpLink).toBeInTheDocument();
});
