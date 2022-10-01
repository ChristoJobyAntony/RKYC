import json
from typing import Dict, List
from uuid import uuid4
from api.models import  User, Base
from api.database import get_db, engine
from sqlalchemy.orm import Session


def run_first_commit() :
    Base.metadata.drop_all(engine)
    Base.metadata.create_all(engine)

    db : Session = get_db().__next__()
    users = []
    for key, dat in json.load(open("./api/data/users.json")).items() : 
        users.append(User(
            aadhaar_id=key,
            first_name=dat['First Name'],
            last_name=dat['Last Name'],
            gender=dat['Gender'],
            age=dat['Age'],
            email=dat['Email'],
            phone=dat['Phone'],
            marital_Status=dat['Marital Status']
        ))
    db.add_all(users)    
    db.commit()


if __name__ == "__main__" :
    run_first_commit()
