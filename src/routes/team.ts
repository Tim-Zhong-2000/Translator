/**
 * @description 路由-team合作翻译
 * @author Tim-Zhong-2000
 */
import express, { Request, Response, NextFunction } from "express";
import { TeamTrans } from "../team-trans";
import ISO963_1 from "../type/ISO963";
import { USER } from "../type/User";
import { msgBody } from "../utils/msgBody";
import { checkLogin } from "../utils/userSession";

const teamTranslator = new TeamTrans();

const router = express.Router();

router.use(checkLogin());

/**
 * ## 获取人工翻译
 * @param req 
 * @param res 
 */
const getTranslate = async (req: Request, res: Response) => {
  const { src, srcLang, destLang } = req.params;
  const providers = req.session.user.friends.map((val) => val.uid); // 所有好友
  providers.push(req.session.user.uid); // 加上自己
  try {
    const dest = await teamTranslator.get(
      src,
      srcLang as ISO963_1,
      destLang as ISO963_1,
      providers
    );
    res.json(dest);
  } catch (err) {
    console.error(err);
    res.status(500).json(msgBody("服务器错误，获取翻译失败"));
  }
};

/**
 * ## 添加/更新翻译
 * @param req 
 * @param res 
 */
const addTranslate = async (req: Request, res: Response) => {
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
    res.json({ msg: "提交翻译成功" });
  } catch (err) {
    console.error(err);
    res.status(500).json(msgBody("服务器错误，提交失败"));
  }
};

/**
 * ## 删除翻译
 * @param req 
 * @param res 
 */
const deleteTranslate = async (req: Request, res: Response) => {
  const { src, srcLang, destLang } = req.params;
  try {
    await teamTranslator.delete(
      src,
      srcLang as ISO963_1,
      destLang as ISO963_1,
      req.session.user.uid
    );
    res.send({ msg: "删除翻译成功" });
  } catch (err) {
    console.error(err);
    res.status(500).json(msgBody("服务器错误，删除翻译失败"));
  }
};

router.get("/:srcLang/:destLang/:src", getTranslate);
router.post("/:srcLang/:destLang/:src/:dest", addTranslate);
router.delete("/:srcLang/:destLang/:src", deleteTranslate);

export default router;
