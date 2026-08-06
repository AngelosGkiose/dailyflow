import {
  apiRequest,
} from "./apiClient.js";


function createQueryString(
  parameters = {}
) {
  const searchParameters =
    new URLSearchParams();

  for (
    const [name, value]
    of Object.entries(parameters)
  ) {
    if (
      value !== null &&
      value !== undefined &&
      value !== ""
    ) {
      searchParameters.set(
        name,
        String(value)
      );
    }
  }

  return searchParameters.toString();
}


export function getFilteredTasks(
  parameters,
  onUnauthorized
) {
  const queryString =
    createQueryString(parameters);

  const path = queryString
    ? `/tasks/?${queryString}`
    : "/tasks/";

  return apiRequest(path, {
    onUnauthorized,
  });
}


export function getInboxTasks(
  onUnauthorized
) {
  return apiRequest(
    "/tasks/inbox",
    {
      onUnauthorized,
    }
  );
}


export function getTodayTasks(
  onUnauthorized
) {
  return apiRequest(
    "/dashboard/today",
    {
      onUnauthorized,
    }
  );
}


export function getUpcomingTasks(
  onUnauthorized
) {
  return apiRequest(
    "/dashboard/upcoming",
    {
      onUnauthorized,
    }
  );
}


export function createTask(
  taskData,
  onUnauthorized
) {
  return apiRequest(
    "/tasks/",
    {
      method: "POST",
      body: taskData,
      onUnauthorized,
    }
  );
}


export function updateTask(
  taskId,
  taskData,
  onUnauthorized
) {
  return apiRequest(
    `/tasks/${taskId}`,
    {
      method: "PATCH",
      body: taskData,
      onUnauthorized,
    }
  );
}


export function completeTask(
  taskId,
  onUnauthorized
) {
  return apiRequest(
    `/tasks/${taskId}/complete`,
    {
      method: "PATCH",
      onUnauthorized,
    }
  );
}


export function reopenTask(
  taskId,
  onUnauthorized
) {
  return apiRequest(
    `/tasks/${taskId}/reopen`,
    {
      method: "PATCH",
      onUnauthorized,
    }
  );
}


export function deleteTask(
  taskId,
  onUnauthorized
) {
  return apiRequest(
    `/tasks/${taskId}`,
    {
      method: "DELETE",
      onUnauthorized,
    }
  );
}


export function addLabelToTask(
  taskId,
  labelId,
  onUnauthorized
) {
  return apiRequest(
    `/tasks/${taskId}/labels/${labelId}`,
    {
      method: "POST",
      onUnauthorized,
    }
  );
}


export function removeLabelFromTask(
  taskId,
  labelId,
  onUnauthorized
) {
  return apiRequest(
    `/tasks/${taskId}/labels/${labelId}`,
    {
      method: "DELETE",
      onUnauthorized,
    }
  );
}