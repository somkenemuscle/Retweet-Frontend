// utils/axiosInstance.ts
import axios from 'axios';

// Create an instance of axios with default settings
const axiosInstance = axios.create({
  baseURL: 'http://localhost:4000/api', // Base URL for your API requests
  withCredentials: true, // Ensure cookies are sent with requests (important for HttpOnly cookies)
});


// This is where you can handle responses or errors globally
axiosInstance.interceptors.response.use(
  (response) => response, // Pass through successful responses
  async (error) => {
    const { response } = error;
    const originalRequest = response?.config;

    // Check if the error status is 401 and if it is related to token expiration
    if (response?.status === 401 && !originalRequest?._retry) {
      originalRequest._retry = true;
      const errorMessage = response.data?.message;

      // Only handle token refresh if the error message indicates token expiration
      if (errorMessage === 'Refresh token not found, please log in again.' ||
        errorMessage === 'Invalid refresh token. Please log in again.' ||
        errorMessage === 'Unauthorized, You dont have permission for this') {

        try {
          await axios.post('http://localhost:4000/api/auth/token', {}, { withCredentials: true });
          return axiosInstance(originalRequest);
        } catch (refreshError) {
          console.error('Token refresh error:', refreshError);



          // If the refresh fails, reject the original error and possibly redirect to login
          return Promise.reject(refreshError);
        }
      }
    }
    // If it is another type of error or the refresh failed, reject the promise with the error
    return Promise.reject(error);
  }
);

export default axiosInstance;
