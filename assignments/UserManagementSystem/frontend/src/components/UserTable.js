import React from 'react';
import { Table, Button, Space } from 'antd';

const UserTable = ({ users, loading, onEdit, onDelete }) => {
  const columns = [
    { title: 'ID', dataIndex: 'id', key: 'id' },
    { title: 'Name', dataIndex: 'name', key: 'name' },
    { title: 'Email', dataIndex: 'email', key: 'email' },
    {
      title: 'Actions',
      key: 'actions',
      render: (_, record) => (
        <Space>
          <Button type="link" onClick={() => onEdit(record)}>
            Update
          </Button>
          <Button type="link" danger onClick={() => onDelete(record.id)}>
            Delete
          </Button>
        </Space>
      ),
    },
  ];

  return (
    <Table
      columns={columns}
      dataSource={users}
      rowKey="id"
      loading={loading}
      bordered
      pagination={{ pageSize: 5 }}
    />
  );
};

export default UserTable; 