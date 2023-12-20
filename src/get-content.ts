import { fetchWithRetries } from "./fetch.js";

const getTitle = (html: string) => {
  const tagStart = html.indexOf("<title>");
  const tagEnd = html.indexOf("</title>");
  return html
    .slice(tagStart + "<title>".length, tagEnd)
    .trim()
    .split("-")
    .filter((item) => !item.includes("拷貝漫畫"))
    .map((item) => item.trim())
    .join(" - ");
};

export const getContent = async (url: string, referer: string) => {
  const resp = await fetchWithRetries(url, {
    headers: {
      // 这里决定用jpg还是webp
      // Cookie: "webp=1",
      Referer: referer,
      "Referrer-Policy": "same-origin",
      "User-Agent":
        "Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/120.0.0.0 Safari/537.36",
    },
    method: "GET",
  });
  const text = await resp.text();
  const title = getTitle(text);
  const contentKey = text.match(/(?<=contentKey=").+?(?=")/)![0];
  return { title, contentKey };
};
