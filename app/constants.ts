
const API_BASE_URL = import.meta.env.PROD 
  ? '/api/v1' 
  : '/api';


export const CAR_BRANDS: string[] = [
  "Peugeot", "ВАЗ (LADA)", "Hyundai", "KIA", "Toyota", "Volkswagen", "Nissan", "Ford", 
  "Renault", "Skoda", "Mercedes-Benz", "BMW", "Audi", "Chevrolet", "Opel", 
  "Mitsubishi", "Mazda", "Honda", "Volvo", "Citroen", "Daewoo", "Subaru", "Land Rover" 
  // This is a selection. The full list of 111 brands is too long for a dropdown.
  // The backend model's OHE should handle other brands.
];

// Frontend display values (mixed case)
export const ENGINE_TYPES_DISPLAY: string[] = ["Бензин", "Дизель", "Гибрид", "Электро", "Газ"];
export const TRANSMISSION_TYPES_DISPLAY: string[] = ["Автомат", "Механика", "Робот", "Вариатор"];
export const CONDITIONS_DISPLAY: string[] = ["Не битый", "Битый"]; // Simplified

// Values sent to backend (should be lowercase to match Enums and agg_features.json keys)
export const BODY_TYPES: string[] = ["седан", "внедорожник", "хетчбэк", "универсал", "минивэн", "фургон", "пикап", "купе", "микроавтобус", "кабриолет", "лифтбек"];
export const COLORS: string[] = [
    "зеленый", "белый", "чёрный", "серебряный", "серый", "синий", "красный", 
    "коричневый", "бежевый", "голубой", "золотой", "фиолетовый", "оранжевый", 
    "жёлтый", "пурпурный", "розовый"
]; // Made 'зеленый' first for default
export const DRIVE_TYPES: string[] = ["передний", "полный", "задний"];
export const STEERING_WHEEL_TYPES: string[] = ["левый", "правый"];

// These typically have specific casing/values defined by standards or common usage, map carefully in CarInputForm
export const PTS_TYPES: string[] = ["Оригинал", "Дубликат"]; 
export const CUSTOMS_CLEARED_TYPES: string[] = ["Растаможен", "Не растаможен"]; 

export const CURRENT_YEAR = new Date().getFullYear();
export const YEARS: number[] = Array.from({ length: 75 }, (_, i) => CURRENT_YEAR - i); // Last 75 years
export const OWNER_COUNT_OPTIONS: number[] = [0, 1, 2, 3, 4, 5]; 

export { API_BASE_URL };