from datetime import date

from fastapi import APIRouter, Depends, Query
from sqlalchemy.orm.session import Session
from starlette import status

from app.dependencies.authutils import get_current_user
from app.dependencies.db import get_db
from app.models.task_model import TaskPriority, TaskStatus
from app.models.user_model import UserModel
from app.schemas.tasks import SortOrder, TaskCreate, TaskPaginationResponse, TaskResponse, TaskSortBy, TaskUpdate
from app.services.task_service import add_label_to_task_service, complete_task_service, create_task_service, delete_label_from_task_service, delete_task_service, get_task_by_id_service, get_tasks_inbox_service, get_tasks_service, reopen_task_service, update_task_service

router = APIRouter(prefix="/tasks", tags=["Tasks"])


@router.post("/", response_model=TaskResponse, status_code=status.HTTP_201_CREATED,
             summary="Create task", description="Creates a new task for the authenticated user. The task can optionally belong to a project.",
             responses={401: {"description": "Authentication credentials are missing or invalid."},
                        404: {"description": "Selected project was not found."},
                        422: {"description": "The submitted task data is invalid."}})
def create_task(request: TaskCreate, db: Session = Depends(get_db), current_user: UserModel = Depends(get_current_user)):
    return create_task_service(request, db, current_user)


@router.get("/", response_model=TaskPaginationResponse, status_code=status.HTTP_200_OK,
            summary="List and filter tasks", description="Returns a paginated collection of tasks belonging to the authenticated user. Tasks can be filtered by project, label, status, priority, search text and due date, and can also be sorted.",
            responses={401: {"description": "Authentication credentials are missing or invalid."},
                       422: {"description": "One or more query parameters are invalid."}})
def get_tasks(project_id: int | None = Query(default=None, gt=0, description="Filter tasks by project ID."), task_status: TaskStatus | None = Query(default=None, alias="status", description="Filter tasks by status."), priority: TaskPriority | None = Query(default=None, description="Filter tasks by priority."), search: str | None = Query(default=None, max_length=100, description="Search tasks by text."), due_date: date | None = Query(default=None, description="Filter tasks by due date."), sort_by: TaskSortBy = Query(default=TaskSortBy.CREATED_AT, description="Field used to sort the results."), order: SortOrder = Query(default=SortOrder.DESC, description="Sort direction."), page: int = Query(default=1, ge=1, description="Page number."), page_size: int = Query(default=20, ge=1, le=100, description="Number of tasks returned per page."), label_id: int | None = Query(default=None, gt=0, description="Filter tasks by label ID."), current_user: UserModel = Depends(get_current_user), db: Session = Depends(get_db)):
    return get_tasks_service(project_id, task_status, priority, search, due_date, sort_by, order, page, page_size, label_id, current_user, db)


@router.get("/inbox", response_model=list[TaskResponse], status_code=status.HTTP_200_OK,
            summary="Get inbox tasks", description="Returns pending tasks belonging to the authenticated user that are not assigned to a project.",
            responses={401: {"description": "Authentication credentials are missing or invalid."}})
def get_tasks_inbox(current_user: UserModel = Depends(get_current_user), db: Session = Depends(get_db)):
    return get_tasks_inbox_service(current_user, db)


@router.get("/{task_id}", response_model=TaskResponse, status_code=status.HTTP_200_OK,
            summary="Get task", description="Returns a single task by ID if it belongs to the authenticated user.",
            responses={401: {"description": "Authentication credentials are missing or invalid."},
                       404: {"description": "Task not found."}})
def get_task_by_id(task_id: int, current_user: UserModel = Depends(get_current_user), db: Session = Depends(get_db)):
    return get_task_by_id_service(task_id, current_user, db)


@router.patch("/{task_id}", response_model=TaskResponse, status_code=status.HTTP_200_OK,
              summary="Update task", description="Partially updates a task belonging to the authenticated user.",
              responses={401: {"description": "Authentication credentials are missing or invalid."},
                         404: {"description": "Task or selected project not found."},
                         422: {"description": "The submitted task data is invalid."}})
def update_task(task_id: int, updated_task: TaskUpdate, current_user: UserModel = Depends(get_current_user), db: Session = Depends(get_db)):
    return update_task_service(task_id, updated_task, current_user, db)


@router.delete("/{task_id}", status_code=status.HTTP_204_NO_CONTENT, summary="Delete task",
               description="Permanently deletes a task belonging to the authenticated user.",
               responses={401: {"description": "Authentication credentials are missing or invalid."},
                          404: {"description": "Task not found."}})
def delete_task(task_id: int, current_user: UserModel = Depends(get_current_user), db: Session = Depends(get_db)):
    delete_task_service(task_id, current_user, db)


@router.patch("/{task_id}/complete", response_model=TaskResponse, status_code=status.HTTP_200_OK,
              summary="Complete task", description="Marks a pending task as completed.",
              responses={401: {"description": "Authentication credentials are missing or invalid."},
                         404: {"description": "Task not found."}})
def complete_task(task_id: int, current_user: UserModel = Depends(get_current_user), db: Session = Depends(get_db)):
    return complete_task_service(task_id, current_user, db)


@router.patch("/{task_id}/reopen", response_model=TaskResponse, status_code=status.HTTP_200_OK,
              summary="Reopen task", description="Changes a completed task back to pending.",
              responses={401: {"description": "Authentication credentials are missing or invalid."},
                         404: {"description": "Task not found."}})
def reopen_task(task_id: int, current_user: UserModel = Depends(get_current_user), db: Session = Depends(get_db)):
    return reopen_task_service(task_id, current_user, db)


@router.post("/{task_id}/labels/{label_id}", response_model=TaskResponse, status_code=status.HTTP_200_OK,
             summary="Add label to task", description="Assigns an existing label to an existing task. Both resources must belong to the authenticated user.",
             responses={401: {"description": "Authentication credentials are missing or invalid."},
                        404: {"description": "Task or label not found."}})
def add_label_to_task(task_id: int, label_id: int, current_user: UserModel = Depends(get_current_user), db: Session = Depends(get_db)):
    return add_label_to_task_service(task_id, label_id, current_user, db)


@router.delete("/{task_id}/labels/{label_id}", status_code=status.HTTP_204_NO_CONTENT,
               summary="Remove label from task", description="Removes a label assignment from a task without deleting the task or the label.",
               responses={401: {"description": "Authentication credentials are missing or invalid."},
                          404: {"description": "Task or label not found."}})
def delete_label_from_task(task_id: int, label_id: int, current_user: UserModel = Depends(get_current_user), db: Session = Depends(get_db)):
    delete_label_from_task_service(task_id, label_id, current_user, db)