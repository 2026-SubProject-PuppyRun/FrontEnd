/**
 * Spring @RequestPart("request") 는 파트 Content-Type 이 application/json 이어야 함.
 * RN 에서 문자열만 append 하면 application/octet-stream 으로 나가 415가 난다.
 */

const utf8ToBase64 = (value: string) => {
  const bytes = unescape(encodeURIComponent(value));
  if (typeof globalThis.btoa === "function") {
    return globalThis.btoa(bytes);
  }

  // Hermes 등 btoa 없을 때 간단 base64
  const chars =
    "ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789+/";
  let output = "";
  for (let i = 0; i < bytes.length; i += 3) {
    const a = bytes.charCodeAt(i);
    const b = i + 1 < bytes.length ? bytes.charCodeAt(i + 1) : 0;
    const c = i + 2 < bytes.length ? bytes.charCodeAt(i + 2) : 0;
    const n = (a << 16) | (b << 8) | c;
    output += chars[(n >> 18) & 63];
    output += chars[(n >> 12) & 63];
    output += i + 1 < bytes.length ? chars[(n >> 6) & 63] : "=";
    output += i + 2 < bytes.length ? chars[n & 63] : "=";
  }
  return output;
};

export const appendJsonRequestPart = (
  formData: FormData,
  data: unknown,
  fieldName = "request",
) => {
  const json = JSON.stringify(data);
  const base64 = utf8ToBase64(json);

  // RN FormData 파일 파트 형식 → Content-Type: application/json
  formData.append(fieldName, {
    uri: `data:application/json;base64,${base64}`,
    name: `${fieldName}.json`,
    type: "application/json",
  } as unknown as Blob);
};
