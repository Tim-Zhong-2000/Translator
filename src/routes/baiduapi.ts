/**
 * @description 路由-百度翻译API
 * @author Tim-Zhong-2000
 */

import express from "express";
import CONFIG from "../utils/config"

import { BaiduTranslatorAPI } from "../translateEngines/baiduTranslatorApi";
import { DefaultTranslatorManager } from "../translateManager/DefaultTranslatorManager";
import { baiduApiLangList } from "../langlist";
import { DefaultFilter } from "../filter/filter";
import { SqliteCache } from "../cacheEngines/sqlite3Cache";

const router = express.Router();

// 初始化百度翻译API
if (CONFIG["baiduapi"].enabled) {
  const baiduTranslatorAPI = new BaiduTranslatorAPI(
    CONFIG["baiduapi"].translatorSetting
  );
  const baiduTranslatorAPICache = new SqliteCache(
    CONFIG["baiduapi"].cacheSetting
  );
  const baiduTranslatorAPIFilter = new DefaultFilter(
    CONFIG["baiduapi"].filterSetting
  );
  const baiduAPIManager = new DefaultTranslatorManager(
    baiduTranslatorAPI,
    baiduTranslatorAPICache,
    baiduTranslatorAPIFilter
  );

  router.get("/langlist", (_req, res) => {
    res.send(JSON.stringify(baiduApiLangList));
    res.end();
  });

  router.get("/:srcLang/:destLang/:src", async (req, res) => {
    let src, srcLang, destLang;
    ({ src: src, srcLang: srcLang, destLang: destLang } = req.params);
    const dest = await baiduAPIManager.translate(src, srcLang, destLang);
    res.send(JSON.stringify(dest));
    res.end();
  });
}

export default router;
