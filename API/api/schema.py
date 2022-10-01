from pydantic import BaseModel

class Result (BaseModel) :
    result: bool

class UserBase (BaseModel) :
    aadhaar_id: str

class UserCreate (UserBase) :
    pass


class OTPBase (BaseModel) :
    token: str
    type: str
    class Config: 
        orm_mode = True

class OTPVerify (OTPBase) : 
    aadhaar_id: str
    otp: int