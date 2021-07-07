import { Request, Response, NextFunction } from "express";
import { USER } from "../type/User";
import { msgBody } from "./msgBody";

/**
 * ## 中间件 - 检查登录状态
 * @returns 
 */
export function checkLogin() {
  return function (req: Request, res: Response, next: NextFunction) {
    if (!req.session.user) {
      res.status(403).json(msgBody("未登录"));
      return;
    }
    next();
  };
}

/**
 * ## 中间件 - 权限控制模块
 * @param role 
 * @returns 
 */
export function roleControl(role: USER.Role) {
  return function (req: Request, res: Response, next: NextFunction) {
    if (req.session.user.role < role) {
      res.status(403).json(msgBody("权限不足"));
      return;
    }
    next();
  };
}
