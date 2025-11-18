
// A simple fetch-based API client. In a larger app, you might use a library like Axios.
const API_BASE_URL = 'http://localhost:4000/api/v1'; // Make sure this matches your backend port

let authToken: string | null = null;

const backendClient = {
  setAuthToken: (token: string | null) => {
    authToken = token;
  },

  async request(method: 'GET' | 'POST' | 'PUT' | 'DELETE', endpoint: string, data: any = null) {
    const headers: HeadersInit = {
      'Content-Type': 'application/json',
    };

    if (authToken) {
      headers['Authorization'] = `Bearer ${authToken}`;
    }

    const config: RequestInit = {
      method,
      headers,
    };

    if (data) {
      config.body = JSON.stringify(data);
    }

    try {
      const response = await fetch(`${API_BASE_URL}${endpoint}`, config);
      const responseData = await response.json();

      if (!response.ok) {
        // Create an error object that mimics Axios's response structure
        const error: any = new Error(responseData.message || 'An error occurred');
        error.response = {
            data: responseData,
            status: response.status,
            statusText: response.statusText,
        };
        throw error;
      }
      
      // Mimic Axios response structure
      return { data: responseData };
    } catch (error) {
      console.error(`API ${method} request to ${endpoint} failed:`, error);
      throw error;
    }
  },

  get(endpoint: string) {
    return this.request('GET', endpoint);
  },

  post(endpoint: string, data: any) {
    return this.request('POST', endpoint, data);
  },

  put(endpoint: string, data: any) {
    return this.request('PUT', endpoint, data);
  },
  
  delete(endpoint: string) {
    return this.request('DELETE', endpoint);
  },
};

export default backendClient;
