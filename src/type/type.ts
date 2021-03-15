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
  serviceProvicerName: string; // 翻译服务提供商名称
  saveFilePath?: string;
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
