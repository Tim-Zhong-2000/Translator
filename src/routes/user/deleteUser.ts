/**
 * @description /user/delete-user 删除用户
 * @author Tim-Zhong-2000
 */

import express, { NextFunction, Request, Response } from "express";
import { checkPayload } from "../../utils/checkPayload";
import { msgBody } from "../../utils/msgBody";
import { checkLogin } from "../../utils/userSession";

const router = express.Router();

/**
 * ## 中间件 - 检查删除的对象是否是自己
 * @returns 
 */
function checkInfo() {
  return function (req: Request, res: Response, next: NextFunction) {
    const { name, email } = req.session.user;
    if (name === req.body.name && email === req.body.email) {
      next();
    } else {
      res
        .status(403)
        .json(msgBody("信息不匹配，请再次确认将要删除的账号"));
    }
  };
}

router
  .use(checkLogin())
  .use(
    checkPayload({
      nickname: "",
      email: "",
      password: "",
    })
  )
  .use(checkInfo())
  .post("/", async (req: Request, res: Response) => {
    const { uid } = req.session.user;
    try {
      res.json(await req.userService.update(uid, { is_delete: true }));
    } catch (err) {
      res
        .status(500)
        .json(msgBody("服务器错误，删除用户失败"));
    }
  });

export default router;
