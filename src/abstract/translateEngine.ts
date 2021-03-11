/**
 * @description 翻译抽象类
 * @author Tim-Zhong-2000
 */
export abstract class TranslateEngine {
  abstract translate(src: string, srcLang: string, destLang: string): Promise<string>;
  abstract translate(src: string): Promise<string>;
  abstract setConfig(config:any):void;
}