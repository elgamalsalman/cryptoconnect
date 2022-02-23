import config from "../utils/config.js";
import Arb from "../models/arb.js";
import binanceClient from "./exchanges/binanceManager.js";
import krakenClient from "./exchanges/krakenManager.js";

const setupArbs = async (prices_databases) => {
	const arbs = config.arbs.map(arbMeta => {
		return new Arb(arbMeta, prices_databases[arbMeta.pair]);
	});
	return arbs;
}

const findCommonCoins = async () => {
  const krakenAssetPairObjects = await krakenClient.getAllSymbols();
  const krakenAssetPairs = [];
  for (let prop in krakenAssetPairObjects) {
    const newSymbol =
      krakenClient.formatSymbol(krakenAssetPairObjects[prop].base) +
      krakenClient.formatSymbol(krakenAssetPairObjects[prop].quote);
    krakenAssetPairs.push(newSymbol);
  }
  // console.log(krakenAssetPairs);

  const binanceAssetPairObjects = await binanceClient.getAllSymbols();
  const binanceAssetPairs = binanceAssetPairObjects.symbols.map(
    (asset) => asset.symbol
  );
  // console.log(binanceAssetPairs);

  const commonAssetPairs = krakenAssetPairs.filter((asset) => {
    return binanceAssetPairs.includes(asset);
  });

  fs.writeFileSync(path.join(process.cwd(), "commonAssetPairs.json"), JSON.stringify(commonAssetPairs));
};

export {
	setupArbs,
}
