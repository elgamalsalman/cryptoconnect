# cryptoconnect

## Description

This is a bot that trades crypto currencies in order to - hopefully - make profits that beat the market isa. This bot will take advantage of arbitrages (differences in price between different exchange platforms [e.g. Binance and Kraken]). I am currently looking at binance and kraken, and might make this an online service in the future if it turns out to be a success isa.

## Plan

storing the data in a database would be the best option, however, in order to allow for this project to scale, I think it would be best to store the data of each exchange platform seperately, instead of storing the price of an assetpair in an exchange over another.

## TODO

- Create a server that monitors the prices of multiple assetpairs on multiple platforms, and places all the data in a temporary database class
	- update database classes

- Create a bot that monitors arbitrages and buys and sells the assets to make profits

- Create a website to visualise the price of the arbitrages
