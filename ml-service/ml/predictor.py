import pandas as pd
import numpy as np
from typing import List, Dict, Any
from ml.model_loader import model_loader
from ml.weather_service import weather_service
from ml.utils import logger, RecommendationRequest, RecommendationResponse, Recommendation, WeatherSummary

class Predictor:
    def __init__(self):
        # Market data (Yield in tons/acre, Price in INR/ton, Cost in INR/acre)
        self.market_data = {
            'Paddy': {'yield': 2.5, 'price': 22000, 'cost': 25000},
            'Wheat': {'yield': 1.8, 'price': 25000, 'cost': 18000},
            'Maize': {'yield': 3.0, 'price': 20000, 'cost': 20000},
            'Sugarcane': {'yield': 35.0, 'price': 3000, 'cost': 60000},
            'Cotton': {'yield': 1.2, 'price': 60000, 'cost': 35000},
            'Groundnut': {'yield': 1.5, 'price': 55000, 'cost': 30000}
        }

    def _calculate_profit(self, crop: str, land_area: float) -> tuple:
        data = self.market_data.get(crop, {'yield': 1.0, 'price': 10000, 'cost': 10000})
        total_yield = data['yield'] * land_area
        total_revenue = total_yield * data['price']
        total_cost = data['cost'] * land_area
        profit = total_revenue - total_cost
        
        # Risk assessment based on profit margin
        margin = profit / total_revenue if total_revenue > 0 else 0
        if margin > 0.4: risk = "Low"
        elif margin > 0.2: risk = "Medium"
        else: risk = "High"
        
        return total_yield, total_cost, profit, risk

    async def get_recommendation(self, request: RecommendationRequest) -> RecommendationResponse:
        weather = await weather_service.fetch_weather(request.location)
        
        if not weather:
            # Fallback for demonstration if API fails
            weather = {"avg_temp": 28.0, "humidity": 70.0, "rainfall_forecast": 100.0}

        if not model_loader.model:
            raise Exception("Model not loaded. Ensure training is complete.")

        # Prepare input features
        # Features: ['soil_encoded', 'temperature', 'humidity', 'rainfall', 'state_encoded', 'rain_encoded']
        try:
            parts = [p.strip() for p in request.location.split(",")]
            state = parts[1] if len(parts) > 1 else "Tamil Nadu"
            
            # Categories matching training logic
            rain_val = weather['rainfall_forecast']
            if rain_val <= 80: rain_cat = "Low"
            elif rain_val <= 150: rain_cat = "Medium"
            else: rain_cat = "High"

            # Encoding
            soil_enc = model_loader.encoders['le_soil'].transform([request.soil_type])[0]
            state_enc = model_loader.encoders['le_state'].transform([state])[0]
            rain_enc = model_loader.encoders['le_rain'].transform([rain_cat])[0]

            input_data = pd.DataFrame([{
                'soil_encoded': soil_enc,
                'temperature': weather['avg_temp'],
                'humidity': weather['humidity'],
                'rainfall': weather['rainfall_forecast'],
                'state_encoded': state_enc,
                'rain_encoded': rain_enc
            }])

            # Scale
            input_scaled = model_loader.scaler.transform(input_data)

            # Predict (Top 3 crops)
            probs = model_loader.model.predict_proba(input_scaled)[0]
            top_indices = np.argsort(probs)[::-1][:3]
            top_crops = model_loader.encoders['le_crop'].inverse_transform(top_indices)
            top_probs = probs[top_indices]

            recommendations = []
            for crop, prob in zip(top_crops, top_probs):
                y_tons, cost, profit, risk = self._calculate_profit(crop, request.land_area)
                
                recommendations.append(Recommendation(
                    crop=crop,
                    success_rate=round(float(prob), 2),
                    expected_yield_tons=round(y_tons, 2),
                    estimated_cost=round(cost, 2),
                    predicted_profit=round(profit, 2),
                    risk=risk
                ))

            weather_summary = WeatherSummary(
                avg_temp=weather['avg_temp'],
                humidity=weather['humidity'],
                rainfall_forecast=weather['rainfall_forecast']
            )

            return RecommendationResponse(
                location=request.location,
                weather_summary=weather_summary,
                recommendations=recommendations
            )

        except Exception as e:
            logger.error(f"Prediction error: {str(e)}")
            raise e

predictor = Predictor()
