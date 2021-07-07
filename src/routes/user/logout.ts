/**
 * @description /user/logout 登出
 * @author Tim-Zhong-2000
 */

import express, { Request, Response } from "express";
import { msgBody } from "../../utils/msgBody";
import { checkLogin } from "../../utils/userSession";

const router = express.Router();

function destroySession() {
  return function (req: Request, res: Response) {
    req.session.destroy((err) => {
      if (err) {
        res.status(500).json(msgBody("Remove Session Error"));
      } else {
        res.send("Logout Successfully");
      }
    });
  };
}

router.get("/", checkLogin(), destroySession());

export default router;
