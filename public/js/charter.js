const price_chart = LightweightCharts.createChart(document.querySelector(".prices-chart"), {width: 400, height: 300});
const candlestick_series = price_chart.addCandlestickSeries();

const ws = new WebSocket(`ws://${window.location.hostname}:8080/ws/btcusdt`);

ws.onmessage = data => {
	data = JSON.parse(data.data);
	if (data.exchange === "BINANCE") {
		// console.log(data);
		for (const candle of data.candles) {
			candlestick_series.update(candle);
		}
	} else if (data.exchange === "KRAKEN") {
		// console.log(data);
		// for (const candle of data.candles) {
		// 	candlestick_series.update(candle);
		// }
	}
};
