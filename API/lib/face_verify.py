import face_recognition
import cv2
import numpy as np


class Verifier():
    def __init__(self) -> None:
        pass
    def compare(self,compare_path : str, truth_path : str):
        frame = cv2.imread(compare_path)
        t_img = face_recognition.load_image_file(truth_path)
        face_encoding = face_recognition.face_encodings(t_img)[0]
        known_face_encodings = [face_encoding]
        small_frame = cv2.resize(frame, (0, 0), fx=0.25, fy=0.25)
        rgb_small_frame = small_frame[:, :, ::-1]
        face_locations = face_recognition.face_locations(rgb_small_frame)
        face_encodings = face_recognition.face_encodings(rgb_small_frame, face_locations)
        for face_encoding in face_encodings:
            face_distances = face_recognition.face_distance(known_face_encodings, face_encoding)
            print(face_distances)
        