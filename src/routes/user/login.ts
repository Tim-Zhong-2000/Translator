/**
 * @description /user/login 登录
 * @author Tim-Zhong-2000
 */

import { User } from "@prisma/client";
import express, { Request, Response } from "express";
import { USER } from "../../type/User";
import { checkPayload } from "../../utils/checkPayload";
import { msgBody } from "../../utils/msgBody";
import { checkLogin } from "../../utils/userSession";

const router = express.Router();

router.get("/", checkLogin()).get("/", (req: Request, res: Response) => {
  res.json(req.session.user);
});

router.post(
  "/",
  checkPayload({ email: "", password: "" }),
  async (req: Request, res: Response) => {
    if (req.session.user) {
      res.status(400).json(msgBody("您已登录一个账号，请先退出"));
      return;
    }
    let userinfo: Omit<User, "password">;
    try {
      userinfo = await req.userService.login(req.body as USER.LoginPayload);
    } catch (err) {
      res.status(403).json(msgBody("登录失败"));
      req.session.destroy(() => {});
      return;
    }
    const { uid, name, email, phone, role } = userinfo;
    const friendInfo = await req.userService.getFriendInfo(uid);
    req.session.user = {
      uid: uid,
      name: name,
      email: email,
      phone: phone,
      role: role,
      friends: friendInfo.friends,
      friendreq: friendInfo.friendreq,
      friendres: friendInfo.friendres,
    };
    res.json(req.session.user);
  }
);

export default router;
