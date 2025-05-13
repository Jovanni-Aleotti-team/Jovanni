#!/usr/bin/env python3
# download_pages.py

import asyncio
import aiohttp
import aiofiles
import os
from aiolimiter import AsyncLimiter
from aiohttp_retry import RetryClient, ExponentialRetry
import random

BASE_DIR = os.path.dirname(os.path.abspath(__file__))

URLS_FILE = os.path.join(BASE_DIR, 'urls.txt')
OUTPUT_DIR = os.path.join(BASE_DIR, 'pages')
CONCURRENCY = 3           
DELAY_SEC   = 0.5         

os.makedirs(OUTPUT_DIR, exist_ok=True)


limiter = AsyncLimiter(max_rate=CONCURRENCY, time_period=1)


HEADERS = {
    'User-Agent': (
        'Mozilla/5.0 (Windows NT 10.0; Win64; x64) '
        'AppleWebKit/537.36 (KHTML, like Gecko) '
        'Chrome/112.0.0.0 Safari/537.36'
    ),
    'Accept-Language': 'ru-RU,ru;q=0.9',
}

async def get_free_proxies():
    """
    Fetch a list of free HTTP proxies from ProxyScrape.
    Returns a list of proxy URLs like 'http://host:port'.
    """
    url = "https://api.proxyscrape.com/v2/?request=getproxies&protocol=http&timeout=10000&country=all&ssl=all&anonymity=all"
    proxies = []
    async with aiohttp.ClientSession() as proxy_sess:
        resp = await proxy_sess.get(url)
        text = await resp.text()
    for line in text.splitlines():
        line = line.strip()
        if line:
            proxies.append(f"http://{line}")
    return proxies

async def fetch_and_save(session, url, idx):
    # choose a proxy for this request
    proxy = random.choice(PROXIES) if PROXIES else None
    async with limiter:
        try:
            async with session.get(url, proxy=proxy) as resp:
                resp.raise_for_status()
                html = await resp.text()
                path = os.path.join(OUTPUT_DIR, f'{idx:07}.html')
                async with aiofiles.open(path, 'w', encoding='utf-8') as f:
                    await f.write(html)
                print(f'[OK]  {idx}: {url}')
        except Exception as e:
            print(f'[ERR] {idx}: {url} → {e}')
        await asyncio.sleep(DELAY_SEC)

async def main():

    # dynamically fetch free proxies
    print("Fetching free proxies...")
    free_proxies = await get_free_proxies()
    if not free_proxies:
        print("Warning: no free proxies found, proceeding without proxy.")
    else:
        print(f"Fetched {len(free_proxies)} proxies.")
    global PROXIES
    PROXIES = free_proxies

    with open(URLS_FILE, 'r', encoding='utf-8') as f:
        urls = [u.strip() for u in f if u.strip()]
    print(f'Будет скачано {len(urls)} страниц, сохраняем в "{OUTPUT_DIR}/"')

    # set up retry strategy for HTTP 429 and server errors
    retry_options = ExponentialRetry(attempts=5, statuses={429, 500, 502, 503, 504})
    async with RetryClient(raise_for_status=False, retry_options=retry_options, headers=HEADERS) as session:
        tasks = [
            asyncio.create_task(fetch_and_save(session, url, i+1))
            for i, url in enumerate(urls)
        ]
        await asyncio.gather(*tasks)

if __name__ == '__main__':
    asyncio.run(main())