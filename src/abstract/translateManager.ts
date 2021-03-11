/**
 * @description 翻译总模块抽象类
 * @author Tim-Zhong-2000
 */
import { CacheEngine } from "./cacheEngine";
import { TranslateEngine } from "./translateEngine";

export abstract class TranslateManager {
  translateEngine: TranslateEngine = null;
  cacheEngine: CacheEngine = null;
  constructor(translateEngine: TranslateEngine, cacheEngine: CacheEngine) {
    if (!!translateEngine && !!cacheEngine) {
      this.translateEngine = translateEngine;
      this.cacheEngine = cacheEngine;
    } else {
      throw new Error("translateEngine or cacheEngine missing");
    }
  }
  abstract translate(
    src: string,
    srcLang: string,
    destLang: string
  ): Promise<string>;

  abstract translateSync?(
    src: string,
    srcLang: string,
    destLang: string
  ): string;
  
  abstract writeCache(
    src: string,
    srcLang: string,
    destLang: string,
    dest: string
  ): void;
  
  abstract readCache(src: string, srcLang: string, destLang: string): void;
}
