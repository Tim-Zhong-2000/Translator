/**
 * @description /user/register 注册
 * @author Tim-Zhong-2000
 */

import express, { NextFunction, Request, Response } from "express";
import { USER } from "../../type/type";
import { errBody } from "../../utils/errorPayload";

const router = express.Router();

async function checkExist(req: Request, res: Response, next: NextFunction) {
  const body: USER.RegisterPayload = req.body;
  // 检查用户是否存在
  try {
    await req.userService.findByEmail(body.email);
    res.status(406).json(errBody(406, "当前邮箱已注册"));
  } catch (err) {
    console.log(err)
    if (typeof err === "number" && err == USER.DBError.NOT_EXIST) {
      next();
    } else {
      res
        .status(500)
        .json(errBody(500, "服务器错误，检查用户是否存在出现异常"));
    }
  }
}

async function doRegister(req: Request, res: Response) {
  const body: USER.RegisterPayload = req.body;
  // 注册
  let userinfo: USER.UserDbItem;
  console.log(body);
  try {
    userinfo = await req.userService.register(body);
  } catch (err) {
    res.status(500).json(errBody(500, "服务器错误，注册失败", err.message));
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

router.post("/", checkExist).post("/", doRegister);

export default router;
