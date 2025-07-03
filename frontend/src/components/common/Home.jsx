// File: frontend/src/components/common/Home.jsx
import React from 'react';
import Container from 'react-bootstrap/Container';
import Image1 from '../../assets/Image1.png';
import { Link } from 'react-router-dom';
import Button from 'react-bootstrap/Button';
import Footer from './FooterC';

const Home = () => {
  return (
    <>
      <Container className='home-container'>
        <div className="left-side">
          <img src={Image1} alt="Complaint Illustration" />
        </div>
        <div className="right-side">
          <p>
            <span className='f-letter'>Empower Your Team,</span><br />
            <span className='s-letter'> Exceed Customer Expectations: Discover our</span> <br />
            <span className='t-letter'>Complaint Management Solution</span><br />
            <Link to={'/Login'}>
              <Button className='mt-3 register'>Register your Complaint</Button>
            </Link>
          </p>
        </div>
      </Container>
      <Footer />
    </>
  );
};

export default Home;
