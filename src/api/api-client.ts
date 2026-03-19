import axios, { AxiosError } from "axios";
import { jwtService } from "./jwt.service";

const API_BASE_URL = "https://api.realworld.show/api";

/**
 * Axios instance configured with interceptors that replicate the Angular app's
 * HTTP interceptor pipeline:
 *   1. apiInterceptor  -> base URL prefixing
 *   2. tokenInterceptor -> JWT token injection
 *   3. errorInterceptor -> global error handling
 */
const apiClient = axios.create({
  baseURL: API_BASE_URL,
});

// Token interceptor: inject JWT Authorization header on every request
apiClient.interceptors.request.use((config) => {
  const token = jwtService.getToken();
  if (token) {
    config.headers.Authorization = `Token ${token}`;
  }
  return config;
});

// Error interceptor: unwrap error response body (mirrors Angular's errorInterceptor)
apiClient.interceptors.response.use(
  (response) => response,
  (error: AxiosError) => {
    if (error.response) {
      return Promise.reject(error.response.data);
    }
    return Promise.reject(error);
  },
);

export { apiClient };
