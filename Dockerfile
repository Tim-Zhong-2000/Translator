# ------------------------------------------------------------------------------
# 第一阶段：构建应用
FROM node:14 as build
WORKDIR /build

# 安装依赖作为缓存
COPY package*.json /build/
RUN npm install --registry https://registry.npm.taobao.org

# 构建应用
COPY . /build
RUN npm run-script build

# ------------------------------------------------------------------------------
# 第二阶段：创建最后可运行的容器
FROM node:14-alpine
WORKDIR /build

# 复制构建好的文件
COPY --from=build /build/node_modules /build/node_modules
COPY --from=build /build/dist /build/dist
COPY ./config.json /etc/tim-translator/

EXPOSE 3000

ENTRYPOINT ["node", "dist/server.js"]