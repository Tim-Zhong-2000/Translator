import { PrismaClient, Translate } from "@prisma/client";
import { Payload } from "../../type/Translator";
import { USER } from "../../type/User";
import { generatePayload } from "../../utils/generatePayload";
import { CacheEngine } from "../abstract/cacheEngine";

export class PrismaCache extends CacheEngine<PrismaClient> {
  constructor(private provider: { uid: number; name: string }) {
    super();
    this.db = new PrismaClient();
  }

  async fetch(src: string, srcLang: string, destLang: string) {
    const result = await this.db.translate.findUnique({
      where: {
        hash_userUid: {
          hash: CacheEngine.generateHashKey(src, srcLang, destLang),
          userUid: this.provider.uid,
        },
      },
    });
    return generatePayload(
      true,
      result.level,
      result.src,
      result.dest,
      result.srcLang,
      result.destLang,
      this.provider
    );
  }

  async insert(payload: Payload) {
    const hashKey = CacheEngine.generateHashKey(
      payload.src,
      payload.srcLang,
      payload.destLang
    );
    const result = await this.db.translate.upsert({
      where: {
        hash_userUid: {
          hash: hashKey,
          userUid: payload.provider.uid,
        },
      },
      create: {
        hash: hashKey,
        src: payload.src,
        srcLang: payload.srcLang,
        dest: payload.dest,
        destLang: payload.destLang,
        level: payload.level,
        privacy: USER.PrivacyLabel.public,
        Provider: { connect: { uid: payload.provider.uid } },
      },
      update: {
        dest: payload.dest,
      },
    });
  }

  resultToPayload(results: Translate[]) {
    return results.map((result) =>
      generatePayload(
        true,
        result.level,
        result.src,
        result.dest,
        result.srcLang,
        result.destLang,
        this.provider
      )
    );
  }
}
