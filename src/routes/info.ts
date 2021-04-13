/**
 * @description 路由-info页
 * @author Tim-Zhong-2000
 */

import express from "express";
import CONFIG from "../utils/config"

const router = express.Router();

const entryList: { name: string; value: string }[] = [];

router.get("/entrys", (_req, res) => {
  res.send(JSON.stringify(entryList));
  res.end();
});

router.get("/", (_req, res) => {
    const info = CONFIG.serverConfig;
    res.send(JSON.stringify(info));
    res.end();
  });

export default router;
