import React, { useState } from 'react';
import { Form, Input, Button, message, Card } from 'antd';
import axios from 'axios';
import { useNavigate } from 'react-router-dom';

const API_BASE = 'http://localhost:5009';

const LoginPage = () => {
  const [loading, setLoading] = useState(false);
  const [form] = Form.useForm();
  const [fieldErrors, setFieldErrors] = useState({});
  const navigate = useNavigate();

  const onFinish = async (values) => {
    setLoading(true);
    setFieldErrors({});
    try {
      const res = await axios.post(`${API_BASE}/login`, values);
      if (res.data.status === 'success') {
        message.success(res.data.message || 'Login successful!');
        navigate('/users');
      } else {
        message.error(res.data.error || 'Invalid credentials');
      }
    } catch (err) {
      if (err.response && err.response.data && err.response.data.errors) {
        // Backend validation errors
        const errors = err.response.data.errors;
        const fieldErrs = {};
        errors.forEach(e => {
          fieldErrs[e.param] = e.msg;
          message.error(e.msg);
        });
        setFieldErrors(fieldErrs);
      } else if (err.response && err.response.data && err.response.data.error) {
        message.error(err.response.data.error);
      } else {
        message.error('Login failed');
      }
    }
    setLoading(false);
  };

  return (
    <div style={{ display: 'flex', justifyContent: 'center', alignItems: 'center', height: '80vh' }}>
      <Card title="Login" style={{ width: 350 }}>
        <Form layout="vertical" onFinish={onFinish} form={form}>
          <Form.Item
            label="Email"
            name="email"
            rules={[{ required: true, message: 'Please input your email!' }]}
            validateStatus={fieldErrors.email ? 'error' : ''}
            help={fieldErrors.email}
          >
            <Input type="email" />
          </Form.Item>
          <Form.Item
            label="Password"
            name="password"
            rules={[{ required: true, message: 'Please input your password!' }]}
            validateStatus={fieldErrors.password ? 'error' : ''}
            help={fieldErrors.password}
          >
            <Input.Password />
          </Form.Item>
          <Form.Item>
            <Button type="primary" htmlType="submit" loading={loading} block>Login</Button>
          </Form.Item>
        </Form>
      </Card>
    </div>
  );
};

export default LoginPage; 