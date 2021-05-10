import sqlite3 = require("sqlite3");
import md5 from "md5";
import { USER } from "../type/User";
import { Database } from "../type/type";

function errorHandler(err: USER.DBError) {
  if (typeof err !== "number") return new Error("未知错误");
  switch (err) {
    case USER.DBError.AUTH_FAIL:
      return new Error("用户不存在或密码错误");
    case USER.DBError.NOT_EXIST:
      return new Error("用户不存在");
    case USER.DBError.COUNT_TOOMUCH:
      return new Error("数据库异常，用户重复");
    case USER.DBError.INTERNAL_ERROR:
      return new Error("数据库内部错误");
    default:
      return new Error("未知数据库错误");
  }
}

export class UserService {
  db: sqlite3.Database;
  constructor(dbConfig: Database) {
    this.db = new sqlite3.Database(dbConfig.host || ":memory:");
    this.db.run(
      "CREATE TABLE IF NOT EXISTS user(\
        uid         INTEGER PRIMARY KEY   AUTOINCREMENT,\
        email       TEXT                  NOT NULL,\
        phone       TEXT                          ,\
        nickname    TEXT                  NOT NULL,\
        password    TEXT                  NOT NULL,\
        role        INTEGER               NOT NULL,\
        create_at   TEXT                  NOT NULL,\
        active      BOOLEAN               NOT NULL\
      )",
      () => {
        this.register({
          nickname: "admin",
          email: "1@123.com",
          password: "123456",
        }).catch(() => {});
        this.register({
          nickname: "test2",
          email: "2@123.com",
          password: "123456",
        }).catch(() => {});
      }
    );
  }

  /**
   * ## 验证密码(登录)
   * 失败时抛出Error类型错误
   * @param user 账号密码
   * @returns Promise<USER.UserDbItem> without password
   */
  async login(user: USER.LoginPayload): Promise<USER.UserDbItem> {
    try {
      return await this.authUser(user.username, md5(user.password), "email");
    } catch (err) {
      throw errorHandler(err);
    }
  }

  /**
   * ## 新增用户(注册)
   * 失败时抛出Error类型错误
   * @param user 注册payload
   * @returns Promise<USER.UserDbItem> without password
   */
  async register(user: USER.RegisterPayload) {
    const { email, phone, password, nickname } = user;
    if (
      await this.findByEmail(email).catch(() => {
        return false;
      })
    ) {
      throw new Error("邮箱已存在");
    }

    if (phone)
      if (
        await this.findByPhone(phone).catch(() => {
          return false;
        })
      ) {
        throw new Error("手机号码已存在");
      }

    try {
      await this.insertUser(email, nickname, md5(password), phone);
      return await this.authUser(email, md5(password), "email");
    } catch (err) {
      throw errorHandler(err);
    }
  }

  /**
   * ## 用Email查找用户是否存在
   * 失败时抛出Error类型错误
   * @param email
   * @returns Promise<USER.UserDbItem> without password
   */
  async findByEmail(email: string) {
    try {
      return await this.findActiveUser(email, "email");
    } catch (err) {
      throw errorHandler(err);
    }
  }

  /**
   * ## 用手机号码查找用户是否存在
   * 失败时抛出Error类型错误
   * @param phone
   * @returns Promise<USER.UserDbItem> without password
   */
  async findByPhone(phone: string) {
    try {
      return await this.findActiveUser(phone, "phone");
    } catch (err) {
      throw errorHandler(err);
    }
  }

  /**
   * ## 用uid查找用户是否存在
   * 失败时抛出Error类型错误
   * @param uid
   */
  async findByUid(uid: number) {
    try {
      return await this.findActiveUser(uid, "uid");
    } catch (err) {
      throw errorHandler(err);
    }
  }

  /**
   * ## 删除账户
   * 失败时抛出Error类型错误
   * @param uid
   * @returns 操作时间和操作uid
   */
  async delete(uid: number) {
    try {
      await this.deleteUser(uid);
      return { now: Date.now(), uid: uid };
    } catch (err) {
      throw errorHandler(err);
    }
  }

  /**
   * ## 更新账号内容
   * 失败时抛出Error类型错误
   * @param uid 用户uid
   * @param text 修改内容
   * @param type 修改类型 "email" | "phone" | "nickname" | "password"
   * @returns
   */
  async update(
    uid: number,
    text: string | number,
    type: "email" | "phone" | "nickname" | "password" | "role"
  ) {
    try {
      await this.updateUser(uid, text, type);
      return { now: Date.now(), uid: uid };
    } catch (err) {
      throw errorHandler(err);
    }
  }

  /**
   * ## 验证用户密码
   * 失败时抛出USER.DBError类型错误
   * @param text 搜索文本 uid: number | email: string | phone: string 
   * @param password 哈希后的密码
   * @param type "uid" | "email" | "phone" 
   * @returns Promise<USER.UserDbItem> without password
   */
  private async authUser(
    text: string|number,
    password: string,
    type: "uid" | "email" | "phone"
  ): Promise<USER.UserDbItem> {
    return new Promise((resolve, reject) => {
      let result: USER.UserDbItem = null;
      const stmt = this.db.prepare(
        `SELECT * FROM user WHERE ${type}=(?) AND password=(?) AND active=true`
      );
      stmt.run(text, password);
      stmt.each(
        (_err, row: USER.UserDbItem) => {
          delete row.password;
          result = row;
        },
        (err, count) => {
          if (err) reject(USER.DBError.INTERNAL_ERROR);
          else if (count === 0) reject(USER.DBError.AUTH_FAIL);
          else if (count === 1) resolve(result);
          else reject(USER.DBError.COUNT_TOOMUCH);
        }
      );
      stmt.finalize();
    });
  }

  /**
   * ## 查找已启用用户
   * @param text 搜索文本 uid: number | email: string | phone: string
   * @param type 文本类型 "uid" | "email" | "phone"
   * @returns Promise<USER.UserDbItem> without password
   */
  findActiveUser(
    text: string | number,
    type: "uid" | "email" | "phone"
  ) {
    return this.findUserBase(text, type, true);
  }

  /**
   * ## 查找已禁用用户
   * @param text 搜索文本 uid: number | email: string | phone: string
   * @param type 文本类型 "uid" | "email" | "phone"
   * @returns Promise<USER.UserDbItem> without password
   */
  findInactiveUser(
    text: string | number,
    type: "uid" | "email" | "phone"
  ) {
    return this.findUserBase(text, type, false);
  }

  /**
   * 查找用户的基础函数
   * @param text 搜索文本 uid: number | email: string | phone: string
   * @param type 文本类型 "uid" | "email" | "phone"
   * @param active 账户是否启用
   * @returns Promise<USER.UserDbItem> without password
   */
  private findUserBase(
    text: string | number,
    type: "uid" | "email" | "phone",
    active: boolean
  ) {
    return new Promise<USER.UserDbItem>((resolve, reject) => {
      let result: USER.UserDbItem = null;
      const stmt = this.db.prepare(
        `SELECT * FROM user WHERE ${type}=(?) AND active=(?) LIMIT 1`
      );
      stmt.run(text, active);
      stmt.each(
        (_err, row: USER.UserDbItem) => {
          delete row.password;
          result = row;
        },
        (err, count) => {
          if (err) reject(USER.DBError.INTERNAL_ERROR);
          else if (count === 0) reject(USER.DBError.NOT_EXIST);
          else resolve(result);
        }
      );
      stmt.finalize();
    });
  }

  /**
   * ## 新增用户
   * 失败时抛出USER.DBError类型错误
   * @param email 
   * @param nickname 
   * @param password 
   * @param phone 
   * @returns Promise<boolean>
   */
  private async insertUser(
    email: string,
    nickname: string,
    password: string,
    phone?: string
  ) {
    return new Promise<boolean>((resolve, reject) => {
      const stmt = this.db.prepare("INSERT INTO user VALUES (?,?,?,?,?,?,?,?)");
      stmt.run(
        null,
        email,
        phone,
        nickname,
        password,
        USER.Role.guest,
        Date.now(),
        true
      );
      stmt.finalize((err) => {
        if (err) reject(USER.DBError.INTERNAL_ERROR);
        else resolve(true);
      });
    });
  }

  /**
   * ## 删除用户
   * 失败时抛出USER.DBError类型错误
   * @param uid 
   * @returns Promise<boolean>
   */
  private async deleteUser(uid: number) {
    return new Promise<boolean>((resolve, reject) => {
      const stmt = this.db.prepare("UPDATE user SET active=(?) WHERE uid=(?)");
      stmt.run(true, uid);
      stmt.finalize((err) => {
        if (err) reject(USER.DBError.INTERNAL_ERROR);
        else resolve(true);
      });
    });
  }

  /**
   * ## 更新用户信息
   * 失败时抛出USER.DBError类型错误
   * @param uid 
   * @param text 搜索文本 uid: number | email: string | phone: string
   * @param type 文本类型 "uid" | "email" | "phone"
   * @returns Promise<boolean>
   */
  private async updateUser(
    uid: number,
    text: string | number,
    type: "email" | "phone" | "nickname" | "password" | "role"
  ) {
    return new Promise<boolean>((resolve, reject) => {
      const stmt = this.db.prepare(`UPDATE user SET ${type}=(?) WHERE uid=(?)`);
      stmt.run(text, uid);
      stmt.finalize((err) => {
        if (err) reject(USER.DBError.INTERNAL_ERROR);
        else resolve(true);
      });
    });
  }
}
