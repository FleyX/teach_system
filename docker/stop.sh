#!/bin/bash

path=$(cd `dirname $0`;pwd)
/bin/bash $path/env/mysql/stop.sh

/bin/bash $path/env/redis/stop.sh

echo "删除front容器"
docker stop front
docker rm front
echo "删除teach-system容器"
docker stop teach-system
docker rm teach-system
echo "删除login-system容器"
docker stop login-system
docker rm login-system
