// src/utils/api.js
import axios from 'axios';

const API_URL = 'http://localhost:5001/api';

const api = {
  // Users
  getUsers: () => axios.get(`${API_URL}/users`),
  getUser: (id) => axios.get(`${API_URL}/users/${id}`),
  createUser: (userData) => axios.post(`${API_URL}/users`, userData),
  updateUser: (id, userData) => axios.put(`${API_URL}/users/${id}`, userData),
  deleteUser: (id) => axios.delete(`${API_URL}/users/${id}`),

  // Projects
  getProjects: () => axios.get(`${API_URL}/projects`),
  getProject: (id) => axios.get(`${API_URL}/projects/${id}`),
  getUserProjects: (userId) => axios.get(`${API_URL}/projects/user/${userId}`),
  createProject: (projectData) => axios.post(`${API_URL}/projects`, projectData),
  updateProject: (id, projectData) => axios.put(`${API_URL}/projects/${id}`, projectData),
  deleteProject: (id) => axios.delete(`${API_URL}/projects/${id}`),

  // Intake Form Endpoints
  createIntakeForm: (formData) => axios.post(`${API_URL}/intake`, formData),
  getIntakeFormsByUser: (userId) => axios.get(`${API_URL}/intake/user/${userId}`),
  getIntakeForm: (id) => axios.get(`${API_URL}/intake/${id}`),
  updateIntakeForm: (id, formData) => axios.put(`${API_URL}/intake/${id}`, formData),
  generateFemaForms: (id) => axios.post(`${API_URL}/intake/${id}/generate`),
  validatePappgCompliance: (id) => axios.post(`${API_URL}/intake/${id}/validate`),

  // Documents
  getProjectDocuments: (projectId) => axios.get(`${API_URL}/documents/project/${projectId}`),
  uploadDocument: (formData) => {
    return axios.post(`${API_URL}/documents/upload`, formData, {
      headers: {
        'Content-Type': 'multipart/form-data',
      },
    });
  },
  deleteDocument: (id) => axios.delete(`${API_URL}/documents/${id}`),
};

export default api;