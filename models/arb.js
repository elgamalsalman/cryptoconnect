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
				this.updateExchangePrice(data.exchange, data.candle);
				this.updateArbPos();
			}
		});
  }

	updateExchangePrice = (exchangeID, candle) => {
		console.log(`arb percentage_diff : ${this.percentage_diff}`);
		if (this.exchange1.id === exchangeID) {
			this.exchange1.price = candle.close;
		} else if (this.exchange2.id === exchangeID) {
			this.exchange2.price = candle.close;
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
  }

	makeTrade = async (trade) => {
		this.trades.push(trade);
		if (this.isSandBox === false) {
			// register a real trade
		}
	}
}

export default Arb;
