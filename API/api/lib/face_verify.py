import face_recognition
import cv2
import numpy as np


class FaceVerifier():
    def __init__(self, threshold : float = 0.35) -> None:
        """A helper class to hold the methods required for face authentication

        Args:
            threshold (float, optional): Threshold for similarity between faces. Defaults to 0.35.
        """
        self.threshold = threshold
        
    def compare(self,compare_path : str, truth_path : str):
        """Compares a face in given image against face in ground truth image and returns a score or None if distance is too far/no face detected.

        Args:
            compare_path (str): path to comparison image
            truth_path (str): path to ground truth image
        """
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
            if(face_distances):
                return face_distances[0]
            else:
                return face_distances
        