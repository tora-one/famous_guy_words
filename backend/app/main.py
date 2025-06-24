import os

from fastapi import FastAPI
from fastapi.middleware.cors import CORSMiddleware
from app.api.words import router as words_router
from app.api import words
from dotenv import load_dotenv
load_dotenv()

url = os.getenv("SUPABASE_DB_URL")
if not url:
    print("❗ SUPABASE_DB_URL が未定義です")
    raise RuntimeError("❌ SUPABASE_DB_URL が設定されていません")
else:
    print(f"✅ SUPABASE_DB_URL（先頭）：{url[:30]}...")  # セキュリティ配慮して先頭だけ表示


app = FastAPI(title="Famous Guy Words API")
app.include_router(words.router, prefix="/api")

# CORS設定
app.add_middleware(
    CORSMiddleware,
    allow_origins=["*"],  # すべてのオリジンを許可（開発環境用）
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)

# ルーターの登録
app.include_router(words_router)

@app.get("/")
async def root():
    return {"message": "Famous Guy Words API"}