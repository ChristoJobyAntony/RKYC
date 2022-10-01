from uuid import uuid4
from sqlalchemy.orm import Session

from . import models

def get_user (db: Session, aadhaar_id: str) :
    return db.query(models.User).filter(models.User.aadhaar_id ==  aadhaar_id).first()

def get_otp (db: Session, token: str) :
    return db.query(models.OTP).filter(models.OTP.token == token).first()

def issue_otp (db: Session, aadhaar_id: str, type: str) :
    token = uuid4().hex
    db.add(models.OTP(
        token=token,
        aadhaar_id=aadhaar_id,
        otp=808012,
        type=type,
    ))
    db.commit()
    return token

def delete_expired_otp () :
    pass

