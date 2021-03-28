/**
 * @description 翻译总模块抽象类
 * @author Tim-Zhong-2000
 */
import { DefaultFilter } from "../filter/filter";
import { DestPayload } from "../type/type";
import { CacheEngine } from "./cacheEngine";
import { TranslateEngine } from "./translateEngine";

export abstract class TranslateManager {
  translateEngine: TranslateEngine = null;
  cacheEngine: CacheEngine = null;
  filter: DefaultFilter = null;

  constructor(
    translateEngine: TranslateEngine,
    cacheEngine: CacheEngine,
    filter: DefaultFilter
  ) {
    if (!!translateEngine && !!cacheEngine) {
      this.translateEngine = translateEngine;
      this.cacheEngine = cacheEngine;
      this.filter = filter;
    } else {
      throw new Error("translateEngine or cacheEngine missing");
    }
  }
  
  abstract translate(
    src: string,
    srcLang: string,
    destLang: string
  ): Promise<DestPayload>;

  abstract writeCache(
    src: string,
    srcLang: string,
    destLang: string,
    dest: DestPayload
  ): void;

  abstract readCache(src: string, srcLang: string, destLang: string): void;
}
