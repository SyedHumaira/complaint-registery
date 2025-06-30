// File: frontend/src/components/admin/AdminHome.jsx
import React, { useEffect, useState } from 'react';
import Container from 'react-bootstrap/Container';
import Navbar from 'react-bootstrap/Navbar';
import AccordionAdmin from './AccordionAdmin';
import AgentInfo from './AgentInfo';
import UserInfo from './UserInfo';
import { useNavigate } from 'react-router-dom';

const AdminHome = () => {
  const navigate = useNavigate();
  const [activeComponent, setActiveComponent] = useState('dashboard');
  const [filter, setFilter] = useState('all');
  const [userName, setUserName] = useState('');

  useEffect(() => {
    const user = JSON.parse(localStorage.getItem('user'));
    if (user && user.userType === 'Admin') {
      setUserName(user.name);
    } else {
      navigate('/');
    }
  }, [navigate]);

  const renderComponent = () => {
    switch (activeComponent) {
      case 'UserInfo':
        return <UserInfo />;
      case 'Agent':
        return <AgentInfo />;
      case 'dashboard':
      default:
        return <AccordionAdmin filter={filter} />;
    }
  };

  return (
    <>
      <Navbar style={{ backgroundColor: '#e0f0e9' }} variant="dark" expand="lg">
        <Container fluid>
          <Navbar.Brand style={{ color: '#2f4f4f', fontWeight: '600' }}>
            Hi Admin {userName}
          </Navbar.Brand>
        </Container>
      </Navbar>

      <div style={{ display: 'flex', minHeight: '90vh' }}>
        <div
          style={{
            width: '250px',
            backgroundColor: '#e0f0e9',
            padding: '20px',
            borderRight: '1px solid #ccc',
          }}
        >
          <h5 className="mb-3">Admin Panel</h5>
          <button
            className={`btn btn-outline-dark w-100 mb-2 ${activeComponent === 'dashboard' ? 'fw-bold' : ''}`}
            onClick={() => setActiveComponent('dashboard')}
          >
            🗂️ Assign Complaints
          </button>
          <button
            className={`btn btn-outline-dark w-100 mb-2 ${activeComponent === 'UserInfo' ? 'fw-bold' : ''}`}
            onClick={() => setActiveComponent('UserInfo')}
          >
            👤 Users
          </button>
          <button
            className={`btn btn-outline-dark w-100 mb-4 ${activeComponent === 'Agent' ? 'fw-bold' : ''}`}
            onClick={() => setActiveComponent('Agent')}
          >
            🧑‍💼 Agents
          </button>

          <h6 className="fw-bold mb-2">Filter Complaints</h6>
          <select
            className="form-select"
            value={filter}
            onChange={(e) => setFilter(e.target.value)}
          >
            <option value="all">All</option>
            <option value="pending">Pending</option>
            <option value="completed">Completed</option>
          </select>
        </div>

        <div style={{ flex: 1, padding: '20px' }}>{renderComponent()}</div>
      </div>
    </>
  );
};

export default AdminHome;
