import { Database } from "./type";

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
  provider: string;
}

export interface CacheBase {
  serviceProviderName: string; // 翻译服务提供商名称
  db?: Database;
}

export interface MapCacheConfig extends CacheBase {}

export interface SqliteCacheConfig extends CacheBase {}

export interface Payload {
  success: boolean;
  level: TranslateLevel;
  src: string;
  dest: string;
  srcLang: string;
  destLang: string;
  tts?: boolean;
  ttsSrc?: string;
  ttsDest?: string;
}

export interface FilterConfig {
  banPrefixs: string[]; // 前缀过滤
  banWords: string[]; // 词汇过滤
  apis: string[]; // 违禁词汇过滤api
  regs: RegExp[]; // 正则表达式
  removeSpaceLangs: string[]; // 需要移除空格的语言
}

export interface FilterResult {
  type: FilterType; // 遇到日志原封不动转发，遇到违禁词block
  text: string;
}

export enum FilterType {
  "PROXY",
  "PASS",
  "BLOCK",
}

export enum TranslateLevel {
  "AI",
  "USER",
  "VERIFIED",
}
