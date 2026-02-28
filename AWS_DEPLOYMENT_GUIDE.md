# AWS・Docker・Linux 運用ガイド（初心者向け）

このガイドでは、「小説の台詞集アプリ」をAWS上でDocker・Linuxを使って運用する方法を、IT初心者向けに詳しく解説します。

---

## 📚 目次

1. [このアプリの構成と設計思想](#このアプリの構成と設計思想)
2. [基礎知識：使う技術の説明](#基礎知識使う技術の説明)
3. [全体の流れ](#全体の流れ)
4. [事前準備](#事前準備)
5. [Step 1: Dockerファイルの作成](#step-1-dockerファイルの作成)
6. [Step 2: ローカルでDockerテスト](#step-2-ローカルでdockerテスト)
7. [Step 3: AWSアカウント作成とセットアップ](#step-3-awsアカウント作成とセットアップ)
8. [Step 4: データベース（Supabase）の準備](#step-4-データベースsupabaseの準備)
9. [Step 5: AWS EC2でLinuxサーバーを立てる](#step-5-aws-ec2でlinuxサーバーを立てる)
10. [Step 6: DockerイメージをAWSにデプロイ](#step-6-dockerイメージをawsにデプロイ)
11. [Step 7: 動作確認とトラブルシューティング](#step-7-動作確認とトラブルシューティング)

---

## このアプリの構成と設計思想

### 📱 アプリケーション概要

**名前**: Famous Guy Words（小説の台詞集）

**目的**: 文学作品や小説から印象的な台詞を集め、カテゴリー別に検索・閲覧できるWebアプリケーション

**データ**: 129件の台詞（恋愛、自由、人生、未来、過去、哲学の6カテゴリー）

### 🏗️ アーキテクチャ構成

```
┌─────────────────────────────────────────────────────────┐
│                  ユーザー（ブラウザ）                    │
└────────────────┬────────────────────────────────────────┘
                 │ http://EC2-IP:3000
                 ▼
┌─────────────────────────────────────────────────────────┐
│         フロントエンド（Next.js）                        │
│  - ポート: 3000                                          │
│  - 技術: React, TypeScript, Mantine UI                  │
│  - 役割: ユーザーインターフェース                        │
└────────────────┬────────────────────────────────────────┘
                 │ HTTP API呼び出し
                 │ GET /api/words?category=love
                 ▼
┌─────────────────────────────────────────────────────────┐
│         バックエンド（FastAPI）                          │
│  - ポート: 8000                                          │
│  - 技術: Python, FastAPI, psycopg2                      │
│  - 役割: ビジネスロジック、API提供                       │
└────────────────┬────────────────────────────────────────┘
                 │ SQL クエリ
                 │ SELECT * FROM words WHERE category='love'
                 ▼
┌─────────────────────────────────────────────────────────┐
│         データベース（Supabase PostgreSQL）              │
│  - ポート: 5432                                          │
│  - 技術: PostgreSQL                                      │
│  - 役割: データ永続化                                    │
└─────────────────────────────────────────────────────────┘
```

### 🎯 なぜこの構成にしたのか？

#### 1. **フロントエンドとバックエンドの分離**

**理由**:
- **独立した開発**: フロントエンドとバックエンドを別々に開発・更新できる
- **スケーラビリティ**: 負荷に応じて、それぞれを独立してスケールできる
- **技術選択の自由**: 最適な技術を各層で選べる（React + Python）
- **再利用性**: 同じAPIを、Webアプリ、モバイルアプリ、他のサービスから利用できる

**例え話**: レストランで、キッチン（バックエンド）とホール（フロントエンド）を分けるようなもの。それぞれが専門の仕事に集中できる。

#### 2. **Next.js（React）をフロントエンドに選んだ理由**

**理由**:
- **モダンなUI**: Reactで動的で美しいUIを構築
- **SEO対応**: サーバーサイドレンダリング（SSR）でSEOに強い
- **開発効率**: コンポーネントベースで再利用しやすい
- **エコシステム**: 豊富なライブラリ（Mantine UIなど）

**なぜReactか**: 世界で最も使われているフロントエンドフレームワーク。求人も多く、学習価値が高い。

#### 3. **FastAPI（Python）をバックエンドに選んだ理由**

**理由**:
- **高速**: 非同期処理で高パフォーマンス
- **型安全**: Pythonの型ヒントで安全なコード
- **自動ドキュメント**: Swagger UIが自動生成される（http://localhost:8000/docs）
- **学習しやすい**: Pythonは初心者に優しい言語
- **データ処理**: Pythonはデータ分析・機械学習に強い（将来の拡張性）

**なぜFastAPIか**: Django（重い）やFlask（機能不足）の中間。モダンで軽量、かつ機能豊富。

#### 4. **Supabase（PostgreSQL）をデータベースに選んだ理由**

**理由**:
- **無料枠が充実**: 個人プロジェクトに最適
- **PostgreSQL**: 信頼性の高いオープンソースDB
- **管理が簡単**: GUIでテーブル作成、データ確認が可能
- **リアルタイム機能**: 将来的にリアルタイム更新も可能
- **認証機能**: ユーザー認証も簡単に追加できる

**なぜSupabaseか**: AWS RDSは設定が複雑で有料。Supabaseは「Firebase（Googleのサービス）のPostgreSQL版」で使いやすい。

#### 5. **Dockerを使う理由**

**理由**:
- **環境の統一**: 「私のPCでは動くのに...」問題を解決
- **簡単デプロイ**: イメージをビルドすれば、どこでも同じように動く
- **依存関係の管理**: Python、Node.js、ライブラリを全部まとめて管理
- **マイクロサービス**: フロントエンドとバックエンドを別コンテナで管理

**例え話**: 引っ越しの時、家具をバラバラに運ぶより、コンテナに入れて運ぶ方が楽。

#### 6. **AWS EC2を使う理由**

**理由**:
- **自由度が高い**: サーバーを自由にカスタマイズできる
- **学習価値**: EC2の知識は転職・就職に有利
- **無料枠**: t2.microは12ヶ月無料
- **スケーラブル**: 将来的にインスタンスサイズを変更できる

**他の選択肢との比較**:
- **Vercel/Netlify**: フロントエンドのみ。バックエンドは別途必要
- **Heroku**: 簡単だが有料化、制限が多い
- **AWS Lambda**: サーバーレスだが、今回は学習目的でEC2を選択

### 📊 データフロー（具体例）

**ユーザーが「恋愛」カテゴリーを選択した場合**:

```
1. ユーザー: 「恋愛」を選択
   ↓
2. フロントエンド（Next.js）:
   fetch('http://backend:8000/api/words?category=love')
   ↓
3. バックエンド（FastAPI）:
   - リクエスト受信
   - SQLクエリ実行: SELECT * FROM words WHERE category='love'
   ↓
4. データベース（Supabase）:
   - クエリ実行
   - 結果を返す: [{id: 1, quote: "...", ...}, ...]
   ↓
5. バックエンド（FastAPI）:
   - JSON形式でレスポンス
   ↓
6. フロントエンド（Next.js）:
   - データを受け取り、カード形式で表示
   - 背景画像を「恋愛」用に変更
   ↓
7. ユーザー: 台詞一覧を閲覧
```

### 🔒 セキュリティ設計

1. **環境変数**: データベース接続情報を`.env`ファイルで管理（GitHubにコミットしない）
2. **CORS設定**: フロントエンドからのみAPIアクセスを許可
3. **IAMユーザー**: AWSルートアカウントを直接使わない
4. **セキュリティグループ**: 必要なポートのみ開放
5. **SSH鍵認証**: パスワード認証ではなく、鍵ファイルで認証

### 📈 将来の拡張性

この構成なら、以下の機能を簡単に追加できます:

1. **ユーザー認証**: Supabase Authで簡単に実装
2. **お気に入り機能**: データベースに`favorites`テーブルを追加
3. **検索機能**: PostgreSQLの全文検索を利用
4. **管理画面**: 台詞の追加・編集・削除機能
5. **API公開**: 他の開発者にAPIを提供
6. **モバイルアプリ**: React Nativeで同じAPIを利用
7. **AI機能**: Pythonで感情分析や推薦機能を追加

### 💡 設計のポイント

| 項目 | 選択 | 理由 |
|------|------|------|
| フロントエンド | Next.js | モダン、SEO対応、学習価値高 |
| バックエンド | FastAPI | 高速、型安全、自動ドキュメント |
| データベース | Supabase | 無料、簡単、PostgreSQL |
| インフラ | AWS EC2 | 自由度高、学習価値高、無料枠 |
| コンテナ | Docker | 環境統一、簡単デプロイ |
| OS | Linux | 軽量、安定、サーバー標準 |

---

## 基礎知識：使う技術の説明

### 🐳 Docker（ドッカー）とは？
**例え話**: お弁当箱のようなもの

- アプリケーションとその動作に必要なもの（Python、Node.js、ライブラリなど）を全部まとめて「箱」に入れる技術
- この「箱」を他のコンピュータに持っていけば、どこでも同じように動く
- **メリット**: 「私のパソコンでは動くのに...」問題を解決

**用語**:
- **Dockerイメージ**: お弁当箱の設計図
- **Dockerコンテナ**: 実際に動いているお弁当箱
- **Dockerfile**: 設計図の作り方を書いたレシピ

### ☁️ AWS（Amazon Web Services）とは？
**例え話**: インターネット上のレンタルコンピュータ

- Amazonが提供するクラウドサービス
- 自分のパソコンではなく、インターネット上のコンピュータを借りてアプリを動かす
- **メリット**: 24時間365日動き続ける、世界中からアクセスできる

**主に使うサービス**:
- **EC2**: 仮想コンピュータ（サーバー）をレンタル
- **ECR**: Dockerイメージを保管する倉庫
- **RDS**: データベース（今回はSupabaseを使うので不要）

### 🐧 Linux（リナックス）とは？
**例え話**: コンピュータのOS（WindowsやMacの仲間）

- サーバーでよく使われる無料のOS
- コマンド（文字）で操作する
- **メリット**: 軽量で安定、サーバー運用に最適

---

## 全体の流れ

```
┌─────────────────────────────────────────────────────────┐
│ 1. ローカル開発環境（あなたのPC）                        │
│    - アプリケーションを作成                              │
│    - Dockerファイルを作成                                │
│    - ローカルでDockerテスト                              │
└────────────────┬────────────────────────────────────────┘
                 │
                 ▼
┌─────────────────────────────────────────────────────────┐
│ 2. Docker Hub または AWS ECR                            │
│    - Dockerイメージをアップロード（保管）                │
└────────────────┬────────────────────────────────────────┘
                 │
                 ▼
┌─────────────────────────────────────────────────────────┐
│ 3. AWS EC2（Linuxサーバー）                             │
│    - Dockerイメージをダウンロード                        │
│    - コンテナを起動                                      │
│    - インターネットに公開                                │
└─────────────────────────────────────────────────────────┘
                 │
                 ▼
┌─────────────────────────────────────────────────────────┐
│ 4. ユーザー                                              │
│    - ブラウザでアクセス                                  │
│    - アプリを使用                                        │
└─────────────────────────────────────────────────────────┘
```

---

## 事前準備

### 必要なもの

1. **Dockerのインストール**
   - Windows: [Docker Desktop for Windows](https://www.docker.com/products/docker-desktop)
   - インストール後、Dockerが起動していることを確認

2. **AWSアカウント**
   - [AWS公式サイト](https://aws.amazon.com/jp/)でアカウント作成
   - クレジットカードが必要（無料枠あり）

3. **テキストエディタ**
   - VS Code推奨（既にインストール済みと仮定）

4. **基本的なコマンド操作の知識**
   - コマンドプロンプト（Windows）またはターミナルの使い方

---

## Step 1: Dockerファイルの作成

### 1-1. バックエンド用Dockerファイル

**何をしているか**: FastAPIアプリをDockerで動かすための設計図を作る

`backend/Dockerfile`を作成（既に存在する場合は確認）:

```dockerfile
# ベースイメージ: Python 3.12を使う
FROM python:3.12-slim

# 作業ディレクトリを設定
WORKDIR /app

# 依存関係ファイルをコピー
COPY requirements.txt .

# Pythonライブラリをインストール
RUN pip install --no-cache-dir -r requirements.txt

# アプリケーションコードをコピー
COPY . .

# ポート8000を公開
EXPOSE 8000

# アプリケーション起動コマンド
CMD ["uvicorn", "app.main:app", "--host", "0.0.0.0", "--port", "8000"]
```

**解説**:
- `FROM`: ベースとなるイメージ（Python 3.12）
- `WORKDIR`: コンテナ内の作業フォルダ
- `COPY`: ファイルをコンテナにコピー
- `RUN`: コマンドを実行（ライブラリインストール）
- `EXPOSE`: 外部からアクセスできるポート番号
- `CMD`: コンテナ起動時に実行するコマンド

### 1-2. フロントエンド用Dockerファイル

**何をしているか**: Next.jsアプリをDockerで動かすための設計図を作る

`famous_words_app/Dockerfile`を作成:

```dockerfile
# ベースイメージ: Node.js 18を使う
FROM node:18-alpine

# 作業ディレクトリを設定
WORKDIR /app

# package.jsonをコピー
COPY package*.json ./

# 依存関係をインストール
RUN npm install

# アプリケーションコードをコピー
COPY . .

# Next.jsをビルド
RUN npm run build

# ポート3000を公開
EXPOSE 3000

# アプリケーション起動コマンド
CMD ["npm", "start"]
```

### 1-3. Docker Composeファイル（ローカルテスト用）

**何をしているか**: バックエンドとフロントエンドを一緒に起動する設定

プロジェクトルートに`docker-compose.yml`を作成:

```yaml
version: '3.8'

services:
  # バックエンド
  backend:
    build: ./backend
    ports:
      - "8000:8000"
    environment:
      - SUPABASE_DB_URL=${SUPABASE_DB_URL}
    restart: always

  # フロントエンド
  frontend:
    build: ./famous_words_app
    ports:
      - "3000:3000"
    environment:
      - NEXT_PUBLIC_API_URL=http://backend:8000
    depends_on:
      - backend
    restart: always
```

**解説**:
- `services`: 起動するコンテナの定義
- `build`: Dockerfileの場所
- `ports`: ポートマッピング（ホスト:コンテナ）
- `environment`: 環境変数
- `depends_on`: 依存関係（フロントエンドはバックエンドの後に起動）

---

## Step 2: ローカルでDockerテスト

### 2-1. 環境変数ファイルの作成

プロジェクトルートに`.env`ファイルを作成:

```env
SUPABASE_DB_URL=postgresql://your_supabase_url_here
```

### 2-2. Dockerイメージのビルド

```bash
# プロジェクトルートで実行
docker-compose build
```

**何が起こるか**: Dockerfileを読み込んで、イメージ（設計図）を作成

### 2-3. コンテナの起動

```bash
docker-compose up
```

**何が起こるか**: 
- バックエンドが http://localhost:8000 で起動
- フロントエンドが http://localhost:3000 で起動

### 2-4. 動作確認

ブラウザで http://localhost:3000 にアクセスして、アプリが動くか確認

### 2-5. コンテナの停止

```bash
# Ctrl + C で停止
# または別のターミナルで
docker-compose down
```

---

## Step 3: AWSアカウント作成とセットアップ

### 3-1. AWSアカウント作成

1. [AWS公式サイト](https://aws.amazon.com/jp/)にアクセス
2. 「無料でサインアップ」をクリック
3. メールアドレス、パスワード、クレジットカード情報を入力
4. 電話番号認証を完了

### 3-2. IAMユーザーの作成（セキュリティ対策）

**何をしているか**: ルートアカウント（最高権限）を直接使わず、制限付きユーザーを作る

1. AWSマネジメントコンソールにログイン
2. 「IAM」サービスを検索
3. 左メニュー「ユーザー」→「ユーザーを追加」
4. ユーザー名: `deploy-user`
5. アクセス権限: 
   - `AmazonEC2FullAccess`
   - `AmazonEC2ContainerRegistryFullAccess`
6. アクセスキーを作成してダウンロード（後で使う）

### 3-3. AWS CLIのインストール

**何をしているか**: コマンドラインからAWSを操作できるツールをインストール

1. [AWS CLI公式ページ](https://aws.amazon.com/jp/cli/)からダウンロード
2. インストール後、コマンドプロンプトで確認:

```bash
aws --version
```

3. AWS CLIの設定:

```bash
aws configure
```

入力内容:
- AWS Access Key ID: （IAMユーザーのアクセスキー）
- AWS Secret Access Key: （IAMユーザーのシークレットキー）
- Default region name: `ap-northeast-1`（東京リージョン）
- Default output format: `json`

---

## Step 4: データベース（Supabase）の準備

### 4-1. Supabaseプロジェクト作成

1. [Supabase](https://supabase.com/)にアクセス
2. 「Start your project」をクリック
3. プロジェクト名: `famous-guy-words`
4. データベースパスワードを設定（メモしておく）
5. リージョン: `Northeast Asia (Tokyo)`

### 4-2. データベース接続情報の取得

1. Supabaseダッシュボード → 「Settings」→「Database」
2. 「Connection string」の「URI」をコピー
3. パスワード部分を実際のパスワードに置き換え

例:
```
postgresql://postgres:[YOUR-PASSWORD]@db.xxxxx.supabase.co:5432/postgres
```

### 4-3. テーブル作成

Supabase SQL Editorで実行:

```sql
CREATE TABLE words (
  id SERIAL PRIMARY KEY,
  source TEXT NOT NULL,
  writer TEXT NOT NULL,
  quote TEXT NOT NULL,
  category TEXT NOT NULL
);
```

### 4-4. データ投入

`backend/data/words.json`のデータをSupabaseにインポート、または`backend/db/insert_seed.py`を実行

---

## Step 5: AWS EC2でLinuxサーバーを立てる

### 5-1. EC2インスタンスの作成

**何をしているか**: AWS上に仮想Linuxサーバーを作る

1. AWSマネジメントコンソール → 「EC2」を検索
2. 「インスタンスを起動」をクリック
3. 設定:
   - **名前**: `famous-words-server`
   - **AMI（OS）**: `Amazon Linux 2023`（無料枠対象）
   - **インスタンスタイプ**: `t2.micro`（無料枠対象）
   - **キーペア**: 新規作成 → `famous-words-key.pem`をダウンロード（大切に保管）
   - **ネットワーク設定**:
     - SSH（ポート22）: 自分のIPアドレスのみ許可
     - HTTP（ポート80）: すべて許可
     - カスタムTCP（ポート8000）: すべて許可
     - カスタムTCP（ポート3000）: すべて許可
   - **ストレージ**: 8GB（デフォルト）

4. 「インスタンスを起動」をクリック

### 5-2. EC2インスタンスに接続

**何をしているか**: 作成したLinuxサーバーにSSH接続する

#### Windows（PowerShell）の場合:

```powershell
# キーファイルの権限設定
icacls "famous-words-key.pem" /inheritance:r
icacls "famous-words-key.pem" /grant:r "%username%:R"

# SSH接続
ssh -i "famous-words-key.pem" ec2-user@<EC2のパブリックIPアドレス>
```

#### Mac/Linuxの場合:

```bash
# キーファイルの権限設定
chmod 400 famous-words-key.pem

# SSH接続
ssh -i "famous-words-key.pem" ec2-user@<EC2のパブリックIPアドレス>
```

**EC2のパブリックIPアドレスの確認方法**:
- EC2ダッシュボード → インスタンス一覧 → 「パブリック IPv4 アドレス」をコピー

### 5-3. EC2にDockerをインストール

**何をしているか**: LinuxサーバーにDockerをインストールする

SSH接続後、以下のコマンドを実行:

```bash
# システムアップデート
sudo yum update -y

# Dockerインストール
sudo yum install docker -y

# Docker起動
sudo systemctl start docker

# Docker自動起動設定
sudo systemctl enable docker

# 現在のユーザーをdockerグループに追加
sudo usermod -a -G docker ec2-user

# 一度ログアウトして再ログイン
exit
```

再度SSH接続して、Dockerが動くか確認:

```bash
docker --version
```

### 5-4. Docker Composeのインストール

```bash
# Docker Composeダウンロード
sudo curl -L "https://github.com/docker/compose/releases/latest/download/docker-compose-$(uname -s)-$(uname -m)" -o /usr/local/bin/docker-compose

# 実行権限付与
sudo chmod +x /usr/local/bin/docker-compose

# 確認
docker-compose --version
```

---

## Step 6: DockerイメージをAWSにデプロイ

### 方法A: Docker Hubを使う（簡単）

#### 6-1. Docker Hubアカウント作成

1. [Docker Hub](https://hub.docker.com/)でアカウント作成
2. ユーザー名をメモ

#### 6-2. ローカルでイメージをビルド＆プッシュ

```bash
# Docker Hubにログイン
docker login

# バックエンドイメージをビルド
cd backend
docker build -t <your-dockerhub-username>/famous-words-backend:latest .

# フロントエンドイメージをビルド
cd ../famous_words_app
docker build -t <your-dockerhub-username>/famous-words-frontend:latest .

# Docker Hubにプッシュ
docker push <your-dockerhub-username>/famous-words-backend:latest
docker push <your-dockerhub-username>/famous-words-frontend:latest
```

#### 6-3. EC2でイメージをプル＆起動

EC2にSSH接続して:

```bash
# 作業ディレクトリ作成
mkdir ~/famous-words
cd ~/famous-words

# docker-compose.ymlを作成
nano docker-compose.yml
```

以下の内容を貼り付け:

```yaml
version: '3.8'

services:
  backend:
    image: <your-dockerhub-username>/famous-words-backend:latest
    ports:
      - "8000:8000"
    environment:
      - SUPABASE_DB_URL=postgresql://your_supabase_url
    restart: always

  frontend:
    image: <your-dockerhub-username>/famous-words-frontend:latest
    ports:
      - "3000:3000"
    environment:
      - NEXT_PUBLIC_API_URL=http://<EC2のパブリックIP>:8000
    depends_on:
      - backend
    restart: always
```

保存して終了（Ctrl + X → Y → Enter）

起動:

```bash
docker-compose up -d
```

**`-d`オプション**: バックグラウンドで実行

### 方法B: AWS ECRを使う（本格的）

#### 6-1. ECRリポジトリ作成

```bash
# バックエンド用リポジトリ
aws ecr create-repository --repository-name famous-words-backend --region ap-northeast-1

# フロントエンド用リポジトリ
aws ecr create-repository --repository-name famous-words-frontend --region ap-northeast-1
```

#### 6-2. ECRにログイン

```bash
aws ecr get-login-password --region ap-northeast-1 | docker login --username AWS --password-stdin <your-aws-account-id>.dkr.ecr.ap-northeast-1.amazonaws.com
```

#### 6-3. イメージをプッシュ

```bash
# バックエンド
docker tag famous-words-backend:latest <your-aws-account-id>.dkr.ecr.ap-northeast-1.amazonaws.com/famous-words-backend:latest
docker push <your-aws-account-id>.dkr.ecr.ap-northeast-1.amazonaws.com/famous-words-backend:latest

# フロントエンド
docker tag famous-words-frontend:latest <your-aws-account-id>.dkr.ecr.ap-northeast-1.amazonaws.com/famous-words-frontend:latest
docker push <your-aws-account-id>.dkr.ecr.ap-northeast-1.amazonaws.com/famous-words-frontend:latest
```

---

## Step 7: 動作確認とトラブルシューティング

### 7-1. 動作確認

1. ブラウザで `http://<EC2のパブリックIP>:3000` にアクセス
2. アプリが表示されればデプロイ成功！

### 7-2. ログ確認

```bash
# コンテナのログを確認
docker-compose logs -f

# 特定のサービスのログ
docker-compose logs -f backend
docker-compose logs -f frontend
```

### 7-3. よくあるエラーと対処法

#### エラー1: 「接続できません」

**原因**: セキュリティグループの設定ミス

**対処法**:
1. EC2ダッシュボード → セキュリティグループ
2. ポート3000, 8000が開いているか確認
3. 開いていなければ、インバウンドルールを追加

#### エラー2: 「データベース接続エラー」

**原因**: SUPABASE_DB_URLが間違っている

**対処法**:
1. `docker-compose.yml`の環境変数を確認
2. Supabaseの接続文字列をコピペし直す
3. コンテナを再起動: `docker-compose restart`

#### エラー3: 「コンテナが起動しない」

**原因**: メモリ不足、ポート競合

**対処法**:
```bash
# コンテナの状態確認
docker ps -a

# 停止中のコンテナを削除
docker-compose down

# 再起動
docker-compose up -d
```

### 7-4. コンテナの管理コマンド

```bash
# コンテナ起動
docker-compose up -d

# コンテナ停止
docker-compose stop

# コンテナ削除
docker-compose down

# コンテナ再起動
docker-compose restart

# コンテナの状態確認
docker-compose ps

# ログ確認
docker-compose logs -f
```

---

## 🎉 完成！

これで、あなたのアプリがAWS上でDocker・Linuxを使って動いています！

### 次のステップ

1. **独自ドメインの設定**: Route 53でドメインを取得
2. **HTTPS化**: Let's Encryptで無料SSL証明書を取得
3. **ロードバランサー**: ALBで負荷分散
4. **自動デプロイ**: GitHub ActionsでCI/CD構築
5. **監視**: CloudWatchでログ監視

---

## 📝 用語集

| 用語 | 説明 |
|------|------|
| Docker | アプリを「箱」に入れて持ち運べる技術 |
| コンテナ | Dockerで動いているアプリの実体 |
| イメージ | コンテナの設計図 |
| AWS | Amazonのクラウドサービス |
| EC2 | AWS上の仮想サーバー |
| Linux | サーバー用OS |
| SSH | リモートサーバーに接続する方法 |
| ポート | アプリの出入り口（番号で管理） |
| 環境変数 | アプリの設定情報 |

---

## 💰 料金について

### 無料枠（12ヶ月間）
- EC2 t2.micro: 月750時間まで無料
- データ転送: 月15GBまで無料

### 有料になる場合
- EC2を24時間起動: 約$10/月
- データ転送超過: 約$0.09/GB

### 節約のコツ
- 使わない時はEC2を停止
- 不要なリソースは削除
- 無料枠の範囲内で運用

---

## 🆘 困ったときは

1. **AWSドキュメント**: https://docs.aws.amazon.com/ja_jp/
2. **Docker公式ドキュメント**: https://docs.docker.com/
3. **Stack Overflow**: エラーメッセージで検索
4. **AWS無料サポート**: AWSマネジメントコンソールから問い合わせ

---

**作成日**: 2024年
**対象**: IT初心者
**前提知識**: 基本的なコマンド操作
