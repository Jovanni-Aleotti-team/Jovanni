import { motion } from 'framer-motion'
import { FaCheckCircle, FaShareAlt } from 'react-icons/fa'

export default function ResultCard({ result }) {
  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      className="glass-morphism mt-8 p-6 rounded-2xl relative overflow-hidden"
    >
      <div className="absolute inset-0 bg-gradient-to-r from-neon/10 to-cyber/10 opacity-50" />
      
      <div className="flex flex-col md:flex-row items-center justify-between gap-6">
        <div className="flex items-center gap-4">
          <FaCheckCircle className="text-4xl text-green-400 shrink-0" />
          <div>
            <h3 className="text-xl font-bold">Результат оценки</h3>
            <p className="text-gray-300">Уверенность: {result.confidence}</p>
          </div>
        </div>
        
        <div className="text-center md:text-right">
          <div className="glowing-text text-3xl font-bold mb-2">
            {result.price}
          </div>
          <button className="flex items-center gap-2 mx-auto md:mx-0 px-4 py-2 bg-neon/20 hover:bg-neon/30 rounded-lg transition">
            <FaShareAlt />
            <span>Поделиться</span>
          </button>
        </div>
      </div>
      
      <div className="mt-4 pt-4 border-t border-white/10">
        <p className="text-sm text-center opacity-75">
          *Цена основана на анализе 2500+ предложений
        </p>
      </div>
    </motion.div>
  )
}