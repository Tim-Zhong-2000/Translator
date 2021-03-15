/**
 * @description 百度翻译API总模块
 */
import { TranslateManager } from "../abstract/translateManager";
import { MapCache } from "../cacheEngines/mapCache";
import { BaiduTranslatorAPI } from "../translateEngines/baiduTranslatorApi";
import { DestPayload } from "../type/type";
import { generateDestPayload } from "../utils/generateDestPayload";

export class BaiduTranslatorApiManager extends TranslateManager {
  constructor(translateEngine: BaiduTranslatorAPI, cacheEngine: MapCache) {
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
        this.writeCache(src, srcLang, destLang, result);
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
