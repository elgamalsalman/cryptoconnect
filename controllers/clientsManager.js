import { WebSocketServer } from "ws";

import config from "../utils/config.js";
import PriceDatabase from "../models/priceDatabase.js";
import binanceClient from "./exchanges/binanceManager.js";
import krakenClient from "./exchanges/krakenManager.js";

const setupClientsWebsockets = async (prices_databases, arbs) => {
	const prices_wss = {};
	for (const symbol in prices_databases) {
    prices_wss[symbol] = new WebSocketServer({
      port: config.env.wss_port,
      path: `/ws/btcusdt`,
    });

    prices_wss[symbol].on("connection", (ws) => {
      console.log("someone connected!");
			for (const exchange in prices_databases[symbol].candles) {
				ws.send(JSON.stringify({
					exchange: exchange,
					candles: prices_databases[symbol].candles[exchange],
				}));
			}

      prices_databases[symbol].onNewCandle((data) => {
        ws.send(JSON.stringify(data));
      });
    });

    break;
  }
}

export {
	setupClientsWebsockets,
};
