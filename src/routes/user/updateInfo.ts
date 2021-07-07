/**
 * @description /user/update-info 更新用户信息
 * @author Tim-Zhong-2000
 */

import express, { Request, Response } from "express";
import { USER } from "../../type/User";
import { checkLogin, roleControl } from "../../utils/userSession";

const router = express.Router();

router.post("/myself", checkLogin(), async (req: Request, res: Response) => {
  const uid = req.session.user.uid;
  const userInfo: USER.Info = req.body;
  const result = await req.userService.update(uid, {
    name: userInfo.name,
  });
  res.json(result);
});

router.post(
  "/other/:id",
  checkLogin(),
  roleControl(USER.Role.admin),
  async (req: Request, res: Response) => {
    const uid = Number(req.params.id);
    const userInfo: USER.Info = req.body;
    const result = await req.userService.update(uid, {
      name: userInfo.name,
    });
    res.json(result);
  }
);
export default router;
