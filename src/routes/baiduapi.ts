/**
 * @description 路由-百度翻译API
 * @author Tim-Zhong-2000
 */

import express from "express";
import CONFIG from "../utils/config";

import { BaiduTranslatorAPI } from "../translator/translateEngines/baiduTranslatorApi";
import { DefaultTranslatorManager } from "../translator/translateManager/DefaultTranslatorManager";
import { DefaultFilter } from "../translator/filter/filter";
import { LangList } from "../translator/langlist";
import { msgBody } from "../utils/msgBody";
import { PrismaCache } from "../translator/cacheEngines/prismaCache";

const router = express.Router();

// 初始化百度翻译API
const providerAccount = { uid: 2, name: "百度翻译API" };
if (CONFIG["baiduapi"].enabled) {
  const baiduTranslatorAPI = new BaiduTranslatorAPI(
    providerAccount,
    CONFIG["baiduapi"].translatorSetting
  );
  const baiduTranslatorAPICache = new PrismaCache(providerAccount);
  const baiduTranslatorAPIFilter = new DefaultFilter(
    CONFIG["baiduapi"].filterSetting
  );
  const baiduAPIManager = new DefaultTranslatorManager(
    baiduTranslatorAPI,
    baiduTranslatorAPICache,
    baiduTranslatorAPIFilter
  );

  router.get("/langlist", (_req, res) => {
    res.json(LangList);
  });

  router.get("/:srcLang/:destLang/:src", async (req, res) => {
    const { src, srcLang, destLang } = req.params;
    const payload = await baiduAPIManager.translate(src, srcLang, destLang);
    res.json(msgBody("获取翻译成功", [payload]));
  });
} else {
  router.use((_req, res) => {
    res.status(400).json(msgBody("百度翻译API服务未启用"));
  });
}

export default router;
