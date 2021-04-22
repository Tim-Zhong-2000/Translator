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

export interface Database {
  host: string;
  port: number;
  user: string;
  password: string;
  database: string;
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

export namespace USER {
  export interface LoginPayload {
    username: string;
    password: string;
  }

  export interface UserDbItem {
    uid: number;
    email: string;
    phone?: string;
    password: string;
    nickname: string;
    role: Role;
    create_at: string;
    isDelete: boolean;
  }

  export interface RegisterPayload {
    nickname: string;
    email: string;
    phone?: string;
    password: string;
  }

  export interface Session {
    uid: number;
    nickname: string;
    email: string;
    phone?: string;
    role: Role;
  }

  export interface Info {
    nickname: string;
    email: string;
    phone?: string;
  }

  /* 数字越大权限越高 */
  export enum Role {
    "guest", // + 下载权限
    "user", // + 发布权限
    "translator", // + 验证权限
    "admin", // + 最高权限
  }
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
