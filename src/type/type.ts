export interface BaiduTranslatorConfig {
  gtk: string;
  cookie: string;
  UA: string;
  token: string;
}

export interface BaiduTranslatorAPIConfig {
  APPID: string;
  KEY: string;
  tts: boolean;
}

export interface BaiduPayload {
  from: string;
  to: string;
  query: string;
  transtype: string;
  simple_means_flag: number;
  sign: string;
  token: string;
  domain: string;
}

export interface CacheIdentity {
  src: string;
  srcLang: string;
  destLang: string;
  serviceProvider: string;
}

export interface MapCacheConfig {
  serviceProviderName: string; // 翻译服务提供商名称
  saveFilePath?: string; // 持久化
}

export interface DestPayload {
  success: boolean;
  src: string;
  dest: string;
  srcLang: string;
  destLang: string;
  tts?: boolean;
  srcTTS?: string;
  destTTS?: string;
}

export interface FilterConfig {
  banPrefixs: string[]; // 前缀过滤
  banWords: string[]; // 词汇过滤
  apis: string[]; // 违禁词汇过滤api
  regs: RegExp[]; // 正则表达式
  removeSpaceLangs: string[]; // 需要移除空格的语言
}

export interface FilterResult{
  type: "proxy" | "pass" | "block"; // 遇到日志原封不动转发，遇到违禁词block
  text: string;
}