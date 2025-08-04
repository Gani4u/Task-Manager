import React, { useState, useEffect } from 'react';
import { Modal, Button, Form, Alert } from 'react-bootstrap';
import axios from 'axios';

function TaskModal({ show, onHide, task }) {
  const [title, setTitle] = useState('');
  const [description, setDescription] = useState('');
  const [status, setStatus] = useState('Pending');
  const [error, setError] = useState('');

  useEffect(() => {
    if (task) {
      setTitle(task.title);
      setDescription(task.description);
      setStatus(task.status);
    } else {
      setTitle('');
      setDescription('');
      setStatus('Pending');
    }
    setError('');
  }, [task]);

  const handleSubmit = async () => {
    if (!title.trim()) {
      setError('Title is required');
      return;
    }

    try {
      if (task) {
        await axios.put(`http://localhost:5000/api/tasks/${task.id}`, { title, description, status });
      } else {
        await axios.post('http://localhost:5000/api/tasks', { title, description, status });
      }

      onHide();
      window.location.reload();
    } catch (err) {
      console.error(err);
      setError('Something went wrong. Please try again.');
    }
  };

  return (
    <Modal show={show} onHide={onHide} centered>
      <Modal.Header closeButton>
        <Modal.Title>{task ? 'Update Task' : 'Add Task'}</Modal.Title>
      </Modal.Header>
      <Modal.Body>
        {error && <Alert variant="danger">{error}</Alert>}

        <Form>
          <Form.Group className="mb-3">
            <Form.Label>Title</Form.Label>
            <Form.Control
              value={title}
              onChange={e => setTitle(e.target.value)}
              isInvalid={!!error && !title.trim()}
              placeholder="Enter task title"
            />
            <Form.Control.Feedback type="invalid">
              Title is required
            </Form.Control.Feedback>
          </Form.Group>

          <Form.Group className="mb-3">
            <Form.Label>Description</Form.Label>
            <Form.Control
              as="textarea"
              value={description}
              onChange={e => setDescription(e.target.value)}
              placeholder="Enter task description"
            />
          </Form.Group>

          {task && (
            <Form.Group className="mb-3">
              <Form.Label>Status</Form.Label>
              <Form.Select value={status} onChange={e => setStatus(e.target.value)}>
                <option>Pending</option>
                <option>Completed</option>
              </Form.Select>
            </Form.Group>
          )}
        </Form>
      </Modal.Body>
      <Modal.Footer>
        <Button variant="secondary" onClick={onHide}>Cancel</Button>
        <Button variant="primary" onClick={handleSubmit}>{task ? 'Update' : 'Add'}</Button>
      </Modal.Footer>
    </Modal>
  );
}

export default TaskModal;
