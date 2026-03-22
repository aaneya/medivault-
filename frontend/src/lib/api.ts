import axios, { AxiosInstance } from 'axios';
import { auth } from './firebase';

const API_URL = process.env.NEXT_PUBLIC_BACKEND_URL || 'http://localhost:5000';

const api: AxiosInstance = axios.create({
  baseURL: API_URL,
  headers: {
    'Content-Type': 'application/json',
  },
});

// Add auth token to requests
api.interceptors.request.use(async (config) => {
  try {
    const token = await auth.currentUser?.getIdToken();
    if (token) {
      config.headers.Authorization = `Bearer ${token}`;
    }
  } catch (e) {
    // No token available
  }
  return config;
});

// API endpoints
export const authAPI = {
  register: (data: any) => api.post('/api/auth/register', data),
  session: (idToken: string) => api.post('/api/auth/session', { idToken }),
};

export const onboardingAPI = {
  uploadDoc: (uid: string, docType: string, file: File) => {
    const formData = new FormData();
    formData.append('file', file);
    formData.append('docType', docType);
    return api.post('/api/onboarding/upload-doc', formData, {
      headers: { 'Content-Type': 'multipart/form-data' },
    });
  },
  submit: (data: any) => api.post('/api/onboarding/submit', data),
  status: () => api.get('/api/onboarding/status'),
};

export const recordsAPI = {
  upload: (file: File, title: string, description: string, patientId?: string) => {
    const formData = new FormData();
    formData.append('file', file);
    formData.append('title', title);
    formData.append('description', description);
    if (patientId) formData.append('patientId', patientId);
    return api.post('/api/records/upload', formData, {
      headers: { 'Content-Type': 'multipart/form-data' },
    });
  },
  list: () => api.get('/api/records'),
  get: (recordId: string) => api.get(`/api/records/${recordId}`),
  getSignedUrl: (recordId: string) => api.get(`/api/records/${recordId}/signed-url`),
  verify: (recordId: string) => api.get(`/api/records/${recordId}/verify`),
  delete: (recordId: string) => api.delete(`/api/records/${recordId}`),
};

export const accessAPI = {
  createRequest: (data: any) => api.post('/api/access-requests', data),
  getMyRequests: () => api.get('/api/access/requests/mine'),
  getPendingRequests: () => api.get('/api/access-requests/pending'),
  respondRequest: (reqId: string, status: string) =>
    api.patch(`/api/access-requests/${reqId}`, { status }),
};

export const adminAPI = {
  getPendingOnboarding: () => api.get('/api/admin/onboarding/pending'),
  reviewOnboarding: (uid: string, action: string, reason?: string) =>
    api.patch(`/api/admin/onboarding/${uid}/review`, {
      action,
      rejectionReason: reason,
    }),
};

export const auditAPI = {
  getMine: () => api.get('/api/audit/mine'),
};

export default api;
