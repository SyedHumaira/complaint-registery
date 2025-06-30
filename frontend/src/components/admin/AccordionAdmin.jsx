// File: frontend/src/components/admin/AccordionAdmin.jsx
import React, { useState, useEffect } from 'react';
import Accordion from 'react-bootstrap/Accordion';
import Card from 'react-bootstrap/Card';
import Dropdown from 'react-bootstrap/Dropdown';
import Alert from 'react-bootstrap/Alert';
import Button from 'react-bootstrap/Button';
import Footer from '../common/FooterC';
import axios from 'axios';

const AccordionAdmin = ({ filter }) => {
  const [complaintList, setComplaintList] = useState([]);
  const [agentList, setAgentList] = useState([]);

  useEffect(() => {
    const fetchData = async () => {
      try {
        const complaints = await axios.get('http://localhost:8000/status');
        const agents = await axios.get('http://localhost:8000/AgentUsers');
        setComplaintList(complaints.data);
        setAgentList(agents.data);
      } catch (error) {
        console.log(error);
      }
    };
    fetchData();
  }, []);

  const handleSelection = async (agentId, complaintId, status, agentName) => {
    try {
      await axios.post('http://localhost:8000/assignedComplaints', {
        agentId,
        complaintId,
        status,
        agentName,
      });

      setComplaintList((prev) =>
        prev.map((c) =>
          c._id === complaintId ? { ...c, assigned: agentName } : c
        )
      );

      alert(`Complaint assigned to Agent ${agentName}`);
    } catch (error) {
      console.log(error);
    }
  };

  const handleDelete = async (complaintId) => {
    if (window.confirm("Delete this completed complaint?")) {
      try {
        await axios.delete(`http://localhost:8000/Complaint/${complaintId}`);
        setComplaintList((prev) => prev.filter((c) => c._id !== complaintId));
      } catch (error) {
        console.error("Error deleting complaint:", error);
      }
    }
  };

  const filteredComplaints = complaintList.filter((c) =>
    filter.toLowerCase() === 'all'
      ? true
      : c.status?.toLowerCase() === filter.toLowerCase()
  );

  return (
    <div>
      <Accordion alwaysOpen>
        {/* Complaints Panel */}
        <Accordion.Item eventKey="0">
          <Accordion.Header>User Complaints</Accordion.Header>
          <Accordion.Body style={{ background: 'aliceblue' }}>
            <div style={{ display: 'flex', flexWrap: 'wrap', margin: '20px' }}>
              {filteredComplaints.length > 0 ? (
                filteredComplaints.map((complaint, index) => (
                  <Card
                    key={index}
                    style={{ width: '15rem', margin: '0 10px 15px 0' }}
                  >
                    <Card.Body style={{ textAlign: 'center' }}>
                      <Card.Title>Name: {complaint.name}</Card.Title>
                      <div style={{ fontSize: '14px', marginTop: '20px' }}>
                        <Card.Text>Address: {complaint.address}</Card.Text>
                        <Card.Text>City: {complaint.city}</Card.Text>
                        <Card.Text>State: {complaint.state}</Card.Text>
                        <Card.Text>Pincode: {complaint.pincode}</Card.Text>
                        <Card.Text>Comment: {complaint.comment}</Card.Text>
                        <Card.Text>Status: {complaint.status}</Card.Text>
                      </div>

                      {complaint.status === 'completed' ? (
                        <>
                          <div className="text-muted mt-2">✅ Completed</div>
                          <Button
                            size="sm"
                            variant="outline-danger"
                            className="mt-2"
                            onClick={() => handleDelete(complaint._id)}
                          >
                            🗑️ Delete
                          </Button>
                        </>
                      ) : complaint.assigned ? (
                        <div className="text-success fw-semibold mt-2">
                          ✅ Assigned to {complaint.assigned}
                        </div>
                      ) : (
                        <Dropdown className="mt-2">
                          <Dropdown.Toggle variant="warning">
                            Assign
                          </Dropdown.Toggle>
                          <Dropdown.Menu>
                            {agentList.map((agent, idx) => (
                              <Dropdown.Item
                                key={idx}
                                onClick={() =>
                                  handleSelection(
                                    agent._id,
                                    complaint._id,
                                    complaint.status,
                                    agent.name
                                  )
                                }
                              >
                                {agent.name}
                              </Dropdown.Item>
                            ))}
                          </Dropdown.Menu>
                        </Dropdown>
                      )}
                    </Card.Body>
                  </Card>
                ))
              ) : (
                <Alert variant="info">
                  <Alert.Heading>No complaints to show</Alert.Heading>
                </Alert>
              )}
            </div>
          </Accordion.Body>
        </Accordion.Item>

        {/* Agents Panel */}
        <Accordion.Item eventKey="1">
          <Accordion.Header>Agents</Accordion.Header>
          <Accordion.Body style={{ background: 'aliceblue' }}>
            <div style={{ display: 'flex', flexWrap: 'wrap', margin: '20px' }}>
              {agentList.length > 0 ? (
                agentList.map((agent, index) => (
                  <Card
                    key={index}
                    style={{ width: '22rem', margin: '0 10px 15px 0' }}
                  >
                    <Card.Body>
                      <Card.Title>Name: {agent.name}</Card.Title>
                      <Card.Text>Email: {agent.email}</Card.Text>
                    </Card.Body>
                  </Card>
                ))
              ) : (
                <Alert variant="info">
                  <Alert.Heading>No Agents to show</Alert.Heading>
                </Alert>
              )}
            </div>
          </Accordion.Body>
        </Accordion.Item>

        {/* Assigned Complaints Overview */}
        <Accordion.Item eventKey="2">
          <Accordion.Header>Complaints Assigned to Agents</Accordion.Header>
          <Accordion.Body style={{ background: 'aliceblue' }}>
            {agentList.map((agent, i) => {
              const agentComplaints = complaintList.filter(
                (c) => c.assigned === agent.name
              );

              return (
                <Card key={i} className="mb-3">
                  <Card.Header style={{ backgroundColor: '#e0f0e9' }}>
                    <strong>Agent:</strong> {agent.name}
                  </Card.Header>
                  <Card.Body>
                    {agentComplaints.length > 0 ? (
                      agentComplaints.map((comp, idx) => (
                        <div
                          key={idx}
                          className="border-bottom mb-2 pb-2"
                        >
                          <p><strong>Complaint:</strong> {comp.comment}</p>
                          <p><strong>Status:</strong> {comp.status}</p>
                        </div>
                      ))
                    ) : (
                      <p className="text-muted">No complaints assigned</p>
                    )}
                  </Card.Body>
                </Card>
              );
            })}
          </Accordion.Body>
        </Accordion.Item>
      </Accordion>
      <Footer />
    </div>
  );
};

export default AccordionAdmin;
