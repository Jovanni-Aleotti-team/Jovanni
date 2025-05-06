import csv
import time
import random
from bs4 import BeautifulSoup
from concurrent.futures import ThreadPoolExecutor
import requests
import os
from selenium import webdriver 
from selenium.webdriver.common.by import By
from selenium.webdriver.chrome.service import Service
from selenium.webdriver.chrome.options import Options
from webdriver_manager.chrome import ChromeDriverManager
from selenium.webdriver.support.ui import WebDriverWait
from selenium.webdriver.support import expected_conditions as EC

HEADERS = {
    "User-Agent": "Mozilla/5.0",
}

BASE_URL = "https://www.avito.ru"
START_URL = "https://www.avito.ru/all/avtomobili"

def get_listing_urls(start_url, pages=5):
    all_links = []
    for page in range(1, pages + 1):
        page_url = f"{start_url}?p={page}"
        chrome_options = Options()
        # chrome_options.add_argument("--headless")  # отключено для отладки
        chrome_options.add_argument("--no-sandbox")
        chrome_options.add_argument("--disable-dev-shm-usage")

        driver = webdriver.Chrome(service=Service(ChromeDriverManager().install()), options=chrome_options)
        driver.get(page_url)
        time.sleep(random.uniform(2, 4))
        WebDriverWait(driver, 10).until(
            EC.presence_of_all_elements_located((By.CSS_SELECTOR, "a[data-marker='item-title']"))
        )
        soup = BeautifulSoup(driver.page_source, "html.parser")
        driver.quit()

        links = []
        for a in soup.select("a[data-marker='item-title']"):
            href = a.get("href")
            if href and "/avtomobili/" in href:
                links.append(BASE_URL + href.split("?")[0])
        all_links.extend(links)
    return list(set(all_links))

def parse_car_page(url):
    chrome_options = Options()
    # chrome_options.add_argument("--headless")
    chrome_options.add_argument("--no-sandbox")
    chrome_options.add_argument("--disable-dev-shm-usage")

    driver = webdriver.Chrome(service=Service(ChromeDriverManager().install()), options=chrome_options)
    try:
        time.sleep(random.uniform(2, 4))
        driver.get(url)
        time.sleep(random.uniform(1, 3))
        soup = BeautifulSoup(driver.page_source, "html.parser")

        title_tag = soup.find("h1")
        title = title_tag.text.strip() if title_tag else "N/A"

        price_tag = soup.select_one('[itemprop="price"]')
        price = price_tag["content"] if price_tag else "N/A"

        params = soup.select("ul.params-paramsList-_awNW li")
        param_dict = {li.find("span").text.split(":")[0].strip(): li.text.split(":")[1].strip()
                      for li in params if ":" in li.text}

        price_ranges = soup.select("div.styles-range-GUls8")
        avito_valuation = {}
        for block in price_ranges:
            label = block.find("span").text.strip()
            value = block.select_one(".styles-subtitle-_GzPh")
            if value:
                avito_valuation[label] = value.text.strip()

        return {
            "url": url,
            "title": title,
            "price": price,
            **param_dict,
            **avito_valuation
        }
    except Exception as e:
        print(f"Ошибка при парсинге {url}: {e}")
        return None
    finally:
        driver.quit()

def save_to_csv(data, filename="cars.csv"):
    if not data:
        return
    keys = sorted(set().union(*(d.keys() for d in data)))
    with open(filename, "w", newline="", encoding="utf-8") as f:
        writer = csv.DictWriter(f, fieldnames=keys)
        writer.writeheader()
        writer.writerows(data)

def run_parser():
    all_data = []

    print("[*] Собираем ссылки на карточки...")
    card_urls = get_listing_urls(START_URL, pages=5)
    print(f"[+] Найдено {len(card_urls)} объявлений")

    with ThreadPoolExecutor(max_workers=2) as executor:
        results = list(executor.map(parse_car_page, card_urls))
        time.sleep(random.uniform(1, 3))

    all_data = [r for r in results if r]
    save_to_csv(all_data)
    print(f"[✓] Готово. Сохранено {len(all_data)} записей в cars.csv")

if __name__ == "__main__":
    run_parser()