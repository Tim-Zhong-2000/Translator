import express, { Request, Response } from "express";
import { USER } from "../type/type";
import { errBody } from "../utils/errorPayload";

const router = express.Router();

router.get("/", (req: Request, res: Response) => {
  // 302 -> register static frontend page
  throw new Error("not finish");
});

router.post("/", async (req: Request, res: Response) => {
  const body: USER.RegisterPayload = req.body;
  // 检查用户是否存在
  const exist = await req.userService.findByEmail(body.email);
  if (exist) {
    res.status(406).json(errBody(406, "当前邮箱已注册"));
    return;
  }
  // 注册
  const userinfo = await req.userService.register(body);
  if (!userinfo) {
    res.status(500).end();
    return;
  }
  // 更新session
  const { uid, nickname, email, phone, role } = userinfo;
  req.session.user = {
    uid: uid,
    nickname: nickname,
    email: email,
    phone: phone,
    role: role,
  };
  res.status(201).json(req.session.user);
  return;
});

export default router;
