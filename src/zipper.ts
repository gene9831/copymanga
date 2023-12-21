import archiver from "archiver";
import fs from "node:fs";
import path from "node:path";
import { fileURLToPath } from "url";

export const zipImages = (imagesDir: string, distZipFile: string) => {
  // create a file to stream archive data to.
  const output = fs.createWriteStream(distZipFile);
  const archive = archiver("zip", {
    zlib: { level: 5 }, // Sets the compression level.
  });

  // listen for all archive data to be written
  // 'close' event is fired only when a file descriptor is involved
  output.on("close", function () {
    console.log(archive.pointer() + " total bytes");
    console.log(
      "archiver has been finalized and the output file descriptor has closed."
    );
  });

  // This event is fired when the data source is drained no matter what was the data source.
  // It is not part of this library but rather from the NodeJS Stream API.
  // @see: https://nodejs.org/api/stream.html#stream_event_end
  output.on("end", function () {
    console.log("Data has been drained");
  });

  // good practice to catch warnings (ie stat failures and other non-blocking errors)
  archive.on("warning", function (err) {
    if (err.code === "ENOENT") {
      // log warning
      console.warn(err);
    } else {
      // throw error
      throw err;
    }
  });

  // good practice to catch this error explicitly
  archive.on("error", function (err) {
    throw err;
  });

  // pipe archive data to the file
  archive.pipe(output);

  const filePathes = fs
    .readdirSync(imagesDir)
    .map((file) => path.join(imagesDir, file))
    .filter((p) => fs.statSync(p).isFile());

  for (const filePath of filePathes) {
    archive.append(fs.createReadStream(filePath), {
      name: path.basename(filePath),
    });
  }

  // finalize the archive (ie we are done appending files but streams have to finish yet)
  // 'close', 'end' or 'finish' may be fired right after calling this method so register to them beforehand
  archive.finalize();
};

// 将文件 URL 转换为本地文件路径
const __filename = fileURLToPath(import.meta.url);

// 获取当前文件所在的目录路径
const __dirname = path.dirname(__filename);

const dirs = fs
  .readdirSync(__dirname)
  .map((file) => path.join(__dirname, file))
  .filter((p) => fs.statSync(p).isDirectory());

for (const dir of dirs) {
  zipImages(dir, `${dir}.cbr`);
}
