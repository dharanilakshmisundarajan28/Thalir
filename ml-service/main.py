from fastapi import FastAPI

app = FastAPI(title="THALIR Crop Intelligence")

@app.get("/")
def read_root():
    return {"message": "Welcome to THALIR ML Service"}

@app.get("/health")
def health_check():
    return {"status": "ok"}
