/**
 * @description /user/update-role 更新用户权限
 * @author Tim-Zhong-2000
 */

import express, { NextFunction, Request, Response } from "express";
import { USER } from "../../type/type";
import { errBody } from "../../utils/errorPayload";
import { checkLogin, roleControl } from "../../utils/userSession";

const router = express.Router();

function checkPayload() {
  return function (req: Request, res: Response, next: NextFunction) {
    const payloadTemplate = {
      uid: -1,
      newRole: USER.Role.guest,
    };
    const payload: Object = req.body;
    let flag = true;
    Object.keys(payloadTemplate).forEach((key) => {
      if (!payload.hasOwnProperty(key)) {
        flag = false;
      }
    });
    if (flag) {
      next();
    } else {
      res.status(400).json(errBody(400, "请求参数非法"));
    }
  };
}

router
  .use(checkLogin())
  .use(roleControl(USER.Role.admin))
  .use(checkPayload())
  .post("/", async (req: Request, res: Response) => {
    const { uid, newRole } = req.body;
    const result = await req.userService.update(uid, newRole, "role");
    if (!result) {
      res.status(500).json(errBody(500, "更改权限失败"));
      return;
    }
    res.json(result);
  });

export default router;
