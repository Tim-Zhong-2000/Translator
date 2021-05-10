/**
 * @description /user/login 登录
 * @author Tim-Zhong-2000
 */

import express, { Request, Response } from "express";
import { USER } from "../../type/User";
import { errBody } from "../../utils/errorPayload";
import { checkLogin } from "../../utils/userSession";

const router = express.Router();

router.get("/", checkLogin()).get("/", (req: Request, res: Response) => {
  res.json(req.session.user);
});

router.post("/", async (req: Request, res: Response) => {
  let userinfo: USER.UserDbItem;
  try {
    userinfo = await req.userService.login(req.body as USER.LoginPayload);
  } catch (err) {
    res.status(403).json(errBody(403, "登录失败", err.message));
    req.session.destroy(() => {});
    return;
  }
  const { uid, nickname, email, phone, role } = userinfo;
  req.session.user = {
    uid: uid,
    nickname: nickname,
    email: email,
    phone: phone,
    role: role,
  };
  res.json(req.session.user);
});

// router.get("/testlogin", (req, res) => {
//   req.session.user = {
//     uid: 1,
//     nickname: "admin",
//     email: "123@123.com",
//     role: USER.Role.admin,
//   };
//   res.send("test login successfully");
// });

export default router;
