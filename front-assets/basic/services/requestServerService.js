import { API_BASE_URL, AUTH_ENDPOINT, HEADERS, STORAGE_KEY } from '../../../env';

export class RequestServerService {
  constructor() {
    this.baseUrl = API_BASE_URL;
  }
  
  async getToken(credentials) {
    try {
      const response = await fetch(`${this.baseUrl}${AUTH_ENDPOINT}`, {
        method: 'POST',
        headers: HEADERS,
        body: JSON.stringify(credentials),
      });
      
      if (!response.ok) throw new Error(`Failed to fetch token: ${response.status}`);
      
      const data = await response.json();
      localStorage.setItem(STORAGE_KEY, data.token);
      return data.token;
    } catch (error) {
      console.error('Error getting token:', error);
      throw error;
    }
  }
  
  getAuthToken() {
    return localStorage.getItem(STORAGE_KEY);
  }
  
  async request(method, url, data = null) {
    const token = this.getAuthToken();
    if (!token) throw new Error('No authentication token found');
    
    const options = {
      method,
      headers: {
        ...HEADERS,
        Authorization: `Bearer ${token}`,
      },
    };
    
    if (data) {
      options.body = JSON.stringify(data);
    }
    
    try {
      const response = await fetch(`${this.baseUrl}${url}`, options);
      if (!response.ok) {
        throw new Error(`HTTP error! Status: ${response.status}`);
      }
      return await response.json();
    } catch (error) {
      console.error(`API ${method} request failed:`, error);
      throw error;
    }
  }
  
  get(url) {
    return this.request('GET', url);
  }
  
  post(url, data) {
    return this.request('POST', url, data);
  }
  
  put(url, data) {
    return this.request('PUT', url, data);
  }
  
  delete(url) {
    return this.request('DELETE', url);
  }
}

export default new RequestServerService();
