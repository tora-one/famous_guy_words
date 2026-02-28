# Famous Guy Words

小説の台詞集アプリケーション - バックエンド（FastAPI）とフロントエンド（Next.js）の構成

文学作品や小説から印象的な台詞を集めたWebアプリケーションで、カテゴリー別に名言を検索・閲覧できます。

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

## クイックスタート（起動方法）

### 1. バックエンドの起動

```bash
# プロジェクトルートから
cd backend
venv\Scripts\activate
# backendディレクトリにいることを確認してから実行
uvicorn app.main:app --reload
```

起動後、http://localhost:8000 でバックエンドが動作します。

**注意**: `venv\Scripts`ディレクトリではなく、`backend`ディレクトリから実行してください。

### 2. フロントエンドの起動

**別のターミナルを開いて:**

```bash
# プロジェクトルートから
cd famous_words_app
npm run dev
```

起動後、http://localhost:3000 でアプリケーションにアクセスできます。

---

## 初回セットアップ（初めての場合のみ）

### バックエンド（FastAPI）
最後はDockerで実装しました。→AWSがuvicorn無理らしい
```bash
cd backend

# 仮想環境の作成
python -m venv venv

# 仮想環境の有効化（Windows）
venv\Scripts\activate

# 依存関係のインストール
pip install -r requirements.txt

# .envファイルにSupabaseのDB URLを設定
# SUPABASE_DB_URL=postgresql://...
```

### フロントエンド（Next.js）
```bash
cd famous_words_app

# 依存関係のインストール
npm install

# .env.localファイルにバックエンドURLを設定（オプション）
# NEXT_PUBLIC_API_URL=http://localhost:8000
```

## アクセス方法

- バックエンドAPI: http://localhost:8000
  - API ドキュメント: http://localhost:8000/docs
- フロントエンド: http://localhost:3000

## システム構成図

```
┌─────────────────────────────────────────────────────────┐
│                    ユーザー                              │
│                  (Webブラウザ)                           │
└────────────────┬────────────────────────────────────────┘
                 │
                 │ http://localhost:3000
                 ▼
┌─────────────────────────────────────────────────────────┐
│           フロントエンド (Next.js)                       │
│  ┌─────────────────────────────────────────────┐       │
│  │  トップページ (page.tsx)                     │       │
│  │  - 背景画像付きランディングページ            │       │
│  │  - 「台詞を見てみる」ボタン                  │       │
│  └─────────────────────────────────────────────┘       │
│                      │                                   │
│                      ▼                                   │
│  ┌─────────────────────────────────────────────┐       │
│  │  検索ページ (search/page.tsx)                │       │
│  │  - カテゴリー選択 (全て/恋愛/自由/人生/未来) │       │
│  │  - 台詞カード一覧表示                        │       │
│  │  - カテゴリー別背景画像                      │       │
│  └─────────────────────────────────────────────┘       │
│                      │                                   │
│                      │ API呼び出し (words.ts)            │
└──────────────────────┼───────────────────────────────────┘
                       │
                       │ HTTP GET /api/words?category=xxx
                       ▼
┌─────────────────────────────────────────────────────────┐
│           バックエンド (FastAPI)                         │
│  ┌─────────────────────────────────────────────┐       │
│  │  main.py - FastAPIアプリケーション           │       │
│  └─────────────────────────────────────────────┘       │
│                      │                                   │
│                      ▼                                   │
│  ┌─────────────────────────────────────────────┐       │
│  │  api/words.py                                │       │
│  │  - GET /api/words エンドポイント             │       │
│  │  - カテゴリーフィルタリング                  │       │
│  └─────────────────────────────────────────────┘       │
│                      │                                   │
│                      │ SQL クエリ (psycopg2)             │
│                      ▼                                   │
│  ┌─────────────────────────────────────────────┐       │
│  │  PostgreSQL (Supabase)                       │       │
│  │  - words テーブル (129件の台詞データ)        │       │
│  └─────────────────────────────────────────────┘       │
└─────────────────────────────────────────────────────────┘
```

## データフロー

1. **ユーザーアクション**: トップページで「台詞を見てみる」をクリック
2. **検索ページ表示**: カテゴリー選択UI表示（デフォルト: 全て）
3. **API呼び出し**: `fetch('http://localhost:8000/api/words?category=love')`
4. **バックエンド処理**: FastAPIがリクエストを受信し、PostgreSQLへクエリ実行
5. **データ取得**: `SELECT id, source, writer, quote, category FROM words WHERE category = 'love'`
6. **レスポンス**: JSON形式で台詞データを返却
7. **画面表示**: カード形式で台詞を一覧表示、カテゴリー別背景画像を適用

## 技術スタック

### フロントエンド
- Next.js (React フレームワーク)
- Mantine UI (UIコンポーネント)
- TypeScript

### バックエンド
- FastAPI (Python Webフレームワーク)
- psycopg2 (PostgreSQL接続)
- Uvicorn (ASGIサーバー)

### データベース
- Supabase (PostgreSQL)
- 129件の台詞データ

## カテゴリー

- **love** (恋愛)
- **freedom** (自由)
- **life** (人生)
- **future** (未来)
- **past** (過去)
- **philosophy** (哲学)
