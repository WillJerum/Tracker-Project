    1. The purpose of this application is to provide a lightweight, minimalist approach to task tracking for solo projects.
In cases where a project is too complicated to keep track of mentally, but not complicated enough to warrant
implementation of a complex enterprise solution such as Trello, this app should provide a happy medium to ensure
work is done effectively with no oversights.

    2. This milestone incorporates a user signup/login, a password change system, and persistent sessions. As for the app itself,
I currently have the basic task view working, as well as a sidebar for creation of new tasks. The current display supports 
sorting, filtering, and pagination. Clicking on a task will show more details in the Task Modal at the top of the list, which updates
in real time as tasks are checked/unchecked. 

    3. I currently still need to input some sort of monetization concept. I was leaning towards the idea of premium accounts. A premium
account would allow users to bypass the cap on task list size (still to be implemented) as its main draw. A premium account would also remove ads
(which have also yet to be implemented). As a stretch goal, I might also add the ability to delete tasks.

    4. I'm using React for the main page components. I've created components for the Task List, Task Modal, Sorting, Filtering, Pagination, and
input form. There are also React components being used for the signup, login, and password change functions, however the former two were lifted
from DomoMaker with some tweaks. I don't plan to implement more components at the moment, unless it becomes necessary for the monetization concept.

    5. I'm storing account data as well as task data in MongoDB. I expect to also store Premium status as part of user account data later down the
line. Other than that, I don't expect to need MongoDB for anything else.

    6. Please see answer to question #3.

    7. I don't currently have a plan for going above and beyond. If I think of something as I go, I'd like to implement it, but as it stands right 
now, I don't have any ideas that don't feel completely arbitrary. I feel my time would be better spent polishing up the basics of the program rather
than adding unnecessary features for the sake of showing off.

    8. I had GitHub Copilot working with me on this project. I used Copilot to quickly prototype basic concepts, which I then later implemented fully by
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