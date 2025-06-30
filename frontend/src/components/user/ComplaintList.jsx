// File: complaint-registery/frontend/src/components/user/ComplaintList.jsx
import React from "react";
import { Card, ListGroup } from "react-bootstrap";

const ComplaintList = ({ complaints }) => {
  if (!complaints.length) {
    return <h5>No complaints found.</h5>;
  }

  return (
    <ListGroup>
      {complaints.map((complaint) => (
        <Card key={complaint._id} className="mb-3">
          <Card.Body>
            <Card.Title>{complaint.name}</Card.Title>
            <Card.Subtitle className="mb-2 text-muted">{complaint.status.toUpperCase()}</Card.Subtitle>
            <Card.Text>
              {complaint.comment}<br />
              <strong>Address:</strong> {complaint.address}, {complaint.city}, {complaint.state}, {complaint.pincode}
            </Card.Text>
            <small className="text-muted">Filed on {new Date(complaint.createdAt).toLocaleString()}</small>
          </Card.Body>
        </Card>
      ))}
    </ListGroup>
  );
};

export default ComplaintList;
