export default function ResultCard({ result }) {
    return (
      <div className="max-w-xl mx-auto mt-10 p-6 bg-gradient-to-r from-neon to-cyber rounded-xl shadow-xl animate-fade-in">
        <h2 className="text-2xl font-bold">Результат оценки</h2>
        <p className="text-lg mt-2">Примерная стоимость: <span className="text-cyber font-bold">{result.price}</span></p>
        <p className="text-lg">Уверенность модели: <span className="text-neon font-bold">{result.confidence}</span></p>
      </div>
    )
  }