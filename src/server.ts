import express from "express";
import cors from "cors";
import morgan from "morgan";
import session from "express-session";
import cookieParser from "cookie-parser";

import CONFIG from "./utils/config";

import UserServiceMiddleware from "./user/UserServiceMiddleware";
import index from "./routes/index";
import user from "./routes/user";
import info from "./routes/info";
import baidu from "./routes/baidu";
import baiduapi from "./routes/baiduapi";
import google from "./routes/google";
import team from "./routes/team";
import serviceDiscovery from "./routes/serviceDiscovery";

import { USER } from "./type/User";
import { UserService } from "./user/UserService";

declare module "express-session" {
  interface Session {
    user: USER.Session;
  }
}

declare module "express" {
  interface Request {
    userService: UserService;
  }
}

// express初始化
const app = express();

// 中间件
// allow cors
app.use(cors());

// logger
// app.use(morgan("combined"));

// post body
app.use(express.urlencoded({ extended: true }));
app.use(express.json());

// append UserService for all request
app.use(UserServiceMiddleware);

// cookie and session
app.use(cookieParser());
app.use(
  session({
    secret: "a1@a1@",
    name: "tim-translator",
    cookie: { maxAge: 30 * 60 * 1000 },
    resave: false,
    saveUninitialized: true,
  })
);

// 路由
app.use("/", index);
app.use("/user", user);
app.use("/info", info);
app.use("/baidu", baidu);
app.use("/baiduapi", baiduapi);
app.use("/google", google);
app.use("/team", team);
app.use("/servicediscovery", serviceDiscovery);

// express启动配置
const PORT = CONFIG.serverConfig.port;
app.listen(PORT, () => {
  console.log(`启动成功，端口号:${PORT}`);
});
