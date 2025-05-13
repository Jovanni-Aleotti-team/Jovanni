import time
import random
import requests
from requests.exceptions import RequestException
from bs4 import BeautifulSoup
import os

BASE_DIR = os.path.dirname(os.path.abspath(__file__))



HEADERS = {
    'User-Agent': (
        'Mozilla/5.0 (Windows NT 10.0; Win64; x64) '
        'AppleWebKit/537.36 (KHTML, like Gecko) '
        'Chrome/112.0.0.0 Safari/537.36'
    ),
    'Accept-Language': 'ru-RU,ru;q=0.9',
    'Referer': 'https://www.avito.ru/',
}

# --- Proxy fetching function ---
def get_free_proxies():
    """
    Fetch a list of free HTTP proxies from ProxyScrape.
    Returns a list of proxy URLs like 'http://host:port'.
    """
    url = ("https://api.proxyscrape.com/v2/?request=getproxies"
           "&protocol=http&timeout=10000"
           "&country=all&ssl=all&anonymity=all")
    try:
        resp = requests.get(url, timeout=10)
        resp.raise_for_status()
        lines = resp.text.splitlines()
        return ["http://" + line.strip() for line in lines if line.strip()]
    except Exception as e:
        print(f"Warning: could not fetch proxies: {e}")
        return []

OUT_FILE = os.path.join(BASE_DIR, 'urls.txt')
BASE_URL = 'https://www.avito.ru/all/avtomobili'

def collect_links(max_pages=None, delay=2.0):
    # fetch proxies once
    PROXIES = get_free_proxies()
    print(f"Fetched {len(PROXIES)} proxies")
    page = 1
    total = 0

    with open(OUT_FILE, 'w', encoding='utf-8') as f:
        while True:
            params = {'p': page}
            print(f'→ Fetching page {page} …')
            # choose a random proxy for this request
            proxy = random.choice(PROXIES) if PROXIES else None
            proxy_dict = {'http': proxy, 'https': proxy} if proxy else None
            try:
                r = requests.get(
                    BASE_URL,
                    headers=HEADERS,
                    params=params,
                    proxies=proxy_dict,
                    timeout=10
                )
            except RequestException as e:
                print(f'  ! Request exception: {e}. Rotating proxy and retrying...')
                time.sleep(delay * 5 + random.uniform(0, delay))
                # remove bad proxy
                if proxy in PROXIES:
                    PROXIES.remove(proxy)
                    if not PROXIES:
                        PROXIES = get_free_proxies()
                        print(f"Refilled proxies: {len(PROXIES)}")
                continue

            if r.status_code == 429:
                print('  ! HTTP 429 Too Many Requests. Rotating proxy and retrying...')
                time.sleep(delay * 5 + random.uniform(0, delay))
                if proxy in PROXIES:
                    PROXIES.remove(proxy)
                    if not PROXIES:
                        PROXIES = get_free_proxies()
                        print(f"Refilled proxies: {len(PROXIES)}")
                continue

            if r.status_code != 200:
                print(f'  ! HTTP {r.status_code} error. Retrying after delay...')
                time.sleep(delay * 5 + random.uniform(0, delay))
                continue

            soup = BeautifulSoup(r.text, 'lxml')
            cards = soup.select('a[data-marker="item-title"]')
            if not cards:
                print('  ! Нет ссылок — завершаю.')
                break

            for a in cards:
                href = a['href']
                if href.startswith('/'):
                    href = 'https://www.avito.ru' + href
                f.write(href + '\n')
            count = len(cards)
            total += count
            print(f'  • {count} links, total {total}')

            # Переходим на следующую страницу
            page += 1
            if max_pages and page > max_pages:
                print(f'  • Достигнут max_pages={max_pages}, останавливаюсь.')
                break
            # Pause with jitter to avoid rate limits
            sleep_time = delay + random.uniform(0, delay)
            time.sleep(sleep_time)

    print(f'Готово, всего ссылок: {total} → {OUT_FILE}')

if __name__ == '__main__':
    collect_links(max_pages=None, delay=2.0)