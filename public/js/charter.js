const prices_chart_width = document.querySelector(".prices-chart").width;
const prices_chart_height = document.querySelector(".prices-chart").height;

const prices_chart = LightweightCharts.createChart(document.querySelector(".prices-chart"), {
	width: prices_chart_width,
	height: prices_chart_height,
	...window.global.chart_config,
});

for (const id of window.global.exchange_ids) {
	window.global.line_series[id] = prices_chart.addLineSeries({
		color: window.global.exchange_colors[id],
	});
}

window.global.percentage_series[
  `${window.global.selected_exchanges[0]}/${window.global.selected_exchanges[1]}`
] = prices_chart.addHistogramSeries({
  priceScaleId: "left",
  autoscaleInfoProvider: () => ({
    priceRange: {
      minValue: 0,
      maxValue: 10,
    },
		margins: {
			top: 0,
			bottom: 0,
		},
  }),
});

window.onresize = () => {
	let prices_chart_width = document.querySelector(".prices-chart").offsetWidth;
	let prices_chart_height = document.querySelector(".prices-chart").offsetHeight;

	prices_chart.applyOptions({
		width: prices_chart_width,
		height: prices_chart_height,
	});
};
