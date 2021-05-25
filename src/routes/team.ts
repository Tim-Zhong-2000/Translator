/**
 * @description 路由-team合作翻译
 * @author Tim-Zhong-2000
 */
import express, { Request, Response, NextFunction } from "express";
import { TeamTrans } from "../team-trans";
import ISO963_1 from "../type/ISO963";
import { USER } from "../type/User";
import { errBody } from "../utils/errorPayload";
import { checkLogin } from "../utils/userSession";

const teamTranslator = new TeamTrans();

const router = express.Router();

router.use(checkLogin());

router.get("/:srcLang/:destLang/:src", async (req: Request, res: Response) => {
  const { src, srcLang, destLang } = req.params;
  const dest = await teamTranslator.get(
    src,
    srcLang as ISO963_1,
    destLang as ISO963_1,
    req.session.user.friends.map((val) => val.uid)
  );
  res.json(dest);
});

router.post(
  "/:srcLang/:destLang/:src/:dest",
  async (req: Request, res: Response) => {
    const { src, srcLang, dest, destLang } = req.params;
    try {
      await teamTranslator.add(
        src,
        srcLang as ISO963_1,
        dest,
        destLang as ISO963_1,
        req.session.user.uid,
        USER.PrivacyLabel.public
      );
      res.json({ msg: "更新翻译成功" });
    } catch (err) {
      res.status(500).json(errBody(500, "err"));
    }
  }
);

router.delete(
  "/:srcLang/:destLang/:src",
  async (req: Request, res: Response) => {
    const { src, srcLang, destLang } = req.params;
    await teamTranslator.delete(
      src,
      srcLang as ISO963_1,
      destLang as ISO963_1,
      req.session.user.uid
    );
    res.send("删除成功");
  }
);

export default router;
