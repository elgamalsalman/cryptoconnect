import fs from "fs";
import path from "path";

// import { findCommonCoins } from "./controllers/arbsFinder.js";
import { monitorAssetpairs } from "./controllers/arbsManager.js";

let config = fs.readFileSync(path.join(process.cwd(), "config.json"), {
  encoding: "utf-8",
});
process.env.config = JSON.parse(config);

(async () => {
  // findCommonCoins();
  monitorAssetpairs();
})();
