import {
  apiRequest,
} from "./apiClient.js";


export function getLabels(
  onUnauthorized
) {
  return apiRequest(
    "/labels/",
    {
      onUnauthorized,
    }
  );
}


export function createLabel(
  labelData,
  onUnauthorized
) {
  return apiRequest(
    "/labels/",
    {
      method: "POST",
      body: labelData,
      onUnauthorized,
    }
  );
}


export function updateLabel(
  labelId,
  labelData,
  onUnauthorized
) {
  return apiRequest(
    `/labels/${labelId}`,
    {
      method: "PATCH",
      body: labelData,
      onUnauthorized,
    }
  );
}


export function deleteLabel(
  labelId,
  onUnauthorized
) {
  return apiRequest(
    `/labels/${labelId}`,
    {
      method: "DELETE",
      onUnauthorized,
    }
  );
}