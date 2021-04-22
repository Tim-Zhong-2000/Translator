/**
 * @description 百度翻译API，APPID与KEY需要在https://api.fanyi.baidu.com/ 申请
 * @author Tim-Zhong-2000
 */

import axios from "axios";
import md5 from "md5";
import { TranslateEngine } from "../abstract/translateEngine";
import { Payload, BaiduTranslatorAPIConfig, TranslateLevel } from "../../type/type";
import { generatePayload } from "../../utils/generatePayload";

export class BaiduTranslatorAPI extends TranslateEngine {
  private APPID: string;
  private KEY: string;
  private SALT = "1435660288";
  private ttsEnabled: boolean;

  private get isConfigEmpty() {
    return this.APPID === "" && this.KEY === "";
  }

  constructor(config: BaiduTranslatorAPIConfig) {
    super();
    if (!!config) {
      this.setConfig(config);
      console.log(`api configurattion apply: ${config.APPID}`);
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
    srcLang: string = "jp",
    destLang: string = "zh"
  ) {
    if (srcLang === destLang) {
      return generatePayload(true, TranslateLevel.VERIFIED, src, src, srcLang, destLang);
    }
    if (this.isConfigEmpty) {
      return generatePayload(
        false,
        TranslateLevel.VERIFIED,
        src,
        "此翻译服务器未设置API账户",
        srcLang,
        destLang
      );
    }
    const res = await axios.get(
      `https://fanyi-api.baidu.com/api/trans/vip/translate` +
        `?q=${src}&from=${srcLang}&to=${destLang}&appid=${this.APPID}&salt=${
          this.SALT
        }&sign=${this.sign(src)}`
    );
    if (!!res && !!res.data) {
      try {
        let Payload = generatePayload(
          true,
          TranslateLevel.AI,
          src,
          res.data.trans_result[0].dst as string,
          srcLang,
          destLang
        );
        if (this.ttsEnabled) {
          Payload = Object.assign(Payload, {
            ttsSrc: res.data["src_tts"],
            ttsDest: res.data["dst_tts"],
          } as Payload);
        }
        return Payload;
      } catch (error) {
        return generatePayload(
          false,
          TranslateLevel.AI,
          src,
          `错误码：${res.data.error_code}`,
          srcLang,
          destLang
        );
      }
    }
  }

  setConfig(config: BaiduTranslatorAPIConfig): void {
    this.APPID = config.APPID;
    this.KEY = config.KEY;
    this.ttsEnabled = config.tts || false;
    this.SALT = "1435660288";
  }

  private sign(text: string) {
    const raw = `${this.APPID}${text}${this.SALT}${this.KEY}`;
    return md5(raw);
  }
}
