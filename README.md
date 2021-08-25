# Tim-Translator
翻译器后端仓库

## 功能列表
- [x] 基础用户系统
- [x] 翻译上游 - 百度翻译web
- [x] 翻译上游 - 百度翻译api
- [x] 翻译上游 - 谷歌翻译web
- [x] 合作翻译模块`team-trans`
- [x] OCR上游 - Paddle
- [ ] OCR上游 - Tesseract
- [ ] 语种识别
- [ ] TTS上游 - 讯飞
- [ ] TTS上游 - 百度

## BasicUsage / 基础用法
1. clone the repositories / 克隆此仓库
2. run `npm install` / 运行`npm install`
3. if you use linux edit the `config.json` and copy it to `/etc/translator/config.json` / 如果你使用的是linux环境，编辑`config.json`并且复制到`/etc/translator/config.json`
4. run `npm start` / 运行`npm start`
5. you can access the default service through `http://localhost:3000/:service/:srcLang/:destLang/:src`(Using an interactive front end, you don't need to memorize these parameters) / 你可以访问`http://localhost:3000/:service/:srcLang/:destLang/:src`获取翻译。（使用交互式前端，不需要记忆这些参数）
6. Fill in the front-end `translation server` with `http://localhost:3000`and save / 在前端`翻译服务器`处填入`http://localhost:3000`并保存。

## Docker(推荐)
推荐使用docker运行该项目。

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

## 配置文件
