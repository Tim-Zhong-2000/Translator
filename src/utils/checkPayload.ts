import { Request, Response, NextFunction } from "express";
import { msgBody } from "./msgBody";

export function checkPayload(template: any) {
  return function (req: Request, res: Response, next: NextFunction) {
    let flag = true; // 是否具有template的所有字段
    let errParams: {
      errorType: "Type_Error" | "Invalid_Param";
      key: string;
    }[] = [];
    Object.keys(req.body).forEach((key) => {
      if (!template.hasOwnProperty(key)) {
        // 上传了接口不存在的字段
        errParams.push({
          errorType: "Invalid_Param",
          key: key,
        });
        flag = false;
      } else if (typeof template[key] !== typeof req.body[key]) {
        errParams.push({
          errorType: "Type_Error",
          key: key,
        });
        flag = false;
      }
    });
    if (flag) {
      next();
    } else {
      res
        .status(400)
        .json(msgBody("请求参数非法", errParams));
    }
  };
}
