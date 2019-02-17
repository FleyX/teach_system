#!/bin/bash
#获取当前脚本所在目录
path=$(cd `dirname $0`;pwd)

echo "Asia/Shanghai" >$path/timezone

/bin/bash $path/stop.sh >/dev/null 2>&1

/bin/bash $path/env/mysql/start.sh

/bin/bash $path/env/redis/start.sh

echo "teach-system容器建立"
docker run -itd --name=teach-system -v $path/../teachSystem:/opt/workspace --link redis --link mysql registry.cn-hangzhou.aliyuncs.com/fleyx/node:v1 /bin/bash /opt/start.sh

echo "login-system容器建立"
docker run -itd --name=login-system -v $path/../loginSystem:/opt/workspace --link redis --link mysql registry.cn-hangzhou.aliyuncs.com/fleyx/node:v1 /bin/bash /opt/start.sh

echo "前端容器建立"
docker run -itd --name=front -p 80:8080 --link login-system --link teach-system -v $path/../client/dist:/opt/dist -v $path/front/log:/var/log/nginx -v $path/front/nginx.conf:/etc/nginx/nginx.conf nginx:latest
