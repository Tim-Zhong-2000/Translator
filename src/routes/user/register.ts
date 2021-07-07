/**
 * @description /user/register 注册
 * @author Tim-Zhong-2000
 */

import { User } from "@prisma/client";
import express, { Request, Response } from "express";
import { USER } from "../../type/User";
import { checkPayload } from "../../utils/checkPayload";
import { msgBody } from "../../utils/msgBody";

const router = express.Router();

router.post(
  "/",
  checkPayload({
    name: "",
    email: "",
    password: "",
  }),
  async (req: Request, res: Response) => {
    const payload: USER.RegisterPayload = req.body;
    try {
      const newUser = await req.userService.register(payload);
      // 更新session
      req.session.user = {
        uid: newUser.uid,
        name: newUser.name,
        email: newUser.email,
        role: newUser.role,
        friends: [],
        friendreq: [],
        friendres: [],
      };
      res.json(msgBody("注册成功", newUser));
    } catch (err) {
      res.status(500).json(msgBody("注册失败", err));
    }
  }
);

export default router;
