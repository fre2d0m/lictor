# 使用官方 Node.js 18 镜像作为基础镜像
FROM node:18 AS builder

ENV TZ="Asia/Shanghai"

# 设置工作目录
WORKDIR /app

# 创建目录
RUN mkdir -p packages

# 复制目录至docker
COPY . .

# 安装依赖
RUN yarn install

# 构建前端服务
RUN cd packages/app && yarn build

# 将构建好的前端静态文件移动到后端服务的 public 目录
RUN mv packages/app/dist/* packages/server/public/

RUN cd packages/server && yarn build

FROM node:18.16.0-alpine3.17

WORKDIR /app

COPY --from=builder /app/packages/server/dist ./dist
COPY --from=builder /app/packages/server/src ./src
COPY --from=builder /app/packages/server/public ./public
COPY --from=builder /app/packages/server/bootstrap.js ./
COPY --from=builder /app/packages/server/package.json ./
COPY --from=builder /app/yarn.lock ./

RUN apk add --no-cache tzdata

ENV TZ="Asia/Shanghai"

RUN yarn install --production


# 暴露服务所需端口
EXPOSE 7001

# 启动服务
CMD ["yarn", "serve"]