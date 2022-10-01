import csv
import json
from random import randint
from uuid import uuid4

with open("./api/data/users.csv", "r") as f :
    c = csv.DictReader(f)
    d = {}
    for row in c :
        row['Phone'] = row['Phone'].replace("-", "") + str(randint(0, 9))
        a = row.pop("aadhar_id") + str(randint(0, 9)) + str(randint(0, 9))
        d[a] = row
    json.dump(d, open("./api/data/users.json", "w+"))

