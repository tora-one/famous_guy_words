# Famous Guy Words API

バックエンドAPIサーバー（FastAPI）

## セットアップ

```bash
# 仮想環境の作成
python -m venv venv

# 仮想環境の有効化
# Windows
venv\Scripts\activate
# macOS/Linux
# source venv/bin/activate

# 依存関係のインストール
pip install -r requirements.txt
```

## 実行方法

```bash
# 開発サーバーの起動
uvicorn app.main:app --reload
```

## API エンドポイント

- `GET /`: APIのルートエンドポイント
- `GET /api/words`: すべての名言を取得

## API ドキュメント

- Swagger UI: http://localhost:8000/docs
- ReDoc: http://localhost:8000/redoc