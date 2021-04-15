/**
 * @description 登录接口
 * @author Tim-Zhong-2000
 */

import express, { Request, Response } from "express";
import { USER } from "../type/type";
import { errBody } from "../utils/errorPayload";

const router = express.Router();

router.get("/", (req, res) => {
  if (req.session.user) {
    res.json(req.session.user);
  } else {
    res.status(401).json(errBody(401, "session过期"));
  }
});

router.post("/", async (req: Request, res: Response) => {
  const userinfo = await req.userService.login(req.body as USER.LoginPayload);
  if (!userinfo) {
    req.session.destroy(() => {});
    res.status(403).end();
  }
  const { uid, nickname, email, phone, role } = userinfo;
  req.session.user = {
    uid: uid,
    nickname: nickname,
    email: email,
    phone: phone,
    role: role,
  };
  res.json(req.session.user);
});

router.get("/testlogin", (req, res) => {
  req.session.user = {
    uid: 1,
    nickname: "admin",
    email: "123@123.com",
    role: USER.Role.admin,
  };
  res.send("test login successfully");
});

export default router;
