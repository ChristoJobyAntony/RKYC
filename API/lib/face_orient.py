import re
from symbol import subscript
import cv2
import mediapipe as mp
import numpy as np
import time

mp_face_mesh = mp.solutions.face_mesh
face_mesh = mp_face_mesh.FaceMesh(min_detection_confidence=0.5, min_tracking_confidence=0.5)

class FaceFile():
    def __init__(self,source : str, stable_length : int = 15, size : tuple = (800,450,),*args, **kwargs) -> None:
        """Creates a single-use object to read in frames from a video file and return face orientation sequence

        Args:
            source (str): File path of the source file
            stable_length (int, optional): The number of continuous frames a pose must be maintained for it to register. Defaults to 15.
            size (tuple, optional): Resize size for the video source. Defaults to (800,450,).
        """
        self.__source = cv2.VideoCapture(source)
        self.size = size
        self.stable_length = stable_length
        
    def run(self) -> list:
        """Returns face orientation on a per frame basis as a list

        Returns:
            list: face orientations
        """
        outputs = []
        while self.__source.isOpened():
            success, image = self.__source.read()
            # Check if no frame was obtained
            if(not success):
                return outputs
            # Resize to provided size
            image = cv2.resize(image,self.size)
            # Performance optimizations for processing
            image = cv2.cvtColor(cv2.flip(image, 1), cv2.COLOR_BGR2RGB)
            image.flags.writeable = False
            results = face_mesh.process(image)
            image.flags.writeable = True
            image = cv2.cvtColor(image, cv2.COLOR_RGB2BGR)
            img_h, img_w, img_c = image.shape
            face_3d = []
            face_2d = []
            # Get specific face landmarks
            if results.multi_face_landmarks:
                for face_landmarks in results.multi_face_landmarks:
                    for idx, lm in enumerate(face_landmarks.landmark):
                        if idx == 33 or idx == 263 or idx == 1 or idx == 61 or idx == 291 or idx == 199:
                            if idx == 1:
                                nose_2d = (lm.x * img_w, lm.y * img_h)
                                nose_3d = (lm.x * img_w, lm.y * img_h, lm.z * 3000)

                            y, x = int(lm.x * img_w), int(lm.y * img_h)
                            face_2d.append([y, x])
                            face_3d.append([y, x, lm.z])
            face_2d = np.array(face_2d, dtype=np.float64)
            face_3d = np.array(face_3d, dtype=np.float64)
            focal_length = 1 * img_w
            # Get camera matrix and distortion matrix
            cam_matrix = np.array([ [focal_length, 0, img_h / 2],
                                    [0, focal_length, img_w / 2],
                                    [0, 0, 1]])
            dist_matrix = np.zeros((4, 1), dtype=np.float64)
            success, rot_vec, trans_vec = cv2.solvePnP(face_3d, face_2d, cam_matrix, dist_matrix)
            rmat, jac = cv2.Rodrigues(rot_vec)
            # Get euler angles in radians for the face rotation
            angles, mtxR, mtxQ, Qx, Qy, Qz = cv2.RQDecomp3x3(rmat)
            # Convert to degrees
            y = angles[0] * 360
            x = angles[1] * 360
            z = angles[2] * 360
            # Compare using thresholds to get orientation
            if x < -10:
                text = "L"
            elif x > 10:
                text = "R"
            elif y < -10:
                text = "D"
            elif y > 10:
                text = "U"
            else:
                text = "F"
            outputs.append(text)
        # Close the source
        self.__source.close()
        return outputs
    
    def process_input(self) -> list:
        """Returns face orientation sequence using stable_length parameter.

        Returns:
            list: List of unique frames longer than stable_length
        """
        # Initialize variables
        self.__frames = self.run()
        frame = len(self.__frames) - 1
        letter = self.__frames[-1]
        processed_frames = []
        letter_count = 0
        # Process from back to front
        while(frame > 0):
            if(self.__frames[frame-1] != letter):
                letter = self.__frames[frame-1]
                if(letter_count > self.stable_length):
                    processed_frames.append(self.__frames[frame])
                letter_count = 0
            else:
                letter_count += 1
            frame = frame - 1
        return processed_frames
                


