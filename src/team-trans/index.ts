/**
 * @description 人工翻译模块
 * @author Tim-Zhong-2000
 */

import CONFIG from "../utils/config";
import sqlite3 = require("sqlite3");
import ISO963_1 from "../type/ISO963";
import { CacheEngine } from "../translator/abstract/cacheEngine";
import { Payload, TranslateLevel } from "../type/Translator";
import { checkArrayType, NumberChecker } from "../utils/checkArrayType";
import { generatePayload } from "../utils/generatePayload";
import { USER } from "../type/User";
import { PrismaClient } from "@prisma/client";

export class TeamTrans {
  db: PrismaClient;

  constructor() {
    this.db = new PrismaClient();
  }

  /**
   * ## 获取翻译
   * 获取的翻译包含:
   * 1. 所有privacy为`USER.PrivacyLabel.public`的公开翻译
   * 2. providers数组中的用户
   * @param src
   * @param srcLang
   * @param destLang
   * @param providers
   */
  async get(
    src: string,
    srcLang: ISO963_1,
    destLang: ISO963_1,
    providers: number[]
  ): Promise<Payload[]> {
    const hashKey = CacheEngine.generateHashKey(src, srcLang, destLang);
    const results = await this.db.translate.findMany({
      where: {
        OR: [
          { hash: hashKey, userUid: { in: providers } },
          {
            hash: hashKey,
            level: TranslateLevel.USER,
            privacy: USER.PrivacyLabel.public,
          },
          { hash: hashKey, level: TranslateLevel.VERIFIED },
        ],
      },
      include: {
        Provider: {
          select: {
            uid: true,
            name: true,
          },
        },
      },
    });
    return results.map((r) =>
      generatePayload(
        true,
        r.level,
        r.src,
        r.dest,
        r.srcLang,
        r.destLang,
        r.Provider
      )
    );
  }
 
  /**
   * ## 添加一条人工翻译
   * 如果已存在，更新当前翻译
   * @param src
   * @param srcLang
   * @param dest
   * @param destLang
   * @param provider 当前用户uid
   * @param privacy
   */
   async add(
    src: string,
    srcLang: ISO963_1,
    dest: string,
    destLang: ISO963_1,
    provider: number,
    privacy: USER.PrivacyLabel
  ) {
    const hashKey = CacheEngine.generateHashKey(src, srcLang, destLang);
    await this.db.translate.upsert({
      where: {
        hash_userUid: {
          hash: hashKey,
          userUid: provider,
        },
      },
      create: {
        hash: hashKey,
        src: src,
        srcLang: srcLang,
        dest: dest,
        destLang: destLang,
        level: TranslateLevel.USER,
        privacy: privacy,
        Provider: { connect: { uid: provider } },
      },
      update: {
        dest: dest,
        privacy: privacy,
      },
    });
  }

  /**
   * ## 删除翻译
   * @param src
   * @param srcLang
   * @param destLang
   * @param provider uid
   */
  async delete(
    src: string,
    srcLang: ISO963_1,
    destLang: ISO963_1,
    provider: number
  ) {
    return await this.db.translate.delete({
      where: {
        hash_userUid: {
          hash: CacheEngine.generateHashKey(src, srcLang, destLang),
          userUid: provider,
        },
      },
    });
  }
}
