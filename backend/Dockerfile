# ベースイメージ（Python公式Slim）
FROM python:3.12-slim

# 作業ディレクトリ設定
WORKDIR /app

# 依存ファイルのコピー
COPY requirements.txt .

# 必要ライブラリインストール
RUN pip install --no-cache-dir -r requirements.txt

# アプリケーションコードのコピー
COPY . .

# ポートを明示（FastAPIが使う）
EXPOSE 8000

# 起動コマンド
CMD ["uvicorn", "app.main:app", "--host", "0.0.0.0", "--port", "8000"]