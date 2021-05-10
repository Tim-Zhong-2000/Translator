/**
 * @description 使用sqlite3的缓存模块
 * @author Tim-Zhong-2000
 */

import sqlite3 = require("sqlite3");
import { CacheEngine } from "../abstract/cacheEngine";
import { Payload, SqliteCacheConfig, TranslateLevel } from "../../type/Translator";

export class SqliteCache extends CacheEngine<sqlite3.Database> {
  constructor(config: SqliteCacheConfig) {
    super();
    this.db = new sqlite3.Database(config.db.host || ":memory:");
    this.serivceProviderName = config.serviceProviderName || "unknown";
    this.db.run(
      "CREATE TABLE IF NOT EXISTS cache (\
            hash        TEXT      NOT NULL,\
            provider    TEXT      NOT NULL,\
            level       INTERGER  NOT NULL,\
            src         TEXT      NOT NULL,\
            dest        TEXT      NOT NULL,\
            srcLang     TEXT      NOT NULL,\
            destLang    TEXT      NOT NULL,\
            tts         BOOLEAN           ,\
            ttsSrc      TEXT              ,\
            ttsDest     TEXT               \
            )"
    );
  }

  async fetch(
    src: string,
    srcLang: string,
    destLang: string
  ): Promise<Payload> {
    const reqHash = this.generateHashKey(
      src,
      srcLang,
      destLang,
      this.serivceProviderName
    );
    const sqliteProc: Promise<Payload[]> = new Promise((resolve, reject) => {
      const rows: Payload[] = [];
      const stmt = this.db.prepare(
        "SELECT level,src,dest,srcLang,destLang FROM cache \
          WHERE hash=(?)"
      );
      stmt.run(reqHash);
      stmt.each(
        (_err, row: Payload) => rows.push(row),
        (err, count) => {
          if (err) reject(new Error("数据库内部错误"));
          else if (count === 0) reject(new Error("数据不存在"));
          else resolve(rows);
        }
      );
      stmt.finalize();
    });
    try {
      const allResult = await sqliteProc;
      console.log(`HIT:\t${decodeURI(src)}`);
      return this.optimizeResults(allResult);
    } catch (err) {
      console.log(`MISS:\t${decodeURI(src)}`);
      throw err;
    }
  }

  insert(payload: Payload) {
    if (!payload.success) throw new Error("you cant cache a fail payload");
    const {
      level,
      src,
      dest,
      srcLang,
      destLang,
      tts,
      ttsSrc,
      ttsDest,
    } = payload;
    const reqHash = this.generateHashKey(
      src,
      srcLang,
      destLang,
      this.serivceProviderName
    );
    return new Promise<boolean>((resolve, reject) => {
      const stmt = this.db.prepare(
        "INSERT INTO cache VALUES (?,?,?,?,?,?,?,?,?,?)"
      );
      stmt.run(
        reqHash,
        this.serivceProviderName,
        level,
        src,
        dest,
        srcLang,
        destLang,
        tts,
        ttsSrc,
        ttsDest
      );
      stmt.finalize((err) => {
        if (err) reject(new Error("数据库内部错误"));
        else resolve(true);
      });
    });
  }

  /**
   * 选出最佳的一条翻译
   * @param allResults 数据库查询结果
   * @returns
   */
  optimizeResults(allResults: Payload[]): Payload {
    const typeArr = allResults.map((result) => result.level);
    const priority = [
      TranslateLevel.VERIFIED,
      TranslateLevel.USER,
      TranslateLevel.AI,
    ];
    for (const type of priority) {
      const findIndex = typeArr.indexOf(type);
      if (findIndex >= 0) {
        const successTag = { success: true };
        return Object.assign(successTag, allResults[findIndex]);
      }
    }
    throw new Error("optimizer failed");
  }
}
