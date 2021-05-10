/**
 * @description /user/update-password 更新用户密码
 * @author Tim-Zhong-2000
 */

import express, { NextFunction, Request, Response } from "express";
import { USER } from "../../type/User";
import { errBody } from "../../utils/errorPayload";
import { checkLogin, roleControl } from "../../utils/userSession";

const router = express.Router();

function chekcPayload() {
  return function (req: Request, res: Response, next: NextFunction) {
    const { newPassword } = req.body;
    if (!newPassword) {
      res.status(400).json(errBody(400, "客户端错误，缺少newPassword字段"));
      return;
    }
    next();
  };
}

// 修改自己的密码
router
  .use("/myself", checkLogin())
  .use("/myself", chekcPayload())
  .post("/myself", async (req: Request, res: Response) => {
    const uid = req.session.user.uid;
    const { newPassword } = req.body;
    try {
      res.json(await req.userService.update(uid, newPassword, "password"));
    } catch (err) {
      res.status(500).json(errBody(500, "修改密码失败", err.message));
    }
  });

// 管理员修改密码
router
  .use("/other/:uid", checkLogin())
  .use("/other/:uid", chekcPayload())
  .use("/other/:uid", roleControl(USER.Role.admin))
  .post("/other/:uid", async (req: Request, res: Response) => {
    const uid = Number(req.params.uid);
    const { newPassword } = req.body;
    try {
      res.json(await req.userService.update(uid, newPassword, "password"));
    } catch (err) {
      res.status(500).json(errBody(500, "修改密码失败"));
    }
  });

export default router;
