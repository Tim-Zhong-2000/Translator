import { Database, USER } from "../type/type";
import sqlite3 = require("sqlite3");
import md5 from "md5";

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
        isDelete    BOOLEAN               NOT NULL\
      )"
    );
  }

  /**
   * 登录接口
   * 登录成功返回用户信息，登录失败抛出错误
   * @param user 账号密码
   * @returns hash
   */
  async login(user: USER.LoginPayload): Promise<USER.UserDbItem> {
    const userLine: USER.UserDbItem = await this.selectUser(
      user.username,
      md5(user.password),
      "email"
    );
    if (!userLine) {
      throw new Error("invaild login");
    }
    return userLine;
  }

  /**
   * 注册接口
   * @param user 注册payload
   * 返回注册成功的用户信息
   */
  async register(user: USER.RegisterPayload) {
    const { email, phone, password, nickname } = user;
    const sataus = await this.insertUser(email, phone, md5(password), nickname);
    if (!sataus) throw new Error("register failed");

    const userinfo = await this.selectUser(email, md5(password), "email");
    if (!userinfo) throw new Error("select user failed! Internal Error!");

    return userinfo;
  }

  /**
   * 用Email查找用户是否存在
   * @param email Email
   */
  async findByEmail(email: string) {
    const findEmail = await this.findUser(email, "email");
    return findEmail;
  }

  /**
   * 用Phone查找用户是否存在
   * @param phone Phone
   */
  async findByPhone(phone: string) {
    const findPhone = await this.findUser(phone, "phone");
    return findPhone;
  }

  /**
   * 用uid查找用户是否存在
   * @param uid uid
   */
  async findByUid(uid: number) {
    const findUid = await this.findUser(uid, "uid");
    return findUid;
  }

  /**
   * 删除账户
   * @param uid
   * @returns uid
   */
  async delete(uid: number) {
    const result = await this.deleteUser(uid);
    if (!result) throw new Error("delete user error");
    return { now: Date.now(), uid: uid };
  }

  /**
   * 更新账号内容
   * @param uid 用户uid
   * @param text 修改内容
   * @param type "email" | "phone" | "nickname" | "password"
   * @returns
   */
  async update(
    uid: number,
    text: string | number,
    type: "email" | "phone" | "nickname" | "password" | "role"
  ) {
    const result = await this.updateUser(uid, text, type);
    if (!result) throw new Error("update user error");
    return { now: Date.now(), uid: uid };
  }

  private async selectUser(
    username: string,
    password: string,
    type: "uid" | "email" | "phone"
  ): Promise<USER.UserDbItem> {
    return new Promise((resolve, reject) => {
      let result: USER.UserDbItem = null;
      const stmt = this.db.prepare(
        `SELECT * FROM user WHERE ${type}=(?) AND password=(?) AND isDelete=false`
      );
      stmt.run(username, password);
      stmt.each((err, row: USER.UserDbItem) => {
        if (err) reject(err);
        if (row.isDelete) return;
        result = row;
      });
      stmt.finalize((err) => {
        if (err) reject(err);
        resolve(result);
      });
      setTimeout(() => {
        reject("timeout");
      }, 2000);
    });
  }

  private async findUser(
    username: string | number,
    type: "uid" | "email" | "phone"
  ) {
    return new Promise((resolve, reject) => {
      let result: USER.UserDbItem = null;
      const stmt = this.db.prepare(
        `SELECT * FROM user WHERE ${type}=(?) AND isDelete=false LIMIT 1`
      );
      stmt.run(username);
      stmt.each((err, row) => {
        if (err) reject(err);
        result = row;
      });
      stmt.finalize((err) => {
        if (err) reject(err);
        resolve(result);
      });
    });
  }

  private async insertUser(
    email: string,
    nickname: string,
    password: string,
    phone?: string
  ) {
    return new Promise((resolve, reject) => {
      const stmt = this.db.prepare("INSERT INTO user VALUES (?,?,?,?,?,?,?,?)");
      stmt.run(
        null,
        email,
        phone,
        nickname,
        password,
        USER.Role.guest,
        Date.now(),
        false
      );
      stmt.finalize((err) => {
        if (err) throw new Error("insert user failed");
        resolve(true);
      });
    });
  }

  private async deleteUser(uid: number) {
    return new Promise((resolve, reject) => {
      const stmt = this.db.prepare(
        "UPDATE user SET isDelete=(?) WHERE uid=(?)"
      );
      stmt.run(true, uid);
      stmt.finalize((err) => {
        if (err) reject(err);
        resolve(true);
      });
    });
  }

  private async updateUser(
    uid: number,
    text: string | number,
    type: "email" | "phone" | "nickname" | "password" | "role"
  ) {
    return new Promise((resolve, reject) => {
      const stmt = this.db.prepare(`UPDATE user SET ${type}=(?) WHERE uid=(?)`);
      stmt.run(text, uid);
      stmt.finalize((err) => {
        if (err) reject(err);
        resolve(true);
      });
    });
  }
}
