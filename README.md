    1. The purpose of this application is to provide a lightweight, minimalist approach to task tracking for solo projects.
In cases where a project is too complicated to keep track of mentally, but not complicated enough to warrant
implementation of a complex enterprise solution such as Trello, this app should provide a happy medium to ensure
work is done effectively with no oversights.

    2. I'm using React for the main page components. I've created components for the Task List, Task Modal, Sorting, Filtering, Pagination, and
input form. There are also React components being used for the signup, login, and password change functions, however the former two were lifted
from DomoMaker with some tweaks.

    3. I'm storing account data as well as task data in MongoDB. Account data includes usernames, hashed passwords, and premium status. Task data 
includes name, priority, status, and description of each task.

    4. I think I ended up with an app that is genuinely useful, which is a lot more than I can say for other projects I've made in other classes.
The user experience is clean, fast, and responsive, making it really great for personal use cases. I could legitimately see myself using this as part
of my own professional workflows.
    
    5. The application concept doesn't leave me a lot of room to show off the best of the best as to what I can do. I thought a lot about how I could
implement more complex features, but I had trouble finding anything that didn't feel forced. For example, sure, I could show off what I know about web audio and
add background music or something, but would that actually make any sense? 

    6. I learned a lot about React components as well as React syntax. Having modern development tools like Copilot available to me, with advanced predictive
syntax writing allowed me to learn how to write good code much more effectively than just reading the documentation. As a hands-on learner, I feel like
I really gained a lot from this experience.

    7. I would try to think of more useful features to add to the project. The only real unimplemented idea that I had was my task deletion system, but I found that 
would actually undermine my monetization concept, so I didn't include it. I would love to get some real world testing feedback and use that as a basis to implement
new features, but for a short-term project like this, that's not quite possible.

    8. I did not go above and beyond.

    9. As previously stated, I had GitHub Copilot working with me on this project. I used Copilot to quickly prototype basic concepts, which I then later implemented fully by
hand. I also used Copilot to help in the debugging process, as well as having it clean up some of my messy syntax, since complicated syntax is not my
strong suit. The only part of the code that was more Copilot than me was the CSS, as I had a lot of components to style, and I felt my time would be
better served working on features and the like. The CSS code blocks I borrowed from Copilot were made based on my exact specifications, and tweaked until
they matched my original vision. As such, you will see a lot of Copilot comments in the CSS, but the rest of the code has my hand-written comments from
when I was working.

-- URL ENDPOINTS --

URL: /settings
Supported Methods: GET
Middleware: Requires Login
Query Params: N/A
Description: Displays user settings page
Return Type(s): HTML

URL: /changePassword
Supported Methods: POST
Middleware: Requires Login
Query Params: newPassword
Description: Changes user password
Return Type(s): JSON

URL: /getTasks
Supported Methods: GET
Middleware: Requires Login
Query Params: id
Description: Gets the list of tasks. Can be used with id param to find one specific task.
Return Type(s): JSON

URL: /login
Supported Methods: GET, POST
Middleware: Requires Secure, Requires Login
Query Params: N/A
Description: Displays login page. Logs a user into their account.
Return Type(s): HTML, JSON

URL: /signup
Supported Methods: POST
Middleware: Requires Secure, Requires Logout
Query Params: N/A
Description: Creates a new account
Return Type(s): JSON

URL: /logout
Supported Methods: GET
Middleware: Requires Login
Query Params: N/A
Description: Logs user out of account
Return Type(s): HTML

URL: /maker
Supported Methods: GET, POST
Middleware: Requires Login
Query Params: N/A
Description: Loads Task page. Allows user to create and view Tasks.
Return Type(s): HTML, JSON

URL: /updateTaskStatus
Supported Methods: PATCH
Middleware: Requires Login
Query Params: N/A
Description: Modifies server-side completion status of a task
Return Type(s): JSON

URL: /getUserStatus
Supported Methods: GET
Middleware: Requires Login
Query Params: N/A
Description: Gets the premium status of a user.
Return Type(s): JSON