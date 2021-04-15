import express, { Request, Response } from "express";
import { USER } from "../type/type";

const router = express.Router();

router.get("/", (req: Request, res: Response) => {
  // 302 -> register static frontend page
  throw new Error("not finish");
});

router.post("/", async (req: Request, res: Response) => {
  const body: USER.RegisterPayload = req.body;
  const userinfo = await req.userService.register(body);
  if (!userinfo) {
    res.statusCode = 500;
    res.end();
  }
  const { uid, nickname, email, phone, role } = userinfo;
  req.session.user = {
    uid: uid,
    nickname: nickname,
    email: email,
    phone: phone,
    role: role,
  };
  res.send("register successfully");
  res.end();
});
