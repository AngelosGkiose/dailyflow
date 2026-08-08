import {
  apiRequest,
} from "./apiClient.js";


export function getProjects() {
  return apiRequest(
    "/projects/"
  );
}


export function createProject(
  projectData
) {
  return apiRequest(
    "/projects/",
    {
      method: "POST",
      body: projectData,
    }
  );
}


export function updateProject(
  projectId,
  projectData
) {
  return apiRequest(
    `/projects/${projectId}`,
    {
      method: "PATCH",
      body: projectData,
    }
  );
}


export function deleteProject(
  projectId
) {
  return apiRequest(
    `/projects/${projectId}`,
    {
      method: "DELETE",
    }
  );
}