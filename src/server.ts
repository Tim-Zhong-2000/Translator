import express from "express";
import fs from "fs";
import cors from "cors";
import morgan from "morgan";

import CONFIG from "./utils/config"

import index from "./routes/index";
import info from "./routes/info";
import baidu from "./routes/baidu";
import baiduapi from "./routes/baiduapi";
import google from "./routes/google";

// express初始化
const app = express();

// 中间件
app.use(cors());
app.use(morgan("combined"));

// 路由
app.use("/", index);
app.use("/info", info);
app.use("/baidu", baidu);
app.use("/baiduapi", baiduapi);
app.use("/google", google);

// 服务发现
app.get("/servicediscovery", (_req, res) => {
  const png = fs.createReadStream("./servicediscovery.png");
  png.pipe(res);
});

// express启动配置
const PORT = CONFIG.serverConfig.port;
app.listen(PORT, () => {
  console.log(`启动成功，端口号:${PORT}`);
});
