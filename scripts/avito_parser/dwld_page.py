#!/usr/bin/env python3
# download_pages.py

import asyncio
import aiohttp
import aiofiles
import os
import random
from aiolimiter import AsyncLimiter
from aiohttp_retry import RetryClient, ExponentialRetry
from aiohttp import ClientTimeout, TCPConnector, ClientError, ClientConnectorError, ServerTimeoutError

BASE_DIR = os.path.dirname(os.path.abspath(__file__))
URLS_FILE = os.path.join(BASE_DIR, 'urls.txt')
OUTPUT_DIR = os.path.join(BASE_DIR, 'pages')

CONCURRENCY = 3
DELAY_SEC = 0.5

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
    api_url = (
        "https://api.proxyscrape.com/v2/"
        "?request=getproxies&protocol=http"
        "&timeout=10000&country=all"
        "&ssl=all&anonymity=all"
    )
    proxies = []
    async with aiohttp.ClientSession() as proxy_sess:
        try:
            resp = await proxy_sess.get(api_url, timeout=ClientTimeout(total=10))
            resp.raise_for_status()
            text = await resp.text()
            for line in text.splitlines():
                if line.strip():
                    proxies.append(f"http://{line.strip()}")
        except Exception as e:
            print(f"[WARN] Не удалось получить прокси: {e}")
    return proxies

async def fetch_and_save(session: RetryClient, url: str, idx: int):
    proxy = random.choice(PROXIES) if PROXIES else None
    async with limiter:
        try:
            async with session.get(
                url,
                proxy=proxy,
                timeout=ClientTimeout(total=30)
            ) as resp:
                resp.raise_for_status()
                raw = await resp.read()
                try:
                    html = raw.decode('utf-8')
                except UnicodeDecodeError:
                    html = raw.decode('utf-8', errors='ignore')

                filename = f"{idx:07}.html"
                path = os.path.join(OUTPUT_DIR, filename)
                async with aiofiles.open(path, 'w', encoding='utf-8') as f:
                    await f.write(html)
                print(f"[OK]  {idx}: {url}")

        except (ServerTimeoutError, asyncio.TimeoutError):
            print(f"[TIMEOUT] {idx}: {url}")
        except ClientConnectorError as e:
            print(f"[CONNERR] {idx}: {url} → {e}")
            if proxy in PROXIES:
                PROXIES.remove(proxy)
                print(f"         Прокси {proxy} удалён из пула")
        except ClientError as e:
            print(f"[ERR] {idx}: {url} → {e}")
        except Exception as e:
            print(f"[UNKN] {idx}: {url} → {e}")
        finally:
            await asyncio.sleep(DELAY_SEC + random.random() * 0.5)

async def main():
    print("Получаем список бесплатных прокси…")
    free_proxies = await get_free_proxies()
    if free_proxies:
        print(f"  → найдено {len(free_proxies)} прокси")
    else:
        print("  → прокси не найдены, работаем без них")
    global PROXIES
    PROXIES = free_proxies

    with open(URLS_FILE, 'r', encoding='utf-8') as f:
        urls = [u.strip() for u in f if u.strip()]
    print(f"Будет скачано {len(urls)} страниц, сохраняем в `{OUTPUT_DIR}/`")

    # Корректная инициализация ExponentialRetry
    retry_opts = ExponentialRetry(
        attempts=5,
        statuses={429, 500, 502, 503, 504},
        start_timeout=1  # вместо retry_interval
    )

    connector = TCPConnector(ssl=False, limit_per_host=CONCURRENCY)

    async with RetryClient(
        raise_for_status=False,
        retry_options=retry_opts,
        headers=HEADERS,
        connector=connector
    ) as session:
        tasks = [
            asyncio.create_task(fetch_and_save(session, url, idx + 1))
            for idx, url in enumerate(urls)
        ]
        await asyncio.gather(*tasks)

if __name__ == "__main__":
    asyncio.run(main())