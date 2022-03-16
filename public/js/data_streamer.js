const ws = new WebSocket(`ws://${window.location.hostname}:8080/ws/btcusdt`);

const add_candle = data => {
	data = JSON.parse(data.data);
	for (const candle of data.candles) {
		// add candle to candles
		if (window.global.candles[data.exchange] === undefined) {
			window.global.candles[data.exchange] = [candle];
		} else {
			const candles_count = window.global.candles[data.exchange].length;
			if (window.global.candles[data.exchange][candles_count - 1].time === candle.time) {
				window.global.candles[data.exchange][candles_count - 1] = candle;
			} else {
				window.global.candles[data.exchange].push(candle);
			}
		}

		// calculate percentage diff
		for (const exchange2 of window.global.exchange_ids) {
			let series = window.global.percentage_data[`${data.exchange}/${exchange2}`];
			if (series === undefined) {
				window.global.percentage_data[`${data.exchange}/${exchange2}`] = [];
				series = window.global.percentage_data[`${data.exchange}/${exchange2}`];
			}
			if (window.global.candles[exchange2] === undefined) continue;
			let i = window.global.candles[exchange2].length - 1;
			if (i === -1) continue;
			for (; i !== -1 && window.global.candles[exchange2][i].time >= candle.time; i--) {}
			i++;

			if (i >= window.global.candles[exchange2].length) continue;

			const new_datapoint = {
				time: candle.time,
				value: candle.close / window.global.candles[exchange2][i].close,
			}

			if (series.length !== 0 && series[series.length - 1].time === new_datapoint.time) {
				series[series.length - 1] = new_datapoint;
			} else {
				series.push(new_datapoint);
			}
		}

		// update chart
		window.global.line_series[data.exchange].update({
			time: candle.time,
			value: candle.close,
		});

		const percentage_series_id = `${window.global.selected_exchanges[0]}/${window.global.selected_exchanges[1]}`;
		console.log(percentage_series_id);
		window.global.percentage_series[percentage_series_id].update(window.global.percentage_data[percentage_series_id][window.global.percentage_data[percentage_series_id].length - 1]);
	}
}

ws.onmessage = add_candle;
