import EventEmitter from "events";

import config from "../utils/config.js";

class PriceDatabase {
  constructor(pair, time_interval) {
    this.pair = pair;
    this.time_interval = time_interval;
    this.candles = {};
    for (let exchange of config.exchanges) {
      this.candles[exchange.id] = [];
    }

    this.event_emitter = new EventEmitter();
  }

  update(exchangeID, candle) {
    const candles = this.candles[exchangeID];
    if (candles.length === 0) {
      candles.push(candle);
      this.event_emitter.emit("newCandle", {
        exchange: exchangeID,
        candles: [candle],
      });
      return;
    }

    const last_time = candles[candles.length - 1].time;
    if (candle.time === last_time) {
      candles[candles.length - 1] = candle;
      this.event_emitter.emit("newCandle", {
        exchange: exchangeID,
        candles: [candle],
      });
    } else if (candle.time > last_time) {
      const target_time = candle.time;
      const time_increment = this.time_interval.seconds;
      let curr_time = last_time + time_increment;
      const last_price = candles[candles.length - 1].close;
      for (; curr_time < target_time; curr_time += time_increment) {
        const intermediate_candle = {
          time: curr_time,
          open: last_price,
          high: last_price,
          low: last_price,
          close: last_price,
          volume: 0.0,
        };
        candles.push(intermediate_candle);
        this.event_emitter.emit("newCandle", {
          exchange: exchangeID,
          candles: [intermediate_candle],
        });
      }
      candles.push(candle);
      this.event_emitter.emit("newCandle", {
        exchange: exchangeID,
        candles: [candle],
      });
    }
  }

  onNewCandle(callback) {
    this.event_emitter.on("newCandle", callback);
  }
}

export default PriceDatabase;
