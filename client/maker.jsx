const helper = require('./helper.js');
const React = require('react');
const {useState, useEffect} = React;
const {createRoot} = require('react-dom/client');

const handleDomo = (e, onDomoAdded) => {
    e.preventDefault();
    helper.hideError();

    const name = e.target.querySelector('#domoName').value;
    const age = e.target.querySelector('#domoAge').value;
    const level = e.target.querySelector('#domoLevel').value;

    if (!name || !age || !level) {
        helper.handleError('All fields are required!');
        return false;
    }

    helper.sendPost(e.target.action, {name, age, level}, () => onDomoAdded(name, age, level));
    return false;
}



const DomoForm = (props) => {
    return(
        <form id="domoForm"
            onSubmit={(e) => handleDomo(e, props.triggerReload)}
            name="domoForm"
            action="/maker"
            method="POST"
            className="domoForm"
        >
            <div>
                <label htmlFor="name">Name: </label>
                <input id="domoName" type="text" name="name" placeholder="Domo Name" />
            </div>
            <div>
                <label htmlFor="age">Age: </label>
                <input id="domoAge" type="number" min="0" name="age" />
            </div>
            <div>
                <label htmlFor="level">Level: </label>
                <input id="domoLevel" type="number" min="1" name="level" />
            </div>
            <input className="makeDomoSubmit" type="submit" value="Make Domo" />
        </form>
    );
}

const DomoList = (props) => {
    const [domos, setDomos] = useState([props.domos]);
    const [sortKey, setSortKey] = useState('name'); 

    useEffect(() => {
        const loadDomosFromServer = async () => {
            const response = await fetch('/getDomos');
            const data = await response.json();
            setDomos(data.domos);
        };
        loadDomosFromServer();
    }, [props.reloadDomos]);

    const handleSortChange = (e) => {
        setSortKey(e.target.value);
    };

    const sortedDomos = [...domos].sort((a, b) => {
        if (sortKey === 'name') return a.name.localeCompare(b.name);
        if (sortKey === 'age') return a.age - b.age;
        if (sortKey === 'level') return a.level - b.level;
        return 0;
    });

    if (domos.length === 0) {
        return (
            <div className="domoList">
                <h3 className="emptyDomo">No Domos yet!</h3>
            </div>
        );
    }

    const domoNodes = sortedDomos.map((domo) => (
        <div key={domo._id} className="domo">
            <img src="/assets/img/domoface.jpeg" alt="domo face" className="domoFace" />
            <h3 className="domoName">{domo.name}</h3>
            <h3 className="domoAge">Age: {domo.age}</h3>
            <h3 className="domoLevel">Level: {domo.level}</h3>
        </div>
    ));

    return (
        <div>
            <div className="sortOptions">
                <label htmlFor="sort">Sort By: </label>
                <select id="sort" onChange={handleSortChange}>
                    <option value="name">Name</option>
                    <option value="age">Age</option>
                    <option value="level">Level</option>
                </select>
            </div>
            <div className="domoList">{domoNodes}</div>
        </div>
    );
};

const App = () => {
    const [reloadDomos, setReloadDomos] = useState(false);

    return (
        <div>
            <div id="makeDomo">
            <DomoForm triggerReload={() => setReloadDomos(!reloadDomos)} />
            </div>
            <div id="domos">
                <DomoList domos={[]} reloadDomos={reloadDomos} />
            </div>
        </div>
    );
};

const init = () => {
    const root = createRoot(document.getElementById('app'));
    root.render(<App />);
};

window.onload = init;