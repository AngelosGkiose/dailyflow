import {
  apiRequest,
} from "./apiClient.js";


function buildQueryString(
  parameters = {}
) {
  const searchParameters =
    new URLSearchParams();

  Object.entries(
    parameters
  ).forEach(
    ([key, value]) => {
      if (
        value !== undefined &&
        value !== null &&
        value !== ""
      ) {
        searchParameters.append(
          key,
          String(value)
        );
      }
    }
  );

  const queryString =
    searchParameters.toString();

  return queryString
    ? `?${queryString}`
    : "";
}


export function getFilteredTasks(
  parameters = {}
) {
  const queryString =
    buildQueryString(
      parameters
    );

  return apiRequest(
    `/tasks/${queryString}`
  );
}


export function getInboxTasks() {
  return apiRequest(
    "/tasks/inbox"
  );
}


export function getTodayTasks() {
  return apiRequest(
    "/dashboard/today"
  );
}


export function getUpcomingTasks() {
  return apiRequest(
    "/dashboard/upcoming"
  );
}


export function createTask(
  taskData
) {
  return apiRequest(
    "/tasks/",
    {
      method: "POST",
      body: taskData,
    }
  );
}


export function updateTask(
  taskId,
  taskData
) {
  return apiRequest(
    `/tasks/${taskId}`,
    {
      method: "PATCH",
      body: taskData,
    }
  );
}


export function deleteTask(
  taskId
) {
  return apiRequest(
    `/tasks/${taskId}`,
    {
      method: "DELETE",
    }
  );
}


export function completeTask(
  taskId
) {
  return apiRequest(
    `/tasks/${taskId}/complete`,
    {
      method: "PATCH",
    }
  );
}


export function reopenTask(
  taskId
) {
  return apiRequest(
    `/tasks/${taskId}/reopen`,
    {
      method: "PATCH",
    }
  );
}


export function addLabelToTask(
  taskId,
  labelId
) {
  return apiRequest(
    `/tasks/${taskId}/labels/${labelId}`,
    {
      method: "POST",
    }
  );
}


export function removeLabelFromTask(
  taskId,
  labelId
) {
  return apiRequest(
    `/tasks/${taskId}/labels/${labelId}`,
    {
      method: "DELETE",
    }
  );
}