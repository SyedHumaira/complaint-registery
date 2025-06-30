// File: frontend/src/components/user/UserDashboard.jsx
import React, { useEffect, useState } from "react";
import axios from "axios";
import { io } from "socket.io-client";
import ChatWindow from "../common/ChatWindow"; // ✅ Add this import
import "./UserDashboard.css";

const socket = io("http://localhost:8000");

const UserDashboard = () => {
  const user = JSON.parse(localStorage.getItem("user"));
  const [complaints, setComplaints] = useState([]);
  const [filter, setFilter] = useState("All");
  const [sort, setSort] = useState("desc");
  const [editingId, setEditingId] = useState(null);
  const [editData, setEditData] = useState({ comment: "", address: "" });

  const fetchComplaints = async () => {
    try {
      const res = await axios.get(`http://localhost:8000/status/${user._id}`);
      const sorted = res.data.sort((a, b) =>
        sort === "desc"
          ? new Date(b.createdAt) - new Date(a.createdAt)
          : new Date(a.createdAt) - new Date(b.createdAt)
      );
      setComplaints(sorted);
    } catch (err) {
      console.error("Failed to fetch complaints:", err);
    }
  };

  useEffect(() => {
    fetchComplaints();
  }, [sort]);

  useEffect(() => {
    socket.on("newComplaint", (newComplaint) => {
      if (newComplaint.userId === user._id) {
        fetchComplaints();
      }
    });
    return () => {
      socket.off("newComplaint");
    };
  }, []);

  const handleFilter = (status) => setFilter(status);
  const handleSortChange = (e) => setSort(e.target.value);

  const filtered = complaints.filter((c) =>
    filter === "All" ? true : c.status === filter
  );

  const handleDelete = async (id) => {
    if (window.confirm("Are you sure you want to delete this complaint?")) {
      try {
        await axios.delete(`http://localhost:8000/Complaint/${id}`);
        fetchComplaints();
      } catch (err) {
        alert("Failed to delete complaint");
      }
    }
  };

  const startEdit = (complaint) => {
    setEditingId(complaint._id);
    setEditData({ comment: complaint.comment, address: complaint.address });
  };

  const handleEditChange = (e) => {
    const { name, value } = e.target;
    setEditData({ ...editData, [name]: value });
  };

  const saveEdit = async (id) => {
    try {
      await axios.put(`http://localhost:8000/Complaint/${id}`, editData);
      setEditingId(null);
      fetchComplaints();
    } catch (err) {
      alert("Failed to update complaint");
    }
  };

  return (
    <div style={{ display: "flex", height: "100vh" }}>
      {/* Sidebar */}
      <div style={{ width: "240px", padding: "20px", background: "#f8f9fa" }}>
        <h4>📁 Dashboard</h4>
        <ul className="nav flex-column">
          {["All", "pending", "completed"].map((status) => (
            <li key={status} className="nav-item mb-2">
              <button
                onClick={() => handleFilter(status)}
                className={`btn btn-outline-dark w-100 ${
                  filter === status ? "active" : ""
                }`}
              >
                {status === "All"
                  ? "All Complaints"
                  : status.charAt(0).toUpperCase() + status.slice(1)}
              </button>
            </li>
          ))}
          <li className="nav-item">
            <a href="/RegisterComplaint" className="btn btn-dark w-100">
              ➕ Register Complaint
            </a>
          </li>
        </ul>

        <hr />
        <label className="mb-2 fw-bold">Sort by:</label>
        <select
          className="form-select"
          value={sort}
          onChange={handleSortChange}
        >
          <option value="desc">Newest First</option>
          <option value="asc">Oldest First</option>
        </select>
      </div>

      {/* Content */}
      <div style={{ flex: 1, padding: "30px", background: "#ced4da" }}>
        <h3>Your Complaints</h3>
        {filtered.length === 0 ? (
          <p className="mt-4">No complaints found.</p>
        ) : (
          filtered.map((c) => (
            <div
              key={c._id}
              className="p-4 my-3 bg-light border rounded position-relative"
            >
              <h5>{user.name}</h5>
              <p className="fw-bold text-uppercase text-secondary">{c.status}</p>

              {editingId === c._id ? (
                <>
                  <textarea
                    name="comment"
                    className="form-control mb-2"
                    value={editData.comment}
                    onChange={handleEditChange}
                  />
                  <input
                    name="address"
                    className="form-control mb-2"
                    value={editData.address}
                    onChange={handleEditChange}
                  />
                  <button
                    className="btn btn-success btn-sm me-2"
                    onClick={() => saveEdit(c._id)}
                  >
                    ✅ Save
                  </button>
                  <button
                    className="btn btn-secondary btn-sm"
                    onClick={() => setEditingId(null)}
                  >
                    ❌ Cancel
                  </button>
                </>
              ) : (
                <>
                  <p><strong>Description:</strong> {c.comment}</p>
                  <p><strong>Address:</strong> {c.address}</p>
                  <p className="text-muted">
                    Registered on:{" "}
                    {new Date(c.createdAt).toLocaleString("en-IN")}
                  </p>
                  <button
                    className="btn btn-sm btn-outline-primary me-2"
                    onClick={() => startEdit(c)}
                  >
                    ✏️ Edit
                  </button>
                  <button
                    className="btn btn-sm btn-outline-danger"
                    onClick={() => handleDelete(c._id)}
                  >
                    🗑️ Delete
                  </button>

                  {/* ✅ Chat Window added here */}
                  <div className="mt-3">
                    <strong>Messages:</strong>
                    <ChatWindow complaintId={c._id} name={user.name} />
                  </div>
                </>
              )}
            </div>
          ))
        )}
      </div>
    </div>
  );
};

export default UserDashboard;
