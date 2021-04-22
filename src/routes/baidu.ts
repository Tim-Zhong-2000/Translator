/**
 * @description 路由-百度翻译
 * @author Tim-Zhong-2000
 */

import express from "express";
import CONFIG from "../utils/config";

import { BaiduTranslatorCrawler } from "../translator/translateEngines/baiduTranslatorCrawler";
import { DefaultTranslatorManager } from "../translator/translateManager/DefaultTranslatorManager";
import { baiduLangList } from "../translator/langlist";
import { DefaultFilter } from "../translator/filter/filter";
import { SqliteCache } from "../translator/cacheEngines/sqlite3Cache";
import { errBody } from "../utils/errorPayload";

const router = express.Router();

if (CONFIG["baidu"].enabled) {
  const baiduTranslatorCrawler = new BaiduTranslatorCrawler();
  const baiduTranslatorCrawlerCache = new SqliteCache(
    CONFIG["baidu"].cacheSetting
  );
  const baiduTranslatorFilter = new DefaultFilter(
    CONFIG["baidu"].filterSetting
  );
  const baiduCrawlerManager = new DefaultTranslatorManager(
    baiduTranslatorCrawler,
    baiduTranslatorCrawlerCache,
    baiduTranslatorFilter
  );

  router.get("/langlist", (_req, res) => {
    res.json(baiduLangList);
  });

  router.get("/reload", async (_req, res) => {
    await baiduTranslatorCrawler.autoConfig();
    res.status(201).send("Finished");
  });

  router.get("/:srcLang/:destLang/:src", async (req, res) => {
    const { src, srcLang, destLang } = req.params;
    const dest = await baiduCrawlerManager.translate(src, srcLang, destLang);
    res.json(dest);
  });
} else {
  router.use((_req, res) => {
    res.status(400).json(errBody(400, "百度翻译服务未启用"));
  });
}

export default router;
