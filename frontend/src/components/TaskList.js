import React, { useEffect, useState } from 'react';
import axios from 'axios';
import { Table, Button, Modal, Spinner, Form } from 'react-bootstrap';

function TaskList({ onEdit }) {
  const [tasks, setTasks] = useState([]);
  const [offset, setOffset] = useState(0);
  const [loading, setLoading] = useState(false);
  const [showDelete, setShowDelete] = useState(false);
  const [deleteId, setDeleteId] = useState(null);
  const [hasMore, setHasMore] = useState(true);
  const [search, setSearch] = useState('');
  const LIMIT = 10;

  const fetchTasks = async (reset = false, searchTerm = search) => {
    try {
      setLoading(true);
      const currentOffset = reset ? 0 : offset;

      const res = await axios.get('http://localhost:5000/api/tasks', {
        params: {
          limit: LIMIT,
          offset: currentOffset,
          search: searchTerm
        }
      });

      const sorted = res.data.sort((a, b) => {
        if (a.status === b.status) return 0;
        return a.status === 'Pending' ? -1 : 1;
      });

      if (reset) {
        setTasks(sorted);
        setOffset(LIMIT);
      } else {
        setTasks(prev => [...prev, ...sorted]);
        setOffset(prev => prev + LIMIT);
      }

      setHasMore(res.data.length === LIMIT);
      setLoading(false);
    } catch (err) {
      console.error(err);
      setLoading(false);
    }
  };

  const confirmDelete = (id) => {
    setDeleteId(id);
    setShowDelete(true);
  };

  const deleteTask = async () => {
    await axios.delete(`http://localhost:5000/api/tasks/${deleteId}`);
    setShowDelete(false);
    setOffset(0);
    fetchTasks(true); // reset list
  };

  useEffect(() => {
    fetchTasks(true);
  }, []);

  const handleSearchChange = (e) => {
    const value = e.target.value;
    setSearch(value);
    setOffset(0);
    fetchTasks(true, value);
  };

  return (
    <>
      {/* 🔍 Search Bar */}
      <div className="mb-3">
        <Form.Control
          type="text"
          placeholder="🔍 Search by task title..."
          value={search}
          onChange={handleSearchChange}
        />
      </div>

      <Table striped bordered hover responsive>
        <thead className="table-primary">
          <tr>
            <th>Title</th>
            <th>Description</th>
            <th>Status</th>
            <th className="text-center">Actions</th>
          </tr>
        </thead>
        <tbody>
          {tasks.map(task => (
            <tr key={task.id}>
              <td>{task.title}</td>
              <td>{task.description}</td>
              <td>
                <span className={`badge ${task.status === 'Completed' ? 'bg-success' : 'bg-danger'}`}>
                  {task.status}
                </span>
              </td>
              <td className="text-center">
                <Button size="sm" variant="warning" className="me-2" onClick={() => onEdit(task)}>Edit</Button>
                <Button size="sm" variant="danger" onClick={() => confirmDelete(task.id)}>Delete</Button>
              </td>
            </tr>
          ))}
        </tbody>
      </Table>

      {/* ⏳ Spinner or Load More */}
      <div className="d-flex justify-content-center mb-4">
        {loading ? (
          <Spinner animation="border" variant="primary" />
        ) : (
          hasMore && (
            <Button variant="outline-primary" onClick={() => fetchTasks()}>
              Load More
            </Button>
          )
        )}
      </div>

      {/* ❗ Delete Confirmation Modal */}
      <Modal show={showDelete} onHide={() => setShowDelete(false)} centered>
        <Modal.Header closeButton>
          <Modal.Title>Confirm Delete</Modal.Title>
        </Modal.Header>
        <Modal.Body>Are you sure you want to delete this task?</Modal.Body>
        <Modal.Footer>
          <Button variant="secondary" onClick={() => setShowDelete(false)}>Cancel</Button>
          <Button variant="danger" onClick={deleteTask}>Delete</Button>
        </Modal.Footer>
      </Modal>
    </>
  );
}

export default TaskList;
