from sqlalchemy.orm.session import Session


from app.models.user_model import UserModel


def get_user_by_email(db:Session,email:str)->UserModel | None:
    return db.query(UserModel).filter(UserModel.email == email).first()


def get_user_by_id(db:Session,user_id:int)->UserModel | None:
    return db.query(UserModel).filter(UserModel.id == user_id).first()

def add_user(db:Session,new_user:UserModel)->UserModel:
    db.add(new_user)
    db.commit()
    db.refresh(new_user)
    return new_user
