import { FaGithub, FaTelegram, FaRegEnvelope } from 'react-icons/fa'

export default function Footer() {
  return (
    <footer className="w-full mt-20 border-t border-white/10">
      <div className="max-w-6xl mx-auto px-4 py-12">
        <div className="grid grid-cols-1 md:grid-cols-4 gap-8">
          <div className="space-y-4">
            <h5 className="text-lg font-bold text-neon">Jovanni</h5>
            <p className="text-sm text-gray-400">
              Умная оценка автомобилей с использованием AI технологий
            </p>
          </div>

          <div className="space-y-4">
            <h6 className="text-sm font-semibold">Навигация</h6>
            <ul className="space-y-2 text-sm text-gray-400">
              <li><a href="#" className="hover:text-neon transition">Главная</a></li>
              <li><a href="#" className="hover:text-neon transition">О сервисе</a></li>
              <li><a href="#" className="hover:text-neon transition">Контакты</a></li>
            </ul>
          </div>

          <div className="space-y-4">
            <h6 className="text-sm font-semibold">Технологии</h6>
            <ul className="space-y-2 text-sm text-gray-400">
              <li><a href="#" className="hover:text-neon transition">ML Модели</a></li>
              <li><a href="#" className="hover:text-neon transition">API Документация</a></li>
              <li><a href="#" className="hover:text-neon transition">Открытый код</a></li>
            </ul>
          </div>

          <div className="space-y-4">
            <h6 className="text-sm font-semibold">Контакты</h6>
            <div className="flex gap-4 text-2xl text-gray-400">
              <a href="#" className="hover:text-neon transition">
                <FaGithub />
              </a>
              <a href="#" className="hover:text-neon transition">
                <FaTelegram />
              </a>
              <a href="#" className="hover:text-neon transition">
                <FaRegEnvelope />
              </a>
            </div>
          </div>
        </div>

        <div className="mt-8 pt-8 border-t border-white/10 text-center text-sm text-gray-400">
          © 2024 Jovanni. Все права защищены
        </div>
      </div>
    </footer>
  )
}