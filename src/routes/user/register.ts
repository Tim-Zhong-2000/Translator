/**
 * @description /user/register 注册
 * @author Tim-Zhong-2000
 */

import express, { Request, Response } from "express";
import { USER } from "../../type/User";
import { errBody } from "../../utils/errorPayload";

const router = express.Router();

async function doRegister(req: Request, res: Response) {
  const body: USER.RegisterPayload = req.body;
  // 注册
  let userinfo: USER.UserDbItem;
  console.log(body);
  try {
    userinfo = await req.userService.register(body);
  } catch (err) {
    res.status(500).json(errBody(500, "注册失败", err.message));
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
}

router.get("/", (req: Request, res: Response) => {
  // 302 -> register static frontend page
  throw new Error("not finish");
});

router.post("/", doRegister);

export default router;
