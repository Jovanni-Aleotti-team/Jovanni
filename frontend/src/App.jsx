import { useState } from 'react'
import HeroSection from './components/HeroSection'
import CarForm from './components/CarForm'
import ProgressBar from './components/ProgressBar'
import ResultCard from './components/ResultCard'
import LottieAnimation from './components/LottieAnimation'

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
    <div className="min-h-screen bg-dark text-white font-exo flex flex-col items-center justify-center px-4 py-10">
      <div className="w-full max-w-4xl space-y-8">
        <HeroSection />
        <ProgressBar progress={progress} />
        <CarForm 
          carData={carData} 
          setCarData={setCarData} 
          setProgress={setProgress} 
          onSubmit={handleSubmit} 
        />
        {result && <ResultCard result={result} />}
        <LottieAnimation />
      </div>
    </div>
  )
}
