// File: frontend/src/components/common/RegisterComplaint.jsx
import React, { useState } from "react";
import axios from "axios";
import { useNavigate } from "react-router-dom";
import Footer from "./FooterC";
import { toast } from "react-toastify";
import CustomNavbar from "./CustomNavbar";

const RegisterComplaint = () => {
  const navigate = useNavigate();
  const user = JSON.parse(localStorage.getItem("user"));

  const [complaint, setComplaint] = useState({
    name: user?.name || "",
    address: "",
    city: "",
    state: "",
    pincode: "",
    comment: ""
  });

  const handleChange = (e) => {
    const { name, value } = e.target;
    setComplaint({ ...complaint, [name]: value });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      await axios.post(`http://localhost:8000/Complaint/${user._id}`, complaint);
      toast.success("✅ Complaint registered successfully!");
      navigate("/dashboard");
    } catch (err) {
      toast.error("❌ Failed to register complaint");
      console.error(err);
    }
  };

  return (
    <>
      <CustomNavbar />

      <div className="container my-5">
        <h3 className="mb-4">📝 Register a Complaint</h3>
        <form onSubmit={handleSubmit}>
          {["name", "address", "city", "state", "pincode"].map((field, i) => (
            <div className="mb-3" key={i}>
              <label className="form-label fw-bold">
                {field.charAt(0).toUpperCase() + field.slice(1)}
              </label>
              <input
                type={field === "pincode" ? "number" : "text"}
                name={field}
                className="form-control"
                value={complaint[field]}
                onChange={handleChange}
                required
              />
            </div>
          ))}

          <div className="mb-3">
            <label className="form-label fw-bold">Complaint Description</label>
            <textarea
              name="comment"
              className="form-control"
              rows="4"
              value={complaint.comment}
              onChange={handleChange}
              required
            ></textarea>
          </div>

          <button className="btn btn-dark" type="submit">
            Submit Complaint
          </button>
        </form>
      </div>

      <Footer />
    </>
  );
};

export default RegisterComplaint;
