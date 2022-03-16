window.global = {};
window.global.selected_exchanges = ["BINANCE", "KRAKEN"];
window.global.candles = {};
window.global.line_series = {};
window.global.percentage_data = {};
window.global.percentage_series = {};

window.global.exchange_ids = ["BINANCE", "KRAKEN", "COIN-BASE-PRO", "FTX"];
window.global.exchange_colors = {
	"BINANCE": "#f4b808dd",
	"KRAKEN": "#5841d9dd",
	"COIN-BASE-PRO": "#91b5bfdd",
	"FTX": "#007194dd",
}

window.global.chart_config = {
  layout: {
    background: {
      color: "#1c1c26",
    },
    textColor: "#cccccccc",
  },
  grid: {
    vertLines: {
      color: "#cccccc11",
    },
    horzLines: {
      color: "#cccccc11",
    },
  },
	leftPriceScale: {
		visible: true,
	},
}
