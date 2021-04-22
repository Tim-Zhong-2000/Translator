import { Request, Response, NextFunction } from "express";
import { USER } from "../type/type";
import { errBody } from "./errorPayload";

export function checkLogin() {
  return function (req: Request, res: Response, next: NextFunction) {
    if (!req.session.user) {
      res.status(403).json(errBody(403, "未登录"));
      return;
    }
    next();
  };
}

export function roleControl(role: USER.Role) {
  return function (req: Request, res: Response, next: NextFunction) {
    if (req.session.user.role < role) {
      res.status(403).json(errBody(403, "权限不足"));
      return;
    }
    next();
  };
}
