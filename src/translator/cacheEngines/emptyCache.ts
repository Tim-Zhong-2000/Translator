/**
 * @description 空缓存，不实现任何缓存功能，只提供空接口。
 * @author Tim-Zhong-2000
 */

import { CacheEngine } from "../abstract/cacheEngine";
import { Payload } from "../../type/Translator";

export class EmptyCache extends CacheEngine<null> {
  constructor() {
    super();
  }

  fetch(src: string, srcLang: string, destLang: string): Promise<Payload> {
    throw new Error("MISS");
  }

  insert(dest: Payload): void {
    return;
  }
}
