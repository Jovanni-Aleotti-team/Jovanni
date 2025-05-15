from selenium import webdriver
from selenium.webdriver.chrome.service import Service
from selenium.webdriver.common.by import By
import time
from tqdm import tqdm
import os
from pathlib import Path

# Настройка Selenium WebDriver (Chrome)
options = webdriver.ChromeOptions()
options.add_argument("--start-maximized")

# Укажи путь к chromedriver, если он не прописан в PATH
service = Service()

driver = webdriver.Chrome(service=service, options=options)

# Переход на главную страницу Avito
driver.get("https://www.avito.ru/")

print("🔐 Войдите в аккаунт Avito вручную в открывшемся окне.")
input("👉 После входа и полной загрузки нажмите Enter...")

# Настройка работы со слагами и параллельными вкладками
script_dir = Path(__file__).resolve().parent
regions_file = script_dir / 'valid_avito_slugs.txt'
brands_file = script_dir / 'avito_brand_slugs.txt'
processed_file = script_dir / 'processed_combinations.txt'

# Загрузка списков слагов
with open(regions_file, 'r', encoding='utf-8') as f:
    region_slugs = [line.strip() for line in f if line.strip()]
with open(brands_file, 'r', encoding='utf-8') as f:
    brand_slugs = [line.strip() for line in f if line.strip()]

# Загрузка уже обработанных комбинаций
processed = set()
if processed_file.exists():
    with open(processed_file, 'r', encoding='utf-8') as f:
        processed = set(line.strip() for line in f if line.strip())

# Директория для сохранения всех страниц
save_dir = script_dir / "Avito_pages"
save_dir.mkdir(parents=True, exist_ok=True)

# Основной цикл по регионам и брендам
for region in tqdm(region_slugs, desc="🔍 Регионы", position=0):
    for brand in tqdm(brand_slugs, desc=f"🚗 Бренды для {region}", position=1, leave=False):
        combo = f"{region}|{brand}"
        if combo in processed:
            print(f"✅ Пропущена обработанная комбинация: {combo}")
            continue

        print(f"🔄 Обработка комбинации регион={region}, бренд={brand}")
        combo_dir = save_dir / f"{region}_{brand}"
        combo_dir.mkdir(parents=True, exist_ok=True)

        base_url = f"https://www.avito.ru/{region}/avtomobili/{brand}"
        page = 1
        while True:
            # Используем текущее окно без переключения
            url = f"{base_url}?p={page}"
            print(f"→ Загружаю: {url}")
            driver.get(url)
            time.sleep(5)

            current_url = driver.current_url
            if page > 1 and ('?p=1' in current_url or current_url.rstrip('/').endswith(f"/{brand}")):
                print("⏹ Переадресация на первую страницу или отсутствие новых страниц, выходим.")
                break

            file_path = combo_dir / f"page_{page}.html"
            with open(file_path, "w", encoding="utf-8") as f:
                f.write(driver.page_source)
            print(f"  • Сохранено: {file_path.name}")

            page += 1

        # Запись обработки комбинации
        with open(processed_file, 'a', encoding='utf-8') as f:
            f.write(combo + "\n")

driver.quit()