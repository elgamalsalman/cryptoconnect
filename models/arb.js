import moment from "moment";

import Chart from "./charts.js";

class Arb {
  constructor(arbConfig) {
		this.percentageDiff = 0;
    this.arbPos = 1;
		this.arbChart = new Chart();
		this.trades = [];
    for (let prop in arbConfig) {
      this[prop] = arbConfig[prop];
    }
  }

	updateExchangePrice = (exchangeName, newPrice) => {
		if (this.exchange1.name === exchangeName) {
			this.exchange1.price = newPrice;
		} else if (this.exchange2.name === exchangeName) {
			this.exchange2.price = newPrice;
		} else throw "exchange not member of this arbitrage";

    if (this.exchange1Price === undefined || this.exchange2Price === undefined) return;
    this.percentageDiff =
      (Math.abs(this.exchange1Price - this.exchange2Price) * 100) /
      Math.min(this.exchange1Price, this.exchange2Price);
		this.arbChart.updateData(moment().unix(), percentageDiff);

		this.updateArbPos();
	}

  updateArbPos = () => {
    if (this.arbPos === 1) {
      if (this.exchange2Price < this.exchange1Price && this.percentageDiff >= 0.5) {
        this.arbPos = 2;
        this.arbOpportunities.push(this.percentageDiff);
      } else if (
        this.exchange2Price > this.exchange1Price &&
        this.arbOpportunities.length > 0
      ) {
        const lastOpp = this.arbOpportunities.pop();
        this.arbOpportunities.push(Math.max(lastOpp, this.percentageDiff));
      }
    } else if (this.arbPos === 2) {
      if (this.exchange2Price > this.exchange1Price && this.percentageDiff >= 0.5) {
        this.arbPos = 1;
        this.arbOpportunities.push(this.percentageDiff);
      } else if (
        this.exchange2Price < this.exchange1Price &&
        this.arbOpportunities.length > 0
      ) {
        const lastOpp = this.arbOpportunities.pop();
        this.arbOpportunities.push(Math.max(lastOpp, this.percentageDiff));
      }
    }
  };
}

export default Arb;