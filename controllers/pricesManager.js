import config from "../utils/config.js";
import PriceDatabase from "../models/priceDatabase.js";
import binanceClient from "./exchanges/binanceManager.js";
import krakenClient from "./exchanges/krakenManager.js";

const constructPriceDatabases = async () => {
	const monitored_pairs = config.pairs;

	const price_databases = {};
	monitored_pairs.forEach(pair => {
		price_databases[pair.id] = new PriceDatabase(pair, config.time_interval);
	});

	return price_databases;
}

const streamPrices = async (price_databases) => {
	// ------- KRAKEN -------
	let kraken_wsnames_list = [];
	for (const symbol in price_databases) {
		kraken_wsnames_list.push(price_databases[symbol].pair.wsnames.KRAKEN);
	}

	krakenClient.ws.on("open", () => {
		krakenClient.ws.send(
			JSON.stringify({
				event: "subscribe",
				pair: kraken_wsnames_list,
				subscription: {
					name: "ohlc",
				},
			})
		);
	});

	krakenClient.ws.onmessage = event => {
		event = JSON.parse(event.data);
		if (event.event === "heartbeat") {
			return;
		} else if (Array.isArray(event)) { // data
			// console.log("KRAKEN data recieved");
			const pairWsname = event[3];
			let symbol;
			for (const curr_symbol in price_databases) {
				if (price_databases[curr_symbol].pair.wsnames.KRAKEN == pairWsname) {
					symbol = curr_symbol;
					break;
				}
			}
			// const ind = price_databases.findIndex(db => db.pair.wsnames.KRAKEN === pairWsname);
			price_databases[symbol].update("KRAKEN", krakenClient.formatCandle(event[1]));
			// console.log(price_databases[symbol].candles);
		} else console.log(event);
	};

	// ------- BINANCE -------
	let binance_wsnames_list = [];
	for (const symbol in price_databases) {
		binance_wsnames_list.push(price_databases[symbol].pair.wsnames.BINANCE);
	}

	binanceClient.ws.on("open", () => {
		binanceClient.ws.send(
			JSON.stringify({
				method: "SUBSCRIBE",
				params: binance_wsnames_list.map(wsname => `${wsname}@kline_1m`),
				id: 0
			})
		);
	});

	binanceClient.ws.onmessage = (event) => {
		event = JSON.parse(event.data);
		if (event.e === "kline") {
			// console.log("BINANCE data recieved");
			const symbol = event.s;
			// const ind = price_databases.findIndex(db => db.pair.id === symbol);
			price_databases[symbol].update("BINANCE", binanceClient.formatCandle(event.k));
			// console.log(price_databases[symbol].candles);
		} else console.log(event);
	};
}

export { streamPrices, constructPriceDatabases };
