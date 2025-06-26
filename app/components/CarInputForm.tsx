import React, { useState } from 'react';
import { CarDetails, FormField, BackendCarRequest } from '../types';
import { 
  CAR_BRANDS, 
  ENGINE_TYPES_DISPLAY, TRANSMISSION_TYPES_DISPLAY, CONDITIONS_DISPLAY, 
  YEARS, CURRENT_YEAR,
  BODY_TYPES, COLORS, DRIVE_TYPES, STEERING_WHEEL_TYPES, 
  PTS_TYPES, CUSTOMS_CLEARED_TYPES, OWNER_COUNT_OPTIONS
} from '../constants';

interface CarInputFormProps {
  onSubmit: (details: BackendCarRequest) => void;
  isLoading: boolean;
}

const initialFormState: CarDetails = {
  make: CAR_BRANDS[0], // Default to the first brand in the list
  name: "", 
  year: YEARS[0], // Default to the most recent year
  mileage: '', // Use empty string for number inputs that will be converted
  enginePowerHp: '', 
  engineDisplacementLtr: '',
  engineType: ENGINE_TYPES_DISPLAY[0], // Default to first option
  transmission: TRANSMISSION_TYPES_DISPLAY[0], // Default to first option
  condition: CONDITIONS_DISPLAY[0], // Default display value
  bodyType: BODY_TYPES[0], // Default to first option
  color: COLORS[0], // Default to first option
  drive: DRIVE_TYPES[0], // Default to first option
  steeringWheel: STEERING_WHEEL_TYPES[0], // Default to first option
  owners: '', // Default to empty, user must select or type
  pts: PTS_TYPES[0], // Default to first option
  customsCleared: CUSTOMS_CLEARED_TYPES[0], // Default to first option
  equipment: "",
};

// Helper to map frontend details to backend request structure
const mapToBackendRequest = (details: CarDetails): BackendCarRequest => {
  let fuel_type = details.engineType.toLowerCase();
  
  let vehicle_transmission: string;
  switch (details.transmission) { // Switch on display value
    case "Автомат": vehicle_transmission = "автоматическая"; break;
    case "Механика": vehicle_transmission = "механическая"; break;
    case "Робот": vehicle_transmission = "роботизированная"; break;
    case "Вариатор": vehicle_transmission = "вариатор"; break;
    default: vehicle_transmission = details.transmission.toLowerCase(); // fallback
  }

  const condition_backend = details.condition.toLowerCase();

  return {
    brand: details.make,
    name: details.name,
    production_date: Number(details.year),
    body_type: details.bodyType, 
    color: details.color, 
    mileage: Number(details.mileage),
    fuel_type: fuel_type,
    vehicle_transmission: vehicle_transmission,
    engine_power_hp: Number(details.enginePowerHp),
    engine_displacement_ltr: Number(details.engineDisplacementLtr),
    drive: details.drive, 
    steering_wheel: details.steeringWheel, 
    owners: Number(details.owners),
    condition: condition_backend,
    pts: details.pts, 
    customs_cleared: details.customsCleared, 
    equipment: details.equipment,
  };
};


const CarInputForm: React.FC<CarInputFormProps> = ({ onSubmit, isLoading }) => {
  const [formData, setFormData] = useState<CarDetails>(initialFormState);
  const [formErrors, setFormErrors] = useState<Partial<Record<FormField, string>>>({});

  const validateField = (name: FormField, value: string | number): string => {
    const sValue = String(value).trim();
    switch (name) {
      case FormField.Name:
        return sValue === '' ? 'Описание/вариант модели обязателен' : '';
      case FormField.Mileage:
        if (sValue === '') return 'Пробег обязателен';
        if (Number(sValue) < 0) return 'Пробег не может быть отрицательным';
        return Number(sValue) > 2000000 ? 'Пробег слишком большой (макс. 2 млн км)' : '';
      case FormField.Year:
         // Year is a select, so it will always have a value
        return '';
      case FormField.EnginePowerHp:
        if (sValue === '') return 'Мощность двигателя обязательна';
        if (Number(sValue) <= 0) return 'Мощность должна быть положительной';
        return Number(sValue) > 2000 ? 'Мощность слишком большая (макс. 2000 л.с.)': '';
      case FormField.EngineDisplacementLtr:
        if (sValue === '') return 'Объем двигателя обязателен';
        if (Number(sValue) <= 0) return 'Объем должен быть положительным';
        return Number(sValue) > 20 ? 'Объем слишком большой (макс. 20л)': '';
      case FormField.Owners:
        if (sValue === '') return 'Количество владельцев обязательно';
        return Number(sValue) < 0 ? 'Количество владельцев не может быть отрицательным' : Number(sValue) > 20 ? 'Слишком много владельцев (макс. 20)' : '';
      case FormField.Equipment:
         return sValue === '' ? 'Комплектация обязательна' : '';
      default:
        return '';
    }
  };

  const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement>) => {
    const { name, value } = e.target;
    const typedName = name as FormField;
    
    setFormData(prev => ({ ...prev, [typedName]: value })); // Store selects as string, numbers as string from input
    
    if (formErrors[typedName]) { // Clear error on change if it existed
       const error = validateField(typedName, value);
       setFormErrors(prev => ({ ...prev, [typedName]: error }));
    }
  };

  const handleBlur = (e: React.FocusEvent<HTMLInputElement | HTMLSelectElement>) => {
    const { name, value } = e.target;
    const typedName = name as FormField;
    const error = validateField(typedName, value);
    setFormErrors(prev => ({ ...prev, [typedName]: error }));
  };

  const handleSubmit = (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    let currentErrors: Partial<Record<FormField, string>> = {};
    let formIsValid = true;

    const fieldsToValidate: FormField[] = [
        FormField.Name, FormField.Mileage, FormField.Year, FormField.EnginePowerHp, 
        FormField.EngineDisplacementLtr, FormField.Owners, FormField.Equipment
    ];

    fieldsToValidate.forEach(key => {
        const value = formData[key as keyof CarDetails];
        const error = validateField(key, value as string | number); // Cast as it can be number for year from state
        if (error) {
            currentErrors[key] = error;
            formIsValid = false;
        }
    });
    
    setFormErrors(currentErrors);

    if (formIsValid) {
      const backendRequestData = mapToBackendRequest(formData);
      onSubmit(backendRequestData);
    }
  };
  
  const formRowClass = "grid grid-cols-1 sm:grid-cols-3 gap-x-4 gap-y-2 items-center mb-4";
  const labelClass = "block text-sm font-medium text-slate-300 sm:text-right sm:pr-2";
  const inputBaseClass = "block w-full rounded-md border-0 py-2 px-3 text-white bg-slate-700 shadow-sm ring-1 ring-inset ring-slate-600 placeholder:text-slate-400 focus:ring-2 focus:ring-inset focus:ring-sky-500 sm:text-sm sm:leading-6 disabled:opacity-50";
  const errorTextClass = "mt-1 text-xs text-red-400 col-span-1 sm:col-span-2 sm:col-start-2";

  return (
    <form onSubmit={handleSubmit} className="space-y-6">
      <h2 className="text-2xl font-semibold text-sky-400 mb-6 border-b border-slate-700 pb-2">Детали автомобиля</h2>
      
      <div className={formRowClass}>
        <label htmlFor={FormField.Make} className={labelClass}>Производитель:</label>
        <div className="sm:col-span-2">
          <select id={FormField.Make} name={FormField.Make} value={formData.make} onChange={handleChange} className={inputBaseClass} disabled={isLoading}>
            {CAR_BRANDS.map(brand => <option key={brand} value={brand}>{brand}</option>)}
          </select>
        </div>
      </div>
      
      <div className={formRowClass}>
        <label htmlFor={FormField.Name} className={labelClass}>Вариант/Двигатель:</label>
        <div className="sm:col-span-2">
          <input type="text" id={FormField.Name} name={FormField.Name} value={formData.name} onChange={handleChange} onBlur={handleBlur} className={`${inputBaseClass} ${formErrors.name ? 'ring-red-500' : ''}`} placeholder="например, 1.4 AT Comfort или GT Line" required disabled={isLoading} />
          {formErrors.name && <p className={errorTextClass}>{formErrors.name}</p>}
        </div>
      </div>

      <div className={formRowClass}>
        <label htmlFor={FormField.Year} className={labelClass}>Год выпуска:</label>
        <div className="sm:col-span-2">
          <select id={FormField.Year} name={FormField.Year} value={String(formData.year)} onChange={handleChange} onBlur={handleBlur} className={`${inputBaseClass} ${formErrors.year ? 'ring-red-500' : ''}`} required disabled={isLoading}>
            {YEARS.map(year => <option key={year} value={year}>{year}</option>)}
          </select>
          {formErrors.year && <p className={errorTextClass}>{formErrors.year}</p>}
        </div>
      </div>
      
      <div className={formRowClass}>
        <label htmlFor={FormField.Mileage} className={labelClass}>Пробег (км):</label>
        <div className="sm:col-span-2">
          <input type="number" id={FormField.Mileage} name={FormField.Mileage} value={formData.mileage} onChange={handleChange} onBlur={handleBlur} className={`${inputBaseClass} ${formErrors.mileage ? 'ring-red-500' : ''}`} placeholder="например, 70000" required disabled={isLoading} min="0" step="100" />
          {formErrors.mileage && <p className={errorTextClass}>{formErrors.mileage}</p>}
        </div>
      </div>

      <div className={formRowClass}>
        <label htmlFor={FormField.EnginePowerHp} className={labelClass}>Мощность (л.с.):</label>
        <div className="sm:col-span-2">
          <input type="number" id={FormField.EnginePowerHp} name={FormField.EnginePowerHp} value={formData.enginePowerHp} onChange={handleChange} onBlur={handleBlur} className={`${inputBaseClass} ${formErrors.enginePowerHp ? 'ring-red-500' : ''}`} placeholder="например, 150" required disabled={isLoading} min="1" step="1" />
          {formErrors.enginePowerHp && <p className={errorTextClass}>{formErrors.enginePowerHp}</p>}
        </div>
      </div>

      <div className={formRowClass}>
        <label htmlFor={FormField.EngineDisplacementLtr} className={labelClass}>Объем двигателя (л):</label>
        <div className="sm:col-span-2">
          <input type="number" id={FormField.EngineDisplacementLtr} name={FormField.EngineDisplacementLtr} value={formData.engineDisplacementLtr} onChange={handleChange} onBlur={handleBlur} className={`${inputBaseClass} ${formErrors.engineDisplacementLtr ? 'ring-red-500' : ''}`} placeholder="например, 1.6 или 2.0" required disabled={isLoading} min="0.1" step="0.1" />
          {formErrors.engineDisplacementLtr && <p className={errorTextClass}>{formErrors.engineDisplacementLtr}</p>}
        </div>
      </div>

      <div className={formRowClass}>
        <label htmlFor={FormField.EngineType} className={labelClass}>Тип топлива:</label>
        <div className="sm:col-span-2">
          <select id={FormField.EngineType} name={FormField.EngineType} value={formData.engineType} onChange={handleChange} className={inputBaseClass} disabled={isLoading}>
            {ENGINE_TYPES_DISPLAY.map(type => <option key={type} value={type}>{type}</option>)}
          </select>
        </div>
      </div>

      <div className={formRowClass}>
        <label htmlFor={FormField.Transmission} className={labelClass}>Коробка передач:</label>
        <div className="sm:col-span-2">
          <select id={FormField.Transmission} name={FormField.Transmission} value={formData.transmission} onChange={handleChange} className={inputBaseClass} disabled={isLoading}>
            {TRANSMISSION_TYPES_DISPLAY.map(type => <option key={type} value={type}>{type}</option>)}
          </select>
        </div>
      </div>
      
      <div className={formRowClass}>
        <label htmlFor={FormField.BodyType} className={labelClass}>Тип кузова:</label>
        <div className="sm:col-span-2">
          <select id={FormField.BodyType} name={FormField.BodyType} value={formData.bodyType} onChange={handleChange} className={inputBaseClass} disabled={isLoading}>
            {BODY_TYPES.map(type => <option key={type} value={type}>{type.charAt(0).toUpperCase() + type.slice(1)}</option>)}
          </select>
        </div>
      </div>

      <div className={formRowClass}>
        <label htmlFor={FormField.Color} className={labelClass}>Цвет:</label>
        <div className="sm:col-span-2">
          <select id={FormField.Color} name={FormField.Color} value={formData.color} onChange={handleChange} className={inputBaseClass} disabled={isLoading}>
            {COLORS.map(type => <option key={type} value={type}>{type.charAt(0).toUpperCase() + type.slice(1)}</option>)}
          </select>
        </div>
      </div>
      
      <div className={formRowClass}>
        <label htmlFor={FormField.Drive} className={labelClass}>Привод:</label>
        <div className="sm:col-span-2">
          <select id={FormField.Drive} name={FormField.Drive} value={formData.drive} onChange={handleChange} className={inputBaseClass} disabled={isLoading}>
            {DRIVE_TYPES.map(type => <option key={type} value={type}>{type.charAt(0).toUpperCase() + type.slice(1)}</option>)}
          </select>
        </div>
      </div>

      <div className={formRowClass}>
        <label htmlFor={FormField.SteeringWheel} className={labelClass}>Руль:</label>
        <div className="sm:col-span-2">
          <select id={FormField.SteeringWheel} name={FormField.SteeringWheel} value={formData.steeringWheel} onChange={handleChange} className={inputBaseClass} disabled={isLoading}>
            {STEERING_WHEEL_TYPES.map(type => <option key={type} value={type}>{type.charAt(0).toUpperCase() + type.slice(1)}</option>)}
          </select>
        </div>
      </div>

      <div className={formRowClass}>
        <label htmlFor={FormField.Owners} className={labelClass}>Кол-во владельцев:</label>
        <div className="sm:col-span-2">
           <input type="number" id={FormField.Owners} name={FormField.Owners} value={formData.owners} onChange={handleChange} onBlur={handleBlur} className={`${inputBaseClass} ${formErrors.owners ? 'ring-red-500' : ''}`} placeholder="0, 1, 2..." required disabled={isLoading} min="0" step="1" />
          {formErrors.owners && <p className={errorTextClass}>{formErrors.owners}</p>}
        </div>
      </div>
      
      <div className={formRowClass}>
        <label htmlFor={FormField.Condition} className={labelClass}>Состояние:</label>
        <div className="sm:col-span-2">
          <select id={FormField.Condition} name={FormField.Condition} value={formData.condition} onChange={handleChange} className={inputBaseClass} disabled={isLoading}>
            {CONDITIONS_DISPLAY.map(cond => <option key={cond} value={cond}>{cond}</option>)}
          </select>
        </div>
      </div>

      <div className={formRowClass}>
        <label htmlFor={FormField.Pts} className={labelClass}>ПТС:</label>
        <div className="sm:col-span-2">
          <select id={FormField.Pts} name={FormField.Pts} value={formData.pts} onChange={handleChange} className={inputBaseClass} disabled={isLoading}>
            {PTS_TYPES.map(type => <option key={type} value={type}>{type}</option>)}
          </select>
        </div>
      </div>

      <div className={formRowClass}>
        <label htmlFor={FormField.CustomsCleared} className={labelClass}>Растаможен:</label>
        <div className="sm:col-span-2">
          <select id={FormField.CustomsCleared} name={FormField.CustomsCleared} value={formData.customsCleared} onChange={handleChange} className={inputBaseClass} disabled={isLoading}>
            {CUSTOMS_CLEARED_TYPES.map(type => <option key={type} value={type}>{type}</option>)}
          </select>
        </div>
      </div>
      
      <div className={formRowClass}>
        <label htmlFor={FormField.Equipment} className={labelClass}>Комплектация:</label>
        <div className="sm:col-span-2">
          <input type="text" id={FormField.Equipment} name={FormField.Equipment} value={formData.equipment} onChange={handleChange} onBlur={handleBlur} className={`${inputBaseClass} ${formErrors.equipment ? 'ring-red-500' : ''}`} placeholder="например, Comfort, Luxe, SE" required disabled={isLoading} />
          {formErrors.equipment && <p className={errorTextClass}>{formErrors.equipment}</p>}
        </div>
      </div>
      
      <button 
        type="submit" 
        disabled={isLoading}
        className="w-full flex justify-center items-center rounded-md bg-sky-500 px-3.5 py-2.5 text-sm font-semibold text-white shadow-sm hover:bg-sky-400 focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-sky-500 disabled:opacity-50 disabled:cursor-not-allowed transition-colors duration-150 ease-in-out"
      >
        {isLoading ? (
          <>
            <svg className="animate-spin -ml-1 mr-3 h-5 w-5 text-white" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
              <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
              <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
            </svg>
            Оценка...
          </>
        ) : (
          'Оценить стоимость'
        )}
      </button>
    </form>
  );
};

export default CarInputForm;