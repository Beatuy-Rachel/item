#!/bin/bash
set -e

GREEN='\033[0;32m'
YELLOW='\033[1;33m'
RED='\033[0;31m'
NC='\033[0m'

echo ""
echo "============================================"
echo "  Item Tracker 一键部署脚本"
echo "============================================"
echo ""

SCRIPT_DIR="$(cd "$(dirname "${BASH_SOURCE[0]}")" && pwd)"
cd "$SCRIPT_DIR"

check_docker() {
    if command -v docker &> /dev/null; then
        echo -e "${GREEN}[OK]${NC} Docker 已安装: $(docker --version)"
        return 0
    else
        echo -e "${YELLOW}[WARN]${NC} Docker 未安装"
        return 1
    fi
}

check_docker_compose() {
    if docker compose version &> /dev/null; then
        echo -e "${GREEN}[OK]${NC} Docker Compose 已安装: $(docker compose version --short)"
        return 0
    elif command -v docker-compose &> /dev/null; then
        echo -e "${GREEN}[OK]${NC} Docker Compose 已安装: $(docker-compose --version)"
        return 0
    else
        echo -e "${YELLOW}[WARN]${NC} Docker Compose 未安装"
        return 1
    fi
}

install_docker() {
    echo ""
    echo "开始安装 Docker..."
    echo ""

    if [ "$(id -u)" -ne 0 ]; then
        echo -e "${RED}[ERROR]${NC} 安装 Docker 需要 root 权限"
        echo "请使用 sudo 运行此脚本: sudo bash deploy.sh"
        exit 1
    fi

    apt-get update -y
    apt-get install -y ca-certificates curl gnupg lsb-release

    mkdir -p /etc/apt/keyrings
    curl -fsSL https://download.docker.com/linux/ubuntu/gpg | gpg --dearmor -o /etc/apt/keyrings/docker.gpg

    echo \
      "deb [arch=$(dpkg --print-architecture) signed-by=/etc/apt/keyrings/docker.gpg] https://download.docker.com/linux/ubuntu \
      $(lsb_release -cs) stable" | tee /etc/apt/sources.list.d/docker.list > /dev/null

    apt-get update -y
    apt-get install -y docker-ce docker-ce-cli containerd.io docker-compose-plugin

    systemctl enable docker
    systemctl start docker

    echo ""
    echo -e "${GREEN}[OK]${NC} Docker 安装完成"
}

check_env_file() {
    if [ ! -f .env ]; then
        echo ""
        echo -e "${YELLOW}[WARN]${NC} 未找到 .env 配置文件"
        echo "正在从 .env.example 创建..."
        cp .env.example .env
        echo ""
        echo -e "${YELLOW}请先编辑 .env 文件，修改相关配置后再运行此脚本${NC}"
        echo "  nano .env"
        exit 1
    fi
    echo -e "${GREEN}[OK]${NC} 配置文件已就绪"
}

login_ghcr() {
    echo ""
    echo "正在登录 GHCR 镜像仓库..."

    GHCR_USERNAME=$(grep '^GHCR_USERNAME=' .env | cut -d '=' -f2)
    GHCR_TOKEN=$(grep '^GHCR_TOKEN=' .env | cut -d '=' -f2)

    if [ -z "$GHCR_USERNAME" ] || [ -z "$GHCR_TOKEN" ] || [ "$GHCR_USERNAME" = "your-github-username" ]; then
        echo ""
        echo -e "${YELLOW}[WARN]${NC} 未配置 GHCR 登录信息"
        echo "请在 .env 文件中设置 GHCR_USERNAME 和 GHCR_TOKEN"
        echo ""
        echo "获取 GitHub Token: https://github.com/settings/tokens"
        echo "需要的权限: read:packages"
        exit 1
    fi

    echo "$GHCR_TOKEN" | docker login ghcr.io -u "$GHCR_USERNAME" --password-stdin
    echo -e "${GREEN}[OK]${NC} GHCR 登录成功"
}

pull_and_start() {
    echo ""
    echo "正在拉取最新镜像..."
    docker compose pull

    echo ""
    echo "正在启动服务..."
    docker compose up -d

    echo ""
    echo "等待服务启动..."
    sleep 5
}

show_status() {
    echo ""
    echo "============================================"
    echo "  部署完成！服务状态："
    echo "============================================"
    echo ""
    docker compose ps

    WEB_PORT=$(grep '^WEB_PORT=' .env | cut -d '=' -f2)
    WEB_PORT=${WEB_PORT:-8080}

    echo ""
    echo "============================================"
    echo -e "${GREEN}  访问地址: http://localhost:${WEB_PORT}${NC}"
    echo "============================================"
    echo ""
    echo "常用命令："
    echo "  查看日志:   docker compose logs -f"
    echo "  停止服务:   docker compose down"
    echo "  更新服务:   bash update.sh"
    echo ""
}

main() {
    check_env_file

    if ! check_docker || ! check_docker_compose; then
        install_docker
    fi

    login_ghcr
    pull_and_start
    show_status
}

main
