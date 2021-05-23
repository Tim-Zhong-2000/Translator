import ISO963_1 from "../type/ISO963";

export function getBaiduLangCode(code: ISO963_1 | "auto") {
  switch (code) {
    case "auto":
      return "auto";
    case "zh_CN":
      return "zh";
    case "zh_TW":
      return "cht";
    case "en":
      return "en";
    case "ja":
      return "jp";
    case "ru":
      return "ru";
    case "ko":
      return "kor";
    case "fr":
      return "fra";
    case "eo":
      return "epo";
    case "es":
      return "spa";
    default:
      throw new Error("Unsupport Language");
  }
}

export function getGoogleLangCode(code: ISO963_1 | "auto") {
  if (code === "zh_CN") return "zh";
  if (code === "zh_TW") return "zh-TW";
  if (code === "auto") throw new Error("Google Dont Support AUTO");
  return code;
}
