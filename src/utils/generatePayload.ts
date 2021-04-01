import { Payload } from "../type/type";

export function generatePayload(
  success: boolean,
  level: "ai" | "user" | "verified",
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
