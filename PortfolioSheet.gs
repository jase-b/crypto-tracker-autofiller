class PortfolioSheet {
  constructor(apiKey) {
    Log("PortfolioSheet");
    this.sheet = SpreadsheetApp.getActiveSheet();
    this._coinSymbolRange = this._getRangeByName('coin_symbols');
    this._coinSymbolColumnMap = this._buildCoinSymbolColumnMap(this._coinSymbolRange);

    if (this._coinSymbolColumnMap.length) {
      this.cmcApi = new CoinMarketCapApi({ apiKey });
      this._formatCoinSymbolColumnValues();
      this.cmcCoinIdMap = this.cmcApi.getCoinIdMap();
      this.portfolioCoinIdMap = this._coinSymbolColumnMap.map(
        cs => this.cmcCoinIdMap.find(c => c.symbol === cs.value)
      );
      Log('PortfolioSheet : portfolioCoinIdMap : %s', this.portfolioCoinIdMap);
      delete this.cmcCoinIdMap;
    }
    
    return this;
  }

  _formatCoinSymbolColumnValues() {
    this._coinSymbolColumnMap.forEach(cs => {
      const cell = this.sheet.getRange(cs.row, cs.column);
      cell.setValue(cell.getValue().toUpperCase());
    });
  }

  _getRangeByName(rangeName) {
    return this.sheet
      .getNamedRanges()
      .find(range => range.getName() === rangeName)
      .getRange();
  }
  
  _buildCoinSymbolColumnMap(coinSymbolRange) {
    const csr = coinSymbolRange;
    const row = csr.getRow();
    const column = csr.getColumn();

    return csr.getValues()
      .filter(v => v[0])
      .map((v, idx) => ({
        column,
        row: row + idx,
        value: v[0].toUpperCase()
      }));
  }

  populateCoinNameColumn() {
    Log('PortfolioSheet : populateCoinNameColumn()');
    this._coinSymbolColumnMap.forEach(csCell => {
      const coin = this.portfolioCoinIdMap.find(c => c.symbol === csCell.value)
      const coinNameCell = this.sheet.getRange(csCell.row, this._getRangeByName('coin_names').getColumn())
      coinNameCell.setValue(coin.name);
    });
  }

  populateCoinPriceColumn() {
    Log('PortfolioSheet : populateCoinPriceColumn()');
    const coinIds = this.portfolioCoinIdMap.map(c => c.id);
    const quotes = this.cmcApi.getLatestQuotes(coinIds);

    this._coinSymbolColumnMap.forEach(csCell => {
      const quote = quotes.find(q => q.symbol === csCell.value)
      const coinNameCell = this.sheet.getRange(csCell.row, this._getRangeByName('coin_prices').getColumn())
      coinNameCell.setValue(quote.price);
    });
  }
}
