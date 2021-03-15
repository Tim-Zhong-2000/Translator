/**
 * @description 空缓存，不实现任何缓存功能，只提供空接口。
 * @author Tim-Zhong-2000
 */
import { CacheEngine } from "../abstract/cacheEngine";
import { DestPayload } from "../type/type";

export class EmptyCache extends CacheEngine<null> {
  constructor() {
    super();
  }

  fetch(src: string, srcLang: string, destLang: string): DestPayload {
    throw new Error("MISS");
  }

  insert(
    src: string,
    srcLang: string,
    destLang: string,
    dest: DestPayload
  ): void {
    return;
  }
}
