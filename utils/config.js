import fs from "fs";
import path from "path";

const config = await JSON.parse(
  fs.readFileSync(path.join(process.cwd(), "config.json"), {
    encoding: "utf-8",
  })
);

export default config;
