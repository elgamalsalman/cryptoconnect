import path from "path";

import express from "express";

// import { findCommonCoins } from "./controllers/arbsFinder.js";
import { streamPrices, constructPriceDatabases } from "./controllers/pricesManager.js";
import { setupArbs } from "./controllers/arbsManager.js";
import { setupClientsWebsockets } from "./controllers/clientsManager.js";
import config from "./utils/config.js";

const server = express();

server.use("/", express.static(path.join(process.cwd(), "public")));

server.use("/charts", (req, res) => {
	res.sendFile(path.join(
		process.cwd(),
		"views",
		"charts.html"
	));
});

server.listen(config.env.port);

(async () => {
  // findCommonCoins();
  const price_databases = await constructPriceDatabases();
	streamPrices(price_databases);
	const arbs = setupArbs(price_databases);
	// setupClientsWebsockets(price_databases, arbs);
})();
