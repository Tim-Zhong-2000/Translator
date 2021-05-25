/**
 * @description /user/friend 好友模块
 * @author Tim-Zhong-2000
 */

import express, { Request, Response } from "express";
import { errBody } from "../../utils/errorPayload";
import { checkLogin } from "../../utils/userSession";

const router = express.Router();

router.use(checkLogin());

// 获取缓存中的好友列表
router.get("/list", async (req: Request, res: Response) => {
  res.json(req.session.user.friends);
});

// 更新好友列表
router.copy("/list", async (req: Request, res: Response) => {
  try {
    const friendList = await req.userService.getFriendDetail(
      req.session.user.uid,
      "friends"
    );
    req.session.user.friends = friendList;
    res.json(friendList);
  } catch (err) {
    res.status(500).json(errBody(500, "更新好友列表失败"));
  }
});

router.delete("/list/:friendid", async (req: Request, res: Response) => {
  try {
    const friendId = Number(req.params.friendid);
    await req.userService.deleteFriend(req.session.user.uid, friendId);
    const friends = await req.userService.getFriendDetail(
      req.session.user.uid,
      "friends"
    );
    req.session.user.friends = friends;
    res.json(friends);
  } catch (err) {
    res.status(500).json(errBody(500, "删除好友失败"));
  }
});

// 更新好友请求发出列表
router.copy("/req", async (req: Request, res: Response) => {
  try {
    const friendreq = await req.userService.getFriendDetail(
      req.session.user.uid,
      "friendreq"
    );
    req.session.user.friendreq = friendreq;
    res.json(friendreq);
  } catch (err) {
    res.status(500).json(errBody(500, "更新状态失败"));
  }
});

// 发送好友请求
router.post("/req/:friendid", async (req: Request, res: Response) => {
  try {
    const friendId = Number(req.params.friendid);
    console.log(friendId)
    await req.userService.addFriend(req.session.user.uid, friendId);
    const friendReq = await req.userService.getFriendDetail(
      req.session.user.uid,
      "friendreq"
    );
    req.session.user.friendreq = friendReq;
    res.json(friendReq);
  } catch (err) {
    res.status(500).json(errBody(500, "添加好友失败"));
  }
});

// 更新好友请求接收列表
router.copy("/res", async (req: Request, res: Response) => {
  try {
    const friendres = await req.userService.getFriendDetail(
      req.session.user.uid,
      "friendreq"
    );
    req.session.user.friendreq = friendres;
    res.json(friendres);
  } catch (err) {
    res.status(500).json(errBody(500, "更新状态失败"));
  }
});

// 通过好友请求
router.post("/res/:friendid", async (req: Request, res: Response) => {
  try {
    const friendId = Number(req.params.friendid);
    await req.userService.permitFriend(req.session.user.uid, friendId);
    const friendRes = await req.userService.getFriendDetail(
      req.session.user.uid,
      "friendres"
    );
    const friends = await req.userService.getFriendDetail(
      req.session.user.uid,
      "friends"
    );
    req.session.user.friendres = friendRes;
    req.session.user.friends = friends;
    res.json(friends);
  } catch (err) {
    res.status(500).json(errBody(500, "通过好友申请失败"));
  }
});

// 拒绝好友请求
router.delete("/res/:friendid", async (req: Request, res: Response) => {
  try {
    const friendId = Number(req.params.friendid);
    await req.userService.refuseFriend(req.session.user.uid, friendId);
    const friendRes = await req.userService.getFriendDetail(
      req.session.user.uid,
      "friendres"
    );
    req.session.user.friendres = friendRes;
    res.json(friendRes);
  } catch (err) {
    res.status(500).json(errBody(500, "拒绝好友申请失败"));
  }
});

export default router;
