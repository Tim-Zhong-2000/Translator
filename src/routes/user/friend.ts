/**
 * @description /user/friend 好友模块
 * @author Tim-Zhong-2000
 */

import express, { NextFunction, Request, Response } from "express";
import { checkPayload } from "../../utils/checkPayload";
import { msgBody } from "../../utils/msgBody";
import { checkLogin } from "../../utils/userSession";

const router = express.Router();

router.use(checkLogin());

// 获取缓存中的好友列表
router.get("/list", async (req: Request, res: Response) => {
  res.json(msgBody("获取缓存好友列表成功", req.session.user.friends));
});

// 更新缓存
router.copy("/", checkPayload({}), async (req: Request, res: Response) => {
  try {
    const friendInfo = await req.userService.getFriendInfo(
      req.session.user.uid
    );
    req.session.user.friends = friendInfo.friends;
    req.session.user.friendreq = friendInfo.friendreq;
    req.session.user.friendres = friendInfo.friendres;
    res.json(msgBody("更新好友列表成功", friendInfo));
  } catch (err) {
    res.status(500).json(msgBody("更新好友列表失败"));
  }
});

router.delete(
  "/list/:friendid",
  checkPayload({}),
  async (req: Request, res: Response) => {
    const friendId = Number(req.params.friendid);
    try {
      const newFriendInfo = await req.userService.deleteFriend(
        req.session.user.uid,
        friendId
      );
      req.session.user.friends = newFriendInfo.friends;
      res.json(msgBody("删除成功"));
    } catch (err) {
      res.status(500).json(msgBody("删除好友失败"));
    }
  }
);

// 发送好友请求
router.post(
  "/req/:friendid",
  checkPayload({}),
  async (req: Request, res: Response) => {
    const friendId = Number(req.params.friendid);
    try {
      const newRequest = await req.userService.addFriend(
        req.session.user.uid,
        friendId
      );
      req.session.user.friendreq.push(newRequest.To);
      res.json(msgBody("添加好友成功", newRequest));
    } catch (err) {
      res.status(500).json(msgBody("添加好友失败"));
    }
  }
);

// 通过好友请求
router.post(
  "/res/:friendid",
  checkPayload({}),
  async (req: Request, res: Response) => {
    const friendId = Number(req.params.friendid);
    try {
      const result = await req.userService.passFriend(
        req.session.user.uid,
        friendId
      );
      req.session.user.friends.push(result.From);
      const index = req.session.user.friendres
        .map((f) => f.uid)
        .indexOf(result.fromUid);
      req.session.user.friendres.splice(index, 1);
      res.json(msgBody("通过好友请求成功", result));
    } catch (err) {
      res.status(500).json(msgBody("通过好友申请失败"));
    }
  }
);

// 拒绝好友请求
router.delete(
  "/res/:friendid",
  checkPayload({}),
  async (req: Request, res: Response) => {
    const friendId = Number(req.params.friendid);
    try {
      await req.userService.refuseFriend(req.session.user.uid, friendId);
      const result = await req.userService.refuseFriend(
        req.session.user.uid,
        friendId
      );
      const index = req.session.user.friendres
        .map((f) => f.uid)
        .indexOf(friendId);
      req.session.user.friendres.splice(index, 1);
      res.json(msgBody("拒绝好友请求成功", result));
    } catch (err) {
      res.status(500).json(msgBody("拒绝好友申请失败"));
    }
  }
);

export default router;
