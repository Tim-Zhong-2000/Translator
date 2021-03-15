export function generateDestPayload(
  success: boolean,
  src: string,
  dest: string,
  srcLang: string,
  destLang: string
) {
  return {
    success: success,
    src: src,
    dest: dest,
    srcLang: srcLang,
    destLang: destLang,
  };
}
