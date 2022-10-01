from turtle import distance
import scipy.io.wavfile as wavfile
import traceback as tb
import os
import sys
import numpy as np
import pandas as pd
from scipy.spatial.distance import cdist, euclidean, cosine 
import warnings
from keras.models import load_model
import os
import parameters as p
from feature_extraction import get_embedding, get_embeddings_from_list_file
from preprocess import get_fft_spectrum
model = load_model(p.MODEL_FILE)

class VoiceVerifier():
    def __init__(self, weight_dir : str = p.EMBED_LIST_FILE) -> None:
        self.model = model
    
    def enroll(self, fp : str,aadhaar_id : str):
        enroll_result = get_embedding(self.model, fp, p.MAX_SEC)
        enroll_embs = np.array(enroll_result.tolist())
        np.save(os.path.join(p.EMBED_LIST_FILE,aadhaar_id +".npy"), enroll_embs)
    
    def compare(self, fp : str, aadhaar_id : str):
        try:
            enroll_embs = np.load(os.path.join(p.EMBED_LIST_FILE,aadhaar_id +".npy"))
        except Exception as e:
            return None
        compare_sample = get_embedding(self.model, fp, p.MAX_SEC)
        test_embs = np.array(compare_sample.tolist())
        distance = euclidean(test_embs, enroll_embs)
        return distance < p.THRESHOLD
