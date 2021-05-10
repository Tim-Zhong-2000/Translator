import { Payload, TranslateLevel } from "../type/Translator";

export function generatePayload(
  success: boolean,
  level: TranslateLevel,
  src: string,
  dest: string,
  srcLang: string,
  destLang: string
): Payload {
  return {
    success: success,
    level: level,
    src: src,
    dest: dest,
    srcLang: srcLang,
    destLang: destLang,
  };
}
