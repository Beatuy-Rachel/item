# 好物记录 - 部署指南

## 方案一：Docker 部署（推荐）

使用 GitHub Actions 自动构建镜像，服务器通过 Docker Compose 一键部署。

### 1. 推送代码到 GitHub

将代码推送到 GitHub 仓库后，GitHub Actions 会自动构建前后端 Docker 镜像并推送到 GHCR (GitHub Container Registry)。

镜像地址：
- 前端：`ghcr.io/你的用户名/仓库名-frontend:latest`
- 后端：`ghcr.io/你的用户名/仓库名-backend:latest`

### 2. 服务器准备

服务器只需安装 Docker 和 Docker Compose：

```bash
# Ubuntu/Debian 安装 Docker
curl -fsSL https://get.docker.com | sh
sudo usermod -aG docker $USER

# 验证
docker -v
docker compose version
```

### 3. 部署

将项目根目录的 `docker-compose.yml` 和 `.env.compose.example` 上传到服务器：

```bash
# 创建项目目录
mkdir -p /opt/item-tracker
cd /opt/item-tracker

# 上传 docker-compose.yml 和 .env.compose.example 到该目录

# 复制环境变量文件并修改
cp .env.compose.example .env
nano .env
```

修改 `.env` 中的配置：

```env
WEB_PORT=8080                    # 网页访问端口
DB_ROOT_PASSWORD=复杂的数据库密码
DB_PASSWORD=和上面一样
JWT_SECRET=一串随机的长字符串
GITHUB_REPOSITORY=你的GitHub用户名/仓库名   # 例如 Beatuy-Rachel/item
```

启动服务：

```bash
# 登录 GHCR（如果是私有仓库需要登录，公开仓库可跳过）
docker login ghcr.io -u 你的GitHub用户名 -p 你的Personal Access Token

# 启动
docker compose up -d

# 查看状态
docker compose ps

# 查看日志
docker compose logs -f backend
docker compose logs -f frontend
```

### 4. 访问

打开浏览器访问 `http://服务器IP:8080`

### 5. 更新版本

```bash
cd /opt/item-tracker
docker compose pull
docker compose up -d
```

### 6. 常用命令

```bash
# 启动/停止/重启
docker compose up -d
docker compose stop
docker compose restart

# 查看日志
docker compose logs -f backend
docker compose logs -f mysql

# 进入容器
docker compose exec backend sh
docker compose exec mysql mysql -u root -p

# 数据备份
docker compose exec mysql mysqldump -u root -p item_tracker > backup_$(date +%Y%m%d).sql

# 数据恢复
docker compose exec -T mysql mysql -u root -p item_tracker < backup_20240101.sql
```

---

## 方案二：手动部署（Node.js + MySQL）

### 一、服务器要求

- 操作系统：推荐 Linux（Ubuntu 20.04+ / CentOS 7+）
- CPU：1 核及以上
- 内存：1GB 及以上
- 硬盘：20GB 及以上
- 带宽：1Mbps 及以上

### 二、软件环境准备

#### 1. 安装 Node.js

```bash
# Ubuntu/Debian
curl -fsSL https://deb.nodesource.com/setup_18.x | sudo -E bash -
sudo apt-get install -y nodejs

# 验证
node -v
npm -v
```

#### 2. 安装 MySQL

```bash
# Ubuntu/Debian
sudo apt-get update
sudo apt-get install -y mysql-server

# 启动 MySQL
sudo systemctl start mysql
sudo systemctl enable mysql

# 安全配置
sudo mysql_secure_installation
```

#### 3. 安装 PM2（进程守护）

```bash
npm install -g pm2
```

### 三、部署后端服务

#### 1. 上传代码

将 `server` 目录上传到服务器，例如 `/opt/item-tracker/server`

#### 2. 安装依赖

```bash
cd /opt/item-tracker/server
npm install --production
```

#### 3. 配置环境变量

```bash
cp .env.example .env
nano .env
```

修改以下配置：

```env
PORT=3001
DB_HOST=localhost
DB_PORT=3306
DB_USER=root
DB_PASSWORD=你的数据库密码
DB_NAME=item_tracker
JWT_SECRET=自定义的密钥字符串（随便写一串随机字符）
```

#### 4. 创建数据库

```bash
# 登录 MySQL
mysql -u root -p

# 创建数据库
CREATE DATABASE item_tracker CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci;
exit;
```

#### 5. 启动服务

```bash
# 使用 PM2 启动（会自动初始化数据库表）
pm2 start index.js --name item-tracker

# 设置开机自启
pm2 startup
pm2 save
```

#### 6. 验证服务

```bash
curl http://localhost:3001/api/health
```

### 四、部署前端

#### 1. 配置 API 地址

在项目根目录创建 `.env.production` 文件：

```env
VITE_API_BASE_URL=https://你的域名/api
```

#### 2. 构建前端

```bash
npm run build
```

#### 3. 部署静态文件

将 `dist` 目录上传到服务器，使用 Nginx 托管。

### 五、配置 Nginx（反向代理）

#### 安装 Nginx

```bash
sudo apt-get install -y nginx
```

#### 配置文件

创建 `/etc/nginx/sites-available/item-tracker`：

```nginx
server {
    listen 80;
    server_name 你的域名;

    # 前端静态文件
    location / {
        root /opt/item-tracker/dist;
        index index.html;
        try_files $uri $uri/ /index.html;
    }

    # 后端 API 代理
    location /api/ {
        proxy_pass http://localhost:3001/api/;
        proxy_set_header Host $host;
        proxy_set_header X-Real-IP $remote_addr;
        proxy_set_header X-Forwarded-For $proxy_add_x_forwarded_for;
    }
}
```

#### 启用配置

```bash
sudo ln -s /etc/nginx/sites-available/item-tracker /etc/nginx/sites-enabled/
sudo nginx -t
sudo systemctl reload nginx
```

### 六、配置 HTTPS（推荐）

使用 Let's Encrypt 免费证书：

```bash
sudo apt-get install -y certbot python3-certbot-nginx
sudo certbot --nginx -d 你的域名
```

### 七、常用命令

```bash
# 查看后端日志
pm2 logs item-tracker

# 重启后端
pm2 restart item-tracker

# 停止后端
pm2 stop item-tracker

# 查看 PM2 进程列表
pm2 list
```

### 八、数据备份

#### 备份 MySQL 数据库

```bash
mysqldump -u root -p item_tracker > backup_$(date +%Y%m%d).sql
```

#### 恢复数据库

```bash
mysql -u root -p item_tracker < backup_20240101.sql
```
