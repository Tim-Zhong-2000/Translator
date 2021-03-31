/**
 * @description 谷歌翻译模块，采用`node-google-translate-skidz`包完成接口调用
 * @author Tim-Zhong-2000
 */

import { TranslateEngine } from "../abstract/translateEngine";
import { DestPayload } from "../type/type";
import { generateDestPayload } from "../utils/generateDestPayload";
const translate = require("node-google-translate-skidz"); // not support ts

export class GoogleTranslatorCrawler extends TranslateEngine {
  async translate(
    src: string,
    srcLang: string = "en",
    destLang: string = "zh"
  ): Promise<DestPayload> {
    const req: Promise<string> = new Promise((resolve, reject) => {
      translate(
        { text: src, source: srcLang, target: destLang },
        (result: string) => {
          resolve(result);
        }
      );
      setTimeout(() => {
        reject();
      }, 2000);
    });
    const dest = await req;
    if (!dest) {
      return generateDestPayload(
        false,
        "ai",
        src,
        "服务器翻译服务错误",
        srcLang,
        destLang
      );
    } else {
      return generateDestPayload(true, "ai", src, dest, srcLang, destLang);
    }
  }

  setConfig(config: any): void {
    throw new Error("Method not implemented.");
  }
}
