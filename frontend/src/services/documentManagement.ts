import { User } from '../types';

interface Document {
  id: string;
  userId: string;
  name: string;
  type: 'resume' | 'cover_letter' | 'certificate' | 'portfolio' | 'other';
  fileUrl: string;
  fileSize: number;
  mimeType: string;
  version: number;
  isCurrent: boolean;
  metadata: {
    uploadedAt: string;
    lastModified: string;
    tags: string[];
    description?: string;
    visibility: 'private' | 'public' | 'shared';
    sharedWith?: string[];
  };
}

interface DocumentVersion {
  id: string;
  documentId: string;
  version: number;
  fileUrl: string;
  fileSize: number;
  uploadedAt: string;
  changes: {
    type: 'content' | 'format' | 'metadata';
    description: string;
  }[];
}

interface DocumentShare {
  id: string;
  documentId: string;
  sharedWith: {
    id: string;
    name: string;
    email: string;
    role: 'viewer' | 'editor';
  }[];
  permissions: {
    canView: boolean;
    canDownload: boolean;
    canEdit: boolean;
    canShare: boolean;
  };
  expiresAt?: string;
  accessCount: number;
}

export const uploadDocument = async (
  file: File,
  type: Document['type'],
  metadata: Partial<Document['metadata']>
): Promise<Document> => {
  // In a real app, this would be an API call
  return {
    id: 'doc_1',
    userId: 'user_1',
    name: file.name,
    type,
    fileUrl: URL.createObjectURL(file),
    fileSize: file.size,
    mimeType: file.type,
    version: 1,
    isCurrent: true,
    metadata: {
      uploadedAt: new Date().toISOString(),
      lastModified: new Date().toISOString(),
      tags: [],
      visibility: 'private',
      ...metadata
    }
  };
};

export const getDocuments = async (userId: string): Promise<Document[]> => {
  // In a real app, this would be an API call
  return [
    {
      id: 'doc_1',
      userId,
      name: 'Resume.pdf',
      type: 'resume',
      fileUrl: 'https://example.com/resume.pdf',
      fileSize: 1024 * 1024,
      mimeType: 'application/pdf',
      version: 1,
      isCurrent: true,
      metadata: {
        uploadedAt: new Date().toISOString(),
        lastModified: new Date().toISOString(),
        tags: ['resume', 'professional'],
        visibility: 'private'
      }
    }
  ];
};

export const getDocumentVersions = async (documentId: string): Promise<DocumentVersion[]> => {
  // In a real app, this would be an API call
  return [
    {
      id: 'ver_1',
      documentId,
      version: 1,
      fileUrl: 'https://example.com/resume_v1.pdf',
      fileSize: 1024 * 1024,
      uploadedAt: new Date().toISOString(),
      changes: [
        {
          type: 'content',
          description: 'Initial version'
        }
      ]
    }
  ];
};

export const updateDocument = async (
  documentId: string,
  file: File,
  changes: DocumentVersion['changes']
): Promise<Document> => {
  // In a real app, this would be an API call
  return {
    id: documentId,
    userId: 'user_1',
    name: file.name,
    type: 'resume',
    fileUrl: URL.createObjectURL(file),
    fileSize: file.size,
    mimeType: file.type,
    version: 2,
    isCurrent: true,
    metadata: {
      uploadedAt: new Date().toISOString(),
      lastModified: new Date().toISOString(),
      tags: ['resume', 'professional'],
      visibility: 'private'
    }
  };
};

export const shareDocument = async (
  documentId: string,
  shareDetails: Omit<DocumentShare, 'id' | 'documentId' | 'accessCount'>
): Promise<DocumentShare> => {
  // In a real app, this would be an API call
  return {
    id: 'share_1',
    documentId,
    sharedWith: shareDetails.sharedWith,
    permissions: shareDetails.permissions,
    expiresAt: shareDetails.expiresAt,
    accessCount: 0
  };
};

export const getSharedDocuments = async (userId: string): Promise<DocumentShare[]> => {
  // In a real app, this would be an API call
  return [
    {
      id: 'share_1',
      documentId: 'doc_1',
      sharedWith: [
        {
          id: 'user_2',
          name: 'Jane Smith',
          email: 'jane@example.com',
          role: 'viewer'
        }
      ],
      permissions: {
        canView: true,
        canDownload: true,
        canEdit: false,
        canShare: false
      },
      accessCount: 1
    }
  ];
};

export const deleteDocument = async (documentId: string): Promise<void> => {
  // In a real app, this would be an API call
  console.log('Deleting document:', documentId);
};

export const updateDocumentMetadata = async (
  documentId: string,
  metadata: Partial<Document['metadata']>
): Promise<Document> => {
  // In a real app, this would be an API call
  return {
    id: documentId,
    userId: 'user_1',
    name: 'Resume.pdf',
    type: 'resume',
    fileUrl: 'https://example.com/resume.pdf',
    fileSize: 1024 * 1024,
    mimeType: 'application/pdf',
    version: 1,
    isCurrent: true,
    metadata: {
      uploadedAt: new Date().toISOString(),
      lastModified: new Date().toISOString(),
      tags: ['resume', 'professional'],
      visibility: 'private',
      ...metadata
    }
  };
}; 