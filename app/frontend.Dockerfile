# Используем Node.js 20
FROM node:20 AS builder

# Рабочая директория
WORKDIR /app

# Копируем только файлы зависимостей
COPY package.json .
COPY package-lock.json .

# Устанавливаем зависимости
RUN npm install

# Копируем остальные файлы
COPY . .

# Собираем приложение
RUN npm run build

# Финальный образ
FROM nginx:stable-alpine

# Копируем собранное приложение
COPY --from=builder /app/dist /usr/share/nginx/html

# Копируем конфиг Nginx
COPY nginx.conf /etc/nginx/conf.d/default.conf

# Открываем порт 80
EXPOSE 80

# Запускаем Nginx
CMD ["nginx", "-g", "daemon off;"]