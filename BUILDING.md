# BUILDING

Requires `python 3.9.6` and `node`

### Backend:

In the root directory, run

```bash
python -m venv .
pip install -r requirements.txt
```

to install required libraries in a virtual environment.

Download and install mediapipe and dlib wheel files.
Copy in the `voice_auth_model_cnn` folder containing the model into `/API/api/lib/`

to start the server:

```bash
cd ./API/
python main.py
```

### Frontend

```bash
cd ./app/
npm install
npm start
```

This will start the development server for the frontend
