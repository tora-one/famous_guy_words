# Famous Guy Words

小説の台詞検索アプリケーション - バックエンド（FastAPI）とフロントエンド（Next.js）の構成

## プロジェクト構成

```
famous_guy_words/
├── backend/          # FastAPI バックエンド
│   ├── app/
│   │   ├── api/      # APIエンドポイント
│   │   ├── core/     # コア機能
│   │   ├── models/   # データモデル
|   |   ├── data/     # jsonの名言データ
│   │   └── main.py   # アプリケーションのエントリーポイント
│   ├── requirements.txt
│   └── README.md
└── famous_words_app/ # Next.js フロントエンド
    ├── public/       # 静的ファイル
    ├── src/          # ソースコード
    │   └── app/      # Next.js App Router
    │       ├── api/  # APIクライアント
    │       ├── words/ # 名言一覧ページ
    │       └── page.tsx # トップページ
    ├── .env.local    # 環境変数
    └── README.md
```

## セットアップと実行

### バックエンド（FastAPI）
```bash
# バックエンドディレクトリに移動
cd backend

# 仮想環境の作成
python -m venv venv

# 仮想環境の有効化
# Windows
venv\Scripts\activate
# macOS/Linux
# source venv/bin/activate

# 依存関係のインストール
pip install -r requirements.txt

# 開発サーバーの起動
uvicorn app.main:app --reload
```

### フロントエンド（Next.js）
```bash
# フロントエンドディレクトリに移動
cd famous_words_app

# 依存関係のインストール
npm install
# または
yarn

# 開発サーバーの起動
npm run dev
# または
yarn dev
```

## アクセス方法

- バックエンドAPI: http://localhost:8000
  - API ドキュメント: http://localhost:8000/docs
- フロントエンド: http://localhost:3000
