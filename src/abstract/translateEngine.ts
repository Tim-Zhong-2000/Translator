/**
 * @description 翻译抽象类
 * @author Tim-Zhong-2000
 */

import { DestPayload } from "../type/type";

export abstract class TranslateEngine {
  abstract translate(
    src: string,
    srcLang: string,
    destLang: string
  ): Promise<DestPayload>;
  abstract translate(src: string): Promise<DestPayload>;
  abstract setConfig(config: any): void;
}
