import fs from "fs";
import path from "path";

const monitoredAssetpairs = await JSON.parse(
  fs.readFileSync(path.join(process.cwd(), "data", "commonAssetPairs.json"), {
    encoding: "utf-8",
  })
);

export default config;
