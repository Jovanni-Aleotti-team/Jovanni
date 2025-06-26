from fastapi import FastAPI, HTTPException
from fastapi.middleware.cors import CORSMiddleware
import logging
from .models import CarRequest, PriceResponse
from .ml_logic import CarPricePredictor
import os

# Настройка логгирования
logging.basicConfig(
    level=logging.INFO,
    format="%(asctime)s - %(name)s - %(levelname)s - %(message)s",
)
logger = logging.getLogger(__name__)

app = FastAPI(
    title="Car Price Prediction API",
    description="API для прогнозирования стоимости автомобилей",
    version="1.0.0"
)

# Настройка CORS
app.add_middleware(
    CORSMiddleware,
    allow_origins=["*"],
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)

# Загрузка модели при старте
MODEL_PATH = "/app/XGBoost_cluster_price.pkl"
AGG_FEATURES_PATH = "/app/agg_features.json"

# Проверка существования файлов
if not os.path.exists(MODEL_PATH):
    logger.error(f"Файл модели не найден: {MODEL_PATH}")
    raise RuntimeError(f"Модель не найдена по пути: {MODEL_PATH}")

if not os.path.exists(AGG_FEATURES_PATH):
    logger.error(f"Файл фич не найден: {AGG_FEATURES_PATH}")
    raise RuntimeError(f"Файл фич не найден по пути: {AGG_FEATURES_PATH}")

logger.info("Загрузка модели...")
predictor = CarPricePredictor(MODEL_PATH, AGG_FEATURES_PATH)
logger.info("Модель успешно загружена!")

@app.get("/health")
async def health_check():
    """Проверка работоспособности сервиса"""
    return {"status": "ok", "message": "Сервис оценки автомобилей работает"}

@app.post("/api/v1/predict", response_model=PriceResponse)
async def predict_price(car_data: CarRequest):
    """Прогнозирование цены автомобиля"""
    try:
        logger.info(f"Получен запрос на оценку: {car_data.dict()}")
        
        # Преобразуем Pydantic модель в dict
        car_dict = car_data.dict()
        
        # Прогнозируем цену
        predicted_price = predictor.predict(car_dict)
        
        logger.info(f"Предсказанная цена: {predicted_price} RUB")
        
        return {
            "predicted_price": predicted_price,
            "currency": "RUB"
        }
    except ValueError as ve:
        logger.error(f"Ошибка валидации: {str(ve)}")
        raise HTTPException(status_code=400, detail=str(ve))
    except Exception as e:
        logger.exception(f"Внутренняя ошибка сервера: {str(e)}")
        raise HTTPException(status_code=500, detail="Внутренняя ошибка сервера")