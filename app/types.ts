
export interface CarDetails {
  // Existing fields
  make: string; // Will be mapped to 'brand' for backend
  // model: string; // Removed as per request
  year: number; // Will be mapped to 'production_date'
  mileage: number | ''; // Allow empty string for form input
  engineType: string; // Will be mapped to 'fuel_type'
  transmission: string; // Will be mapped to 'vehicle_transmission'
  condition: string; // Will be mapped to 'condition' (e.g. "Не битый", "Битый")

  // New fields required by the Python model
  name: string; // Model variant/engine description e.g., "1.4 MT 90hp" or "1.4 (89 л.с.)"
  enginePowerHp: number | ''; // Allow empty string for form input
  engineDisplacementLtr: number | ''; // Allow empty string for form input
  bodyType: string;
  color: string;
  drive: string;
  steeringWheel: string;
  owners: number | ''; // Allow empty string for form input
  pts: string; // "Оригинал" or "Дубликат"
  customsCleared: string; // "Растаможен" or "Не растаможен"
  equipment: string; // Trim level, e.g. "Connect"
}

// Interface for the data structure expected by the new backend
export interface BackendCarRequest {
  brand: string;
  name: string; // Specific model/engine name like "1.4 (89 л.с.)"
  production_date: number;
  body_type: string;
  color: string;
  mileage: number;
  fuel_type: string;
  vehicle_transmission: string;
  engine_power_hp: number;
  engine_displacement_ltr: number;
  drive: string;
  steering_wheel: string;
  owners: number;
  condition: string; // "не битый" or "битый"
  pts: string;
  customs_cleared: string;
  equipment: string;
}

export interface PriceResponse {
  predicted_price: number; // Key from the new backend
  currency?: string; // Optional: if backend provides currency
}

export enum FormField {
  Make = "make",
  // Model = "model", // Removed
  Year = "year",
  Mileage = "mileage",
  EngineType = "engineType",
  Transmission = "transmission",
  Condition = "condition",
  // New form fields
  Name = "name",
  EnginePowerHp = "enginePowerHp",
  EngineDisplacementLtr = "engineDisplacementLtr",
  BodyType = "bodyType",
  Color = "color",
  Drive = "drive",
  SteeringWheel = "steeringWheel",
  Owners = "owners",
  Pts = "pts",
  CustomsCleared = "customsCleared",
  Equipment = "equipment",
}