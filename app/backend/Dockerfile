FROM python:3.11-slim

WORKDIR /app

# Установка системных зависимостей
RUN apt-get update && apt-get install -y --no-install-recommends \
    gcc \
    build-essential \
    && rm -rf /var/lib/apt/lists/*

# Копируем зависимости и устанавливаем их
COPY requirements.txt .
RUN pip install --no-cache-dir -r requirements.txt

# Копируем исходный код
COPY src/ ./src/

# Явно копируем файлы модели и фич
COPY XGBoost_cluster_price.pkl /app/XGBoost_cluster_price.pkl
COPY agg_features.json /app/agg_features.json

# Проверка файлов
RUN echo "Проверка файлов:" && \
    ls -lh /app && \
    python -c "import os; print(f'Размер модели: {os.path.getsize(\"/app/XGBoost_cluster_price.pkl\")} байт')" && \
    python -c "import os; print(f'Размер фич: {os.path.getsize(\"/app/agg_features.json\")} байт')"

EXPOSE 8000

CMD ["uvicorn", "src.main:app", "--host", "0.0.0.0", "--port", "8000"]