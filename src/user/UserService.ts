import sqlite3 = require("sqlite3");
import md5 from "md5";
import { USER } from "../type/User";
import { Database } from "../type/type";
import { PrismaClient, User } from "@prisma/client";

const selectWithoutPassword = {
  uid: true,
  name: true,
  email: true,
  phone: true,
  role: true,
  create_at: true,
  is_delete: true,
};

const selectUidNameRole = {
  uid: true,
  name: true,
  role: true,
};

export class UserService {
  db: PrismaClient;
  constructor(dbConfig: Database) {
    this.db = new PrismaClient();
    this.initUser();
  }

  async initUser() {
    try {
      await this.register(
        { name: "AI_1", email: "AI1", password: "123456" },
        1
      );
    } catch (err) {}
    try {
      await this.register(
        { name: "AI_2", email: "AI2", password: "123456" },
        2
      );
    } catch (err) {}
    try {
      await this.register(
        { name: "admin", email: "admin", password: "123456" },
        3
      );
    } catch (err) {}
    await this.update(3, { role: USER.Role.admin });
  }

  /**
   * ## 验证密码(登录)
   * 失败时抛出Error类型错误
   * @param user 账号密码
   * @returns Promise<USER.UserDbItem> without password
   */
  async login(payload: USER.LoginPayload): Promise<Omit<User, "password">> {
    const user = await this.db.user.findUnique({
      where: {
        email: payload.email,
      },
    });
    if (!user || user.password !== payload.password) {
      throw new Error("邮箱不存在或密码错误");
    } else {
      delete user.password;
      return user;
    }
  }

  /**
   * ## 新增用户(注册)
   * 失败时抛出Error类型错误
   * @param payload 注册payload
   * @returns Promise<USER.UserDbItem> without password
   */
  async register(payload: USER.RegisterPayload, uid?: number) {
    const emailCount = await this.db.user.count({
      where: {
        email: payload.email,
      },
    });
    if (emailCount !== 0) {
      throw new Error("邮箱已存在");
    }
    const newUser = await this.db.user.create({
      data: {
        uid: uid,
        name: payload.name,
        email: payload.email,
        password: payload.password,
        role: USER.Role.user,
      },
      select: selectWithoutPassword,
    });
    await this.db.resource.create({
      data: {
        User: { connect: { uid: newUser.uid } },
        translate: 10000,
        ocr: 500,
      },
    });
    return newUser;
  }

  /**
   * ## 列出用户列表
   * @param limit 获取数量
   * @param offset 偏移量
   * @returns 用户列表 USER.UserDbItem[] without password
   */
  async listUser(
    limit: number,
    offset: number
  ): Promise<Omit<User, "password">[]> {
    return await this.db.user.findMany({
      select: selectWithoutPassword,
      take: limit,
      skip: offset,
    });
  }

  /**
   * ## 列出启用账户列表
   * 失败时抛出Error类型错误
   * @param limit 获取数量
   * @param offset 偏移量
   * @returns 用户列表 USER.UserDbItem[] without password
   */
  async listActiveUser(
    limit = 100,
    offset = 0
  ): Promise<Omit<User, "password">[]> {
    return await this.db.user.findMany({
      where: { is_delete: false },
      select: selectWithoutPassword,
      take: limit,
      skip: offset,
    });
  }

  /**
   * ## 列出禁用用户列表
   * 失败时抛出Error类型错误
   * @param limit 获取数量
   * @param offset 偏移量
   * @returns 用户列表 USER.UserDbItem[] without password
   */
  async listInactiveUser(
    limit = 100,
    offset = 0
  ): Promise<Omit<User, "password">[]> {
    return await this.db.user.findMany({
      where: { is_delete: false },
      select: selectWithoutPassword,
      take: limit,
      skip: offset,
    });
  }

  /**
   * ## 根据uid范围获取用户列表
   * @param uidStart 起始uid
   * @param uidEnd 终止uid
   * @param limit 获取数量
   * @param offset 偏移量
   * @returns 用户列表 User without password
   */
  async listUserByUidRange(
    uidStart: number,
    uidEnd: number,
    limit = 100,
    offset = 0
  ): Promise<Omit<User, "password">[]> {
    return await this.db.user.findMany({
      where: {
        is_delete: false,
        uid: {
          gte: uidStart,
          lte: uidEnd,
        },
      },
      select: selectWithoutPassword,
      take: limit,
      skip: offset,
    });
  }

  /**
   * ## 根据创建时间范围获取用户列表
   * @param timeStart 起始时间
   * @param timeEnd 终止时间
   * @param limit 获取数量
   * @param offset 偏移量
   * @returns 用户列表 USER.UserDbItem[] without password
   */
  async listUserByCreateTimeRange(
    timeStart: number,
    timeEnd: number,
    limit = 100,
    offset = 0
  ): Promise<Omit<User, "password">[]> {
    return await this.db.user.findMany({
      where: {
        create_at: {
          gte: new Date(timeStart),
          lte: new Date(timeEnd),
        },
      },
      select: selectWithoutPassword,
      take: limit,
      skip: offset,
    });
  }

  async update(uid: number, payload: Partial<Omit<User, "uid" | "create_at">>) {
    return await this.db.user.update({
      where: {
        uid: uid,
      },
      data: payload,
      select: selectWithoutPassword,
    });
  }

  /**
   * 获取好友列表
   */
  async getFriendInfo(uid: number) {
    const myRelation = await this.db.user.findUnique({
      where: {
        uid,
      },
      include: {
        From: {
          include: {
            To: {
              select: selectUidNameRole,
            },
          },
        },
        To: {
          include: {
            From: {
              select: selectUidNameRole,
            },
          },
        },
      },
    });
    const passFrom = myRelation.From.filter((r) => r.pass).map((r) => r.To);
    const passTo = myRelation.To.filter((r) => r.pass).map((r) => r.From);
    const unpassFrom = myRelation.From.filter((r) => !r.pass).map((r) => r.To);
    const unpassTo = myRelation.To.filter((r) => !r.pass).map((r) => r.From);
    return {
      friends: passFrom.concat(passTo),
      friendreq: unpassFrom,
      friendres: unpassTo,
    };
  }

  async deleteFriend(uid: number, friendUid: number) {
    const friendInfo = await this.getFriendInfo(uid);
    if (friendInfo.friends.filter((f) => f.uid === friendUid).length === 0) {
      throw new Error("不存在好友关系无法删除");
    }
    await this.db.friend.deleteMany({
      where: {
        OR: [
          { fromUid: uid, toUid: friendUid },
          {
            fromUid: friendUid,
            toUid: uid,
          },
        ],
      },
    });
    return await this.getFriendInfo(uid);
  }

  async addFriend(uid: number, friendUid: number) {
    return await this.db.friend.create({
      data: {
        From: { connect: { uid: uid } },
        To: { connect: { uid: friendUid } },
        pass: false,
      },
      select: {
        To: { select: selectUidNameRole },
      },
    });
  }

  async passFriend(uid: number, friendUid: number) {
    return await this.db.friend.update({
      where: {
        fromUid_toUid: {
          fromUid: friendUid,
          toUid: uid,
        },
      },
      data: { pass: true },
      include: {
        From: { select: selectUidNameRole },
      },
    });
  }

  async refuseFriend(uid: number, friendUid: number) {
    return await this.db.friend.delete({
      where: {
        fromUid_toUid: {
          fromUid: friendUid,
          toUid: uid,
        },
      },
    });
  }
}
