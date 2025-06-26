import { BackendCarRequest, PriceResponse } from '../types';

const API_BASE_URL = '/api/v1'; // Base URL for the backend API (proxied by Nginx in Docker)

export const estimateCarPrice = async (details: BackendCarRequest): Promise<PriceResponse> => {
  try {
    const response = await fetch(`${API_BASE_URL}/predict`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify(details),
    });

    if (!response.ok) {
      let errorMessage = `Ошибка сервера: ${response.status}`;
      try {
        const errorData = await response.json();
        errorMessage = errorData.detail || errorMessage;
        if (typeof errorData.detail === 'object' && errorData.detail.message) {
             errorMessage = errorData.detail.message;
        } else if (Array.isArray(errorData.detail)) { // Handle FastAPI validation errors
            errorMessage = errorData.detail.map((err: any) => `${err.loc.join('.')} - ${err.msg}`).join('; ');
        }
      } catch (e) {
        // Failed to parse error JSON, stick with status
      }
      throw new Error(errorMessage);
    }

    const data: PriceResponse = await response.json();
    
    if (typeof data.predicted_price !== 'number' || isNaN(data.predicted_price)) {
      console.error("Invalid price format from backend:", data);
      throw new Error('Бэкенд вернул некорректный формат цены.');
    }
    
    return data;

  } catch (error) {
    console.error("Error calling prediction API:", error);
    if (error instanceof Error) {
        throw new Error(error.message || 'Не удалось получить оценку от сервиса. Попробуйте позже.');
    }
    throw new Error('Не удалось получить оценку от сервиса. Попробуйте позже.');
  }
};