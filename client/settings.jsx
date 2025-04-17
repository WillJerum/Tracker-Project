const helper = require('./helper.js');
const React = require('react');
const { createRoot } = require('react-dom/client');

// Function to handle password change
const handleChangePassword = async (e) => {
    e.preventDefault();
    helper.hideError();

    const newPassword = e.target.querySelector('#newPassword').value.trim();
    const confirmPassword = e.target.querySelector('#confirmPassword').value.trim();

    if (!newPassword || !confirmPassword) {
        helper.handleError('All fields are required!');
        return false;
    }

    if (newPassword !== confirmPassword) {
        helper.handleError('New passwords do not match!');
        return false;
    }

    try {
        // Use a custom handler to process the response
        await helper.sendPost('/changePassword', { newPassword }, (result) => {
            if (result.message) {
                // Handle success case
                helper.handleError(result.message); // Display success message
            } else if (!result.error) {
                // Handle unexpected success response
                helper.handleError('Password changed successfully!');
            }
        });
    } catch (err) {
        // Handle unexpected errors
        console.error('Error in handleChangePassword:', err);
        helper.handleError('An unexpected error occurred!');
    }

    return false;
};

// React component for the change password form
const ChangePasswordForm = () => {
    return (
        <div class="loginBox">
            <form id="changePasswordForm" onSubmit={handleChangePassword} className="mainForm">
                <label htmlFor="newPassword">New Password: </label>
                <input id="newPassword" type="password" name="newPassword" placeholder="New Password" />
                <label htmlFor="confirmPassword">Confirm Password: </label>
                <input id="confirmPassword" type="password" name="confirmPassword" placeholder="Confirm Password" />
                <input className="formSubmit" type="submit" value="Change Password" />
            </form>
        </div>
    );
};

const init = () => {
    const root = createRoot(document.getElementById('settings'));
    root.render(<ChangePasswordForm />);
};

window.onload = init;