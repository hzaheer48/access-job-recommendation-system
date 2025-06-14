import React, { useState, useEffect } from 'react';
import { Document, DocumentVersion, ResumeTemplate } from '../../types';
import { getDocuments, getDocumentVersions, deleteDocument } from '../../services/documentManagement';
import { Button, Card, Modal, List, Tag, Space, Typography, message } from 'antd';
import { FileTextOutlined, HistoryOutlined, DeleteOutlined, EditOutlined, ShareAltOutlined } from '@ant-design/icons';
import styles from './ResumeManager.module.css';

const { Title, Text } = Typography;

interface ResumeManagerProps {
  userId: string;
  onResumeSelect?: (resume: Document) => void;
}

export const ResumeManager: React.FC<ResumeManagerProps> = ({ userId, onResumeSelect }) => {
  const [resumes, setResumes] = useState<Document[]>([]);
  const [selectedResume, setSelectedResume] = useState<Document | null>(null);
  const [versions, setVersions] = useState<DocumentVersion[]>([]);
  const [showVersions, setShowVersions] = useState(false);
  const [showTemplates, setShowTemplates] = useState(false);
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    loadResumes();
  }, [userId]);

  const loadResumes = async () => {
    try {
      setLoading(true);
      const userResumes = await getDocuments(userId);
      setResumes(userResumes);
    } catch (error) {
      message.error('Failed to load resumes');
      console.error('Error loading resumes:', error);
    } finally {
      setLoading(false);
    }
  };

  const handleResumeSelect = (resume: Document) => {
    setSelectedResume(resume);
    if (onResumeSelect) {
      onResumeSelect(resume);
    }
  };

  const handleVersionClick = async (resume: Document) => {
    try {
      setLoading(true);
      const resumeVersions = await getDocumentVersions(resume.id);
      setVersions(resumeVersions);
      setShowVersions(true);
    } catch (error) {
      message.error('Failed to load resume versions');
      console.error('Error loading versions:', error);
    } finally {
      setLoading(false);
    }
  };

  const handleVersionRestore = async (version: DocumentVersion) => {
    try {
      setLoading(true);
      // In a real app, this would restore the version
      message.success(`Restored version ${version.version}`);
      setShowVersions(false);
      loadResumes();
    } catch (error) {
      message.error('Failed to restore version');
      console.error('Error restoring version:', error);
    } finally {
      setLoading(false);
    }
  };

  const handleDeleteResume = async (resume: Document) => {
    try {
      setLoading(true);
      await deleteDocument(resume.id);
      message.success('Resume deleted successfully');
      loadResumes();
    } catch (error) {
      message.error('Failed to delete resume');
      console.error('Error deleting resume:', error);
    } finally {
      setLoading(false);
    }
  };

  const handleShareResume = async (resume: Document) => {
    try {
      setLoading(true);
      // In a real app, this would open a share dialog
      message.success('Share functionality coming soon');
    } catch (error) {
      message.error('Failed to share resume');
      console.error('Error sharing resume:', error);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className={styles.resumeManager}>
      <Space direction="vertical" style={{ width: '100%' }}>
        <div className={styles.resumeManagerHeader}>
          <Title level={4}>My Resumes</Title>
          <Button type="primary" onClick={() => setShowTemplates(true)}>
            Create New Resume
          </Button>
        </div>

        <List
          loading={loading}
          dataSource={resumes}
          renderItem={(resume: Document) => (
            <Card
              className={styles.resumeCard}
              actions={[
                <Button
                  icon={<HistoryOutlined />}
                  onClick={() => handleVersionClick(resume)}
                >
                  Versions
                </Button>,
                <Button
                  icon={<ShareAltOutlined />}
                  onClick={() => handleShareResume(resume)}
                >
                  Share
                </Button>,
                <Button
                  icon={<DeleteOutlined />}
                  danger
                  onClick={() => handleDeleteResume(resume)}
                >
                  Delete
                </Button>
              ]}
            >
              <Card.Meta
                avatar={<FileTextOutlined style={{ fontSize: 24 }} />}
                title={resume.name}
                description={
                  <Space direction="vertical">
                    <Text>Type: {resume.type}</Text>
                    <Text>Last modified: {new Date(resume.metadata.lastModified).toLocaleDateString()}</Text>
                    <Space>
                      {resume.metadata.tags.map((tag: string) => (
                        <Tag key={tag}>{tag}</Tag>
                      ))}
                    </Space>
                  </Space>
                }
              />
            </Card>
          )}
        />

        <Modal
          title="Resume Versions"
          open={showVersions}
          onCancel={() => setShowVersions(false)}
          footer={null}
        >
          <List
            loading={loading}
            dataSource={versions}
            renderItem={(version: DocumentVersion) => (
              <List.Item
                actions={[
                  <Button
                    type="link"
                    onClick={() => handleVersionRestore(version)}
                  >
                    Restore
                  </Button>
                ]}
              >
                <List.Item.Meta
                  title={`Version ${version.version}`}
                  description={
                    <Space direction="vertical">
                      <Text>Uploaded: {new Date(version.uploadedAt).toLocaleDateString()}</Text>
                      <Text>Size: {(version.fileSize / 1024).toFixed(2)} KB</Text>
                      {version.changes.map((change, index) => (
                        <Tag key={index}>{change.type}: {change.description}</Tag>
                      ))}
                    </Space>
                  }
                />
              </List.Item>
            )}
          />
        </Modal>

        <Modal
          title="Choose Template"
          open={showTemplates}
          onCancel={() => setShowTemplates(false)}
          footer={null}
        >
          <List
            grid={{ gutter: 16, column: 2 }}
            dataSource={[
              {
                id: 'template1',
                name: 'Professional',
                description: 'Clean and professional design',
                thumbnail: 'https://example.com/template1.jpg'
              },
              {
                id: 'template2',
                name: 'Creative',
                description: 'Modern and creative layout',
                thumbnail: 'https://example.com/template2.jpg'
              }
            ]}
            renderItem={(template: ResumeTemplate) => (
              <List.Item>
                <Card
                  hoverable
                  cover={<img alt={template.name} src={template.thumbnail} />}
                  onClick={() => {
                    setShowTemplates(false);
                    // In a real app, this would create a new resume with the template
                    message.success(`Selected template: ${template.name}`);
                  }}
                >
                  <Card.Meta
                    title={template.name}
                    description={template.description}
                  />
                </Card>
              </List.Item>
            )}
          />
        </Modal>
      </Space>
    </div>
  );
}; 