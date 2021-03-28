import { FilterConfig, FilterResult } from "../type/type";

export class DefaultFilter {
  config: FilterConfig;

  constructor(config: FilterConfig) {
    this.config = config;
  }

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
        type: "proxy",
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
        type: "block",
        text: "词汇违规",
      } as FilterResult;
    }

    // 3. reg filter (disable
    // 4. api filter (disbale

    return {
      type: "pass",
      text: text,
    } as FilterResult;
  }
}
