import {
  apiRequest,
} from "./apiClient.js";


export function registerUser(
  userData
) {
  return apiRequest(
    "/auth/register",
    {
      method: "POST",
      body: userData,
    }
  );
}


export function loginUser(
  credentials
) {
  return apiRequest(
    "/auth/login",
    {
      method: "POST",
      body: credentials,
    }
  );
}


export function logoutUser() {
  return apiRequest(
    "/auth/logout",
    {
      method: "POST",
    }
  );
}


export function getCurrentUser() {
  return apiRequest(
    "/auth/me"
  );
}