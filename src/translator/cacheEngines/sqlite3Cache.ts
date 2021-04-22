/**
 * @description 使用sqlite3的缓存模块
 * @author Tim-Zhong-2000
 */

import sqlite3 = require("sqlite3");
import { CacheEngine } from "../abstract/cacheEngine";
import { Payload, SqliteCacheConfig, TranslateLevel } from "../../type/type";

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
      stmt.each((err: Error, row: Payload) => {
        if (err) reject(err);
        rows.push(row);
      });
      stmt.finalize((err) => {
        if (err) reject(err);
        resolve(rows);
      });
    });
    const allResult = await sqliteProc;
    if (allResult && allResult.length > 0) {
      console.log(`HIT:\t${decodeURI(src)}`);
      return this.optimizeResults(allResult);
    } else {
      console.log(`MISS:\t${decodeURI(src)}`);
      throw new Error("MISS");
    }
  }

  insert(payload: Payload): void {
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
    stmt.finalize();
  }

  optimizeResults(allResults: Payload[]) {
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
