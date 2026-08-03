from sqlalchemy.orm.session import Session

from app.models.label_model import LabelModel


def get_label_by_name(db:Session,current_user_id:int,name:str):
    return db.query(LabelModel).filter(LabelModel.user_id == current_user_id,LabelModel.name == name).first()

def add_label(db:Session,label:LabelModel):
    db.add(label)
    db.commit()
    db.refresh(label)
    return label

def get_all_labels_repo(db:Session,current_user_id:int):
    return db.query(LabelModel).filter(LabelModel.user_id == current_user_id).order_by(
            LabelModel.name.asc(),
            LabelModel.id.asc()
        ).all()

def  get_label_by_id_repo(db:Session,label_id:int,current_user_id:int):
    return db.query(LabelModel).filter(LabelModel.id == label_id,LabelModel.user_id == current_user_id).first()

def update_label_repo(db:Session,label:LabelModel):
    db.commit()
    db.refresh(label)
    return label