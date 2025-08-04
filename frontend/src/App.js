import React, { useState } from 'react';
import TaskList from './components/TaskList';
import TaskModal from './components/TaskModal';

function App() {
  const [showModal, setShowModal] = useState(false);
  const [taskToEdit, setTaskToEdit] = useState(null);

  const handleAddClick = () => {
    setTaskToEdit(null); // new task
    setShowModal(true);
  };

  return (
    <div className="container py-5">
      <h2 className="text-center text-primary mb-4">📝 Task Manager</h2>

      {/* Top Add Button */}
      <div className="d-flex justify-content-end mb-3">
        <button className="btn btn-success px-4 py-2" onClick={handleAddClick}>
          + Add Task
        </button>
      </div>

      <TaskList onEdit={(task) => { setTaskToEdit(task); setShowModal(true); }} />
      <TaskModal show={showModal} onHide={() => setShowModal(false)} task={taskToEdit} />
    </div>
  );
}

export default App;
