import httpx
import asyncio
import time
from typing import Dict, Any, Optional
from ml.utils import logger

class WeatherService:
    def __init__(self, api_key: str):
        self.api_key = api_key
        self.cache: Dict[str, Dict[str, Any]] = {}
        self.cache_duration = 3600  # 1 hour in seconds

    async def fetch_weather(self, location: str) -> Optional[Dict[str, Any]]:
        """
        Fetches current weather and 5-day forecast for a given location.
        Implements 1-hour caching and parallel API requests with 4s limit.
        """
        cache_key = f"weather_{location.lower().replace(' ', '_')}"
        try:
            parts = [p.strip() for p in location.split(",")]
            city = parts[0]
            state = parts[1] if len(parts) > 1 else ""
            
            now = time.time()

            if cache_key in self.cache:
                cached_data = self.cache[cache_key]
                if now - cached_data['timestamp'] < self.cache_duration:
                    logger.info(f"Returning cached weather for {location}")
                    return cached_data['data']

            # Use await asyncio.wait_for to ensure we don't hang the user
            return await asyncio.wait_for(self._fetch_from_api(city, state, cache_key, now), timeout=4.0)

        except (asyncio.TimeoutError, Exception) as e:
            logger.error(f"Weather fetch failed or timed out for {location}: {str(e)}")
            # Emergency fallback from cache if exists
            if cache_key in self.cache:
                return self.cache[cache_key]['data']
            return None

    async def _fetch_from_api(self, city: str, state: str, cache_key: str, now: float) -> Optional[Dict[str, Any]]:
        async with httpx.AsyncClient(timeout=5.0) as client:
            # 1. Get Geocoding
            geo_url = f"http://api.openweathermap.org/geo/1.0/direct?q={city},{state},IN&limit=1&appid={self.api_key}"
            geo_res = await client.get(geo_url)
            geo_res.raise_for_status()
            geo_data = geo_res.json()

            if not geo_data:
                return None

            lat, lon = geo_data[0]['lat'], geo_data[0]['lon']

            # 2. Get Weather & Forecast in parallel
            weather_url = f"https://api.openweathermap.org/data/2.5/weather?lat={lat}&lon={lon}&units=metric&appid={self.api_key}"
            forecast_url = f"https://api.openweathermap.org/data/2.5/forecast?lat={lat}&lon={lon}&units=metric&appid={self.api_key}"

            w_resp, f_resp = await asyncio.gather(
                client.get(weather_url),
                client.get(forecast_url)
            )

            w_resp.raise_for_status()
            f_resp.raise_for_status()

            curr_data = w_resp.json()
            fore_data = f_resp.json()

            # Process
            temps = [item['main']['temp'] for item in fore_data['list']]
            rain = sum([item.get('rain', {}).get('3h', 0) for item in fore_data['list']])
            
            processed_data = {
                "avg_temp": round(sum(temps) / len(temps), 1) if temps else curr_data['main']['temp'],
                "humidity": curr_data['main']['humidity'],
                "rainfall_forecast": round(rain, 1),
                "wind_speed": curr_data['wind']['speed'],
                "current_temp": curr_data['main']['temp']
            }

            self.cache[cache_key] = {'timestamp': now, 'data': processed_data}
            return processed_data

# Instance with provided key
weather_service = WeatherService("06f171676e354e75259a2597065c873e")
