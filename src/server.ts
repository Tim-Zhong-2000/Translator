import express from "express";
import fs from "fs";
import cors from "cors";
import morgan from "morgan";
import os from "os";
import { MapCache } from "./cacheEngines/mapCache";
import { BaiduTranslatorCrawler } from "./translateEngines/baiduTranslatorCrawler";
import { BaiduTranslateManager } from "./translateManager/baiduTranslatorCrawlerManager";
import { BaiduTranslatorAPI } from "./translateEngines/baiduTranslatorApi";
import { BaiduTranslatorApiManager } from "./translateManager/baiduTranslatorApiManager";

// 加载所有配置
const CONFIG = JSON.parse(
  fs.readFileSync(
    os.type() === "Linux" ? "/etc/tim-translator/config.json" : "./config.json",
    "utf-8"
  )
);

// 初始化百度翻译
const baiduTranslatorCrawler = new BaiduTranslatorCrawler();
const baiduTranslatorCrawlerCache = new MapCache(CONFIG.baidu.cacheSetting);
const baiduCrawlerManager = new BaiduTranslateManager(
  baiduTranslatorCrawler,
  baiduTranslatorCrawlerCache
);

// 初始化百度翻译API
const baiduTranslatorAPI = new BaiduTranslatorAPI(
  CONFIG["baiduapi"].translatorSetting
);
const baiduTranslatorAPICache = new MapCache(CONFIG.baidu.cacheSetting);
const baiduAPIManager = new BaiduTranslatorApiManager(
  baiduTranslatorAPI,
  baiduTranslatorAPICache
);

// 初始化其他翻译
// ...

// express配置
const PORT = 3000;

// express初始化
const app = express();

// 中间件
app.use(cors());
app.use(morgan("combined"));

// 路由
app.get("/", (req, res) => {
  res.send("123");
});

app.get("/baidu/:srcLang/:destLang/:src", async (req, res) => {
  let src, srcLang, destLang;
  ({ src: src, srcLang: srcLang, destLang: destLang } = req.params);
  const dest = await baiduCrawlerManager.translate(src, srcLang, destLang);
  res.send(dest);
  res.end();
});

app.get("/baiduapi/:srcLang/:destLang/:src", async (req, res) => {
  let src, srcLang, destLang;
  ({ src: src, srcLang: srcLang, destLang: destLang } = req.params);
  const dest = await baiduAPIManager.translate(src, srcLang, destLang);
  res.send(dest);
  res.end();
});

// 启动
app.listen(PORT, () => {
  console.log(`启动成功，端口号:${PORT}`);
});
