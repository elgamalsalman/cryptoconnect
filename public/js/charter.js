const chart1 = LightweightCharts.createChart(document.querySelector(".chart1"), {width: 400, height: 300});
const chart2 = LightweightCharts.createChart(document.querySelector(".chart2"), {width: 400, height: 300});
const candlestick_series1 = chart1.addCandlestickSeries();
const candlestick_series2 = chart2.addCandlestickSeries();

const ws = new WebSocket(`ws://${window.location.hostname}:8080/ws/btcusdt`);

ws.onmessage = data => {
	data = JSON.parse(data.data);
	if (data.exchange === "BINANCE") {
		console.log(data);
		for (const candle of data.candles) {
			candlestick_series1.update(candle);
		}
	} else if (data.exchange === "KRAKEN") {
		console.log(data);
		for (const candle of data.candles) {
			candlestick_series2.update(candle);
		}
	}
};
