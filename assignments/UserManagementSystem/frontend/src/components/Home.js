import React from 'react';
import { Button } from 'antd';
import { useNavigate } from 'react-router-dom';

const Home = () => {
  const navigate = useNavigate();
  return (
    <div style={{ textAlign: 'center', marginTop: 40 }}>
      <h1>User Management System</h1>
      <Button type="primary" style={{ marginTop: 24 }} onClick={() => navigate('/users')}>
        View Users
      </Button>
    </div>
  );
};

export default Home; 