// API Configuration
const API_BASE_URL = 'http://localhost:5002/api';
/** Optional: link to placement-ai-system (FastAPI) for ML predictions. e.g. http://localhost:8000 */
const PLACEMENT_AI_URL = process.env.REACT_APP_PLACEMENT_AI_URL || '';

// API Service
export const apiService = {
  // Student endpoints
  getStudent: async (rollNumber: string) => {
    try {
      const response = await fetch(`${API_BASE_URL}/student/${rollNumber}`);
      const data = await response.json();
      return data;
    } catch (error) {
      console.error('API Error:', error);
      return { success: false, message: 'API connection failed' };
    }
  },

  getAllStudents: async () => {
    try {
      const response = await fetch(`${API_BASE_URL}/students`);
      const data = await response.json();
      return data;
    } catch (error) {
      console.error('API Error:', error);
      return { success: false, message: 'API connection failed' };
    }
  },

  // Prediction endpoint: tries placement-ai-system (REACT_APP_PLACEMENT_AI_URL) first, then portal backend
  predictPlacement: async (data: any) => {
    if (PLACEMENT_AI_URL) {
      try {
        const body = {
          aptitude: data.aptitudeScore ?? 0,
          mock: data.mockInterviewScore ?? 0,
          problems: data.problemsSolved ?? 0,
          hackathons: data.hackathonCount ?? 0,
          technical: data.technicalTestScore ?? 0,
          resume: data.resumeScore ?? 0,
          projects: data.projectsCount ?? 0,
        };
        const response = await fetch(`${PLACEMENT_AI_URL.replace(/\/$/, '')}/predict`, {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify(body),
        });
        if (response.ok) {
          const result = await response.json();
          return {
            success: true,
            prediction: {
              readiness: result.readiness,
              probability: typeof result.probability === 'number' ? result.probability : result.probability / 100,
              recommendations: result.recommendations || [],
            },
          };
        }
      } catch (e) {
        console.warn('Placement AI service failed, falling back to portal API:', e);
      }
    }
    try {
      const response = await fetch(`${API_BASE_URL}/predict`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(data),
      });
      const result = await response.json();
      return result;
    } catch (error) {
      console.error('API Error:', error);
      return { success: false, message: 'API connection failed' };
    }
  },

  // Dashboard stats
  getDashboardStats: async () => {
    try {
      const response = await fetch(`${API_BASE_URL}/dashboard/stats`);
      const data = await response.json();
      return data;
    } catch (error) {
      console.error('API Error:', error);
      return { success: false, message: 'API connection failed' };
    }
  },

  // Authentication endpoints
  studentLogin: async (rollNumber: string, password: string) => {
    try {
      const response = await fetch(`${API_BASE_URL}/student/login`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({ rollNumber, password }),
      });
      const data = await response.json();
      return data;
    } catch (error) {
      console.error('Student login error:', error);
      return { success: false, message: 'Network error' };
    }
  },

  facultyLogin: async (facultyId: string, password: string) => {
    try {
      const response = await fetch(`${API_BASE_URL}/faculty/login`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({ facultyId, password }),
      });
      const data = await response.json();
      return data;
    } catch (error) {
      console.error('Faculty login error:', error);
      return { success: false, message: 'Network error' };
    }
  },
  getFaculty: async (facultyId: string) => {
    try {
      const response = await fetch(`${API_BASE_URL}/faculty/${facultyId}`);
      const data = await response.json();
      return data;
    } catch (error) {
      console.error('API Error:', error);
      return { success: false, message: 'API connection failed' };
    }
  },

  // Health check
  healthCheck: async () => {
    try {
      const response = await fetch(`${API_BASE_URL}/health`);
      const data = await response.json();
      return data;
    } catch (error) {
      console.error('API Error:', error);
      return { success: false, message: 'API connection failed' };
    }
  },
};

export default apiService;
