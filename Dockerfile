# node.jsのベースイメージを利用する
# nodeのイメージに対してプロジェクト名を決める
FROM node:14.17.1
# プロジェクト名をワークディレクトリに設定（設定簡易化のため）
WORKDIR /kagome
# COPY ./app /app

# proxy設定
# RUN npm -g config set proxy http://10.76.0.41:8080
# RUN npm -g config set https-proxy http://10.76.0.41:8080
# ENV http_proxy http://10.76.0.41:8080
# ENV https_proxy http://10.76.0.41:8080

## VueのCLIをダウンロード（yarnだとバグがaws側のパッケージあるので、npmを利用）
RUN npm install -g @vue/cli
# aws amplifyのCLIをダウンロード（aws amplifyのcliをインストールする）
# RUN npm install -g @aws-amplify/cli

# パッケージファイルをコピー
COPY package*.json ./

# アプリケーションのソースコードをコピー
COPY . .

# 開発サーバーを起動するためのポートを公開
EXPOSE 8080

# デフォルトのコマンドを設定
CMD ["npm", "run", "serve"]

# RUN apt -y update
# RUN apt -y upgrade
# RUN apt -y install python3-pip

# RUN curl "https://awscli.amazonaws.com/awscli-exe-linux-x86_64.zip" -o "awscliv2.zip"
# RUN unzip awscliv2.zip
# RUN ./aws/install

# AWS CLIのインストール
# RUN pip3 install https://github.com/boto/botocore/archive/v2.tar.gz
# RUN pip3 install https://github.com/aws/aws-cli/archive/v2.tar.gz
# RUN pip3 install git-remote-codecommit


# 特区環境で実行する際はコメントアウトする
# RUN npm -g config set proxy http://10.76.0.41:8080
# RUN npm -g config set https-proxy http://10.76.0.41:8080
