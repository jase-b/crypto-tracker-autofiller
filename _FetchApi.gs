class FetchApi {
  constructor({ apiKey }) {
    const key = this._validateApiKey(apiKey);

    this.requestParams = Object.freeze({
      headers: {
        "X-CMC_PRO_API_KEY": key
      }
    });

    return this;
  }

  get BASE_URL () {
    return "https://pro-api.coinmarketcap.com";
  }

  _validateApiKey (apiKey) {
    if (!apiKey || typeof apiKey !== 'string') {
      throw new Error("Missing or invalid API key.");
    }

    return apiKey.trim();
  }
}
