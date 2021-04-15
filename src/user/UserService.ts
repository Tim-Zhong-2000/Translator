import { Database, USER } from "../type/type";
import sqlite3 = require("sqlite3");

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
      user.password
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
    const sataus = await this.insertUser(email, phone, password, nickname);
    if (!sataus) throw new Error("register failed");

    const userinfo = await this.selectUser(email, password);
    if (!userinfo) throw new Error("select user failed! Internal Error!");

    return userinfo;
  }

  private async selectUser(
    username: string,
    password: string
  ): Promise<USER.UserDbItem> {
    return new Promise((resolve, reject) => {
      let result: USER.UserDbItem;
      const stmt = this.db.prepare(
        "SELECT * FROM user WHERE\
        email=(?) OR\
        phone=(?) AND\
        password=(?)\
        "
      );
      stmt.run(username, username, password);
      stmt.each((err, row: USER.UserDbItem) => {
        if (err) reject(err);
        if (row.isDelete) return;
        result = row;
      });
      stmt.finalize((err) => {
        if (err) reject(err);
        if (result) resolve(result);
      });
    });
  }

  private async selectUserByUid(uid: number): Promise<USER.UserDbItem> {
    return new Promise((resolve, reject) => {
      let result: USER.UserDbItem;
      const stmt = this.db.prepare("SELECT * FROM user WHERE uid=(?)");
      stmt.run(uid);
      stmt.each((err, row: USER.UserDbItem) => {
        if (err) reject(err);
        if (row.isDelete) return;
        result = row;
      });
      stmt.finalize((err) => {
        if (err) reject(err);
        if (result) resolve(result);
      });
    });
  }

  private async toUid(text: string, type: "email" | "phone") {
    return 1;
  }

  private async insertUser(
    email: string,
    nickname: string,
    password: string,
    phone?: string
  ) {
    return new Promise((resolve, reject) => {
      const stmt = this.db.prepare("INSERT INTO user (?,?,?,?,?,?,?,?)");
      stmt.run(
        null,
        email,
        phone,
        nickname,
        password,
        JSON.stringify([USER.Role.guest]),
        Date.now(),
        false
      );
      stmt.finalize((err) => {
        if (err) throw new Error("insert user failed");
        resolve(true);
      });
    });
  }
}
