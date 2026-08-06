const API_BASE_URL = "http://127.0.0.1:8000";

export const AUTH_CHANGED_EVENT =
  "dailyflow-auth-changed";


export class ApiError extends Error {
  constructor(message, status, data = null) {
    super(message);

    this.name = "ApiError";
    this.status = status;
    this.data = data;
  }
}


function notifyAuthChanged() {
  window.dispatchEvent(
    new Event(AUTH_CHANGED_EVENT)
  );
}


function decodeJwtPayload(token) {
  try {
    const tokenParts = token.split(".");

    if (tokenParts.length !== 3) {
      return null;
    }

    const base64Url = tokenParts[1];

    const base64 = base64Url
      .replace(/-/g, "+")
      .replace(/_/g, "/");

    const paddedBase64 = base64.padEnd(
      Math.ceil(base64.length / 4) * 4,
      "="
    );

    const decodedPayload =
      decodeURIComponent(
        window
          .atob(paddedBase64)
          .split("")
          .map((character) => {
            const characterCode =
              character.charCodeAt(0);

            return (
              "%" +
              characterCode
                .toString(16)
                .padStart(2, "0")
            );
          })
          .join("")
      );

    return JSON.parse(decodedPayload);
  } catch {
    return null;
  }
}


export function isAccessTokenValid(token) {
  if (!token) {
    return false;
  }

  const payload = decodeJwtPayload(token);

  if (!payload) {
    return false;
  }

  if (typeof payload.exp !== "number") {
    return false;
  }

  const currentTimeInSeconds =
    Math.floor(Date.now() / 1000);

  return payload.exp > currentTimeInSeconds;
}


export function getAccessToken() {
  const accessToken =
    localStorage.getItem("access_token");

  if (!accessToken) {
    return null;
  }

  if (!isAccessTokenValid(accessToken)) {
    localStorage.removeItem("access_token");

    notifyAuthChanged();

    return null;
  }

  return accessToken;
}


export function saveAccessToken(accessToken) {
  localStorage.setItem(
    "access_token",
    accessToken
  );

  notifyAuthChanged();
}


export function removeAccessToken() {
  localStorage.removeItem("access_token");

  notifyAuthChanged();
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
    removeAccessToken();

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
    removeAccessToken();

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