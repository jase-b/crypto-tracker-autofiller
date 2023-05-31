async function init() {
  // const ui = SpreadsheetApp.getUi();
  // const response = ui.prompt('Getting to know you', 'May I know your name?', ui.ButtonSet.YES_NO);
  const ps = new PortfolioSheet(getScriptProp('cmcApiKey'));

  if (ps.portfolioCoinIdMap) {
    ps.populateCoinNameColumn();
    ps.populateCoinPriceColumn();
  }

  Log("All done!")

  function getScriptProp(propName) {
    return JSON.parse(PropertiesService
      .getScriptProperties()
      .getProperty(propName)
    );
  }
}

function Log(...msg) {
  Logger.log(...msg);
}
