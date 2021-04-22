/**
 * @description 路由-百度翻译API
 * @author Tim-Zhong-2000
 */

import express from "express";
import CONFIG from "../utils/config";

import { BaiduTranslatorAPI } from "../translator/translateEngines/baiduTranslatorApi";
import { DefaultTranslatorManager } from "../translator/translateManager/DefaultTranslatorManager";
import { baiduApiLangList } from "../translator/langlist";
import { DefaultFilter } from "../translator/filter/filter";
import { SqliteCache } from "../translator/cacheEngines/sqlite3Cache";
import { errBody } from "../utils/errorPayload";

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
    res.json(baiduApiLangList);
  });

  router.get("/:srcLang/:destLang/:src", async (req, res) => {
    const { src, srcLang, destLang } = req.params;
    const dest = await baiduAPIManager.translate(src, srcLang, destLang);
    res.json(dest);
  });
} else {
  router.use((_req, res) => {
    res.status(400).json(errBody(400, "百度翻译API服务未启用"));
  });
}

export default router;
