/**
 * @description 文本过滤器，配置文件见config.json
 * @author Tim-Zhong-2000
 */

import { FilterConfig, FilterResult, FilterType } from "../../type/Translator";

export class DefaultFilter {
  config: FilterConfig;

  constructor(config: FilterConfig) {
    this.config = config;
  }

  /**
   * 文本过滤
   * @param text 过滤文本
   * @param lang 过滤语言
   * @returns
   */
  exec(text: string, lang: string): FilterResult {
    text = decodeURI(text);
    let pass = true;

    if (this.config.removeSpaceLangs.indexOf(lang) >= 0) {
      text = text.replace(/\ /g, "");
    }

    // 1. prefix filter
    this.config.banPrefixs.forEach((prefix) => {
      if (text.startsWith(prefix)) {
        pass = false;
      }
    });
    if (!pass) {
      return {
        type: FilterType.PROXY,
        text: "",
      } as FilterResult;
    }

    // 2. words filter
    this.config.banWords.forEach((word) => {
      if (text.indexOf(word) > 0) {
        pass = false;
      }
    });
    if (!pass) {
      return {
        type: FilterType.BLOCK,
        text: "词汇违规",
      } as FilterResult;
    }

    // 3. reg filter
    this.config.regs.forEach((regStr) => {
      const reg = RegExp(regStr);
      if (reg.test(text)) {
        pass = false;
      }
    });
    if (!pass) {
      return {
        type: FilterType.BLOCK,
        text: "词汇违规",
      } as FilterResult;
    }

    // 4. api filter (disbale

    return {
      type: FilterType.PASS,
      text: text,
    } as FilterResult;
  }
}
