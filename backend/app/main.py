from fastapi import FastAPI
from fastapi.middleware.cors import CORSMiddleware
from .api.words import router as words_router

app = FastAPI(title="Famous Guy Words API")

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