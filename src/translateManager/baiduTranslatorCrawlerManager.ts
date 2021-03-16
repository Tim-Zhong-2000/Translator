/**
 * @description 百度翻译总模块
 * @author Tim-Zhong-2000
 */
import { TranslateManager } from "../abstract/translateManager";
import { MapCache } from "../cacheEngines/mapCache";
import { BaiduTranslatorCrawler } from "../translateEngines/baiduTranslatorCrawler";
import { DestPayload } from "../type/type";
import { generateDestPayload } from "../utils/generateDestPayload";

export class BaiduTranslateManager extends TranslateManager {
  constructor(translateEngine: BaiduTranslatorCrawler, cacheEngine: MapCache) {
    super(translateEngine, cacheEngine);
  }

  async translate(
    src: string,
    srcLang: string,
    destLang: string
  ): Promise<DestPayload> {
    let result: DestPayload = null;
    try {
      result = this.readCache(src, srcLang, destLang);
    } catch (error) {
      try {
        result = await this.translateEngine.translate(src, srcLang, destLang);
        if (result.success) {
          this.writeCache(src, srcLang, destLang, result);
        }
      } catch (error) {
        result = generateDestPayload(false, src, "未知错误", srcLang, destLang);
      }
    }
    return result;
  }

  writeCache(
    src: string,
    srcLang: string,
    destLang: string,
    dest: DestPayload
  ): void {
    this.cacheEngine.insert(src, srcLang, destLang, dest);
  }

  readCache(src: string, srcLang: string, destLang: string): DestPayload {
    return this.cacheEngine.fetch(src, srcLang, destLang);
  }
}
