from sqlalchemy import Column, String, Integer, Table, Text, ForeignKey, Float, Boolean, DateTime
from sqlalchemy.orm import relationship
import datetime
from .database import Base


class User (Base) :
    __tablename__ = "users"
    first_name = Column(String(length=30), nullable=False)
    last_name = Column(String(length=30), nullable=False)
    aadhaar_id = Column(String(length=12), primary_key=True)
    email = Column(String(length=50), nullable=False)
    gender = Column(String(length=10), nullable=False) # Male, Female
    age = Column(Integer)
    phone = Column(String(length=10), nullable=False) 
    marital_Status = Column(String(length=10), nullable=False) # Single, Married

class OTP (Base) :
    __tablename__ = "otp"
    token = Column(String(length=36), primary_key=True)
    aadhaar_id  = Column(String(length=12), ForeignKey("users.aadhaar_id"), nullable=False)
    otp = Column(Integer, nullable=False)
    type = Column(String(length=10), nullable=False) # ENROLL, VERIFICATION
    validated = Column(Boolean, nullable=False, default=False)
    timestamp = Column(DateTime(timezone=True), default=datetime.datetime.utcnow)




# class EnrolledUser (Base) :
#     __tablename__ = "enrolled_users"

# class Organizations (Base) :
#     __tablename__ = "organizations"

