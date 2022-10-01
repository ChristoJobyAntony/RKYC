from uuid import uuid4
from sqlalchemy.orm import Session
import datetime

from . import models

def get_user (db: Session, aadhaar_id: str) -> models.User:
    return db.query(models.User).filter(models.User.aadhaar_id ==  aadhaar_id).first()

def get_otp (db: Session, token: str) -> models.OTP:
    return db.query(models.OTP).filter(models.OTP.token == token).first()

def verify_otp (db: Session, token: str):
    delete_expired_otp(db)
    otp = get_otp(db, token)
    otp.validated = True
    db.commit()

def issue_otp (db: Session, aadhaar_id: str, type: str) :
    token = uuid4().hex
    db.query(models.OTP).filter(models.OTP.aadhaar_id == aadhaar_id).filter(models.OTP.type == type).delete()
    db.add(models.OTP(
        token=token,
        aadhaar_id=aadhaar_id,
        otp=808012,
        type=type,
    ))
    db.commit()
    return token

def delete_expired_otp (db:Session) :
    max_time = datetime.datetime.utcnow() - datetime.timedelta(minutes=10)
    db.query(models.OTP).filter(models.OTP.timestamp < max_time).delete()
    db.commit()

def verify_enroll (db: Session, aadhaar_id: str):
    user = get_user(db,aadhaar_id)
    user.is_enrolled = True
    db.commit()