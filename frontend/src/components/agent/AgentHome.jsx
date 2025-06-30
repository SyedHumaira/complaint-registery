// File: frontend/src/components/agent/AgentHome.jsx
import React, { useState, useEffect } from 'react';
import Button from 'react-bootstrap/Button';
import Container from 'react-bootstrap/Container';
import Navbar from 'react-bootstrap/Navbar';
import Card from 'react-bootstrap/Card';
import Collapse from 'react-bootstrap/Collapse';
import Alert from 'react-bootstrap/Alert';
import axios from 'axios';
import ChatWindow from '../common/ChatWindow';
import Footer from '../common/FooterC';
import { useNavigate } from 'react-router-dom';

const AgentHome = () => {
  const navigate = useNavigate();
  const [userName, setUserName] = useState('');
  const [toggle, setToggle] = useState({});
  const [agentComplaintList, setAgentComplaintList] = useState([]);
  const [filter, setFilter] = useState('All');
  const [sortOrder, setSortOrder] = useState('desc');

  useEffect(() => {
    const getData = async () => {
      try {
        const user = JSON.parse(localStorage.getItem('user'));
        if (user) {
          const { _id, name } = user;
          setUserName(name);
          const response = await axios.get(`http://localhost:8000/allcomplaints/${_id}`);
          setAgentComplaintList(response.data);
        } else {
          navigate('/');
        }
      } catch (error) {
        console.log(error);
      }
    };
    getData();
  }, [navigate]);

  const handleStatusChange = async (complaintId) => {
    try {
      await axios.put(`http://localhost:8000/complaint/${complaintId}`, {
        status: 'completed',
      });
      setAgentComplaintList((prev) =>
        prev.map((c) =>
          (c.complaintId === complaintId || c._id === complaintId)
            ? { ...c, status: 'completed' }
            : c
        )
      );
    } catch (error) {
      console.log(error);
    }
  };

  const handleDelete = async (complaintId) => {
    if (window.confirm("Are you sure you want to delete this completed complaint?")) {
      try {
        await axios.delete(`http://localhost:8000/Complaint/${complaintId}`);
        setAgentComplaintList((prev) =>
          prev.filter((c) => c.complaintId !== complaintId && c._id !== complaintId)
        );
      } catch (error) {
        console.log(error);
      }
    }
  };

  const handleToggle = (complaintId) => {
    setToggle((prev) => ({
      ...prev,
      [complaintId]: !prev[complaintId],
    }));
  };

  const style = {
    marginTop: '66px',
  };

  const filteredComplaints = agentComplaintList
    .filter((c) =>
      filter === 'All' ? true : c.status === filter.toLowerCase()
    )
    .sort((a, b) =>
      sortOrder === 'desc'
        ? new Date(b.createdAt) - new Date(a.createdAt)
        : new Date(a.createdAt) - new Date(b.createdAt)
    );

  return (
    <>
      {/* Header */}
      <Navbar bg="secondary" variant="dark" className="px-4">
        <Navbar.Brand className="text-white">Hi Agent {userName}</Navbar.Brand>
      </Navbar>

      {/* Page Layout */}
      <div className="container-fluid" style={{ display: 'flex', padding: '20px', minHeight: '85vh' }}>

        {/* Sidebar */}
        <div
          className="bg-light"
          style={{
            width: '250px',
            borderRight: '1px solid #ccc',
            padding: '20px',
          }}
        >
          <h5 className="mb-3">Filters</h5>
          {['All', 'Pending', 'Completed'].map((status) => (
            <Button
              key={status}
              variant={filter === status ? 'primary' : 'outline-primary'}
              className="w-100 mb-2"
              onClick={() => setFilter(status)}
            >
              {status}
            </Button>
          ))}

          <hr />

          <label className="fw-bold mb-2">Sort By</label>
          <select
            className="form-select"
            value={sortOrder}
            onChange={(e) => setSortOrder(e.target.value)}
          >
            <option value="desc">Newest First</option>
            <option value="asc">Oldest First</option>
          </select>
        </div>

        {/* Complaints area */}
        <div
          style={{
            flex: 1,
            overflowX: 'auto',
            whiteSpace: 'nowrap',
            paddingLeft: '20px',
            display: 'flex',
            gap: '16px',
          }}
        >
          {filteredComplaints && filteredComplaints.length > 0 ? (
            filteredComplaints.map((complaint) => {
              const complaintId = complaint.complaintId || complaint._id;
              if (!complaintId) return null;
              const isOpen = toggle[complaintId] || false;

              return (
                <Card
                  key={complaintId}
                  style={{
                    width: '18rem',
                    flex: '0 0 auto',
                    display: 'inline-block',
                  }}
                >
                  <Card.Body>
                    <Card.Title><b>Name:</b> {complaint.name}</Card.Title>
                    <Card.Text><b>Address:</b> {complaint.address}</Card.Text>
                    <Card.Text><b>City:</b> {complaint.city}</Card.Text>
                    <Card.Text><b>State:</b> {complaint.state}</Card.Text>
                    <Card.Text><b>Pincode:</b> {complaint.pincode}</Card.Text>
                    <Card.Text><b>Comment:</b> {complaint.comment}</Card.Text>
                    <Card.Text><b>Status:</b> {complaint.status}</Card.Text>

                    {complaint.status !== 'completed' ? (
                      <Button
                        onClick={() => handleStatusChange(complaintId)}
                        variant="primary"
                        className="mb-2"
                      >
                        Mark Completed
                      </Button>
                    ) : (
                      <Button
                        onClick={() => handleDelete(complaintId)}
                        variant="danger"
                        className="mb-2"
                      >
                        Delete
                      </Button>
                    )}

                    <Button
                      onClick={() => handleToggle(complaintId)}
                      aria-controls={`collapse-${complaintId}`}
                      aria-expanded={!isOpen}
                      className="mx-2"
                      variant="secondary"
                    >
                      Message
                    </Button>

                    <Collapse in={!isOpen} dimension="width">
                      <div id={`collapse-${complaintId}`}>
                        <Card body style={{ width: '250px', marginTop: '12px' }}>
                          <ChatWindow complaintId={complaintId} name={userName} />
                        </Card>
                      </div>
                    </Collapse>
                  </Card.Body>
                </Card>
              );
            })
          ) : (
            <Alert variant="info">
              <Alert.Heading>No complaints to show</Alert.Heading>
            </Alert>
          )}
        </div>
      </div>

      <Footer style={style} />
    </>
  );
};

export default AgentHome;
