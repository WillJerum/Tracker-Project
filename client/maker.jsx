const helper = require('./helper.js');
const React = require('react');
const {useState, useEffect} = React;
const {createRoot} = require('react-dom/client');

const handleTask = (e, onTaskAdded) => {
    e.preventDefault();
    helper.hideError();

    const name = e.target.querySelector('#taskName').value.trim();
    const priority = e.target.querySelector('#taskPriority').value.trim();

    if (!name || !priority) {
        helper.handleError('All fields are required!');
        return false;
    }

    // Send name, priority, and default status (false)
    helper.sendPost(e.target.action, { name, priority, status: false }, () => onTaskAdded(name, priority));
    return false;
}

const makeTask = async (req, res) => {
    if (!req.body.name || !req.body.priority) {
        return res.status(400).json({ error: 'Name and priority are required!' });
    }

    const taskData = {
        name: req.body.name,
        priority: req.body.priority,
        status: false, // Default to false
        owner: req.session.account._id,
    };

    try {
        const newTask = new Task(taskData);
        await newTask.save();
        return res.status(201).json({ name: newTask.name, priority: newTask.priority, status: newTask.status });
    } catch (err) {
        console.log(err);
        if (err.code === 11000) {
            return res.status(400).json({ error: 'Task already exists!' });
        }
        return res.status(500).json({ error: 'An error occurred creating task!' });
    }
};

const TaskForm = (props) => {
    return (
        <form
            id="taskForm"
            onSubmit={(e) => handleTask(e, props.triggerReload)}
            name="taskForm"
            action="/maker"
            method="POST"
            className="taskForm"
        >
            <div>
                <label htmlFor="name">Name: </label>
                <input id="taskName" type="text" name="name" placeholder="Task Name" />
            </div>
            <div>
                <label htmlFor="priority">Priority: </label>
                <input id="taskPriority" type="number" min="0" name="priority" />
            </div>
            <input className="makeTaskSubmit" type="submit" value="Make Task" />
        </form>
    );
};

const TaskList = (props) => {
    const [tasks, setTasks] = useState([props.tasks]);
    const [sortKey, setSortKey] = useState('name'); 

    useEffect(() => {
        const loadTasksFromServer = async () => {
            const response = await fetch('/getTasks');
            const data = await response.json();
            setTasks(data.tasks);
        };
        loadTasksFromServer();
    }, [props.reloadTasks]);

    const handleSortChange = (e) => {
        setSortKey(e.target.value);
    };

    const sortedTasks = [...tasks].sort((a, b) => {
        if (sortKey === 'name') return a.name.localeCompare(b.name);
        if (sortKey === 'priority') return a.priority - b.priority;
        if (sortKey === 'status') return a.status === b.status ? 0 : a.status ? -1 : 1;
        return 0;
    });

    const toggleTaskStatus = async (taskId, currentStatus) => {
        const response = await fetch('/updateTaskStatus', {
            method: 'PATCH',
            headers: {
                'Content-Type': 'application/json',
            },
            body: JSON.stringify({ taskId, status: !currentStatus }), // Toggle the status
        });
    
        const result = await response.json();
        if (result.error) {
            console.error(result.error);
        } else {
            props.triggerReload(); // Use the passed triggerReload function
        }
    };

    if (tasks.length === 0) {
        return (
            <div className="taskList">
                <h3 className="emptyTask">No Tasks yet!</h3>
            </div>
        );
    }

    const taskNodes = sortedTasks.map((task) => (
        <div key={task._id} className="task">
            <img src="/assets/img/clipboard.png" alt="task icon" className="taskIcon" />
            <h3 className="taskName">{task.name}</h3>
            <h3 className="taskPriority">Priority: {task.priority}</h3>
            <label>
                <input
                    type="checkbox"
                    checked={task.status}
                    onChange={() => toggleTaskStatus(task._id, task.status)}
                />Mark as Done</label>
        </div>
    ));

    return (
        <div>
            <div className="sortOptions">
                <label htmlFor="sort">Sort By: </label>
                <select id="sort" onChange={handleSortChange}>
                    <option value="name">Name</option>
                    <option value="priority">Priority</option>
                    <option value="status">Status</option>
                </select>
            </div>
            <div className="taskList">{taskNodes}</div>
        </div>
    );
};

const App = () => {
    const [reloadTasks, setReloadTasks] = useState(false);

    const triggerReload = () => setReloadTasks(!reloadTasks);

    return (
        <div>
            <div id="makeTask">
                <TaskForm triggerReload={triggerReload} />
            </div>
            <div id="tasks">
                <TaskList tasks={[]} reloadTasks={reloadTasks} triggerReload={triggerReload} />
            </div>
        </div>
    );
};

const init = () => {
    const root = createRoot(document.getElementById('app'));
    root.render(<App />);
};

window.onload = init;