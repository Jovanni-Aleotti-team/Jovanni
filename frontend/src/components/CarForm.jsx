export default function CarForm({ carData, setCarData, setProgress, onSubmit }) {
  const handleChange = (e) => {
    const { name, value } = e.target
    setCarData(prev => ({ ...prev, [name]: value }))
    setProgress(50)
  }

  return (
    <div className="glass-morphism max-w-2xl mx-auto p-8 my-10">
      <div className="grid grid-cols-1 gap-6">
        {['brand', 'model', 'year', 'mileage'].map((field) => (
          <input
            key={field}
            name={field}
            placeholder={`Введите ${field}`}
            value={carData[field]}
            onChange={handleChange}
            className="bg-gray-800 rounded-lg p-3 focus:ring-2 focus:ring-cyber"
          />
        ))}

        <button
          onClick={onSubmit}
          className="bg-neon hover:bg-cyber text-black font-bold py-3 px-8 rounded-lg transition-all duration-300 transform hover:scale-105"
        >
          Рассчитать
        </button>
      </div>
    </div>
  )
}