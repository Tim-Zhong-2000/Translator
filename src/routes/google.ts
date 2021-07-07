/**
 * @description 路由-谷歌翻译
 * @author Tim-Zhong-2000
 */

import express from "express";
import CONFIG from "../utils/config";

import { DefaultTranslatorManager } from "../translator/translateManager/DefaultTranslatorManager";
import { DefaultFilter } from "../translator/filter/filter";
import { GoogleTranslatorCrawler } from "../translator/translateEngines/googleTranslatorCrawler";
import { LangList } from "../translator/langlist";
import { PrismaCache } from "../translator/cacheEngines/prismaCache";
import { msgBody } from "../utils/msgBody";

const router = express.Router();

// 初始化谷歌翻译
const providerAccount = { uid: 3, name: "谷歌翻译" };
if (CONFIG["google"].enabled) {
  const googleTranslatorCrawler = new GoogleTranslatorCrawler(
    providerAccount,
    CONFIG["google"].translatorSetting
  );
  const googleTranslatorCrawlerCache = new PrismaCache(providerAccount);
  const googleTranslatorCrawlerFilter = new DefaultFilter(
    CONFIG["google"].filterSetting
  );
  const googleTranslateManager = new DefaultTranslatorManager(
    googleTranslatorCrawler,
    googleTranslatorCrawlerCache,
    googleTranslatorCrawlerFilter
  );

  router.get("/langlist", (_req, res) => {
    res.json(LangList);
  });

  router.get("/:srcLang/:destLang/:src", async (req, res) => {
    const { src, srcLang, destLang } = req.params;
    const dest = await googleTranslateManager.translate(src, srcLang, destLang);
    res.json(dest);
  });
} else {
  router.use((_req, res) => {
    res.status(400).json(msgBody("谷歌翻译服务未启用"));
  });
}

export default router;
