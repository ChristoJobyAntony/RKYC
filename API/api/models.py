from email.policy import default
from sqlalchemy import Column, String, Integer, Table, Text, ForeignKey, Float, null
from sqlalchemy.orm import relationship

from .database import Base


class User (Base) :
    __tablename__ = "users"
    first_name = Column(String(length=30), nullable=False)
    last_name = Column(String(length=30), nullable=False)
    aadhaar_id = Column(String(length=10), primary_key=True)
    email = Column(String(length=50), nullable=False)
    gender = Column(String(length=10), nullable=False)
    age = Column(Integer)
    phone = Column(String(length=10), nullable=False)
    marital_Status = Column(String(length=10), nullable=False)

class EnrolledUser (Base) :
    pass

class Organizations (Base) :
    pass

class Moderators (Base) :
    pass

