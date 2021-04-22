/**
 * @description 缓存抽象类
 * @author Tim-Zhong-2000
 */

import md5 from "md5";
import { CacheIdentity, Payload } from "../../type/type";

export abstract class CacheEngine<T> {
  db: T = null; // 底层数据结构
  serivceProviderName = "unknown"; // 服务提供商名称

  abstract fetch(
    src: string,
    srcLang: string,
    destLang: string
  ): Promise<Payload>;

  abstract insert(dest: Payload): void;

  hash(str: string): string {
    return md5(str);
  }

  generateHashKey(
    src: string,
    srcLang: string,
    destLang: string,
    provider: string
  ) {
    const origin: CacheIdentity = {
      src: src,
      srcLang: srcLang,
      destLang: destLang,
      provider: provider,
    };
    return this.hash(JSON.stringify(origin));
  }
}
