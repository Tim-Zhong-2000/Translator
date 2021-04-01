import { TranslateManager } from "../abstract/translateManager";
import { MapCache } from "../cacheEngines/mapCache";
import { DefaultFilter } from "../filter/filter";
import { GoogleTranslatorCrawler } from "../translateEngines/googleTranslatorCrawler";
import { Payload } from "../type/type";
import { generatePayload } from "../utils/generatePayload";

/**
 * @description 谷歌翻译总模块
 * @author Tim-Zhong-2000
 */
export class GoogleTranslateManager extends TranslateManager {
  constructor(
    translateEngine: GoogleTranslatorCrawler,
    cacheEngine: MapCache,
    filter: DefaultFilter
  ) {
    super(translateEngine, cacheEngine, filter);
  }

  async translate(
    src: string,
    srcLang: string = "jp",
    destLang: string = "zh"
  ): Promise<Payload> {
    let dest: Payload = null;

    const filterResult = this.filter.exec(src, srcLang);
    switch (filterResult.type) {
      case "pass":
        src = filterResult.text;
        break;
      case "proxy":
        dest = generatePayload(
          true,
          "verified",
          src,
          filterResult.text,
          srcLang,
          destLang
        );
        return dest;
      case "block":
        dest = generatePayload(
          true,
          "ai",
          "",
          filterResult.text,
          srcLang,
          destLang
        );
        return dest;
    }

    try {
      dest = this.readCache(src, srcLang, destLang);
    } catch (error) {
      try {
        dest = await this.translateEngine.translate(src, srcLang, destLang);
        if (dest.success) this.writeCache(dest);
      } catch (error) {
        dest = generatePayload(
          false,
          "ai",
          src,
          "服务器未知错误",
          srcLang,
          destLang
        );
      }
    }
    return dest;
  }

  writeCache(dest: Payload): void {
    this.cacheEngine.insert(dest);
  }

  readCache(src: string, srcLang: string, destLang: string): Payload {
    return this.cacheEngine.fetch(src, srcLang, destLang);
  }
}
