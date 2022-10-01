import shutil
from uuid import uuid4
import aiofiles
from fastapi import FastAPI, Depends, HTTPException, status, Form, Security, UploadFile, File
from fastapi.middleware.cors import CORSMiddleware
from fastapi.security import OAuth2PasswordRequestForm, SecurityScopes
from sqlalchemy.orm import Session

from . import schema, curd, config
from .database import Base, get_db, engine

Base.metadata.create_all(engine)

app  = FastAPI()

origins = [
    "*"
]

app.add_middleware(
    CORSMiddleware,
    allow_origins=origins,
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"]
)

@app.get("/user/available", response_model=schema.Result)
def user_available (aadhaar_id: str, db:Session = Depends(get_db)) :
    return {
        "result" : False if curd.get_user(db, aadhaar_id=aadhaar_id)  == None else True
    }
    
@app.post("/user/enroll/otp/issue", response_model=schema.OTPBase)
def user_enroll_otp_issue (aadhaar_id: str, db:Session=Depends(get_db)) :
    t = curd.issue_otp(db, aadhaar_id, config.OTP_ENROLL)
    t =  curd.get_otp(db, t)
    print(t.timestamp)
    return t
    

@app.get("/user/enroll/otp/verify", response_model=schema.Result) 
def user_enroll_otp_verify (aadhaar_id: str, token:str,  otp:int, db:Session=Depends(get_db)) :
    t = curd.get_otp(db, token)
    if (not t) : 
        raise HTTPException(status_code=400, detail="The token is expired or not found !")
    if (t.aadhaar_id != aadhaar_id) :
        raise HTTPException(status_code=400, detail="Invalid request")
    if (otp != t.otp) :
        raise HTTPException(status_code=400, detail="Invalid OTP")
    curd.verify_otp(db, token)
    return {
        "result": True
    }

@app.post("/user/enroll/register")
async def read_root(aadhaar_id:str, otp_token: str, video: UploadFile = File(), db=Depends(get_db), audio: UploadFile=File()):
    video_path = config.VIDEO_PATH + uuid4().hex + ".mp4"
    audio_path = config.AUDIO_PATH + uuid4().hex + ".wav"
    if video.content_type != "video/webm" :
        raise HTTPException(status_code=400, detail="Invalid Video File")
    if audio.content_type != "audio/wav" :
        raise HTTPException(status_code=400, detail="Invalid Audio File")
    with open(video_path, "wb+") as file_object:
        shutil.copyfileobj(video.file, file_object) 
    with open(audio_path, "wb+") as file_object : 
        shutil.copyfileobj(audio.file, file_object)
    return {}

@app.get("/test")
def delete (db=Depends(get_db)) :
    curd.delete_expired_otp(db)
