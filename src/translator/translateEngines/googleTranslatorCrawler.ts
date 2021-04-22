/**
 * @description 谷歌翻译模块
 * @author Tim-Zhong-2000
 */

import axios from "axios";
import { TranslateEngine } from "../abstract/translateEngine";
import { Payload, TranslateLevel } from "../../type/type";
import { generatePayload } from "../../utils/generatePayload";

export class GoogleTranslatorCrawler extends TranslateEngine {
  UA = "";

  constructor(config: any) {
    super();
    if (!!config) {
      this.setConfig(config);
    } else {
      throw new Error("config should not be empty");
    }
  }

  /**
   * 请求翻译接口
   * @param src 源文本
   * @param srcLang 源语言
   * @param destLang 目标语言
   * @returns `Promise<Payload>` 翻译结果
   */
  async translate(
    src: string,
    srcLang: string = "en",
    destLang: string = "zh"
  ): Promise<Payload> {
    const dest = await this.googleTranslate(src, srcLang, destLang);
    if (!dest) {
      return generatePayload(
        false,
        TranslateLevel.AI,
        src,
        "服务器翻译服务错误",
        srcLang,
        destLang
      );
    } else {
      return generatePayload(true, TranslateLevel.AI, src, dest, srcLang, destLang);
    }
  }

  googleTranslate(
    src: string,
    srcLang: string,
    destLang: string
  ): Promise<string> {
    const api = "https://translate.google.cn/translate_a/single";
    const url = `${api}?client=t&sl=${srcLang}&tl=${destLang}&dt=rm&dt=t&tk=${this.googleToken(
      src
    )}&q=${encodeURIComponent(src)}`;
    return new Promise((resolve, reject) => {
      axios
        .get(url, {
          headers: this.getHeader(),
        })
        .then((res) => {
          if (!!res.data) {
            resolve(res.data[0][0][0] as string);
          }
        })
        .catch((e) => reject);
    });
  }

  // Forked from https://github.com/cocoa520/Google_TK
  googleToken(r: any) {
    for (var a = 406644, e = [], h = 0, n = 0; n < r.length; n++) {
      var o = r.charCodeAt(n);
      128 > o
        ? (e[h++] = o)
        : (2048 > o
            ? (e[h++] = (o >> 6) | 192)
            : (55296 == (64512 & o) &&
              n + 1 < r.length &&
              56320 == (64512 & r.charCodeAt(n + 1))
                ? ((o =
                    65536 + ((1023 & o) << 10) + (1023 & r.charCodeAt(++n))),
                  (e[h++] = (o >> 18) | 240),
                  (e[h++] = ((o >> 12) & 63) | 128))
                : (e[h++] = (o >> 12) | 224),
              (e[h++] = ((o >> 6) & 63) | 128)),
          (e[h++] = (63 & o) | 128));
    }
    function t(r: any, t: any) {
      for (var a = 0; a < t.length - 2; a += 3) {
        var e;
        if ((e = t.charAt(a + 2)) >= "a") {
          e = e.charCodeAt(0) - 87;
        } else {
          e = Number(e);
        }
        e = "+" == t.charAt(a + 1) ? r >>> e : r << e;
        r = "+" == t.charAt(a) ? (r + e) & 4294967295 : r ^ e;
      }
      return r;
    }
    for (r = a, h = 0; h < e.length; h++) (r += e[h]), (r = t(r, "+-a^+6"));
    return (
      (r = t(r, "+-3^+b+-f")),
      0 > (r ^= 3293161072) && (r = 2147483648 + (2147483647 & r)),
      (r %= 1e6).toString() + "." + (r ^ a)
    );
  }

  /**
   * 构建header
   * @returns 构建的header
   */
  private getHeader() {
    return {
      "Content-Type": "application/x-www-form-urlencoded; charset=UTF-8",
      "User-Agent": this.UA,
      Host: "translate.google.cn",
      Origin: "https://translate.google.cn",
      Referer: "https://translate.google.cn/",
      "sec-ch-ua":
        "'Chromium';v='88', 'Google Chrome';v='88', ';Not A Brand';v='99'",
    };
  }

  setConfig(config: any): void {
    this.UA = config.UA;
  }
}
