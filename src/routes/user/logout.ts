/**
 * @description /user/logout 登出
 * @author Tim-Zhong-2000
 */

import express, { Request, Response, NextFunction } from "express";
import { errBody } from "../../utils/errorPayload";
import { checkLogin } from "../../utils/userSession";

const router = express.Router();

function destroySession() {
  return function (req: Request, res: Response) {
    req.session.destroy((err) => {
      if (err) {
        res.status(500).json(errBody(500, "Remove Session Error"));
      } else {
        res.send("Logout Successfully");
      }
    });
  };
}

router.get("/", checkLogin()).get("/", destroySession());

export default router;
