/**
 * @description /user/update-info 更新用户信息
 * @author Tim-Zhong-2000
 */

import express, { Request, Response } from "express";
import { USER } from "../../type/User";
import { errBody } from "../../utils/errorPayload";
import { checkLogin, roleControl } from "../../utils/userSession";

const router = express.Router();

async function updateInfo(
  uid: number,
  newInfo: USER.Info,
  req: Request,
  res: Response
) {
  const { nickname, email, phone } = newInfo;
  if (email) {
    try {
      await req.userService.update(uid, email, "email");
      req.session.user.email = email;
    } catch (err) {
      res.status(500).json(errBody(500, "修改邮箱失败", err.message));
      return;
    }
  }
  if (nickname) {
    try {
      await req.userService.update(uid, nickname, "nickname");
      req.session.user.nickname = nickname;
    } catch (err) {
      res.status(500).json(errBody(500, "修改昵称失败", err.message));
      return;
    }
  }
  if (phone) {
    try {
      await req.userService.update(uid, phone, "phone");
      req.session.user.phone = phone;
    } catch (err) {
      res.status(500).json(errBody(500, "修改手机号失败", err.message));
      return;
    }
  }
  res.json(newInfo);
}

router
  .use("/myself", checkLogin())
  .post("/myself", (req: Request, res: Response) => {
    const uid = req.session.user.uid;
    const userInfo: USER.Info = req.body;
    updateInfo(uid, userInfo, req, res);
  });

router
  .use("/other/:id", checkLogin())
  .use("/other/:id", roleControl(USER.Role.admin))
  .post("/other/:id", (req: Request, res: Response) => {
    const uid = Number(req.params.id);
    const userInfo: USER.Info = req.body;
    updateInfo(uid, userInfo, req, res);
  });
export default router;
