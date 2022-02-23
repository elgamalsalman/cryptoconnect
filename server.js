import fs from "fs";
import path from "path";

// import { findCommonCoins } from "./controllers/arbsFinder.js";
import { streamPrices, constructPriceDatabases } from "./controllers/priceManager.js";
import { setupArbs } from "./controllers/arbsManager.js";

let config = fs.readFileSync(path.join(process.cwd(), "config.json"), {
  encoding: "utf-8",
});
process.env.config = JSON.parse(config);

(async () => {
  // findCommonCoins();
  const price_databases = await constructPriceDatabases();
	streamPrices(price_databases);
	const arbs = setupArbs(price_databases);
})();
