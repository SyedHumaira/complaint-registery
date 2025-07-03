// File: frontend/src/components/common/SignUp.jsx
import axios from "axios";
import React, { useState } from "react";
import { Link } from "react-router-dom";
import { toast } from "react-toastify";

import FooterC from "./FooterC";

const SignUp = () => {
  const [title, setTitle] = useState("Select User");
  const [user, setUser] = useState({
    name: "",
    email: "",
    password: "",
    phone: "",
    userType: ""
  });

  const handleChange = (e) => {
    setUser({ ...user, [e.target.name]: e.target.value });
  };

  const handleTitle = (select) => {
    setTitle(select);
    setUser({ ...user, userType: select });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    const updatedUser = {
      ...user,
      email: user.email.toLowerCase(),
      userType: title
    };

    try {
      await axios.post("http://localhost:8000/SignUp", updatedUser);
      toast.success("Signup successful ✅");
    } catch (err) {
      console.error(err);
      toast.error("Signup failed ❌");
    }

    setUser({ name: "", email: "", password: "", phone: "", userType: "" });
    setTitle("Select User");
  };

  return (
    <>
    
      <section className="gradient-custom" style={{ minHeight: "100vh" }}>
        <div className="container py-5">
          <div className="row justify-content-center align-items-center">
            <div className="col-12 col-md-8 col-lg-6 col-xl-5">
              <div className="card bg-dark text-white">
                <div className="card-body p-5 text-center">
                  <h2 className="fw-bold mb-4">SignUp</h2>
                  <form onSubmit={handleSubmit}>
                    {[{ name: "name", type: "text" },
                      { name: "email", type: "email" },
                      { name: "password", type: "password" },
                      { name: "phone", type: "text" }
                    ].map((field, i) => (
                      <div className="form-outline form-white mb-3" key={i}>
                        <input
                          type={field.type}
                          name={field.name}
                          value={user[field.name]}
                          onChange={handleChange}
                          className="form-control form-control-lg"
                          required
                        />
                        <label className="form-label">
                          {field.name.charAt(0).toUpperCase() + field.name.slice(1)}
                        </label>
                      </div>
                    ))}

                    <div className="form-outline form-white mb-4">
                      <select
                        className="form-select"
                        value={title}
                        onChange={(e) => handleTitle(e.target.value)}
                        required
                      >
                        <option disabled>Select User</option>
                        <option>Ordinary</option>
                        <option>Admin</option>
                        <option>Agent</option>
                      </select>
                      <label className="form-label">User Type</label>
                    </div>

                    <button className="btn btn-outline-light btn-lg px-5" type="submit">
                      Register
                    </button>
                  </form>

                  <p className="mb-0 mt-3">
                    Already have an account? <Link to="/Login">Login</Link>
                  </p>
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>
      <FooterC />
    </>
  );
};

export default SignUp;
