import fs from "node:fs";
import path from "node:path";
import { downloadImage } from "./download-image.js";
import { getContent } from "./get-content.js";
import { getImageUrls } from "./get-image-urls.js";

const baseUrl = "https://www.copymanga.site/comic/";
const list: { url: string }[] = [
  // 填写 url 地址
  // { url: "https://www.copymanga.site/comic/xxx" },
];

function mkdir(path: string) {
  if (fs.existsSync(path)) {
    return;
  }
  fs.mkdirSync(path);
}

const downloadQueue: { url: string; outDir: string; name: string }[] = [];
let pendding: typeof downloadQueue;
const maxDownloads = 10;

Promise.all(
  list.map(async (item) => {
    const referer = baseUrl + item.url.slice(baseUrl.length).split("/")[0];
    const content = await getContent(item.url, referer);
    return content;
  })
).then((pack) => {
  pack.forEach((content) => {
    const imageUrls = getImageUrls(content.contentKey);
    const outDir = path.join("dist", `${content.title}`);

    imageUrls.forEach((url, index) => {
      const extName = url.split(".").slice(-1)[0];
      const name = `${String(index + 1).padStart(3, "0")}.${extName}`;

      downloadQueue.push({ url, outDir, name });
    });
  });

  pendding = downloadQueue.slice(maxDownloads);
  downloadQueue.slice(0, maxDownloads).forEach(({ url, outDir, name }) => {
    download(url, outDir, name);
  });
});

const download = (url: string, outDir: string, name: string) => {
  return new Promise<void>((resolve) => {
    mkdir(outDir);
    const distPath = path.join(outDir, name);
    if (fs.existsSync(distPath)) {
      resolve();
      return;
    }
    resolve(
      downloadImage(url, distPath).then(() => {
        console.log(distPath);
      })
    );
    return;
  }).finally(() => {
    const first = pendding.shift();
    if (first) {
      download(first.url, first.outDir, first.name);
    }
  });
};
