const API_BASE_URL =
  import.meta.env.VITE_API_BASE_URL;


export class ApiError extends Error {
  constructor(message, status, data = null) {
    super(message);

    this.name = "ApiError";
    this.status = status;
    this.data = data;
  }
}


export async function apiRequest(
  path,
  {
    method = "GET",
    body,
    headers = {},
  } = {}
) {
  const requestHeaders = {
    ...headers,
  };

  let requestBody;

  if (body !== undefined) {
    requestHeaders["Content-Type"] =
      "application/json";

    requestBody =
      JSON.stringify(body);
  }


  let response;

  try {
    response = await fetch(
      `${API_BASE_URL}${path}`,
      {
        method,
        headers:
          requestHeaders,
        body:
          requestBody,
        credentials:
          "include",
      }
    );
  } catch {
    throw new ApiError(
      "Could not connect to the server",
      0
    );
  }


  if (
    response.status ===
    204
  ) {
    return null;
  }


  let data = null;

  const contentType =
    response.headers.get(
      "content-type"
    );


  if (
    contentType?.includes(
      "application/json"
    )
  ) {
    data =
      await response.json();
  }


  if (!response.ok) {
    let message =
      "The request could not be completed";


    if (
      typeof data?.detail ===
      "string"
    ) {
      message =
        data.detail;
    } else if (
      Array.isArray(
        data?.detail
      )
    ) {
      message =
        data.detail
          .map(
            (errorItem) =>
              errorItem.msg
          )
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