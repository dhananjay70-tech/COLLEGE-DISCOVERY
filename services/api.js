import axios from 'axios';

const API_BASE_URL = import.meta.env.VITE_API_URL || 'http://localhost:5000/api';

const apiClient = axios.create({
  baseURL: API_BASE_URL,
  headers: {
    'Content-Type': 'application/json'
  }
});

// Add token to requests
apiClient.interceptors.request.use((config) => {
  const token = localStorage.getItem('token');
  if (token) {
    config.headers.Authorization = `Bearer ${token}`;
  }
  return config;
});

// Auth endpoints
export const authAPI = {
  register: (data) => apiClient.post('/auth/register', data),
  login: (data) => apiClient.post('/auth/login', data),
  logout: () => apiClient.post('/auth/logout'),
  getMe: () => apiClient.get('/auth/me')
};

// College endpoints
export const collegeAPI = {
  getAllColleges: (params) => apiClient.get('/colleges', { params }),
  getCollegeById: (id) => apiClient.get(`/colleges/${id}`),
  addReview: (id, data) => apiClient.post(`/colleges/${id}/review`, data)
};

// Saved colleges endpoints
export const savedAPI = {
  saveCollege: (collegeId) => apiClient.post(`/saved/save/${collegeId}`),
  unsaveCollege: (collegeId) => apiClient.delete(`/saved/unsave/${collegeId}`),
  getSavedColleges: () => apiClient.get('/saved'),
  compareColleges: (data) => apiClient.post('/saved/compare', data)
};

export default apiClient;
