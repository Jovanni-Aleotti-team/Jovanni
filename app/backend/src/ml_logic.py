import pandas as pd
import numpy as np
import joblib
import json
import logging
import os

logger = logging.getLogger(__name__)

# Константы из обучения
PREMIUM_BRANDS = [
    'Mercedes-Benz', 'BMW', 'Audi', 'Porsche', 'Lexus', 'Land Rover',
    'Bentley', 'Maserati', 'Ferrari', 'Rolls-Royce', 'Jaguar', 'Tesla',
    'Genesis', 'Infiniti', 'Acura', 'Cadillac', 'Volvo', 'Lincoln'
]
CURRENT_YEAR = 2025

class CarPricePredictor:
    def __init__(self, model_path: str, agg_features_path: str):
        self.model_path = model_path
        self.agg_features_path = agg_features_path
        
        # Загрузка модели с проверками
        self.model = self._load_model()
        
        # Загрузка агрегированных фич
        self.agg_features = self._load_agg_features()
        
        self.final_columns = [
            'production_date', 'power_per_liter', 'mileage_per_year',
            'price_brand_ratio', 'power_bodytype_ratio', 'owners',
            'body_type', 'fuel_type', 'drive', 'steering_wheel', 'condition',
            'pts', 'customs_cleared', 'name', 'equipment', 'brand', 
            'vehicle_transmission', 'is_classic_color', 'is_premium', 'is_damaged'
        ]
        logger.info("Модель и фичи успешно загружены")

    def _load_model(self):
        """Загрузка модели с обработкой ошибок"""
        logger.info(f"Загрузка модели из {self.model_path}")
        
        # Проверка существования файла
        if not os.path.exists(self.model_path):
            error_msg = f"Файл модели не найден: {self.model_path}"
            logger.error(error_msg)
            raise FileNotFoundError(error_msg)
        
        # Проверка размера файла
        file_size = os.path.getsize(self.model_path)
        logger.info(f"Размер файла модели: {file_size} байт")
        if file_size == 0:
            error_msg = f"Файл модели пуст: {self.model_path}"
            logger.error(error_msg)
            raise ValueError(error_msg)
        
        try:
            # Попытка загрузки модели
            model = joblib.load(self.model_path)
            logger.info("Модель успешно загружена")
            return model
        except Exception as e:
            logger.error(f"Ошибка загрузки модели: {str(e)}")
            
            # Дополнительная диагностика
            try:
                with open(self.model_path, 'rb') as f:
                    header = f.read(100)
                    logger.info(f"Первые 100 байт файла: {header}")
            except Exception as read_error:
                logger.error(f"Ошибка чтения файла: {str(read_error)}")
            
            raise RuntimeError(f"Ошибка загрузки модели: {str(e)}") from e

    def _load_agg_features(self):
        """Загрузка агрегированных фич с обработкой ошибок"""
        logger.info(f"Загрузка фич из {self.agg_features_path}")
        
        # Проверка существования файла
        if not os.path.exists(self.agg_features_path):
            error_msg = f"Файл фич не найден: {self.agg_features_path}"
            logger.error(error_msg)
            raise FileNotFoundError(error_msg)
        
        # Проверка размера файла
        file_size = os.path.getsize(self.agg_features_path)
        logger.info(f"Размер файла фич: {file_size} байт")
        if file_size == 0:
            error_msg = f"Файл фич пуст: {self.agg_features_path}"
            logger.error(error_msg)
            raise ValueError(error_msg)
        
        try:
            # Загрузка и проверка фич
            with open(self.agg_features_path, 'r', encoding='utf-8') as f:
                features = json.load(f)
                
            # Проверка наличия необходимых ключей
            required_keys = ['body_type_power_avg']
            for key in required_keys:
                if key not in features:
                    error_msg = f"Ключ '{key}' отсутствует в файле фич"
                    logger.error(error_msg)
                    raise KeyError(error_msg)
                
            logger.info("Фичи успешно загружены")
            return features
        except Exception as e:
            logger.error(f"Ошибка загрузки фич: {str(e)}")
            raise RuntimeError(f"Ошибка загрузки фич: {str(e)}") from e

    def create_features(self, data: dict) -> pd.DataFrame:
        """Создает производные признаки для одного автомобиля"""
        try:
            df = pd.DataFrame([data])
            
            # Мощность на литр
            df['power_per_liter'] = df['engine_power_hp'] / df['engine_displacement_ltr']
            df['power_per_liter'] = df['power_per_liter'].replace([np.inf, -np.inf], 0)
            
            # Пробег в год
            vehicle_age = CURRENT_YEAR - df['production_date']
            # Защита от деления на 0 (новые автомобили)
            df['mileage_per_year'] = df['mileage'] / vehicle_age.replace(0, 1)
            
            # Бинарные признаки
            classic_colors = ['белый', 'чёрный', 'серый', 'серебряный']
            df['is_classic_color'] = df['color'].apply(lambda x: 1 if x in classic_colors else 0)
            df['is_premium'] = df['brand'].apply(lambda x: 1 if x in PREMIUM_BRANDS else 0)
            df['is_damaged'] = df['condition'].apply(lambda x: 1 if x == 'битый' else 0)
            
            # Фичи из агрегированных данных
            body_type_power_avg = pd.Series(self.agg_features['body_type_power_avg'])
            df['power_bodytype_ratio'] = df['engine_power_hp'] / df['body_type'].map(body_type_power_avg)
            df['price_brand_ratio'] = 1.0  # Заглушка
            
            # Заполнение пропусков
            df.fillna({
                'power_bodytype_ratio': 1.0,
                'power_per_liter': df['engine_power_hp']
            }, inplace=True)
            
            return df
            
        except Exception as e:
            logger.error(f"Ошибка создания фич: {str(e)}")
            raise RuntimeError(f"Ошибка создания фич: {str(e)}") from e

    def predict(self, car_data: dict) -> float:
        """Выполняет предсказание цены для одного автомобиля"""
        try:
            logger.info("Создание фич для предсказания...")
            # Создаем фичи
            features_df = self.create_features(car_data)
            
            # Выбираем нужные колонки в правильном порядке
            logger.info("Подготовка данных для модели...")
            features_df = features_df[self.final_columns]
            
            # Прогнозируем
            logger.info("Выполнение предсказания...")
            predicted_price = self.model.predict(features_df)[0]
            logger.info(f"Предсказанная цена: {predicted_price}")
            
            return round(float(predicted_price), 2)
        except Exception as e:
            logger.exception(f"Ошибка при прогнозировании: {str(e)}")
            raise ValueError(f"Ошибка предсказания: {str(e)}")