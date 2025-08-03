import React, { useState } from 'react';
import { Layout, Typography, Input, Button, Divider, message, Card, Space, Row, Col } from 'antd';
import 'antd/dist/reset.css';
import './App.css';

const { Header, Content } = Layout;
const { Title, Text, Paragraph } = Typography;
const API_BASE = 'http://localhost:5000';

function App() {
  const [longUrl, setLongUrl] = useState('');
  const [shortCode, setShortCode] = useState('');
  const [statsCode, setStatsCode] = useState('');
  const [stats, setStats] = useState(null);
  const [loadingShorten, setLoadingShorten] = useState(false);
  const [loadingStats, setLoadingStats] = useState(false);

  const handleShorten = async () => {
    setShortCode('');
    setLoadingShorten(true);
    try {
      const res = await fetch(`${API_BASE}/api/shorten`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ url: longUrl })
      });
      const data = await res.json();
      if (!res.ok) throw new Error(data.error || 'Unknown error');
      setShortCode(data.shortCode);
      message.success('Short URL created!');
    } catch (err) {
      message.error(err.message);
    } finally {
      setLoadingShorten(false);
    }
  };

  const handleStats = async () => {
    setStats(null);
    setLoadingStats(true);
    try {
      const res = await fetch(`${API_BASE}/api/stats/${statsCode}`);
      const data = await res.json();
      if (!res.ok) throw new Error(data.error || 'Unknown error');
      setStats(data);
    } catch (err) {
      message.error(err.message);
    } finally {
      setLoadingStats(false);
    }
  };

  const shortUrl = shortCode ? `${API_BASE}/${shortCode}` : '';

  return (
    <Layout style={{ minHeight: '100vh', background: 'linear-gradient(135deg, #f0f2f5 0%, #e6f7ff 100%)' }}>
      <Header style={{ background: '#fff', textAlign: 'center', padding: 0, boxShadow: '0 2px 8px #f0f1f2' }}>
        <Title level={2} style={{ margin: 16, color: '#1890ff', letterSpacing: 1 }}>URL Shortener</Title>
      </Header>
      <Content>
        <Row justify="center" align="middle" style={{ minHeight: '80vh' }}>
          <Col xs={24} sm={20} md={14} lg={10} xl={8}>
            <Card bordered={false} style={{ borderRadius: 12, boxShadow: '0 4px 24px #e6f7ff', marginTop: 32 }}>
              <Title level={4} style={{ color: '#1890ff', marginBottom: 24 }}>Shorten a URL</Title>
              <Space direction="vertical" size="large" style={{ width: '100%' }}>
                <Input
                  placeholder="Enter long URL"
                  value={longUrl}
                  onChange={e => setLongUrl(e.target.value)}
                  onPressEnter={handleShorten}
                  size="large"
                  style={{ borderRadius: 6 }}
                />
                <Button type="primary" loading={loadingShorten} onClick={handleShorten} block size="large" style={{ borderRadius: 6 }}>
                  Shorten
                </Button>
                {shortCode && (
                  <Paragraph copyable={{ text: shortUrl }} style={{ marginBottom: 0 }}>
                    <Text strong>Short URL: </Text>
                    <a href={shortUrl} target="_blank" rel="noopener noreferrer">{shortUrl}</a>
                  </Paragraph>
                )}
              </Space>
              <Divider style={{ margin: '32px 0 24px 0' }} />
              <Title level={5} style={{ color: '#1890ff', marginBottom: 16 }}>Get URL Stats</Title>
              <Space direction="vertical" size="large" style={{ width: '100%' }}>
                <Input
                  placeholder="Enter short code"
                  value={statsCode}
                  onChange={e => setStatsCode(e.target.value)}
                  onPressEnter={handleStats}
                  size="large"
                  style={{ borderRadius: 6 }}
                />
                <Button type="primary" loading={loadingStats} onClick={handleStats} block size="large" style={{ borderRadius: 6 }}>
                  Get Stats
                </Button>
                {stats && (
                  <Card type="inner" style={{ background: '#fafcff', borderRadius: 8 }}>
                    <div style={{ marginBottom: 8 }}><Text strong>Original URL:</Text> <a href={stats.originalUrl} target="_blank" rel="noopener noreferrer">{stats.originalUrl}</a></div>
                    <div style={{ marginBottom: 8 }}><Text strong>Created At:</Text> {stats.createdAt}</div>
                    <div><Text strong>Clicks:</Text> {stats.clicks}</div>
                  </Card>
                )}
              </Space>
            </Card>
          </Col>
        </Row>
      </Content>
    </Layout>
  );
}

export default App;
