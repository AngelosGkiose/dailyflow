const API_BASE_URL = "http://127.0.0.1:8000";


export class ApiError extends Error {
  constructor(message, status, data = null) {
    super(message);

    this.name = "ApiError";
    this.status = status;
    this.data = data;
  }
}


export function getAccessToken() {
  return localStorage.getItem("access_token");
}


export function saveAccessToken(accessToken) {
  localStorage.setItem(
    "access_token",
    accessToken
  );
}


export function removeAccessToken() {
  localStorage.removeItem("access_token");
}


export async function apiRequest(
  path,
  {
    method = "GET",
    body,
    headers = {},
    onUnauthorized,
    requiresAuth = true,
  } = {}
) {
  const accessToken = getAccessToken();

  if (requiresAuth && !accessToken) {
    if (onUnauthorized) {
      onUnauthorized();
    }

    throw new ApiError(
      "Authentication required",
      401
    );
  }

  const requestHeaders = {
    ...headers,
  };

  if (requiresAuth && accessToken) {
    requestHeaders.Authorization =
      `Bearer ${accessToken}`;
  }

  let requestBody;

  if (body !== undefined) {
    requestHeaders["Content-Type"] =
      "application/json";

    requestBody = JSON.stringify(body);
  }

  let response;

  try {
    response = await fetch(
      `${API_BASE_URL}${path}`,
      {
        method,
        headers: requestHeaders,
        body: requestBody,
      }
    );
  } catch {
    throw new ApiError(
      "Could not connect to the server",
      0
    );
  }

  if (response.status === 401) {
    if (requiresAuth && onUnauthorized) {
      onUnauthorized();
    }

    throw new ApiError(
      "Authentication required",
      401
    );
  }

  if (response.status === 204) {
    return null;
  }

  let data = null;

  const contentType =
    response.headers.get("content-type");

  if (
    contentType?.includes(
      "application/json"
    )
  ) {
    data = await response.json();
  }

  if (!response.ok) {
    let message =
      "The request could not be completed";

    if (typeof data?.detail === "string") {
      message = data.detail;
    } else if (Array.isArray(data?.detail)) {
      message = data.detail
        .map((errorItem) => errorItem.msg)
        .join(", ");
    }

    throw new ApiError(
      message,
      response.status,
      data
    );
  }

  return data;
}