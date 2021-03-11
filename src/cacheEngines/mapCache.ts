/**
 * @description 使用JavaScript原生Map作为底层数据结构的缓存模块
 * @author Tim-Zhong-2000
 */

import { CacheEngine } from "../abstract/cacheEngine";
import { MapCacheConfig } from "../type/type";

export class MapCache extends CacheEngine<Map<string, string>> {
  constructor(config: MapCacheConfig) {
    super();
    this.db = new Map<string, string>();  
    this.serivceProviderName = config.serviceProvicerName || "unknown";
  }

  fetch(src: string, srcLang: string, destLang: string): string {
    const result = this.db.get(this.generateHashKey(src, srcLang, destLang));
    if (!result) {
      console.log(`MISS:\t${this.generateHashKey(src, srcLang, destLang)}`);
      throw new Error("MISS");
    }
    console.log(`HIT:\t${this.generateHashKey(src, srcLang, destLang)}`);
    return result;
  }

  insert(src: string, srcLang: string, destLang: string, dest: string): void {
    const result = this.db.set(
      this.generateHashKey(src, srcLang, destLang),
      dest
    );
    if (!result) {
      throw new Error("Insert Fail");
    }
  }
}
