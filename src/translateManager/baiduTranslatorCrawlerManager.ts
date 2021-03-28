/**
 * @description 百度翻译总模块
 * @author Tim-Zhong-2000
 */
import { TranslateManager } from "../abstract/translateManager";
import { MapCache } from "../cacheEngines/mapCache";
import { DefaultFilter } from "../filter/filter";
import { BaiduTranslatorCrawler } from "../translateEngines/baiduTranslatorCrawler";
import { DestPayload } from "../type/type";
import { generateDestPayload } from "../utils/generateDestPayload";

export class BaiduTranslateManager extends TranslateManager {
  constructor(
    translateEngine: BaiduTranslatorCrawler,
    cacheEngine: MapCache,
    filter: DefaultFilter
  ) {
    super(translateEngine, cacheEngine, filter);
  }

  async translate(
    src: string,
    srcLang: string,
    destLang: string
  ): Promise<DestPayload> {
    let result: DestPayload = null;

    const filterResult = this.filter.exec(src, srcLang);
    switch (filterResult.type) {
      case "pass":
        src = filterResult.text;
        break;
      case "proxy":
        result = generateDestPayload(
          true,
          src,
          filterResult.text,
          srcLang,
          destLang
        );
        return result;
      case "block":
        result = generateDestPayload(
          true,
          "",
          filterResult.text,
          srcLang,
          destLang
        );
        return result;
    }

    try {
      result = this.readCache(src, srcLang, destLang);
    } catch (error) {
      try {
        result = await this.translateEngine.translate(src, srcLang, destLang);
        if (result.success) {
          this.writeCache(src, srcLang, destLang, result);
        }
      } catch (error) {
        result = generateDestPayload(false, src, "服务器未知错误", srcLang, destLang);
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
