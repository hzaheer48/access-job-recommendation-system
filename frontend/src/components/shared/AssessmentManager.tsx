import React, { useState, useEffect } from 'react';
import { Assessment, AssessmentTemplate, AssessmentResult } from '../../types';
import {
  createAssessment,
  getAssessment,
  submitAssessment,
  getAssessmentTemplates,
  getUserAssessments,
  getAssessmentResults
} from '../../services/assessment';
import { Button, Card, Modal, List, Tag, Space, Typography, message, Progress, Steps, Form, Radio, Input } from 'antd';
import { FileTextOutlined, CheckCircleOutlined, ClockCircleOutlined, TrophyOutlined } from '@ant-design/icons';
import styles from './AssessmentManager.module.css';

const { Title, Text } = Typography;
const { Step } = Steps;

interface AssessmentManagerProps {
  userId: string;
}

export const AssessmentManager: React.FC<AssessmentManagerProps> = ({ userId }) => {
  const [assessments, setAssessments] = useState<Assessment[]>([]);
  const [templates, setTemplates] = useState<AssessmentTemplate[]>([]);
  const [currentAssessment, setCurrentAssessment] = useState<Assessment | null>(null);
  const [currentResult, setCurrentResult] = useState<AssessmentResult | null>(null);
  const [showTemplates, setShowTemplates] = useState(false);
  const [showResults, setShowResults] = useState(false);
  const [loading, setLoading] = useState(false);
  const [form] = Form.useForm();

  useEffect(() => {
    loadAssessments();
    loadTemplates();
  }, [userId]);

  const loadAssessments = async () => {
    try {
      setLoading(true);
      const userAssessments = await getUserAssessments(userId);
      setAssessments(userAssessments);
    } catch (error) {
      message.error('Failed to load assessments');
      console.error('Error loading assessments:', error);
    } finally {
      setLoading(false);
    }
  };

  const loadTemplates = async () => {
    try {
      const assessmentTemplates = await getAssessmentTemplates('skill_1'); // In a real app, this would be dynamic
      setTemplates(assessmentTemplates);
    } catch (error) {
      message.error('Failed to load assessment templates');
      console.error('Error loading templates:', error);
    }
  };

  const handleStartAssessment = async (template: AssessmentTemplate) => {
    try {
      setLoading(true);
      const assessment = await createAssessment(userId, 'skill_1', template.id);
      setCurrentAssessment(assessment);
      setShowTemplates(false);
    } catch (error) {
      message.error('Failed to start assessment');
      console.error('Error starting assessment:', error);
    } finally {
      setLoading(false);
    }
  };

  const handleSubmitAssessment = async (values: any) => {
    if (!currentAssessment) return;
    try {
      setLoading(true);
      const result = await submitAssessment(currentAssessment.id, values.answers);
      setCurrentResult(result);
      setShowResults(true);
      loadAssessments();
    } catch (error) {
      message.error('Failed to submit assessment');
      console.error('Error submitting assessment:', error);
    } finally {
      setLoading(false);
    }
  };

  const handleViewResults = async (assessment: Assessment) => {
    try {
      setLoading(true);
      const result = await getAssessmentResults(assessment.id);
      setCurrentResult(result);
      setShowResults(true);
    } catch (error) {
      message.error('Failed to load assessment results');
      console.error('Error loading results:', error);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className={styles.assessmentManager}>
      <Space direction="vertical" style={{ width: '100%' }}>
        <div className={styles.assessmentManagerHeader}>
          <Title level={4}>Skill Assessments</Title>
          <Button type="primary" onClick={() => setShowTemplates(true)}>
            Start New Assessment
          </Button>
        </div>

        <List
          loading={loading}
          dataSource={assessments}
          renderItem={(assessment: Assessment) => (
            <Card
              className={styles.assessmentCard}
              actions={[
                <Button
                  type="link"
                  onClick={() => handleViewResults(assessment)}
                >
                  View Results
                </Button>
              ]}
            >
              <Card.Meta
                avatar={<FileTextOutlined style={{ fontSize: 24 }} />}
                title={assessment.type}
                description={
                  <Space direction="vertical">
                    <Text>Status: {assessment.status}</Text>
                    {assessment.score && (
                      <Progress
                        percent={Math.round((assessment.score / assessment.maxScore) * 100)}
                        status="active"
                      />
                    )}
                    <Text>Duration: {assessment.duration} minutes</Text>
                    {assessment.startTime && (
                      <Text>Started: {new Date(assessment.startTime).toLocaleDateString()}</Text>
                    )}
                  </Space>
                }
              />
            </Card>
          )}
        />

        <Modal
          title="Choose Assessment Template"
          open={showTemplates}
          onCancel={() => setShowTemplates(false)}
          footer={null}
        >
          <List
            grid={{ gutter: 16, column: 2 }}
            dataSource={templates}
            renderItem={(template: AssessmentTemplate) => (
              <List.Item>
                <Card
                  hoverable
                  onClick={() => handleStartAssessment(template)}
                >
                  <Card.Meta
                    title={template.name}
                    description={
                      <Space direction="vertical">
                        <Text>{template.description}</Text>
                        <Text>Difficulty: {template.difficulty}</Text>
                        <Text>Duration: {template.duration} minutes</Text>
                        <Space>
                          {template.tags.map((tag: string) => (
                            <Tag key={tag}>{tag}</Tag>
                          ))}
                        </Space>
                      </Space>
                    }
                  />
                </Card>
              </List.Item>
            )}
          />
        </Modal>

        <Modal
          title="Assessment Results"
          open={showResults}
          onCancel={() => setShowResults(false)}
          footer={null}
          width={800}
        >
          {currentResult && (
            <Space direction="vertical" style={{ width: '100%' }}>
              <Card>
                <Space direction="vertical" style={{ width: '100%' }}>
                  <Title level={4}>Overall Score</Title>
                  <Progress
                    type="circle"
                    percent={currentResult.percentage}
                    format={(percent) => `${percent}%`}
                  />
                  <Text>Time Taken: {currentResult.timeTaken} minutes</Text>
                </Space>
              </Card>

              <Card title="Feedback">
                <Space direction="vertical" style={{ width: '100%' }}>
                  <div>
                    <Title level={5}>Strengths</Title>
                    <List
                      dataSource={currentResult.feedback.strengths}
                      renderItem={(item: string) => (
                        <List.Item>
                          <CheckCircleOutlined style={{ color: '#52c41a' }} /> {item}
                        </List.Item>
                      )}
                    />
                  </div>
                  <div>
                    <Title level={5}>Areas for Improvement</Title>
                    <List
                      dataSource={currentResult.feedback.weaknesses}
                      renderItem={(item: string) => (
                        <List.Item>
                          <ClockCircleOutlined style={{ color: '#faad14' }} /> {item}
                        </List.Item>
                      )}
                    />
                  </div>
                  <div>
                    <Title level={5}>Recommendations</Title>
                    <List
                      dataSource={currentResult.feedback.recommendations}
                      renderItem={(item: string) => (
                        <List.Item>
                          <TrophyOutlined style={{ color: '#1890ff' }} /> {item}
                        </List.Item>
                      )}
                    />
                  </div>
                </Space>
              </Card>

              <Card title="Detailed Results">
                <List
                  dataSource={currentResult.answers}
                  renderItem={(answer) => (
                    <List.Item>
                      <List.Item.Meta
                        title={`Question ${answer.questionId}`}
                        description={
                          <Space direction="vertical">
                            <Text>Your Answer: {answer.answer}</Text>
                            <Text>Points: {answer.points}</Text>
                            <Tag color={answer.isCorrect ? 'success' : 'error'}>
                              {answer.isCorrect ? 'Correct' : 'Incorrect'}
                            </Tag>
                          </Space>
                        }
                      />
                    </List.Item>
                  )}
                />
              </Card>
            </Space>
          )}
        </Modal>

        {currentAssessment && (
          <Modal
            title={`Assessment: ${currentAssessment.type}`}
            open={!!currentAssessment}
            onCancel={() => setCurrentAssessment(null)}
            footer={null}
            width={800}
          >
            <Form
              form={form}
              layout="vertical"
              onFinish={handleSubmitAssessment}
            >
              <Steps
                current={0}
                items={currentAssessment.questions.map((_, index) => ({
                  title: `Question ${index + 1}`,
                }))}
              />
              <div className={styles.questionsContainer}>
                {currentAssessment.questions.map((question, index) => (
                  <Card key={question.id} className={styles.questionCard}>
                    <Form.Item
                      name={['answers', question.id]}
                      label={`${index + 1}. ${question.question}`}
                      rules={[{ required: true, message: 'Please select an answer' }]}
                    >
                      {question.type === 'multiple_choice' ? (
                        <Radio.Group>
                          {question.options?.map((option) => (
                            <Radio key={option} value={option}>
                              {option}
                            </Radio>
                          ))}
                        </Radio.Group>
                      ) : (
                        <Input.TextArea rows={4} />
                      )}
                    </Form.Item>
                    <div className={styles.questionMeta}>
                      <Tag color="blue">Points: {question.points}</Tag>
                      <Tag color="purple">{question.difficulty}</Tag>
                      <Tag color="green">{question.category}</Tag>
                    </div>
                  </Card>
                ))}
              </div>
              <Form.Item>
                <Button type="primary" htmlType="submit" loading={loading}>
                  Submit Assessment
                </Button>
              </Form.Item>
            </Form>
          </Modal>
        )}
      </Space>
    </div>
  );
}; 