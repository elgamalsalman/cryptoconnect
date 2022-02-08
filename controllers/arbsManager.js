import fs from "fs";
import path from "path";

import fetch from "node-fetch";
import WebSocket from "ws";

import binanceClient from "./exchanges/binanceManager.js";
import krakenClient from "./exchanges/krakenManager.js";

const monitorAssetpairs = async () => {
	const monitoredAssetpairs = await JSON.parse(
		fs.readFileSync(path.join(process.cwd(), "data", "commonAssetPairs.json"), {
			encoding: "utf-8",
		})
	);
	// const commonAssetPairs = ["SCBTC"];

	const arbitrages = commonAssetPairs.map(pair => {
		return {
			name: pair,
			arbPos: "BINANCE",
			arbOpportunities: [],
		};
	});

	// add krakenWSNames
	let payload = await fetch(`https://api.kraken.com/0/public/AssetPairs?pair=${commonAssetPairs.join(",")}`);
	payload = await payload.json();
	payload = payload.result;
	let i = 0;
	for (let prop in payload) {
		arbitrages[i].krakenWSName = payload[prop].wsname;
		i++;
	}

	// update kraken data
	const krakenWS = new WebSocket(`wss://ws.kraken.com/`);
	krakenWS.on("open", () => {
		krakenWS.send(
			JSON.stringify({
				event: "subscribe",
				pair: (arbitrages.map(arb => arb.krakenWSName)),
				subscription: {
					name: "ohlc",
				},
			})
		);
	});

	krakenWS.onmessage = (event) => {
		event = JSON.parse(event.data);
		if (event.event === "heartbeat") return;
		else if (Array.isArray(event)) {
			// data
			const channelID = event[0];
			const close = parseFloat(event[1][5]);
			const ind = arbitrages.findIndex(arb => arb.krakenChannelID === channelID);
			arbitrages[ind].krakenPrice = close;
			// <--------------UPDATE ARBITRAGE POSITION-------------->
		} else if (event.event === "subscriptionStatus" && event.status === "subscribed"){
			// new subscription
			const arbInd = arbitrages.findIndex(arb => {
				return (arb.krakenWSName === event.pair);
			});
			arbitrages[arbInd].krakenChannelID = event.channelID;
		} else console.log(event);
	};

	// -------------BINANCE-------------
	// add arbitrages binanceWSName
	for (let arb of arbitrages) {
		arb.binanceWSName = arb.name.toLowerCase();
	}

	// update Binance data
	const binanceWS = new WebSocket(`wss://stream.binance.com:9443/ws/stream`);
	binanceWS.on("open", () => {
		binanceWS.send(
			JSON.stringify({
				method: "SUBSCRIBE",
				params: (arbitrages.map(arb => `${arb.binanceWSName}@kline_1m`)),
				id: 0,
			})
		);
	});

	binanceWS.onmessage = (event) => {
		event = JSON.parse(event.data);
		if (event.e === "kline") {
			// data
			const symbol = event.s;
			const close = parseFloat(event.k.c);
			const ind = arbitrages.findIndex(arb => arb.name === symbol);
			arbitrages[ind].binancePrice = close;
			// <--------------UPDATE ARBITRAGE POSITION-------------->
			updateArbPos(arbitrages[ind]);
		} else console.log(event);
	};

	setInterval(() => {
		console.log("-----------------------");
		console.log("-----------------------");
		console.log("-----------------------");
		arbitrages.map(arb => {
			// console.log(arb);
			console.log(arb.name, ":", arb.arbOpportunities, ",");
		});
	}, 60 * 1000);
};

export { monitorAssetpairs };
