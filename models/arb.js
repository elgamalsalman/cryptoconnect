import fs from "fs";
import moment from "moment";

class Arb {
  constructor(arb_meta, price_database) {
    for (let prop in arb_meta) {
      this[prop] = arb_meta[prop];
    }
		// this.price_database = price_database;

    this.arbPos = 1;
		this.percentage_diff = 0;
		this.trades = [];

		price_database.onNewCandle(data => {
			if (data.exchange === this.exchange1.id || data.exchange === this.exchange2.id) {
				this.updateExchangePrice(data.exchange, data.candles);
				this.updateArbPos();
			}
		});
  }

	updateExchangePrice = (exchangeID, candles) => {
		if (this.exchange1.id === exchangeID) {
			this.exchange1.price = candles[candles.length - 1].close;
		} else if (this.exchange2.id === exchangeID) {
			this.exchange2.price = candles[candles.length - 1].close;
		}

    if (this.exchange1.price === undefined || this.exchange2.price === undefined) return;

    this.percentage_diff =
      (Math.abs(this.exchange1.price - this.exchange2.price) * 100) /
       Math.min(this.exchange1.price, this.exchange2.price);
	}

  updateArbPos = () => {
    if (this.exchange1.price === undefined || this.exchange2.price === undefined) return;

    if (this.arbPos === 1) {
      if (
        this.exchange2.price < this.exchange1.price &&
        this.percentage_diff >= this.trigger_percentage
      ) {
        this.arbPos = 2;
				this.makeTrade({
					"time" : moment.now() / 1000,
					"exchange" : exchange1,
 					"type" : "sell",
					"amount" : this.exchange1.base_amount,
				});
				this.makeTrade({
					"time" : moment.now() / 1000,
					"exchange" : exchange2,
 					"type" : "buy",
					"amount" : this.exchange2.quote_amount,
				});
      }
		} else if (this.arbPos === 2) {
      if (
				this.exchange2.price > this.exchange1.price &&
				this.percentage_diff >= this.trigger_percentage
			) {
        this.arbPos = 1;
				this.makeTrade({
					"time" : moment.now() / 1000,
					"exchange" : exchange2,
 					"type" : "sell",
					"amount" : this.exchange2.base_amount,
				});
				this.makeTrade({
					"time" : moment.now() / 1000,
					"exchange" : exchange1,
 					"type" : "buy",
					"amount" : this.exchange1.quote_amount,
				});
      }
		}

		let printed_percentage_diff = this.percentage_diff;
		if (this.exchange1.price < this.exchange2.price) printed_percentage_diff = -1 * printed_percentage_diff;
		console.log(`${this.pair} percentage_diff : ${printed_percentage_diff}`);
		
		fs.appendFile(`data/${this.pair}.json`, `[${parseInt(moment.now() / 1000)},\t${this.exchange1.price},\t${this.exchange2.price},\t${printed_percentage_diff}],\n`, err => {
			if (err) console.log(err);
		});
	}

	makeTrade = async (trade) => {
		fs.appendFile(`data/${this.pair}_trades.json`, `[${parseInt(moment.now() / 1000)},\t${this.exchange1.price},\t${this.exchange2.price},\t${printed_percentage_diff}],\n`, err => {
			if (err) console.log(err);
		});

		this.trades.push(trade);
		if (this.isSandBox === false) {
			// register a real trade
		}
	}
}

export default Arb;
