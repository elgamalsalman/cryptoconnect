import fetch from "node-fetch";
import WebSocket from "ws";

class KrakenClient {
	constructor() {
		this.timeout = new Promise((res, rej) => res());
		this.ws = new WebSocket(`wss://ws.kraken.com/`);
	};

	resetTimeout() {
		this.timeout = new Promise((res, rej) => {
			setInterval(() => res(), 3100);
		});
	};

	formatSymbol(symbol) {
		while (symbol.length > 3 && symbol[0] === "X") {
			symbol = symbol.slice(1);
		}
		if (symbol === "XBT") symbol = "BTC";
		return symbol;
	};

	formatCandle(data) {
		return {
			"time": parseFloat(data[1]),
			"open": parseFloat(data[2]),
			"high": parseFloat(data[3]),
			"low": parseFloat(data[4]),
			"close": parseFloat(data[5]),
			"volume": parseFloat(data[7]),
		};
	}

	async getAllSymbols() {
		await this.timeout;
		let payload = await fetch(`https://api.kraken.com/0/public/AssetPairs`);
		payload = await payload.json();
		this.resetTimeout();
		return payload.result;
	};

	async createMarketBuyOrder(symbol, amount) {
		await this.timeout;
		console.log(`creating a marketBuyOrder of ${amount} ${symbol}`);
		this.resetTimeout();
	};
	
	async createMarketSellOrder(symbol, amount) {
		await this.timeout;
		console.log(`creating a marketSellOrder of ${amount} ${symbol}`);
		this.resetTimeout();
	};

	async isSymbolValid(symbol) {
		await this.timeout;
		const data = await fetch(`https://api.kraken.com/0/public/AssetPairs?pair=${symbol}`);
		const json = await data.json();
		this.resetTimeout();
		if (json.error.length === 0) return true;
		else return false;
	};
};

const krakenClient = new KrakenClient();

export default krakenClient;
