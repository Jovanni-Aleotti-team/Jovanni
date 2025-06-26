
docker run -it --rm -v "$(pwd)":/app -w /app node:18 npm install

# Пересоберите контейнеры
docker compose down -v
docker compose build --no-cache
docker compose up


docker rmi -f $(docker images -q)

# Удалите кэш сборки
docker builder prune -af

ls -lh backend/XGBoost_cluster_price.pkl
docker system prune -af 
docker builder prune -af 
docker volume prune -f
docker-compose build --no-cache  
docker-compose up   

http://localhost/

http://127.0.0.1