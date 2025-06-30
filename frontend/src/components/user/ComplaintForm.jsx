// File: complaint-registery/frontend/src/components/user/ComplaintForm.jsx
import React, { useState } from 'react';
import axios from 'axios';

const ComplaintForm = ({ onSuccess }) => {
  const [complaint, setComplaint] = useState({
    name: "",
    address: "",
    city: "",
    state: "",
    pincode: "",
    comment: ""
  });

  const user = JSON.parse(localStorage.getItem("user"));

  const handleChange = (e) => {
    const { name, value } = e.target;
    setComplaint({ ...complaint, [name]: value });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      await axios.post(`http://localhost:8000/Complaint/${user._id}`, complaint);
      alert("Complaint registered");
      setComplaint({ name: "", address: "", city: "", state: "", pincode: "", comment: "" });
      if (onSuccess) onSuccess(); // ✅ refresh complaints list
    } catch (err) {
      alert("Failed to register complaint");
    }
  };

  return (
    <form onSubmit={handleSubmit}>
      <h4 className="mb-3">Register a Complaint</h4>
      <input name="name" placeholder="Name" value={complaint.name} onChange={handleChange} className="form-control mb-2" required />
      <input name="address" placeholder="Address" value={complaint.address} onChange={handleChange} className="form-control mb-2" required />
      <input name="city" placeholder="City" value={complaint.city} onChange={handleChange} className="form-control mb-2" required />
      <input name="state" placeholder="State" value={complaint.state} onChange={handleChange} className="form-control mb-2" required />
      <input name="pincode" placeholder="Pincode" value={complaint.pincode} onChange={handleChange} className="form-control mb-2" required />
      <textarea name="comment" placeholder="Complaint Details" value={complaint.comment} onChange={handleChange} className="form-control mb-3" required />
      <button type="submit" className="btn btn-primary">Submit</button>
    </form>
  );
};

export default ComplaintForm;
