/**
 * @description /user/update-role 更新用户权限
 * @author Tim-Zhong-2000
 */

import express, { NextFunction, Request, Response } from "express";
import { USER } from "../../type/User";
import { checkPayload } from "../../utils/checkPayload";
import { msgBody } from "../../utils/msgBody";
import { checkLogin, roleControl } from "../../utils/userSession";

const router = express.Router();

router.post(
  "/",
  checkLogin(),
  roleControl(USER.Role.admin),
  checkPayload({
    uid: -1,
    newRole: USER.Role.guest,
  }),
  async (req: Request, res: Response) => {
    const { uid, newRole } = req.body;
    try {
      res.json(await req.userService.update(uid, { role: newRole }));
    } catch (err) {
      res.status(500).json(msgBody("更改权限失败"));
    }
  }
);

export default router;
