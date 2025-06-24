import traceback
from fastapi import APIRouter, HTTPException, Query
from typing import List

import psycopg2
from ..models.words import Words
import os
from dotenv import load_dotenv

router = APIRouter(
    prefix="/api/words",
    tags=["words"],
)

# load_dotenv()                            🔑 呪文書から鍵を読み取る
# DB_URL = os.getenv(...)                  🧾 記憶の扉の座標
# conn = psycopg2.connect(DB_URL)          🛠️ 記憶の器と接続
# cur = conn.cursor()                      🖋️ 構文を記す筆
# cur.execute("SELECT ...")                🪶 詠唱する
# data = cur.fetchall()                    📖 語録を開く
# conn.close()                             🔐 扉を静かに閉じる

# Python には PostgreSQL 用の接続ライブラリとして主に 2つの選択肢があります：
# psycopg2: 安定＆定番（あなたが使ってる方）
# asyncpg: 高速＆非同期対応（FastAPIと相性◎）
# 構文の重み、速さ、非同期性によって選択肢が変わります。 今はまず psycopg2 で十分。のちに asyncpg に差し替える余地もあります。



@router.get("/", response_model=List[Words])
async def get_words(category: str | None = Query(default=None)):
    load_dotenv()
    conn = psycopg2.connect(os.getenv("SUPABASE_DB_URL"))
    cur = conn.cursor()
    
    try:
        if category == "all":
            cur.execute("SELECT id, source, writer, quote, category FROM words")
        else:
            cur.execute("SELECT id, source, writer, quote, category FROM words WHERE category = %s", (category,))
        results = cur.fetchall()

        return [
        Words(
            id=row[0],
            source=row[1],
            writer=row[2],
            quote=row[3],
            category=row[4],
        )
        for row in results
    ]
    except Exception as e:
        traceback.print_exc()
        raise HTTPException(status_code=500, detail=f"Error reading data: {str(e)}")
    finally:
        conn.close()

