/* Takes in an error message. Sets the error message up in html, and
   displays it to the user. Will be hidden by other events that could
   end in an error.
*/
const handleError = (message, elementId) => {
    // Remove any existing error messages
    const existingError = document.querySelector(`#${elementId} + .errorMessage`);
    if (existingError) {
        existingError.remove();
    }

    // Create a new error message element
    const errorElement = document.createElement('p');
    errorElement.className = 'errorMessage';
    errorElement.textContent = message;

    // Insert the error message after the input field
    const inputElement = document.getElementById(elementId);
    if (inputElement) {
        inputElement.parentNode.insertBefore(errorElement, inputElement.nextSibling);
    } else {
        console.error(`Element with ID "${elementId}" not found.`);
    }
};

/* Sends post requests to the server using fetch. Will look for various
   entries in the response JSON object, and will handle them appropriately.
*/
const sendPost = async (url, data, handler) => {
    const response = await fetch(url, {
        method: 'POST',
        headers: {
            'Content-Type': 'application/json',
        },
        body: JSON.stringify(data),
    });

    const result = await response.json();
    document.getElementById('taskMessage').classList.add('hidden');

    if (result.redirect) {
        window.location = result.redirect;
    }

    if (result.error) {
        handleError(result.error);
    }

    if (handler) {
        handler(result);
    }
};

const hideError = () => {
    // Remove all error messages
    const errorMessages = document.querySelectorAll('.errorMessage');
    errorMessages.forEach((error) => error.remove());
};

module.exports = {
    handleError,
    hideError,
    sendPost,
};
