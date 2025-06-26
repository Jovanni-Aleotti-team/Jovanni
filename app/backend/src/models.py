from pydantic import BaseModel, Field, validator
import re

class CarRequest(BaseModel):
    brand: str = Field(..., min_length=2, max_length=50, example="Peugeot")
    name: str = Field(..., min_length=1, max_length=100, example="1.4 (89 л.с.)")
    production_date: int = Field(..., ge=1900, le=2025, example=2010)
    body_type: str = Field(..., min_length=2, max_length=50, example="седан")
    color: str = Field(..., min_length=2, max_length=50, example="зеленый")
    mileage: float = Field(..., ge=0, le=2000000, example=60000)
    fuel_type: str = Field(..., min_length=3, max_length=20, example="бензин")
    vehicle_transmission: str = Field(..., min_length=5, max_length=30, example="робот")
    engine_power_hp: float = Field(..., gt=0, le=2000, example=89.0)
    engine_displacement_ltr: float = Field(..., gt=0, le=20, example=1.4)
    drive: str = Field(..., min_length=5, max_length=20, example="передний")
    steering_wheel: str = Field(..., min_length=5, max_length=20, example="левый")
    owners: int = Field(..., ge=0, le=20, example=1)
    condition: str = Field(..., min_length=5, max_length=20, example="не битый")
    pts: str = Field(..., min_length=6, max_length=20, example="Оригинал")
    customs_cleared: str = Field(..., min_length=6, max_length=20, example="Растаможен")
    equipment: str = Field(..., min_length=2, max_length=50, example="Connect")

    @validator('condition')
    def validate_condition(cls, v):
        valid_conditions = ["не битый", "битый"]
        if v.lower() not in valid_conditions:
            raise ValueError(f"Недопустимое состояние. Допустимые значения: {', '.join(valid_conditions)}")
        return v.lower()

    @validator('vehicle_transmission')
    def validate_transmission(cls, v):
        valid_transmissions = ["автоматическая", "механическая", "роботизированная", "вариатор"]
        if v.lower() not in valid_transmissions:
            raise ValueError(f"Недопустимый тип трансмиссии. Допустимые значения: {', '.join(valid_transmissions)}")
        return v.lower()

    @validator('fuel_type')
    def validate_fuel_type(cls, v):
        valid_fuels = ["бензин", "дизель", "электро", "гибрид", "газ"]
        if v.lower() not in valid_fuels:
            raise ValueError(f"Недопустимый тип топлива. Допустимые значения: {', '.join(valid_fuels)}")
        return v.lower()

class PriceResponse(BaseModel):
    predicted_price: float = Field(..., example=350000.0)
    currency: str = Field(default="RUB", example="RUB")