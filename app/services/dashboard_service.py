from datetime import datetime, timezone, timedelta, time

from app.repositories.dashboard_repository import today_tasks_repo, upcoming_tasks_repo


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
    start_tomorrow = datetime.combine(tomorrow,time.min)
    return upcoming_tasks_repo(db,current_user.id,start_tomorrow)

