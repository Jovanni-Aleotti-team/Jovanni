export default function FeaturesSection() {
    return (
      <div className="w-full max-w-6xl">
        <h2 className="section-title glowing-text">Наши преимущества</h2>
        <div className="responsive-grid">
          {[
            {icon: 'rocket', title: 'Мгновенный расчет', text: 'Получите оценку за 15 секунд'},
            {icon: 'brain', title: 'ИИ технология', text: 'Нейросеть с точностью 98%'},
            {icon: 'shield-alt', title: 'Безопасность', text: 'Ваши данные защищены'},
          ].map((feature, i) => (
            <div key={i} className="glass-morphism p-6 hover:gradient-border transition-all">
              <div className="icon-blob mb-4 mx-auto">
                <i className={`fas fa-${feature.icon} text-neon text-2xl`}></i>
              </div>
              <h3 className="text-xl font-bold mb-2 text-center">{feature.title}</h3>
              <p className="text-gray-300 text-center">{feature.text}</p>
            </div>
          ))}
        </div>
      </div>
    )
  }