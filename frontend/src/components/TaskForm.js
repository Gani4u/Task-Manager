import React, { useState } from 'react';
import axios from 'axios';

function TaskForm() {
  const [task, setTask] = useState({ title: '', description: '' });

  const handleSubmit = async (e) => {
    e.preventDefault();
    await axios.post('http://localhost:5000/api/tasks', task);
    window.location.reload();
  };

  return (
    <form onSubmit={handleSubmit} className="mb-3">
      <input className="form-control mb-2"
        placeholder="Title"
        value={task.title}
        onChange={(e) => setTask({ ...task, title: e.target.value })}
      />
      <textarea className="form-control mb-2"
        placeholder="Description"
        value={task.description}
        onChange={(e) => setTask({ ...task, description: e.target.value })}
      />
      <button className="btn btn-primary">Add Task</button>
    </form>
  );
}

export default TaskForm;
