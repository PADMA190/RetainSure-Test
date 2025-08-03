import React from 'react';
import { BrowserRouter as Router, Routes, Route, Link, useNavigate } from 'react-router-dom';
import { Layout, Menu, Button } from 'antd';
import {
  UserOutlined,
  HomeOutlined,
  LoginOutlined
} from '@ant-design/icons';
import Home from './components/Home';
import UsersPage from './components/UsersPage';
import LoginPage from './components/LoginPage';
const { Header, Content } = Layout;

function App() {
  return (
    <Router>
      <Layout style={{ minHeight: '100vh' }}>
        <Header style={{ display: 'flex', alignItems: 'center' }}>
          <div style={{ flex: 1 }}>
            <Menu theme="dark" mode="horizontal" defaultSelectedKeys={['home']} style={{ display: 'inline-block', width: 'auto' }}>
              <Menu.Item key="home" icon={<HomeOutlined />}>
                <Link to="/">Home</Link>
              </Menu.Item>
              <Menu.Item key="users" icon={<UserOutlined />}>
                <Link to="/users">Users</Link>
              </Menu.Item>
            </Menu>
          </div>
          <LoginButton />
        </Header>
        <Content style={{ padding: '24px 50px' }}>
          <Routes>
            <Route path="/" element={<Home />} />
            <Route path="/users" element={<UsersPage />} />
            <Route path="/login" element={<LoginPage />} />
          </Routes>
        </Content>
      </Layout>
    </Router>
  );
}

function LoginButton() {
  const navigate = useNavigate();
  return (
    <Button
      type="primary"
      icon={<LoginOutlined />}
      style={{ marginLeft: 16 }}
      onClick={() => navigate('/login')}
    >
      Login
    </Button>
  );
}

export default App;
