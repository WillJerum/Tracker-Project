const helper = require('./helper.js');
const React = require('react');
const {createRoot} = require('react-dom/client');

// Function to handle login
// This function is responsible for handling the login process, including form submission and validation.
const handleLogin = async (e) => {
    e.preventDefault();
    helper.hideError();

    const username = e.target.querySelector('#user').value;
    const pass = e.target.querySelector('#pass').value;

    if (!username || !pass) {
        helper.handleError('Username or password is empty!', 'user');
        return false;
    }

    try {
        const response = await fetch(e.target.action, {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json',
            },
            body: JSON.stringify({ username, pass }),
        });

        const result = await response.json();

        if (response.status !== 200) {
            helper.handleError(result.error || 'An error occurred.', 'user');
            return false;
        }

        window.location = result.redirect;
    } catch (err) {
        console.error('Failed to log in:', err);
        helper.handleError('An error occurred during login.', 'user');
    }

    return false;
}

// Function to handle signup
const handleSignup = async (e) => {
    e.preventDefault();
    helper.hideError();

    const username = e.target.querySelector('#user').value;
    const pass = e.target.querySelector('#pass').value;
    const pass2 = e.target.querySelector('#pass2').value;

    if (!username) {
        helper.handleError('Username is required!', 'user');
        return false;
    }

    if (!pass) {
        helper.handleError('Password is required!', 'pass');
        return false;
    }

    if (!pass2) {
        helper.handleError('Please confirm your password!', 'pass2');
        return false;
    }

    if (pass !== pass2) {
        helper.handleError('Passwords do not match!', 'pass2');
        return false;
    }

    try {
        const response = await fetch(e.target.action, {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json',
            },
            body: JSON.stringify({ username, pass, pass2 }),
        });

        const result = await response.json();

        if (response.status !== 200) {
            helper.handleError(result.error || 'An error occurred.', 'user');
            return false;
        }

        window.location = result.redirect;
    } catch (err) {
        console.error('Failed to sign up:', err);
        helper.handleError('An error occurred during signup.', 'user');
    }

    return false;
}

// Login component
const LoginWindow = (props) => {
    return (
        <div class="loginBox">
            <form id="loginForm"
                name="loginForm"
                onSubmit={handleLogin}
                action="/login"
                method="POST"
                className="mainForm"
            >
                <label htmlFor="username">Username: </label>
                <input id="user" type="text" name="username" placeholder="username" />
                <label htmlFor="pass">Password: </label>
                <input id="pass" type="password" name="pass" placeholder="password" />
                <input className="formSubmit" type="submit" value="Sign in" />
            </form>
        </div>
    );
}

// Signup component
// This component is responsible for rendering the signup form and handling the signup process.
const SignupWindow = (props) => {
    return (
        <div class="loginBox">
            <form id="signupForm"
                name="signupForm"
                onSubmit={handleSignup}
                action="/signup"
                method="POST"
                className="mainForm"
            >
                <label htmlFor="username">Username: </label>
                <input id="user" type="text" name="username" placeholder="username" />
                <label htmlFor="pass">Password: </label>
                <input id="pass" type="password" name="pass" placeholder="password" />
                <label htmlFor="pass2">Retype Password: </label>
                <input id="pass2" type="password" name="pass2" placeholder="retype password" />
                <label htmlFor="premium">Premium Account ($9.99): </label>
                <input id="premium" type="checkbox" name="premium" />
                <input className="formSubmit" type="submit" value="Sign up" />
            </form>
        </div>
    );
}

const init = () => {
    const loginButton = document.getElementById('loginButton');
    const signupButton = document.getElementById('signupButton');

    const root = createRoot(document.getElementById('content'));

    loginButton.addEventListener('click', (e) => {
        e.preventDefault();
        root.render(<LoginWindow />);
        return false;
    });

    signupButton.addEventListener('click', (e) => {
        e.preventDefault();
        root.render(<SignupWindow />);
        return false;
    });

    root.render(<LoginWindow />);
};

window.onload = init;