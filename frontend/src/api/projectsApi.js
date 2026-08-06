import {
  apiRequest,
} from "./apiClient.js";


export function getProjects(
  onUnauthorized
) {
  return apiRequest(
    "/projects/",
    {
      onUnauthorized,
    }
  );
}


export function createProject(
  projectData,
  onUnauthorized
) {
  return apiRequest(
    "/projects/",
    {
      method: "POST",
      body: projectData,
      onUnauthorized,
    }
  );
}


export function updateProject(
  projectId,
  projectData,
  onUnauthorized
) {
  return apiRequest(
    `/projects/${projectId}`,
    {
      method: "PATCH",
      body: projectData,
      onUnauthorized,
    }
  );
}


export function deleteProject(
  projectId,
  onUnauthorized
) {
  return apiRequest(
    `/projects/${projectId}`,
    {
      method: "DELETE",
      onUnauthorized,
    }
  );
}