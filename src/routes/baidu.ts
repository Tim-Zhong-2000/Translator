/**
 * @description 路由-百度翻译
 * @author Tim-Zhong-2000
 */

import express from "express";
import CONFIG from "../utils/config"

import { BaiduTranslatorCrawler } from "../translateEngines/baiduTranslatorCrawler";
import { DefaultTranslatorManager } from "../translateManager/DefaultTranslatorManager";
import { baiduLangList } from "../langlist";
import { DefaultFilter } from "../filter/filter";
import { SqliteCache } from "../cacheEngines/sqlite3Cache";

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
    res.send(JSON.stringify(baiduLangList));
    res.end();
  });

  router.get("/reload", async (_req, res) => {
    await baiduTranslatorCrawler.autoConfig();
    res.send("Finished");
    res.end();
  });

  router.get("/:srcLang/:destLang/:src", async (req, res) => {
    let src, srcLang, destLang;
    ({ src: src, srcLang: srcLang, destLang: destLang } = req.params);
    const dest = await baiduCrawlerManager.translate(src, srcLang, destLang);
    res.send(JSON.stringify(dest));
    res.end();
  });
}

export default router;