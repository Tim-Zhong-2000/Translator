/**
 * @description /user/delete-user 删除用户
 * @author Tim-Zhong-2000
 */

import express, { NextFunction, Request, Response } from "express";
import { errBody } from "../../utils/errorPayload";
import { checkLogin } from "../../utils/userSession";

const router = express.Router();

function checkPayload() {
  return function (req: Request, res: Response, next: NextFunction) {
    const payloadTemplate = {
      nickname: "",
      email: "",
      password: "",
    };
    let flag = true;
    Object.keys(payloadTemplate).forEach((key) => {
      if (!(req.body as Object).hasOwnProperty(key)) {
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

function checkInfo() {
  return function (req: Request, res: Response, next: NextFunction) {
    const { nickname, email } = req.session.user;
    const { nickname2, email2 } = req.body;
    if (nickname === nickname2 && email === email2) {
      next();
    } else {
      res
        .status(403)
        .json(errBody(403, "信息不匹配，请再次确认将要删除的账号"));
    }
  };
}
router
  .use(checkLogin())
  .use(checkPayload())
  .use(checkInfo())
  .post("/", async (req: Request, res: Response) => {
    const { uid } = req.session.user;
    const result = await req.userService.delete(uid);
    if (!result) {
      res.status(500).json(errBody(500, "服务器错误，删除用户失败"));
      return;
    }
    res.json(result);
  });

export default router;
