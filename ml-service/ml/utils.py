from pydantic import BaseModel, Field
from typing import List, Optional
import logging

# Configure Logging
logging.basicConfig(
    level=logging.INFO,
    format='%(asctime)s - %(name)s - %(levelname)s - %(message)s'
)
logger = logging.getLogger("THALIR-ML")

class RecommendationRequest(BaseModel):
    soil_type: str = Field(..., description="Type of soil (e.g., Loamy, Sandy, Clayey)")
    land_area: float = Field(..., description="Land area in acres")
    location: str = Field(..., description="Location in 'City, State' format")

class WeatherSummary(BaseModel):
    avg_temp: float
    humidity: float
    rainfall_forecast: float

class Recommendation(BaseModel):
    crop: str
    success_rate: float
    expected_yield_tons: float
    estimated_cost: float
    predicted_profit: float
    risk: str

class RecommendationResponse(BaseModel):
    location: str
    weather_summary: WeatherSummary
    recommendations: List[Recommendation]

class ModelInfoResponse(BaseModel):
    model_accuracy: float
    training_date: str
    version: str
