/**
 * @description 使用JavaScript原生Map作为底层数据结构的缓存模块
 * @author Tim-Zhong-2000
 */

import { CacheEngine } from "../abstract/cacheEngine";
import { Payload, MapCacheConfig } from "../../type/Translator";

export class MapCache extends CacheEngine<Map<string, Payload>> {
  constructor(config: MapCacheConfig) {
    super();
    this.db = new Map<string, Payload>();
    this.serivceProviderName = config.serviceProviderName || "unknown";
  }

  fetch(src: string, srcLang: string, destLang: string): Promise<Payload> {
    const reqHash = this.generateHashKey(
      src,
      srcLang,
      destLang,
      this.serivceProviderName
    );
    return new Promise((resolve, reject) => {
      const result = this.db.get(reqHash);
      if (!result) {
        console.log(`MISS:\t${decodeURI(src)}\thash:\t${reqHash}`);
        reject("MISS");
      }
      console.log(`HIT:\t${decodeURI(src)}\thash:\t${reqHash}`);
      resolve(result);
    });
  }

  insert(dest: Payload): void {
    const reqHash = this.generateHashKey(
      dest.src,
      dest.srcLang,
      dest.destLang,
      this.serivceProviderName
    );
    const result = this.db.set(reqHash, dest);
    if (!result) {
      throw new Error("Insert Fail");
    }
  }
}
