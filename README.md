# Tim-Translator
提供REST API接口的翻译服务器，中转多个上游翻译服务，方便程序开发
## BasicUsage / 基础用法
1. clone the repositories / 克隆此仓库
2. run `npm install` / 运行`npm install`
3. if you use linux edit the `config.json` and copy it to `/etc/translator/config.json` / 如果你使用的是linux环境，编辑`config.json`并且复制到`/etc/translator/config.json`
4. run `npm start` / 运行`npm start`
5. you can access the default service through `http://localhost:3000/:service/:srcLang/:destLang/:src`(Using an interactive front end, you don't need to memorize these parameters) / 你可以访问`http://localhost:3000/:service/:srcLang/:destLang/:src`获取翻译。（使用交互式前端，不需要记忆这些参数）
6. Fill in the front-end `translation server` with `http://localhost:3000`and save / 在前端`翻译服务器`处填入`http://localhost:3000`并保存。

## Docker(推荐)
推荐使用docker运行该项目。**本项目已经连接到Docker hub，镜像名为`timzhong/translator`**

### 使用docker启动容器
```
docker run -d -p 3000:3000 timzhong/translator
```

### 或使用dockercompose启动容器
docker-compose:
```
version: "2.1"
services:
  tim-translator:
    image: timzhong/translator
    ports:
      - "3000:3000"
    restart: always
```

### 构建Docker镜像
```
git clone https://github.com/Tim-Zhong-2000/Translator.git
cd Translator
docker build tim-translator:1.0 .
```
## 所需依赖
### node_modules
1. `axios` 用于请求翻译api
2. `cookie-parser` 用于实现用户态
3. `cors` 允许跨域中间件（调试）
4. `express` HTTP服务器
5. `express-session` session中间件
6. `md5` 密码哈希（不安全）
7. `morgan` 日志中间件
8. `multer` 处理form-data的中间件
9. `nodemon` 调试工具
10. `qs` 构建URL工具
11. `sqlite3` 数据库引擎
12. `typescript` 编译器

### external tool
1. `leptonia` 图像预处理工具
2. `tesseract` OCR工具