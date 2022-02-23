class AssetpairDatabase {
	constructor(assetpair, time_interval) {
		this.assetpair = assetpair;
		this.time_interval = time_interval;
		this.candles = [];
	}

	async updateData(time, value) {

	}
};

export default AssetpairDatabase;
