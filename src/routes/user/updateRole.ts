/**
 * @description /user/update-role 更新用户权限
 * @author Tim-Zhong-2000
 */

import express, { NextFunction, Request, Response } from "express";
import { USER } from "../../type/User";
import { checkPayload } from "../../utils/checkPayload";
import { errBody } from "../../utils/errorPayload";
import { checkLogin, roleControl } from "../../utils/userSession";

const router = express.Router();

router
  .use(checkLogin())
  .use(roleControl(USER.Role.admin))
  .use(
    checkPayload({
      uid: -1,
      newRole: USER.Role.guest,
    })
  )
  .post("/", async (req: Request, res: Response) => {
    const { uid, newRole } = req.body;
    try {
      res.json(await req.userService.update(uid, newRole, "role"));
    } catch (err) {
      res.status(500).json(errBody(500, "更改权限失败"));
    }
  });

export default router;
