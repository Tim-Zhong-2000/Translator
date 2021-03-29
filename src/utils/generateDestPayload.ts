import { DestPayload } from "../type/type";

export function generateDestPayload(
  success: boolean,
  level: "ai" | "user" | "verified",
  src: string,
  dest: string,
  srcLang: string,
  destLang: string
): DestPayload {
  return {
    success: success,
    level: level,
    src: src,
    dest: dest,
    srcLang: srcLang,
    destLang: destLang,
  };
}
