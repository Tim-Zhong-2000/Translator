/**
 * @description 路由-谷歌翻译
 * @author Tim-Zhong-2000
 */

import express from "express";
import CONFIG from "../utils/config";

import { DefaultTranslatorManager } from "../translator/translateManager/DefaultTranslatorManager";
import { googleLanglist } from "../translator/langlist";
import { DefaultFilter } from "../translator/filter/filter";
import { GoogleTranslatorCrawler } from "../translator/translateEngines/googleTranslatorCrawler";
import { SqliteCache } from "../translator/cacheEngines/sqlite3Cache";
import { errBody } from "../utils/errorPayload";

const router = express.Router();

// 初始化谷歌翻译
if (CONFIG["google"].enabled) {
  const googleTranslatorCrawler = new GoogleTranslatorCrawler(
    CONFIG["google"].translatorSetting
  );
  const googleTranslatorCrawlerCache = new SqliteCache(
    CONFIG["google"].cacheSetting
  );
  const googleTranslatorCrawlerFilter = new DefaultFilter(
    CONFIG["google"].filterSetting
  );
  const googleTranslateManager = new DefaultTranslatorManager(
    googleTranslatorCrawler,
    googleTranslatorCrawlerCache,
    googleTranslatorCrawlerFilter
  );

  router.get("/langlist", (_req, res) => {
    res.json(googleLanglist);
  });

  router.get("/:srcLang/:destLang/:src", async (req, res) => {
    const { src, srcLang, destLang } = req.params;
    const dest = await googleTranslateManager.translate(src, srcLang, destLang);
    res.json(dest);
  });
} else {
  router.use((_req, res) => {
    res.status(400).json(errBody(400, "谷歌翻译服务未启用"));
  });
}

export default router;
