#!/bin/bash

echo "删除mysql容器"
docker stop mysql
docker rm mysql
