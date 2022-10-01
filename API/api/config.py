BASE = "./api"
DB_CREDENTIALS = BASE + "/secrets/database.txt"
TOKEN_VALIDITY_TIME = 60
ACTOR_USER = "user"
ACTOR_ORGANIZATION = "organization"
JWT_SECRET_KEY = open(BASE + "/secrets/jwt_secret_key.txt").read()
JWT_ALGORITHM = "HS256"
OTP_ENROLL = "enrollment"
OTP_VERIFY = "verification"
