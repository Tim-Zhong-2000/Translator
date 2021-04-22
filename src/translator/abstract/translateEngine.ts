/**
 * @description 翻译抽象类
 * @author Tim-Zhong-2000
 */

import { Payload } from "../../type/type";

export abstract class TranslateEngine {
  abstract translate(
    src: string,
    srcLang: string,
    destLang: string
  ): Promise<Payload>;

  abstract translate(src: string): Promise<Payload>;
  
  abstract setConfig(config: any): void;
}
