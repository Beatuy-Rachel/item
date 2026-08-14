#!/bin/bash
set -e

GREEN='\033[0;32m'
YELLOW='\033[1;33m'
RED='\033[0;31m'
BLUE='\033[0;34m'
NC='\033[0m'

echo ""
echo "============================================"
echo "  Item Tracker 一键更新脚本"
echo "============================================"
echo ""

SCRIPT_DIR="$(cd "$(dirname "${BASH_SOURCE[0]}")" && pwd)"
cd "$SCRIPT_DIR"

if [ ! -f .env ]; then
    echo -e "${RED}[ERROR]${NC} 未找到 .env 配置文件"
    echo "请先运行 deploy.sh 完成首次部署"
    exit 1
fi

if ! command -v docker &> /dev/null; then
    echo -e "${RED}[ERROR]${NC} Docker 未安装"
    echo "请先运行 deploy.sh 完成安装"
    exit 1
fi

echo -e "${BLUE}[INFO]${NC} 拉取最新镜像..."
docker compose pull

echo ""
echo -e "${BLUE}[INFO]${NC} 重新启动服务..."
docker compose up -d

echo ""
echo "等待服务就绪..."
sleep 5

echo ""
echo "============================================"
echo -e "${GREEN}  更新完成！${NC}"
echo "============================================"
echo ""
docker compose ps
echo ""
echo "查看日志: docker compose logs -f --tail=50"
echo ""
