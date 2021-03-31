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
import { baiduApiLangList, baiduLangList } from "./langlist";
import { DefaultFilter } from "./filter/filter";

// 加载所有配置
const CONFIG = JSON.parse(
  fs.readFileSync(
    os.type() === "Linux" ? "/etc/tim-translator/config.json" : "./config.json",
    "utf-8"
  )
);

// 初始化百度翻译
const baiduTranslatorCrawler = new BaiduTranslatorCrawler();
const baiduTranslatorCrawlerCache = new MapCache(CONFIG["baidu"].cacheSetting);
const baiduTranslatorFilter = new DefaultFilter(CONFIG["baidu"].filterSetting);
const baiduCrawlerManager = new BaiduTranslateManager(
  baiduTranslatorCrawler,
  baiduTranslatorCrawlerCache,
  baiduTranslatorFilter
);

// 初始化百度翻译API
const baiduTranslatorAPI = new BaiduTranslatorAPI(
  CONFIG["baiduapi"].translatorSetting
);
const baiduTranslatorAPICache = new MapCache(CONFIG["baiduapi"].cacheSetting);
const baiduTranslatorAPIFilter = new DefaultFilter(
  CONFIG["baiduapi"].filterSetting
);
const baiduAPIManager = new BaiduTranslatorApiManager(
  baiduTranslatorAPI,
  baiduTranslatorAPICache,
  baiduTranslatorAPIFilter
);

// 初始化其他翻译
// ...

// express配置
const PORT = CONFIG.serverConfig.port;

// express初始化
const app = express();

// 中间件
app.use(cors());
app.use(morgan("combined"));

// 路由
app.get("/", (req, res) => {
  res.send("123");
});

/// 百度
app.get("/baidu/:srcLang/:destLang/:src", async (req, res) => {
  let src, srcLang, destLang;
  ({ src: src, srcLang: srcLang, destLang: destLang } = req.params);
  const dest = await baiduCrawlerManager.translate(src, srcLang, destLang);
  res.send(JSON.stringify(dest));
  res.end();
});
app.get("/baidu/langlist", (req, res) => {
  res.send(JSON.stringify(baiduLangList));
  res.end();
});
app.get("/baidu/reload", async (req, res) => {
  await baiduTranslatorCrawler.autoConfig();
  res.send("Finished");
  res.end();
});

/// 百度API
app.get("/baiduapi/:srcLang/:destLang/:src", async (req, res) => {
  let src, srcLang, destLang;
  ({ src: src, srcLang: srcLang, destLang: destLang } = req.params);
  const dest = await baiduAPIManager.translate(src, srcLang, destLang);
  res.send(JSON.stringify(dest));
  res.end();
});
app.get("/baiduapi/langlist", (req, res) => {
  res.send(JSON.stringify(baiduApiLangList));
  res.end();
});

/// 返回服务类型
app.get("/info/entrys", (req, res) => {
  const list = [];
  if (CONFIG["baidu"].enabeld) {
    list.push({ name: "baidu", value: "baidu" });
  }
  if (CONFIG["baiduapi"].enabled) {
    list.push({ name: "api", value: "baiduapi" });
  }
  res.send(JSON.stringify(list));
  res.end();
});

/// 服务发现
app.get("/servicediscovery", (req, res) => {
  const png = fs.createReadStream("./servicediscovery.png");
  png.pipe(res);
});

/// 通告启用的服务
app.get("/servicediscovery/info", (req, res) => {
  const info = CONFIG.serverConfig;
  res.send(JSON.stringify(info));
  res.end();
});

// 启动
app.listen(PORT, () => {
  console.log(`启动成功，端口号:${PORT}`);
});
