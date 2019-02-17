#/bin/bash

echo "删除redis容器"
docker stop redis
docker rm redis
