class CoinMarketCapApi extends FetchApi {
  constructor(apiKey) {
    super(apiKey);
    this.COIN_ID_MAP_URL = `${this.BASE_URL}/v1/cryptocurrency/map`;
    this.QUOTES_LATEST_URL = `${this.BASE_URL}/v2/cryptocurrency/quotes/latest`;
  }

  getCoinIdMap () {
    Log('CoinMarketCapApi : getCoinIdMap()');
    try {
      const response = UrlFetchApp.fetch(this.COIN_ID_MAP_URL, this.requestParams);
      const { data } = JSON.parse(response)
      
      return data.map(coin => ({
        symbol: coin.symbol,
        name: coin.name,
        slug: coin.slug,
        id: coin.id
      }));
    } catch (err) {
      Logger.log(err);
      return null;
    }
  }

  getLatestQuotes(...coinIds) {
    Log('CoinMarketCapApi : getLatestQuotes()');
    try {
      const url = `${this.QUOTES_LATEST_URL}?id=${coinIds.join(',')}`;
      const response = UrlFetchApp.fetch(url, this.requestParams);
      const { data } = JSON.parse(response)

      return Object.values(data).map(q => ({
        id: q.id,
        price: q.quote.USD.price,
        symbol: q.symbol
      }));
    } catch (err) {
      Logger.log(err);
      return null;
    }
  }
}
