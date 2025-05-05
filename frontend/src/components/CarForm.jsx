export default function CarForm({ carData, setCarData, setProgress }) {
    const handleInputChange = (e) => {
      const { name, value } = e.target
      setCarData(prev => ({
        ...prev,
        [name]: value
      }))
      setProgress(25)
    }
  
    return (
      <div className="glass-morphism max-w-2xl mx-auto p-8 my-8">
        <div className="space-y-6">
          <div className="form-group">
            <label className="block text-lg mb-2">Марка автомобиля</label>
            <input
              name="brand"
              value={carData.brand}
              onChange={handleInputChange}
              className="w-full bg-gray-800 rounded-lg p-3 focus:ring-2 focus:ring-[var(--neon-blue)]"
            />
          </div>
          
          {/* Добавьте остальные поля формы аналогично */}
          
          <button 
            className="bg-[var(--neon-blue)] hover:bg-[var(--cyber-green)] 
                       text-black font-bold py-3 px-8 rounded-lg
                       transition-all duration-300 transform hover:scale-105"
          >
            Рассчитать
          </button>
        </div>
      </div>
    )
  }