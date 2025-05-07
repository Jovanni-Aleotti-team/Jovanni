import { motion } from 'framer-motion'

const examples = [
    { 
        brand: 'Toyota Camry', 
        year: 2018, 
        mileage: '65 000 км',
        price: '1 890 000 ₽',
        features: ['Полный привод', '2.5 л', 'Автомат']
      },

      { 
        brand: 'BMW 5', 
        year: 2017, 
        mileage: '165 000 км',
        price: '3 500 000 ₽',
        features: ['задний привод', '2 л', 'Автомат']
      },

      { 
        brand: 'Lada Vesta', 
        year: 2022, 
        mileage: '10 000 км',
        price: '1 000 000 ₽',
        features: ['Полный привод', '1.6 л', 'Механика']
      },

]

export default function ExampleEstimation() {
  return (
    <div className="w-full max-w-4xl">
      <h3 className="text-2xl font-bold mb-6 glowing-text text-center">
        Примеры оценок
      </h3>
      
      <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
        {examples.map((example, idx) => (
          <motion.div
            key={idx}
            whileHover={{ scale: 1.05 }}
            className="glass-morphism p-4 rounded-xl cursor-pointer transition-all hover:border-neon/50"
          >
            <div className="flex justify-between items-start mb-3">
              <div>
                <h4 className="font-semibold">{example.brand}</h4>
                <p className="text-sm text-gray-300">{example.year} года</p>
              </div>
              <span className="text-xs px-2 py-1 bg-neon/20 rounded-md">
                {example.mileage}
              </span>
            </div>
            <div className="text-xl font-bold text-neon">
              {example.price}
            </div>
          </motion.div>
        ))}
      </div>
    </div>
  )
}