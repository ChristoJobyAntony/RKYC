from sys import argv
import uvicorn

if __name__ == "__main__":
    uvicorn.run("api.api:app", host="0.0.0.0", port=5003, reload=True)