/**
 * @description 缓存抽象类
 * @author Tim-Zhong-2000
 */
import md5 from "md5";
import { CacheIdentity } from "../type/type";

export abstract class CacheEngine<T = Map<string, string>> {
  db: T = null; // 底层数据结构
  serivceProviderName = "unknown"; // 服务提供商名称

  abstract fetch(src: string, srcLang: string, destLang: string): string;

  abstract insert(
    src: string,
    srcLang: string,
    destLang: string,
    dest: string
  ): void;

  hash(str: string): string {
    return md5(str);
  }

  generateHashKey(src: string, srcLang: string, destLang: string) {
    const origin: CacheIdentity = {
      src: src,
      srcLang: srcLang,
      destLang: destLang,
      serviceProvider: this.serivceProviderName
    };
    return this.hash(JSON.stringify(origin));
  }
}
