async function init() {
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
