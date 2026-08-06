import {
  apiRequest,
} from "./apiClient.js";


export function registerUser(userData) {
  return apiRequest(
    "/auth/register",
    {
      method: "POST",
      body: userData,
      requiresAuth: false,
    }
  );
}


export function loginUser(credentials) {
  return apiRequest(
    "/auth/login",
    {
      method: "POST",
      body: credentials,
      requiresAuth: false,
    }
  );
}