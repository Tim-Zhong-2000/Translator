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
import { baiduApiLangList, baiduLangList, googleLanglist } from "./langlist";
import { DefaultFilter } from "./filter/filter";
import { GoogleTranslatorCrawler } from "./translateEngines/googleTranslatorCrawler";
import { GoogleTranslateManager } from "./translateManager/googleTranslatorCrawlerManager";

// 加载所有配置
const CONFIG = JSON.parse(
  fs.readFileSync(
    os.type() === "Linux" ? "/etc/tim-translator/config.json" : "./config.json",
    "utf-8"
  )
);
const entryList: { name: string; value: string }[] = [];

// express配置
const PORT = CONFIG.serverConfig.port;

// express初始化
const app = express();

// 中间件
app.use(cors());
app.use(morgan("combined"));

// 路由
app.get("/", (_req, res) => {
  res.send("123");
});

// 返回服务类型
app.get("/info/entrys", (_req, res) => {
  res.send(JSON.stringify(entryList));
  res.end();
});

// 服务发现
app.get("/servicediscovery", (_req, res) => {
  const png = fs.createReadStream("./servicediscovery.png");
  png.pipe(res);
});

// 通告启用的服务
app.get("/servicediscovery/info", (_req, res) => {
  const info = CONFIG.serverConfig;
  res.send(JSON.stringify(info));
  res.end();
});

// 初始化百度翻译
if (CONFIG["baidu"].enabled) {
  entryList.push({ name: "baidu", value: "baidu" });

  const baiduTranslatorCrawler = new BaiduTranslatorCrawler();
  const baiduTranslatorCrawlerCache = new MapCache(
    CONFIG["baidu"].cacheSetting
  );
  const baiduTranslatorFilter = new DefaultFilter(
    CONFIG["baidu"].filterSetting
  );
  const baiduCrawlerManager = new BaiduTranslateManager(
    baiduTranslatorCrawler,
    baiduTranslatorCrawlerCache,
    baiduTranslatorFilter
  );

  /// 百度
  app.get("/baidu/:srcLang/:destLang/:src", async (req, res) => {
    let src, srcLang, destLang;
    ({ src: src, srcLang: srcLang, destLang: destLang } = req.params);
    const dest = await baiduCrawlerManager.translate(src, srcLang, destLang);
    res.send(JSON.stringify(dest));
    res.end();
  });
  app.get("/baidu/langlist", (_req, res) => {
    res.send(JSON.stringify(baiduLangList));
    res.end();
  });
  app.get("/baidu/reload", async (_req, res) => {
    await baiduTranslatorCrawler.autoConfig();
    res.send("Finished");
    res.end();
  });
}

// 初始化百度翻译API
if (CONFIG["baiduapi"].enabled) {
  entryList.push({ name: "baidu api", value: "baiduapi" });
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
  /// 百度API
  app.get("/baiduapi/:srcLang/:destLang/:src", async (req, res) => {
    let src, srcLang, destLang;
    ({ src: src, srcLang: srcLang, destLang: destLang } = req.params);
    const dest = await baiduAPIManager.translate(src, srcLang, destLang);
    res.send(JSON.stringify(dest));
    res.end();
  });
  app.get("/baiduapi/langlist", (_req, res) => {
    res.send(JSON.stringify(baiduApiLangList));
    res.end();
  });
}

// 初始化谷歌翻译
if (CONFIG["google"].enabled) {
  entryList.push({ name: "google", value: "google" });

  const googleTranslatorAPI = new GoogleTranslatorCrawler(
    CONFIG["google"].translatorSetting
  );
  const googleTranslatorAPICache = new MapCache(CONFIG["google"].cacheSetting);
  const googleTranslatorAPIFilter = new DefaultFilter(
    CONFIG["google"].filterSetting
  );
  const googleTranslateManager = new GoogleTranslateManager(
    googleTranslatorAPI,
    googleTranslatorAPICache,
    googleTranslatorAPIFilter
  );
  /// google
  app.get("/google/:srcLang/:destLang/:src", async (req, res) => {
    let src, srcLang, destLang;
    ({ src: src, srcLang: srcLang, destLang: destLang } = req.params);
    const dest = await googleTranslateManager.translate(src, srcLang, destLang);
    res.send(JSON.stringify(dest));
    res.end();
  });
  app.get("/google/langlist", (_req, res) => {
    res.send(JSON.stringify(googleLanglist));
    res.end();
  });
}

// 初始化其他翻译
// ...

// 启动
app.listen(PORT, () => {
  console.log(`启动成功，端口号:${PORT}`);
});
