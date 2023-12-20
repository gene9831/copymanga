import fs from "node:fs";
import { fetchWithRetries } from "./fetch.js";

export const downloadImage = async (url: string, dist: string) => {
  const out = dist || url.split("/").slice(-1)[0];
  const resp = await fetchWithRetries(url, {
    headers: {
      accept:
        "image/avif,image/webp,image/apng,image/svg+xml,image/*,*/*;q=0.8",
      "User-Agent":
        "Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/120.0.0.0 Safari/537.36",
    },
    referrerPolicy: "same-origin",
    method: "GET",
  });
  const buffer = await resp.arrayBuffer();
  fs.writeFileSync(out, Buffer.from(buffer));
};
