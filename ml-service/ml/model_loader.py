import joblib
import os
from threading import Lock
from ml.utils import logger

class ModelLoader:
    _instance = None
    _lock = Lock()

    def __new__(cls):
        with cls._lock:
            if cls._instance is None:
                cls._instance = super(ModelLoader, cls).__new__(cls)
                cls._instance.model = None
                cls._instance.scaler = None
                cls._instance.encoders = None
                cls._instance.model_info = {}
                cls._instance._load_model()
        return cls._instance

    def _load_model(self):
        try:
            model_dir = os.path.dirname(os.path.abspath(__file__))
            model_path = os.path.join(model_dir, 'crop_model.pkl')
            scaler_path = os.path.join(model_dir, 'scaler.pkl')
            encoders_path = os.path.join(model_dir, 'encoders.pkl')
            info_path = os.path.join(model_dir, 'model_info.txt')

            if os.path.exists(model_path):
                self.model = joblib.load(model_path)
                self.scaler = joblib.load(scaler_path)
                self.encoders = joblib.load(encoders_path)
                
                if os.path.exists(info_path):
                    with open(info_path, 'r') as f:
                        lines = f.readlines()
                        for line in lines:
                            key, val = line.strip().split(': ')
                            self.model_info[key.lower()] = val
                
                logger.info("ML model and artifacts loaded successfully.")
            else:
                logger.warning("ML model files not found. Please run training script first.")
        except Exception as e:
            logger.error(f"Failed to load ML model: {str(e)}")

# Global instance
model_loader = ModelLoader()
