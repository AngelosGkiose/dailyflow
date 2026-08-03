from pydantic import BaseModel


class DashboardSummaryResponse(BaseModel):
    total_tasks: int
    pending_tasks: int
    completed_tasks: int
    today_tasks: int
    overdue_tasks: int
    total_projects: int