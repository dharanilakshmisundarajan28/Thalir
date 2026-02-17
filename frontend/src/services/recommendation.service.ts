// import axios from "axios";

// const ML_API_URL = "http://localhost:8000";

// export interface RecommendationRequest {
//     soil_type: string;
//     land_area: number;
//     location: string;
// }

// export interface WeatherSummary {
//     avg_temp: number;
//     humidity: number;
//     rainfall_forecast: number;
// }

// export interface Recommendation {
//     crop: string;
//     success_rate: number;
//     expected_yield_tons: number;
//     estimated_cost: number;
//     predicted_profit: number;
//     risk: string;
// }

// export interface RecommendationResponse {
//     location: string;
//     weather_summary: WeatherSummary;
//     recommendations: Recommendation[];
// }

// class RecommendationService {
//     getRecommendations(data: RecommendationRequest) {
//         return axios.post<RecommendationResponse>(`${ML_API_URL}/recommend`, data);
//     }
// }

// export default new RecommendationService();
import axios from "axios";

const ML_API_URL = "http://localhost:8000";

export interface RecommendationRequest {
  soil_type: string;
  land_area: number;
  location: string;
}

export interface WeatherSummary {
  avg_temp: number;
  humidity: number;
  rainfall_forecast: number;
}

export interface Recommendation {
  crop: string;
  success_rate: number;
  expected_yield_tons: number;
  estimated_cost: number;
  predicted_profit: number;
  risk: string;
}

export interface RecommendationResponse {
  location: string;
  weather_summary: WeatherSummary;
  recommendations: Recommendation[];
}

class RecommendationService {
  getRecommendations(data: RecommendationRequest) {
    return axios.post<RecommendationResponse>(
      `${ML_API_URL}/recommend`,
      data
    );
  }
}

export default new RecommendationService();
