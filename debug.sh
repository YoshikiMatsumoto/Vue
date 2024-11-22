docker build -t dev .
# --rm: コンテナ停止時にDocker消す
# -it : コンソールに結果を出力
# -p  : ポートフォワード
# -v  : ディレクトリ共有
# --name: コンテナ名を指定　https://qiita.com/wMETAw/items/34ba5c980e2a38e548db
#npm install vue@2 vuetify@2

docker run -v /home/ec2-user/sibw-clientapp:/sibw-clientapp -it -p 8080:8080  --rm --name dev dev bash
docker run -v C:/Users/24045/OneDrive - KAGOME/00_仕事/01_work/kagome:/kagome -it -p 8080:8080  --rm --name dev dev bash