# from fastapi import FastAPI, HTTPException
# from fastapi.middleware.cors import CORSMiddleware
# from ml.utils import RecommendationRequest, RecommendationResponse, ModelInfoResponse, logger
# from ml.predictor import predictor
# from ml.model_loader import model_loader

# app = FastAPI(title="THALIR Crop Intelligence")

# # CORS Configuration
# app.add_middleware(
#     CORSMiddleware,
#     allow_origins=["*"],
#     allow_credentials=True,
#     allow_methods=["*"],
#     allow_headers=["*"],
# )

# @app.get("/")
# def read_root():
#     return {"message": "Welcome to THALIR ML Service"}

# @app.get("/health")
# def health_check():
#     return {"status": "ok", "model_loaded": model_loader.model is not None}

# @app.post("/recommend", response_model=RecommendationResponse)
# async def get_crop_recommendation(request: RecommendationRequest):
#     try:
#         if not model_loader.model:
#             raise HTTPException(status_code=503, detail="Model is not yet ready. Please try again later.")
        
#         recommendation = await predictor.get_recommendation(request)
#         return recommendation
#     except Exception as e:
#         logger.error(f"Error in recommendation endpoint: {str(e)}")
#         raise HTTPException(status_code=500, detail=str(e))

# @app.get("/model-info", response_model=ModelInfoResponse)
# def get_model_info():
#     if not model_loader.model:
#         return ModelInfoResponse(
#             model_accuracy=0.0,
#             training_date="N/A",
#             version="Not Loaded"
#         )
    
#     return ModelInfoResponse(
#         model_accuracy=float(model_loader.model_info.get('accuracy', 0.0)),
#         training_date=model_loader.model_info.get('date', 'Unknown'),
#         version=model_loader.model_info.get('version', '1.0.0')
#     )
from fastapi import FastAPI, HTTPException
from fastapi.middleware.cors import CORSMiddleware
from ml.utils import RecommendationRequest, RecommendationResponse, ModelInfoResponse, logger
from ml.predictor import predictor
from ml.model_loader import model_loader

app = FastAPI(title="THALIR Crop Intelligence")

# =========================
# CORS (for React frontend)
# =========================
app.add_middleware(
    CORSMiddleware,
    allow_origins=["*"],
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)

# =========================
# ROOT
# =========================
@app.get("/")
def read_root():
    return {"message": "Welcome to THALIR ML Service"}

# =========================
# HEALTH CHECK
# =========================
@app.get("/health")
def health_check():
    return {
        "status": "ok",
        "model_loaded": model_loader.model is not None
    }

# =========================
# 🔥 FIXED RECOMMEND ENDPOINT
# =========================
@app.post("/recommend", response_model=RecommendationResponse)
async def get_crop_recommendation(request: RecommendationRequest):
    try:
        # Model check
        if not model_loader.model:
            raise HTTPException(
                status_code=503,
                detail="Model is not ready. Please wait."
            )

        # ==========================================
        # ✅ FIX: Normalize location before encoding
        # Converts:
        # "Coimbatore, TN" -> "Coimbatore"
        # "Madurai, Tamil Nadu" -> "Madurai"
        # ==========================================
        if request.location:
            request.location = request.location.split(",")[0].strip()

        # Call predictor
        recommendation = await predictor.get_recommendation(request)
        return recommendation

    except Exception as e:
        logger.error(f"Recommendation error: {str(e)}")
        raise HTTPException(status_code=500, detail=str(e))

# =========================
# MODEL INFO
# =========================
@app.get("/model-info", response_model=ModelInfoResponse)
def get_model_info():
    if not model_loader.model:
        return ModelInfoResponse(
            model_accuracy=0.0,
            training_date="N/A",
            version="Not Loaded"
        )

    return ModelInfoResponse(
        model_accuracy=float(model_loader.model_info.get("accuracy", 0.0)),
        training_date=model_loader.model_info.get("date", "Unknown"),
        version=model_loader.model_info.get("version", "1.0.0")
    )
