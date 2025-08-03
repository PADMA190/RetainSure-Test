import React, { useEffect, useState } from 'react';
import { Button, Input, Modal, Form, message } from 'antd';
import axios from 'axios';
import UserTable from './UserTable';
import UserModal from './UserModal';

const API_BASE = 'http://localhost:5009';

const UsersPage = () => {
  const [users, setUsers] = useState([]);
  const [loading, setLoading] = useState(false);
  const [search, setSearch] = useState('');
  const [searchType, setSearchType] = useState('id');
  const [isModalVisible, setIsModalVisible] = useState(false);
  const [isEdit, setIsEdit] = useState(false);
  const [editingUser, setEditingUser] = useState(null);
  const [form] = Form.useForm();
  const [modalErrors, setModalErrors] = useState([]);

  const fetchUsers = async () => {
    setLoading(true);
    try {
      const res = await axios.get(`${API_BASE}/users`);
      setUsers(res.data);
    } catch (err) {
      message.error('Failed to fetch users');
    }
    setLoading(false);
  };

  useEffect(() => {
    fetchUsers();
  }, []);

  const handleSearch = async (customType) => {
    setLoading(true);
    try {
      const type = customType || searchType;
      if (type === 'id') {
        if (!search) { await fetchUsers(); setLoading(false); return; }
        const res = await axios.get(`${API_BASE}/user/${search}`);
        setUsers(res.data ? [res.data] : []);
      } else {
        if (!search) { await fetchUsers(); setLoading(false); return; }
        const res = await axios.get(`${API_BASE}/search?name=${search}`);
        setUsers(res.data);
      }
    } catch (err) {
      setUsers([]);
      console.log("sdf");
      if (err.response && err.response.data && err.response.data.error) {
        console.log("dsfa");
        message.error(err.response.data.error);
      } else if (err.response && err.response.status === 404) {
        message.error('User not found');
      } else {
        message.error('Search failed');
      }
    }
    setLoading(false);
  };

  const showCreateModal = () => {
    setIsEdit(false);
    setEditingUser(null);
    form.resetFields();
    setIsModalVisible(true);
  };

  const showEditModal = (user) => {
    setIsEdit(true);
    setEditingUser(user);
    form.setFieldsValue({ name: user.name, email: user.email, password: user.password });
    setIsModalVisible(true);
  };

  const handleDelete = async (id) => {
    Modal.confirm({
      title: 'Are you sure you want to delete this user?',
      onOk: async () => {
        try {
          const res = await axios.delete(`${API_BASE}/user/${id}`);
          if (res.data && res.data.message) {
            message.success(res.data.message);
          } else {
            message.success('User deleted');
          }
          fetchUsers();
        } catch (err) {
          if (err.response && err.response.data && err.response.data.error) {
            message.error(err.response.data.error);
          } else if (err.response && err.response.status === 404) {
            message.error('User not found');
          } else {
            message.error('Failed to delete user');
            console.error('Delete error:', err);
          }
        }
      },
    });
  };

  const handleModalOk = async () => {
    try {
      const values = await form.validateFields();
      setModalErrors([]);
      if (isEdit && editingUser) {
        const res = await axios.put(`${API_BASE}/user/${editingUser.id}`, {
          name: values.name,
          email: values.email,
        });
        if (res.data && res.data.message) {
          message.success(res.data.message);
        } else {
          message.success('User updated');
        }
        setIsModalVisible(false);
        fetchUsers();
      } else {
        const res = await axios.post(`${API_BASE}/users`, values);
        if (res.data && res.data.message) {
          message.success(res.data.message);
        } else {
          message.success('User created');
        }
        setIsModalVisible(false);
        fetchUsers();
      }
    } catch (err) {
      if (err.response && err.response.data && err.response.data.errors) {
        setModalErrors(err.response.data.errors);
        err.response.data.errors.forEach(e => message.error(e.msg));
      } else if (err.response && err.response.data && err.response.data.error) {
        message.error(err.response.data.error);
      } else if (err.response && err.response.status === 404) {
        message.error('User not found');
      } else {
        message.error('An error occurred');
      }
    }
  };

  return (
    <div>
      <div style={{ display: 'flex', justifyContent: 'space-between', marginBottom: 16 }}>
        <div style={{ display: 'flex', gap: 8 }}>
          <Input.Search
            placeholder={`Search by ${searchType}`}
            value={search}
            onChange={e => setSearch(e.target.value)}
            onSearch={() => handleSearch()}
            style={{ width: 200 }}
            allowClear
          />
          <Button
            type={searchType === 'id' ? 'primary' : 'default'}
            onClick={() => { setSearchType('id'); handleSearch('id'); }}
          >
            By ID
          </Button>
          <Button
            type={searchType === 'name' ? 'primary' : 'default'}
            onClick={() => { setSearchType('name'); handleSearch('name'); }}
          >
            By Name
          </Button>
        </div>
        <Button type="primary" onClick={showCreateModal}>
          Create New User
        </Button>
      </div>
      <UserTable
        users={users}
        loading={loading}
        onEdit={showEditModal}
        onDelete={handleDelete}
      />
      <UserModal
        visible={isModalVisible}
        isEdit={isEdit}
        onOk={handleModalOk}
        onCancel={() => { setIsModalVisible(false); setModalErrors([]); }}
        form={form}
        editingUser={editingUser}
        errors={modalErrors}
      />
    </div>
  );
};

export default UsersPage; 