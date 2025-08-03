import React from 'react';
import { Modal, Form, Input } from 'antd';

const getFieldError = (errors, field) => {
  const err = errors?.find(e => e.param === field);
  return err ? err.msg : undefined;
};

const UserModal = ({ visible, isEdit, onOk, onCancel, form, errors = [] }) => (
  <Modal
    title={isEdit ? 'Update User' : 'Create New User'}
    open={visible}
    onOk={onOk}
    onCancel={onCancel}
    okText={isEdit ? 'Update' : 'Create'}
  >
    <Form form={form} layout="vertical">
      <Form.Item
        label="Name"
        name="name"
        rules={[{ required: true, message: 'Please input the name!' }]}
        validateStatus={getFieldError(errors, 'name') ? 'error' : ''}
        help={getFieldError(errors, 'name')}
      >
        <Input />
      </Form.Item>
      <Form.Item
        label="Email"
        name="email"
        rules={[{ required: true, message: 'Please input the email!' }]}
        validateStatus={getFieldError(errors, 'email') ? 'error' : ''}
        help={getFieldError(errors, 'email')}
      >
        <Input type="email" />
      </Form.Item>
      {!isEdit && (
        <Form.Item
          label="Password"
          name="password"
          rules={[{ required: true, message: 'Please input the password!' }]}
          validateStatus={getFieldError(errors, 'password') ? 'error' : ''}
          help={getFieldError(errors, 'password')}
        >
          <Input.Password />
        </Form.Item>
      )}
    </Form>
  </Modal>
);

export default UserModal; 