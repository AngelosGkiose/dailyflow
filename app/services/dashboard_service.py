from datetime import datetime, timezone, timedelta, time

from app.repositories.dashboard_repository import today_tasks_repo, upcoming_tasks_repo, overdue_task_repo, \
    get_summary_repo
from app.schemas.dashboard import DashboardSummaryResponse


def today_tasks_service(db,current_user):
    now = datetime.now(timezone.utc)
    today = now.date()
    tomorrow = today + timedelta(days=1)
    start_tomorrow =datetime.combine(
        tomorrow,
        time.min
    )
    return today_tasks_repo(db,current_user.id,start_tomorrow)

def upcoming_tasks_service(db,current_user):
    now=datetime.now(timezone.utc)
    today=now.date()
    tomorrow = today + timedelta(days=1)
    start_tomorrow = datetime.combine(tomorrow,time.min,tzinfo=timezone.utc)
    return upcoming_tasks_repo(db,current_user.id,start_tomorrow)

def overdue_tasks_service(db,current_user):
    now=datetime.now(timezone.utc)
    return overdue_task_repo(db, current_user.id, now)

def get_statistics_service(db,current_user):
    now=datetime.now(timezone.utc)
    today = now.date()
    tomorrow = today + timedelta(days=1)
    start_tomorrow = datetime.combine(tomorrow,time.min,tzinfo=timezone.utc)
    summary_tasks=get_summary_repo(db,current_user.id,start_tomorrow,now)
    return DashboardSummaryResponse(total_tasks=summary_tasks['total_tasks'],
                                    pending_tasks=summary_tasks['pending_tasks'],
                                    completed_tasks=summary_tasks['completed_tasks'],
                                    today_tasks=summary_tasks['today_tasks'],
                                    overdue_tasks=summary_tasks['overdue_tasks'],
                                    total_projects=summary_tasks["total_projects"])



