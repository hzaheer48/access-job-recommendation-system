import { User, JobApplication } from '../types';

interface Message {
  id: string;
  senderId: string;
  receiverId: string;
  content: string;
  timestamp: string;
  status: 'sent' | 'delivered' | 'read';
  attachments?: {
    type: 'file' | 'image' | 'document';
    name: string;
    url: string;
    size: number;
  }[];
}

interface Chat {
  id: string;
  participants: {
    id: string;
    name: string;
    role: 'job_seeker' | 'employer' | 'recruiter';
    avatar?: string;
  }[];
  lastMessage?: Message;
  unreadCount: number;
  applicationId?: string;
  jobId?: string;
  status: 'active' | 'archived';
  createdAt: string;
  updatedAt: string;
}

interface Notification {
  id: string;
  userId: string;
  type: 'message' | 'application' | 'interview' | 'system';
  title: string;
  content: string;
  isRead: boolean;
  timestamp: string;
  actionUrl?: string;
  metadata?: Record<string, any>;
}

export const sendMessage = async (
  chatId: string,
  content: string,
  attachments?: File[]
): Promise<Message> => {
  // In a real app, this would be an API call
  return {
    id: 'msg_1',
    senderId: 'user_1',
    receiverId: 'user_2',
    content,
    timestamp: new Date().toISOString(),
    status: 'sent',
    attachments: attachments?.map(file => ({
      type: 'file',
      name: file.name,
      url: URL.createObjectURL(file),
      size: file.size
    }))
  };
};

export const getChats = async (userId: string): Promise<Chat[]> => {
  // In a real app, this would be an API call
  return [
    {
      id: 'chat_1',
      participants: [
        {
          id: 'user_1',
          name: 'John Doe',
          role: 'job_seeker'
        },
        {
          id: 'user_2',
          name: 'Jane Smith',
          role: 'recruiter',
          avatar: 'https://example.com/avatar.jpg'
        }
      ],
      lastMessage: {
        id: 'msg_1',
        senderId: 'user_2',
        receiverId: 'user_1',
        content: 'Hello, I saw your application...',
        timestamp: new Date().toISOString(),
        status: 'read'
      },
      unreadCount: 0,
      applicationId: 'app_1',
      jobId: 'job_1',
      status: 'active',
      createdAt: new Date().toISOString(),
      updatedAt: new Date().toISOString()
    }
  ];
};

export const getChatMessages = async (chatId: string): Promise<Message[]> => {
  // In a real app, this would be an API call
  return [
    {
      id: 'msg_1',
      senderId: 'user_2',
      receiverId: 'user_1',
      content: 'Hello, I saw your application...',
      timestamp: new Date().toISOString(),
      status: 'read'
    },
    {
      id: 'msg_2',
      senderId: 'user_1',
      receiverId: 'user_2',
      content: 'Thank you for reviewing my application...',
      timestamp: new Date().toISOString(),
      status: 'delivered'
    }
  ];
};

export const markMessagesAsRead = async (chatId: string): Promise<void> => {
  // In a real app, this would be an API call
  console.log('Marking messages as read for chat:', chatId);
};

export const createChat = async (
  participants: string[],
  applicationId?: string,
  jobId?: string
): Promise<Chat> => {
  // In a real app, this would be an API call
  return {
    id: 'chat_1',
    participants: participants.map(id => ({
      id,
      name: 'User ' + id,
      role: 'job_seeker'
    })),
    unreadCount: 0,
    applicationId,
    jobId,
    status: 'active',
    createdAt: new Date().toISOString(),
    updatedAt: new Date().toISOString()
  };
};

export const getNotifications = async (userId: string): Promise<Notification[]> => {
  // In a real app, this would be an API call
  return [
    {
      id: 'notif_1',
      userId,
      type: 'message',
      title: 'New Message',
      content: 'You have a new message from Jane Smith',
      isRead: false,
      timestamp: new Date().toISOString(),
      actionUrl: '/messages/chat_1'
    },
    {
      id: 'notif_2',
      userId,
      type: 'application',
      title: 'Application Update',
      content: 'Your application for Software Engineer has been reviewed',
      isRead: false,
      timestamp: new Date().toISOString(),
      actionUrl: '/applications/app_1'
    }
  ];
};

export const markNotificationAsRead = async (notificationId: string): Promise<void> => {
  // In a real app, this would be an API call
  console.log('Marking notification as read:', notificationId);
};

export const sendApplicationMessage = async (
  application: JobApplication,
  content: string
): Promise<Message> => {
  // In a real app, this would be an API call
  return {
    id: 'msg_1',
    senderId: 'user_1',
    receiverId: 'employer_1',
    content,
    timestamp: new Date().toISOString(),
    status: 'sent'
  };
}; 