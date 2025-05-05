import { useState } from 'react'
import HeroSection from './components/HeroSection'
import CarForm from './components/CarForm'
import ProgressBar from './components/ProgressBar'
import './styles.css'

export default function App() {
  const [progress, setProgress] = useState(0)
  const [carData, setCarData] = useState({
    brand: '',
    model: '',
    year: 2053,
    mileage: 0
  })

  return (
    <div className="app">
      <HeroSection />
      <ProgressBar progress={progress} />
      <CarForm 
        carData={carData}
        setCarData={setCarData}
        setProgress={setProgress}
      />
    </div>
  )
}