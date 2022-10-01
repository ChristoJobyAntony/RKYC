BASE = "./api"
VIDEO_PATH = BASE + "/media/video/"
AUDIO_PATH = BASE + "/media/audio/"
FACE_PATH = BASE + "/media/faces/"
FACE_COMPARE_PATH = BASE + "/media/faces_compare/"
VIDEO_COMPARE_PATH = BASE + "/media/video/videos_compare"
EMBED_PATH = BASE + "/media/voice_embeds/"
DB_CREDENTIALS = BASE + "/secrets/database.txt"
TOKEN_VALIDITY_TIME = 60
ACTOR_USER = "user"
ACTOR_ORGANIZATION = "organization"
JWT_SECRET_KEY = open(BASE + "/secrets/jwt_secret_key.txt").read()
JWT_ALGORITHM = "HS256"
OTP_ENROLL = "enroll"
OTP_VERIFY = "verify"
