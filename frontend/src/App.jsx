import { useState } from 'react'
import HeroSection from './components/HeroSection'
import CarForm from './components/CarForm'
import ProgressBar from './components/ProgressBar'
import LottieAnimation from './components/LottieAnimation'
import FeaturesSection from './components/FeaturesSection'
import ResultCard from './components/ResultCard'
import ExampleEstimation from './components/ExampleEstimation'
import Footer from './components/Footer'

export default function App() {
  const [progress, setProgress] = useState(0)
  const [carData, setCarData] = useState({ brand: '', model: '', year: '', mileage: '' })
  const [result, setResult] = useState(null)

  const handleSubmit = () => {
    setProgress(100)
    setTimeout(() => {
      setResult({ price: '1 350 000 ₽', confidence: 'Высокая' })
    }, 1500)
  }

  return (
    <div className="min-h-screen bg-dark text-white font-exo flex flex-col items-center px-4 py-10 space-y-20">
      {/* Основной блок */}
      <div className="w-full max-w-4xl space-y-8">
        <HeroSection />
        <div className="glass-morphism p-8 relative overflow-hidden">
          <div className="absolute inset-0 bg-gradient-to-r from-neon/10 to-cyber/10"></div>
          <ProgressBar progress={progress} />
          <CarForm 
            carData={carData} 
            setCarData={setCarData} 
            setProgress={setProgress} 
            onSubmit={handleSubmit} 
          />
          {result && <ResultCard result={result} />}
        </div>
      </div>

      {/* Секция с примерами */}
      <ExampleEstimation />

      {/* Преимущества */}
      <FeaturesSection />

      <Footer />

      {/* Анимация в отдельном разделе */}
      <div className="w-full max-w-4xl glass-morphism p-8">
        <h2 className="text-3xl mb-6 glowing-text text-center">Как это работает?</h2>
        <LottieAnimation />
      </div>
    </div>
  )
}