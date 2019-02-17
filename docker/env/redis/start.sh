#!/bin/bash

#获取当前所在目录
path=$(cd `dirname $0`;pwd)

echo "建立redis容器"
docker run -itd --name redis -p 6379:6379 -v $path/data:/data -v $path/redis.conf:/etc/redis/redis.conf redis:3.2.10  redis-server /etc/redis/redis.conf
