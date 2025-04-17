const helper = require('./helper.js');
const React = require('react');
const {useState, useEffect} = React;
const {createRoot} = require('react-dom/client');

const handleTask = (e, onTaskAdded) => {
    e.preventDefault();
    helper.hideError();

    const name = e.target.querySelector('#taskName').value.trim();
    const priority = e.target.querySelector('#taskPriority').value.trim();
    const description = e.target.querySelector('#taskDescription').value.trim();

    console.log({ name, priority, description }); // Debugging: Check the values being sent

    if (!name || !priority) {
        helper.handleError('All fields are required!');
        return false;
    }

        helper.sendPost(e.target.action, { name, priority, description, status: false }, () => onTaskAdded(name, priority, description));
    return false;
}

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
            <div>
                <label htmlFor="description">Description: </label>
                <textarea id="taskDescription" name="description" placeholder="Task Description (optional)" rows="3"></textarea>
            </div>
            <input className="makeTaskSubmit" type="submit" value="Make Task" />
        </form>
    );
};

const TaskDetailsModal = ({ task, onClose }) => {
    if (!task) {
        return (
            <div className="taskDetailsBox">
                <h3>Task Details</h3>
                <p>Select a task to view details.</p>
            </div>
        );
    }

    return (
        <div className="taskDetailsBox">
            <h3>Task Details</h3>
            <p><strong>Name:</strong> {task.name}</p>
            <p><strong>Priority:</strong> {task.priority}</p>
            <p><strong>Description:</strong> {task.description || 'No description provided'}</p>
            <p><strong>Status:</strong> {task.status ? 'Completed' : 'Incomplete'}</p>
            <button onClick={onClose} className="closeButton">Close</button>
        </div>
    );
};

const SortOptions = ({ sortKey, onSortChange }) => {
    return (
        <div className="sortOptions">
            <label htmlFor="sort">Sort By: </label>
            <select id="sort" value={sortKey} onChange={(e) => onSortChange(e.target.value)}>
                <option value="name">Name</option>
                <option value="priority">Priority</option>
                <option value="status">Status</option>
            </select>
        </div>
    );
};

const TaskFilter = ({ filter, onFilterChange }) => {
    return (
        <div className="taskFilter">
            <label htmlFor="filter">Filter By: </label>
            <select id="filter" value={filter} onChange={(e) => onFilterChange(e.target.value)}>
                <option value="all">All</option>
                <option value="completed">Completed</option>
                <option value="incomplete">Incomplete</option>
            </select>
        </div>
    );
};

const Pagination = ({ currentPage, totalPages, onPageChange }) => {
    return (
        <div className="pagination">
            <button disabled={currentPage === 1} onClick={() => onPageChange(currentPage - 1)}>
                Previous
            </button>
            <span>Page {currentPage} of {totalPages}</span>
            <button disabled={currentPage === totalPages} onClick={() => onPageChange(currentPage + 1)}>
                Next
            </button>
        </div>
    );
};

const TaskList = (props) => {
    const [tasks, setTasks] = useState([]);
    const [sortKey, setSortKey] = useState('name');
    const [filter, setFilter] = useState('all');
    const [currentPage, setCurrentPage] = useState(1);
    const [selectedTask, setSelectedTask] = useState(null);
    const tasksPerPage = 5;

    useEffect(() => {
        const loadTasksFromServer = async () => {
            const response = await fetch('/getTasks');
            const data = await response.json();
            setTasks(data.tasks);

            // Update the selected task if it exists in the updated tasks list
            if (selectedTask) {
                const updatedTask = data.tasks.find((task) => task._id === selectedTask._id);
                if (updatedTask) {
                    setSelectedTask(updatedTask);
                }
            }
        };
        loadTasksFromServer();
    }, [props.reloadTasks]);

    const handleSortChange = (key) => {
        setSortKey(key);
    };

    const handleFilterChange = (value) => {
        setFilter(value);
        setCurrentPage(1); // Reset to the first page when filtering
    };

    const handleTaskClick = (task) => {
        setSelectedTask(task);
    };

    const closeModal = () => {
        setSelectedTask(null);
    };

    const toggleTaskStatus = async (taskId, currentStatus) => {
        try {
            const response = await fetch('/updateTaskStatus', {
                method: 'PATCH',
                headers: {
                    'Content-Type': 'application/json',
                },
                body: JSON.stringify({ taskId, status: !currentStatus }),
            });

            const result = await response.json();
            if (result.error) {
                console.error(result.error);
            } else {
                props.triggerReload(); // Reload the task list after updating

                // Update the selected task if it matches the updated task
                if (selectedTask && selectedTask._id === taskId) {
                    setSelectedTask({ ...selectedTask, status: !currentStatus });
                }
            }
        } catch (err) {
            console.error('Failed to update task status:', err);
        }
    };

    const filteredTasks = tasks.filter((task) => {
        if (filter === 'completed') return task.status;
        if (filter === 'incomplete') return !task.status;
        return true;
    });

    const sortedTasks = [...filteredTasks].sort((a, b) => {
        if (sortKey === 'name') return a.name.localeCompare(b.name);
        if (sortKey === 'priority') return a.priority - b.priority;
        if (sortKey === 'status') return a.status === b.status ? 0 : a.status ? -1 : 1;
        return 0;
    });

    const startIndex = (currentPage - 1) * tasksPerPage;
    const endIndex = startIndex + tasksPerPage;
    const paginatedTasks = sortedTasks.slice(startIndex, endIndex);

    const totalPages = Math.ceil(sortedTasks.length / tasksPerPage);

    const taskNodes = paginatedTasks.map((task) => (
        <div
            key={task._id}
            className="task"
            title={task.description || 'No description provided'}
            onClick={() => handleTaskClick(task)}
        >
            <img src="/assets/img/clipboard.png" alt="task icon" className="taskIcon" />
            <h3 className="taskName">{task.name}</h3>
            <h3 className="taskPriority">Priority: {task.priority}</h3>
            <label>
                <input
                    type="checkbox"
                    checked={task.status}
                    onChange={() => toggleTaskStatus(task._id, task.status)} 
                />
                Done
            </label>
        </div>
    ));

    return (
        <div>
            <div className="controls">
                <SortOptions sortKey={sortKey} onSortChange={handleSortChange} />
                <TaskFilter filter={filter} onFilterChange={handleFilterChange} />
            </div>
            <TaskDetailsModal task={selectedTask} onClose={closeModal} />
            <div className="taskList">{taskNodes}</div>
            <Pagination
                currentPage={currentPage}
                totalPages={totalPages}
                onPageChange={setCurrentPage}
            />
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