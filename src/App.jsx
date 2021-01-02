import React from 'react';
import './App.css';

function App() {
	const prevData = {
		id: null,
		title: '',
		completed: false,
	};

	const [todo, setTodo] = React.useState([]);
	const [active, setActive] = React.useState(prevData);

	const [editing, setEditing] = React.useState(false);

	const url = 'http://127.0.0.1:8000/api/';

	function fetchData() {
		fetch(url + 'task-list/')
			.then((res) => res.json())
			.then((data) => {
				setTodo(data);
			});

		console.log('Fetching...');
	}

	React.useEffect(() => {
		fetchData();
	}, []);

	const handleChange = (e) => {
		setActive((prev) => ({ ...prev, [e.target.name]: e.target.value }));
	};

	const handleSubmit = (e) => {
		e.preventDefault();

		if (editing) {
			const newUrl = `${url}task-update/${active.id}/`;

			fetch(newUrl, {
				method: 'POST',
				headers: {
					'Content-type': 'application/json',
				},
				body: JSON.stringify(active),
			})
				.then(() => {
					setActive(prevData);
					fetchData();
				})
				.catch((e) => console.error(e));
		} else {
			fetch(url + 'task-create/', {
				method: 'POST',
				headers: {
					'Content-type': 'application/json',
				},
				body: JSON.stringify(active),
			})
				.then(() => {
					setActive(prevData);
					fetchData();
				})
				.catch((e) => console.error(e));
		}
	};

	const handleEdit = (task) => {
		setActive(task);
		setEditing(true);
	};

	const handleDelete = (task) => {
		fetch(`${url}task-delete/${task.id}/`, {
			method: 'DELETE',
		})
			.then(() => {
				fetchData();
			})
			.catch((e) => console.error(e));
	};

	const handleCompleted = (task) => {
		const newUrl = `${url}task-update/${task.id}/`;

		task.completed = !task.completed;

		fetch(newUrl, {
			method: 'POST',
			headers: {
				'Content-type': 'application/json',
			},
			body: JSON.stringify(task),
		})
			.then(() => {
				setActive(prevData);
				fetchData();
			})
			.catch((e) => console.error(e));
	};

	return (
		<div className='container'>
			<div id='task-container'>
				<div id='form-wrapper'>
					<form onSubmit={handleSubmit} id='form'>
						<div className='flex-wrapper'>
							<div style={{ flex: 6 }} className='m-2'>
								<input
									type='text'
									name='title'
									id='Add task'
									onChange={handleChange}
									className='form-control'
									value={active.title}
								/>
							</div>

							<div style={{ flex: 1 }} className='m-2'>
								<input
									type='submit'
									id='submit'
									value='Add'
									className='btn btn-warning'
								/>
							</div>
						</div>
					</form>
				</div>

				<div id='list-wrapper'>
					{todo.map((task) => (
						<div key={task.id} className='task-wrapper flex-wrapper'>
							<div
								style={{
									flex: 7,
								}}
								onClick={() => handleCompleted(task)}
							>
								<span
									style={{
										textDecoration: task.completed ? 'line-through' : 'none',
									}}
								>
									{task.title}
								</span>
							</div>
							<div style={{ flex: 1 }}>
								<button
									className='btn btn-sm btn-outline-info'
									onClick={() => {
										handleEdit(task);
									}}
								>
									Edit
								</button>
							</div>
							<div style={{ flex: 1 }}>
								<button
									onClick={() => {
										handleDelete(task);
									}}
									className='btn btn-sm btn-outline-dark delete'
								>
									-
								</button>
							</div>
						</div>
					))}
				</div>
			</div>
		</div>
	);
}

export default App;
