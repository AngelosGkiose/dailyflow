import {
  apiRequest,
} from "./apiClient.js";


export function getLabels() {
  return apiRequest(
    "/labels/"
  );
}


export function createLabel(
  labelData
) {
  return apiRequest(
    "/labels/",
    {
      method: "POST",
      body: labelData,
    }
  );
}


export function updateLabel(
  labelId,
  labelData
) {
  return apiRequest(
    `/labels/${labelId}`,
    {
      method: "PATCH",
      body: labelData,
    }
  );
}


export function deleteLabel(
  labelId
) {
  return apiRequest(
    `/labels/${labelId}`,
    {
      method: "DELETE",
    }
  );
}