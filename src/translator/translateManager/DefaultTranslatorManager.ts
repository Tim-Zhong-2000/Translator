/**
 * @description 管理模块
 * @author Tim-Zhong-2000
 */

import { CacheEngine } from "../abstract/cacheEngine";
import { TranslateEngine } from "../abstract/translateEngine";
import { TranslateManager } from "../abstract/translateManager";
import { DefaultFilter } from "../filter/filter";
import { FilterType, Payload, TranslateLevel } from "../../type/Translator";
import { generatePayload } from "../../utils/generatePayload";

export class DefaultTranslatorManager<
  CacheType
> extends TranslateManager<CacheType> {
  constructor(
    translateEngine: TranslateEngine,
    cacheEngine: CacheEngine<CacheType>,
    filter: DefaultFilter
  ) {
    super(translateEngine, cacheEngine, filter);
  }

  /**
   * 翻译函数，进行过滤与缓存
   * @param src 源文本
   * @param srcLang 源语言
   * @param destLang 目标语言
   * @returns `Promise<Payload>` 翻译结果
   */
  async translate(
    src: string,
    srcLang: string,
    destLang: string
  ): Promise<Payload> {
    const filterResult = this.filter.exec(src, srcLang);
    switch (filterResult.type) {
      case FilterType.PASS:
        src = filterResult.text;
        break;
      case FilterType.PROXY:
        return generatePayload(
          true,
          TranslateLevel.VERIFIED,
          src,
          filterResult.text,
          srcLang,
          destLang
        );
      case FilterType.BLOCK:
        console.log(`BAN:\t${src}`);
        return generatePayload(
          true,
          TranslateLevel.AI,
          "",
          filterResult.text,
          srcLang,
          destLang
        );
    }

    try {
      console.time("readCache");
      const payload = await this.readCache(src, srcLang, destLang);
      payload.success = true;
      return payload;
    } catch (err) {
      console.log(err)
    } finally {
      console.timeEnd("readCache");
    }

    try {
      console.time("translate");
      const payload = await this.translateEngine.translate(src, srcLang, destLang);
      this.writeCache(payload);
      return payload;
    } catch (err) {
      return generatePayload(
        false,
        TranslateLevel.AI,
        src,
        err.message,
        srcLang,
        destLang
      );
    } finally {
      console.timeEnd("translate");
    }
  }

  writeCache(dest: Payload): void {
    this.cacheEngine.insert(dest);
  }

  async readCache(
    src: string,
    srcLang: string,
    destLang: string
  ): Promise<Payload> {
    return this.cacheEngine.fetch(src, srcLang, destLang);
  }
}
