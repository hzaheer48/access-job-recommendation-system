import React, { useState, useEffect } from 'react';
import { JobAlert, JobAlertMatch, JobAlertStats } from '../../types';
import {
  createJobAlert,
  updateJobAlert,
  deleteJobAlert,
  getUserJobAlerts,
  getJobAlertMatches,
  updateJobAlertMatchStatus,
  getJobAlertStats,
  pauseJobAlert,
  resumeJobAlert
} from '../../services/jobAlerts';
import { Button, Card, Modal, List, Tag, Space, Typography, message, Form, Input, Select, Switch, Statistic, Row, Col } from 'antd';
import { BellOutlined, PauseOutlined, PlayCircleOutlined, DeleteOutlined, EditOutlined } from '@ant-design/icons';
import styles from './JobAlertManager.module.css';

const { Title, Text } = Typography;
const { Option } = Select;

interface JobAlertManagerProps {
  userId: string;
}

export const JobAlertManager: React.FC<JobAlertManagerProps> = ({ userId }) => {
  const [alerts, setAlerts] = useState<JobAlert[]>([]);
  const [selectedAlert, setSelectedAlert] = useState<JobAlert | null>(null);
  const [matches, setMatches] = useState<JobAlertMatch[]>([]);
  const [stats, setStats] = useState<JobAlertStats | null>(null);
  const [showMatches, setShowMatches] = useState(false);
  const [showCreateModal, setShowCreateModal] = useState(false);
  const [showEditModal, setShowEditModal] = useState(false);
  const [loading, setLoading] = useState(false);
  const [form] = Form.useForm();

  useEffect(() => {
    loadAlerts();
    loadStats();
  }, [userId]);

  const loadAlerts = async () => {
    try {
      setLoading(true);
      const userAlerts = await getUserJobAlerts(userId);
      setAlerts(userAlerts);
    } catch (error) {
      message.error('Failed to load job alerts');
      console.error('Error loading alerts:', error);
    } finally {
      setLoading(false);
    }
  };

  const loadStats = async () => {
    try {
      const alertStats = await getJobAlertStats(userId);
      setStats(alertStats);
    } catch (error) {
      message.error('Failed to load alert statistics');
      console.error('Error loading stats:', error);
    }
  };

  const handleCreateAlert = async (values: any) => {
    try {
      setLoading(true);
      await createJobAlert(userId, values);
      message.success('Job alert created successfully');
      setShowCreateModal(false);
      form.resetFields();
      loadAlerts();
      loadStats();
    } catch (error) {
      message.error('Failed to create job alert');
      console.error('Error creating alert:', error);
    } finally {
      setLoading(false);
    }
  };

  const handleEditAlert = async (values: any) => {
    if (!selectedAlert) return;
    try {
      setLoading(true);
      await updateJobAlert(selectedAlert.id, values);
      message.success('Job alert updated successfully');
      setShowEditModal(false);
      form.resetFields();
      loadAlerts();
    } catch (error) {
      message.error('Failed to update job alert');
      console.error('Error updating alert:', error);
    } finally {
      setLoading(false);
    }
  };

  const handleDeleteAlert = async (alert: JobAlert) => {
    try {
      setLoading(true);
      await deleteJobAlert(alert.id);
      message.success('Job alert deleted successfully');
      loadAlerts();
      loadStats();
    } catch (error) {
      message.error('Failed to delete job alert');
      console.error('Error deleting alert:', error);
    } finally {
      setLoading(false);
    }
  };

  const handleViewMatches = async (alert: JobAlert) => {
    try {
      setLoading(true);
      const alertMatches = await getJobAlertMatches(alert.id);
      setMatches(alertMatches);
      setShowMatches(true);
    } catch (error) {
      message.error('Failed to load job matches');
      console.error('Error loading matches:', error);
    } finally {
      setLoading(false);
    }
  };

  const handleUpdateMatchStatus = async (match: JobAlertMatch, status: JobAlertMatch['status']) => {
    try {
      await updateJobAlertMatchStatus(match.id, status);
      message.success('Match status updated successfully');
      handleViewMatches(alerts.find(a => a.id === match.alertId)!);
    } catch (error) {
      message.error('Failed to update match status');
      console.error('Error updating match status:', error);
    }
  };

  const handleToggleAlert = async (alert: JobAlert) => {
    try {
      setLoading(true);
      if (alert.status === 'active') {
        await pauseJobAlert(alert.id);
        message.success('Job alert paused successfully');
      } else {
        await resumeJobAlert(alert.id);
        message.success('Job alert resumed successfully');
      }
      loadAlerts();
    } catch (error) {
      message.error('Failed to toggle job alert');
      console.error('Error toggling alert:', error);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className={styles.jobAlertManager}>
      <Space direction="vertical" style={{ width: '100%' }}>
        <div className={styles.jobAlertManagerHeader}>
          <Title level={4}>Job Alerts</Title>
          <Button type="primary" onClick={() => setShowCreateModal(true)}>
            Create Alert
          </Button>
        </div>

        {stats && (
          <Row gutter={16} className={styles.statsRow}>
            <Col span={6}>
              <Card>
                <Statistic
                  title="Total Alerts"
                  value={stats.totalAlerts}
                  prefix={<BellOutlined />}
                />
              </Card>
            </Col>
            <Col span={6}>
              <Card>
                <Statistic
                  title="Active Alerts"
                  value={stats.activeAlerts}
                  prefix={<PlayCircleOutlined />}
                />
              </Card>
            </Col>
            <Col span={6}>
              <Card>
                <Statistic
                  title="Total Matches"
                  value={stats.totalMatches}
                />
              </Card>
            </Col>
            <Col span={6}>
              <Card>
                <Statistic
                  title="New Matches"
                  value={stats.matchesByStatus.new}
                  valueStyle={{ color: '#3f8600' }}
                />
              </Card>
            </Col>
          </Row>
        )}

        <List
          loading={loading}
          dataSource={alerts}
          renderItem={(alert: JobAlert) => (
            <Card
              className={styles.alertCard}
              actions={[
                <Button
                  icon={alert.status === 'active' ? <PauseOutlined /> : <PlayCircleOutlined />}
                  onClick={() => handleToggleAlert(alert)}
                >
                  {alert.status === 'active' ? 'Pause' : 'Resume'}
                </Button>,
                <Button
                  icon={<EditOutlined />}
                  onClick={() => {
                    setSelectedAlert(alert);
                    form.setFieldsValue(alert);
                    setShowEditModal(true);
                  }}
                >
                  Edit
                </Button>,
                <Button
                  icon={<DeleteOutlined />}
                  danger
                  onClick={() => handleDeleteAlert(alert)}
                >
                  Delete
                </Button>
              ]}
            >
              <Card.Meta
                avatar={<BellOutlined style={{ fontSize: 24 }} />}
                title={alert.name}
                description={
                  <Space direction="vertical">
                    <Text>Frequency: {alert.frequency}</Text>
                    <Text>Status: {alert.status}</Text>
                    <Space>
                      {alert.criteria.keywords.map((keyword: string) => (
                        <Tag key={keyword}>{keyword}</Tag>
                      ))}
                    </Space>
                    <Button type="link" onClick={() => handleViewMatches(alert)}>
                      View Matches
                    </Button>
                  </Space>
                }
              />
            </Card>
          )}
        />

        <Modal
          title="Job Matches"
          open={showMatches}
          onCancel={() => setShowMatches(false)}
          footer={null}
          width={800}
        >
          <List
            loading={loading}
            dataSource={matches}
            renderItem={(match: JobAlertMatch) => (
              <List.Item
                actions={[
                  <Select
                    defaultValue={match.status}
                    style={{ width: 120 }}
                    onChange={(value) => handleUpdateMatchStatus(match, value)}
                  >
                    <Option value="new">New</Option>
                    <Option value="viewed">Viewed</Option>
                    <Option value="applied">Applied</Option>
                    <Option value="dismissed">Dismissed</Option>
                  </Select>
                ]}
              >
                <List.Item.Meta
                  title={`Match Score: ${(match.matchScore * 100).toFixed(1)}%`}
                  description={
                    <Space direction="vertical">
                      {match.matchReasons.map((reason, index) => (
                        <Tag key={index}>{reason}</Tag>
                      ))}
                    </Space>
                  }
                />
              </List.Item>
            )}
          />
        </Modal>

        <Modal
          title="Create Job Alert"
          open={showCreateModal}
          onCancel={() => {
            setShowCreateModal(false);
            form.resetFields();
          }}
          footer={null}
        >
          <Form
            form={form}
            layout="vertical"
            onFinish={handleCreateAlert}
          >
            <Form.Item
              name="name"
              label="Alert Name"
              rules={[{ required: true }]}
            >
              <Input />
            </Form.Item>
            <Form.Item
              name="criteria"
              label="Search Criteria"
              rules={[{ required: true }]}
            >
              <Input.TextArea rows={4} />
            </Form.Item>
            <Form.Item
              name="frequency"
              label="Alert Frequency"
              rules={[{ required: true }]}
            >
              <Select>
                <Option value="daily">Daily</Option>
                <Option value="weekly">Weekly</Option>
                <Option value="monthly">Monthly</Option>
                <Option value="realtime">Real-time</Option>
              </Select>
            </Form.Item>
            <Form.Item>
              <Button type="primary" htmlType="submit" loading={loading}>
                Create Alert
              </Button>
            </Form.Item>
          </Form>
        </Modal>

        <Modal
          title="Edit Job Alert"
          open={showEditModal}
          onCancel={() => {
            setShowEditModal(false);
            form.resetFields();
          }}
          footer={null}
        >
          <Form
            form={form}
            layout="vertical"
            onFinish={handleEditAlert}
          >
            <Form.Item
              name="name"
              label="Alert Name"
              rules={[{ required: true }]}
            >
              <Input />
            </Form.Item>
            <Form.Item
              name="criteria"
              label="Search Criteria"
              rules={[{ required: true }]}
            >
              <Input.TextArea rows={4} />
            </Form.Item>
            <Form.Item
              name="frequency"
              label="Alert Frequency"
              rules={[{ required: true }]}
            >
              <Select>
                <Option value="daily">Daily</Option>
                <Option value="weekly">Weekly</Option>
                <Option value="monthly">Monthly</Option>
                <Option value="realtime">Real-time</Option>
              </Select>
            </Form.Item>
            <Form.Item>
              <Button type="primary" htmlType="submit" loading={loading}>
                Update Alert
              </Button>
            </Form.Item>
          </Form>
        </Modal>
      </Space>
    </div>
  );
}; 