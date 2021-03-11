/**
 * @description 百度翻译总模块
 * @author Tim-Zhong-2000
 */
import { TranslateManager } from "../abstract/translateManager";
import { MapCache } from "../cacheEngines/mapCache";
import { BaiduTranslatorCrawler } from "../translateEngines/baiduTranslatorCrawler";

export class BaiduTranslateManager extends TranslateManager {
  constructor(
    translateEngine: BaiduTranslatorCrawler,
    cacheEngine: MapCache
  ) {
    super(translateEngine, cacheEngine);
  }

  async translate(
    src: string,
    srcLang: string,
    destLang: string
  ): Promise<string> {
    let result = "";
    try {
      result = this.readCache(src, srcLang, destLang);
    } catch (error) {
      try {
        result = await this.translateEngine.translate(src, srcLang, destLang);
        this.writeCache(src, srcLang, destLang, result);
      } catch (error) {
        result = "未知错误";
      }
    }
    return result;
  }

  translateSync(src: string, srcLang: string, destLang: string): string {
    throw new Error("sync interface is not available now");
  }

  writeCache(
    src: string,
    srcLang: string,
    destLang: string,
    dest: string
  ): void {
    this.cacheEngine.insert(src, srcLang, destLang, dest);
  }

  readCache(src: string, srcLang: string, destLang: string): string {
    return this.cacheEngine.fetch(src, srcLang, destLang);
  }
}
