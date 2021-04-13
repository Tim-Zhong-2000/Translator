/**
 * @description 翻译总模块抽象类
 * @author Tim-Zhong-2000
 */

import { DefaultFilter } from "../filter/filter";
import { Payload } from "../type/type";
import { CacheEngine } from "./cacheEngine";
import { TranslateEngine } from "./translateEngine";

export abstract class TranslateManager<CacheType> {
  translateEngine: TranslateEngine = null;
  cacheEngine: CacheEngine<CacheType> = null;
  filter: DefaultFilter = null;

  constructor(
    translateEngine: TranslateEngine,
    cacheEngine: CacheEngine<CacheType>,
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
  ): Promise<Payload>;

  abstract writeCache(dest: Payload): void;

  abstract readCache(src: string, srcLang: string, destLang: string): void;
}
