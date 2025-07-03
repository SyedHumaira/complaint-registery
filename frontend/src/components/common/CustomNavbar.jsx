// File: frontend/src/components/common/CustomNavbar.jsx
import React from "react";
import { Link, useNavigate } from "react-router-dom";
import Navbar from "react-bootstrap/Navbar";
import Container from "react-bootstrap/Container";
import Nav from "react-bootstrap/Nav";

const CustomNavbar = () => {
  const user = JSON.parse(localStorage.getItem("user"));
  const navigate = useNavigate();

  const handleLogout = () => {
    localStorage.removeItem("user");
    navigate("/");
    window.location.reload(); // ✅ fix double navbar issue
  };

  return (
    <Navbar bg="dark" variant="dark" expand="lg" style={{ padding: "20px 0" }}>
      <Container>
        <Navbar.Brand as={Link} to="/" style={{ fontWeight: "600", fontSize: "22px" }}>
          ComplaintCare
        </Navbar.Brand>
        <Navbar.Toggle aria-controls="navbarScroll" />
        <Navbar.Collapse id="navbarScroll">
          <Nav className="ms-auto">
            {!user ? (
              <>
                <Nav.Link as={Link} to="/" style={navLinkStyle}>Home</Nav.Link>
                <Nav.Link as={Link} to="/Login" style={navLinkStyle}>Login</Nav.Link>
                <Nav.Link as={Link} to="/SignUp" style={navLinkStyle}>Sign Up</Nav.Link>
              </>
            ) : (
              <>
                <Nav.Link as={Link} to="/dashboard" style={navLinkStyle}>Dashboard</Nav.Link>
                <Nav.Link as={Link} to="/Profile" style={navLinkStyle}>Profile</Nav.Link>
                <Nav.Link onClick={handleLogout} style={navLinkStyle}>Logout</Nav.Link>
              </>
            )}
          </Nav>
        </Navbar.Collapse>
      </Container>
    </Navbar>
  );
};

const navLinkStyle = {
  color: "#ffffff",
  fontWeight: "600",
  fontSize: "17px",
  margin: "0 10px",
};

export default CustomNavbar;
