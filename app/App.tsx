
import React, { useState, useCallback } from 'react';
import { BackendCarRequest, PriceResponse } from './types';
import CarInputForm from './components/CarInputForm';
import PriceDisplay from './components/PriceDisplay';
import LoadingSpinner from './components/LoadingSpinner';
import ErrorMessage from './components/ErrorMessage';
import { estimateCarPrice } from './services/predictionService'; // Ensures correct relative path

const App: React.FC = () => {
  const [price, setPrice] = useState<number | null>(null);
  const [isLoading, setIsLoading] = useState<boolean>(false);
  const [error, setError] = useState<string | null>(null);
  const [submittedCarDetails, setSubmittedCarDetails] = useState<BackendCarRequest | null>(null);

  const handleSubmit = useCallback(async (details: BackendCarRequest) => {
    setIsLoading(true);
    setError(null);
    setPrice(null);
    setSubmittedCarDetails(details); // Store details that were sent to backend

    try {
      // API_KEY check for Gemini is no longer needed here
      // The new backend handles its own model and logic
      const priceResponse: PriceResponse = await estimateCarPrice(details);
      setPrice(priceResponse.predicted_price);
    } catch (err) {
      if (err instanceof Error) {
        setError(err.message);
      } else {
        setError('Произошла неизвестная ошибка при оценке стоимости.');
      }
      console.error(err);
    } finally {
      setIsLoading(false);
    }
  }, []);

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-900 to-slate-700 py-8 px-4 sm:px-6 lg:px-8 text-white">
      <header className="text-center mb-10">
        <h1 className="text-4xl sm:text-5xl font-extrabold tracking-tight bg-clip-text text-transparent bg-gradient-to-r from-sky-400 to-cyan-300">
          <span className="inline-block mr-3">🚗</span> Оценщик Стоимости Автомобилей
        </h1>
        <p className="mt-3 text-lg text-slate-300 max-w-2xl mx-auto">
          Введите характеристики вашего автомобиля, и наш сервис предоставит ориентировочную рыночную стоимость на основе предиктивной модели.
        </p>
      </header>

      <main className="max-w-4xl mx-auto grid grid-cols-1 md:grid-cols-2 gap-8 items-start">
        <div className="bg-slate-800 shadow-2xl rounded-xl p-6 md:p-8">
          <CarInputForm onSubmit={handleSubmit} isLoading={isLoading} />
        </div>

        <div className="bg-slate-800 shadow-2xl rounded-xl p-6 md:p-8 min-h-[400px] flex flex-col justify-center items-center"> {/* Increased min-h for richer display */}
          {isLoading && <LoadingSpinner />}
          {error && !isLoading && <ErrorMessage message={error} />}
          {price !== null && !isLoading && !error && submittedCarDetails && (
            <PriceDisplay price={price} carDetails={submittedCarDetails} />
          )}
          {!isLoading && !error && price === null && (
            <div className="text-center text-slate-400">
              <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={1.5} stroke="currentColor" className="w-16 h-16 mx-auto mb-4 opacity-50">
                <path strokeLinecap="round" strokeLinejoin="round" d="M2.25 18.75a60.07 60.07 0 0 1 15.797 2.101c.727.198 1.453-.342 1.453-1.096V18.75M3.75 4.5v.75A.75.75 0 0 1 3 6h-.75m0 0v-.375c0-.621.504-1.125 1.125-1.125H20.25M2.25 6v9m18-10.5v.75c0 .414.336.75.75.75h.75m-1.5-1.5h.375c.621 0 1.125.504 1.125 1.125v9.75c0 .621-.504 1.125-1.125 1.125h-.375m1.5-1.5H21a.75.75 0 0 0-.75.75v.75m0 0H3.75m0 0h-.375a1.125 1.125 0 0 1-1.125-1.125V15m1.5 1.5v-.75A.75.75 0 0 0 3 15h-.75M15 10.5a3 3 0 1 1-6 0 3 3 0 0 1 6 0Zm3 0h.008v.008H18V10.5Zm-12 0h.008v.008H6V10.5Z" />
              </svg>
              <p className="text-xl font-semibold">Результат оценки появится здесь</p>
              <p className="text-sm">Заполните форму и нажмите "Оценить"</p>
            </div>
          )}
        </div>
      </main>
      <footer className="text-center mt-12 text-sm text-slate-500">
        <p>&copy; {new Date().getFullYear()} Car Valuator. Все права защищены.</p>
         <p className="text-xs mt-1">Цены являются ориентировочными и не представляют собой официальную оценку.</p>
      </footer>
    </div>
  );
};

export default App;