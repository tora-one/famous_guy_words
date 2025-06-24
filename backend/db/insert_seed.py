import json
import os
import psycopg2
from dotenv import load_dotenv

load_dotenv()

# .envから読み込み
DB_URL = os.getenv("SUPABASE_DB_URL")

# JSONファイル読み込み
with open("../data/words.json", encoding="utf-8") as f:
    data = json.load(f)

# PostgreSQLへ接続
conn = psycopg2.connect(DB_URL)
cur = conn.cursor()

# データ挿入
for item in data:
    cur.execute("""
        INSERT INTO words (source, writer, quote, category)
        VALUES (%s, %s, %s, %s)
    """, (
        item.get("source"),
        item.get("writer"),
        item.get("quote"),
        item.get("category")
    ))

conn.commit()
cur.close()
conn.close()

print("✅ JSON → Supabase：データ挿入完了")
