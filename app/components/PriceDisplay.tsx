import React from 'react';
import { BackendCarRequest } from '../types'; // Use BackendCarRequest as it reflects what was sent

interface PriceDisplayProps {
  price: number; // This will be `predicted_price`
  carDetails: BackendCarRequest; // Display details sent to backend
}

const PriceDisplay: React.FC<PriceDisplayProps> = ({ price, carDetails }) => {
  // Assuming price is in RUB as per Python example. Adjust currency if needed.
  const formattedPrice = new Intl.NumberFormat('ru-RU', { style: 'currency', currency: 'RUB', minimumFractionDigits: 0 }).format(price);

  return (
    <div className="text-center w-full">
      <h2 className="text-2xl font-semibold text-sky-400 mb-2">Ориентировочная стоимость:</h2>
      <p className="text-5xl font-bold text-transparent bg-clip-text bg-gradient-to-r from-emerald-400 to-green-500 py-2 mb-6">
        {formattedPrice}
      </p>
      <div className="text-left text-sm text-slate-300 bg-slate-700 p-4 rounded-lg shadow max-h-80 overflow-y-auto">
        <h3 className="font-semibold text-slate-100 mb-2">На основе следующих данных:</h3>
        <ul className="space-y-1 list-disc list-inside">
          <li><strong>Производитель:</strong> {carDetails.brand}</li>
          <li><strong>Модель/Вариант:</strong> {carDetails.name}</li>
          <li><strong>Год:</strong> {carDetails.production_date}</li>
          <li><strong>Пробег:</strong> {new Intl.NumberFormat('ru-RU').format(carDetails.mileage)} км</li>
          <li><strong>Мощность:</strong> {carDetails.engine_power_hp} л.с.</li>
          <li><strong>Объем двигателя:</strong> {carDetails.engine_displacement_ltr} л</li>
          <li><strong>Тип топлива:</strong> {carDetails.fuel_type}</li>
          <li><strong>КПП:</strong> {carDetails.vehicle_transmission}</li>
          <li><strong>Кузов:</strong> {carDetails.body_type}</li>
          <li><strong>Цвет:</strong> {carDetails.color}</li>
          <li><strong>Привод:</strong> {carDetails.drive}</li>
          <li><strong>Руль:</strong> {carDetails.steering_wheel}</li>
          <li><strong>Владельцев:</strong> {carDetails.owners}</li>
          <li><strong>Состояние:</strong> {carDetails.condition}</li>
          <li><strong>ПТС:</strong> {carDetails.pts}</li>
          <li><strong>Растаможен:</strong> {carDetails.customs_cleared}</li>
          <li><strong>Комплектация:</strong> {carDetails.equipment}</li>
        </ul>
      </div>
      <p className="mt-6 text-xs text-slate-500">
        Это AI-генерируемая оценка на основе предоставленной модели. Реальная рыночная цена может отличаться.
      </p>
    </div>
  );
};

export default PriceDisplay;
