from turtle import distance
import scipy.io.wavfile as wavfile
import traceback as tb
import os

os.environ['TF_CPP_MIN_LOG_LEVEL'] = '3' 

import sys
import numpy as np
import pandas as pd
from scipy.spatial.distance import cdist, euclidean, cosine 
import warnings
from keras.models import load_model
import os
from api.lib import parameters
from api.lib.feature_extraction import get_embedding, get_embeddings_from_list_file
from api.lib.preprocess import get_fft_spectrum
from api.lib import parameters as p
import logging

model = load_model(p.MODEL_FILE)


class VoiceVerifier():
    def __init__(self, weight_dir : str = p.EMBED_LIST_FILE) -> None:
        """Creates an object to handle creating and comparing voice embeddings

        Args:
            weight_dir (str, optional): directory to save voice embeddings to. Defaults to p.EMBED_LIST_FILE.
        """
        self.model = model
        self.weight_dir = weight_dir
    
    def enroll(self, fp : str,aadhaar_id : str):
        """Enrolls a user with aadhar_id by making an embedding file with the same name from the filepath provided

        Args:
            fp (str): filepath to the .wav fil
            aadhaar_id (str): the filename is set to this
        """
        enroll_result = get_embedding(self.model, fp, p.MAX_SEC)
        enroll_embs = np.array(enroll_result.tolist())
        np.save(os.path.join(self.weight_dir, aadhaar_id +".npy"), enroll_embs)
    
    def compare(self, fp : str, aadhaar_id : str) -> int:
        """Compares embeddings generated from file at fp with embeddings of name aadhar_id.npy

        Args:
            fp (str): path to wav file for conmparison
            aadhaar_id (str): aadhar_id.npy will be the file compared against

        Returns:
            int : euclidean distance between embed vectors compared
        """
        try:
            enroll_embs = np.load(os.path.join(self.weight_dir, aadhaar_id +".npy"))
        except Exception as e:
            return None
        compare_sample = get_embedding(self.model, fp, p.MAX_SEC)
        test_embs = np.array(compare_sample.tolist())
        distance = euclidean(test_embs, enroll_embs)
        return distance
