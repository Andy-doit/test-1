export const MARKET_SOURCES = {
  CRYPTO:
    "https://www.tradingview-widget.com/embed-widget/market-quotes/?locale=en#%7B%22colorTheme%22%3A%22light%22%2C%22largeChartUrl%22%3A%22%22%2C%22isTransparent%22%3Afalse%2C%22showSymbolLogo%22%3Atrue%2C%22backgroundColor%22%3A%22%23ffffff%22%2C%22width%22%3A820%2C%22height%22%3A600%2C%22symbolsGroups%22%3A%5B%7B%22name%22%3A%22Crypto%22%2C%22symbols%22%3A%5B%7B%22name%22%3A%22BINANCE%3ABTCUSDT%22%2C%22displayName%22%3A%22BTC%22%7D%2C%7B%22name%22%3A%22BINANCE%3AETHUSDT%22%2C%22displayName%22%3A%22ETH%22%7D%2C%7B%22name%22%3A%22BINANCE%3ABNBUSDT%22%2C%22displayName%22%3A%22BNB%22%7D%2C%7B%22name%22%3A%22BINANCE%3ASOLUSDT%22%2C%22displayName%22%3A%22SOL%22%7D%2C%7B%22name%22%3A%22BINANCE%3AXRPUSDT%22%2C%22displayName%22%3A%22XRP%22%7D%2C%7B%22name%22%3A%22BINANCE%3ADOGEUSDT%22%2C%22displayName%22%3A%22DOGE%22%7D%2C%7B%22name%22%3A%22BINANCE%3ASHIBUSDT%22%2C%22displayName%22%3A%22SHIB%22%7D%2C%7B%22name%22%3A%22BINANCE%3ATONUSDT%22%2C%22displayName%22%3A%22TON%22%7D%2C%7B%22name%22%3A%22BINANCE%3ALTCUSDT%22%2C%22displayName%22%3A%22LTC%22%7D%2C%7B%22name%22%3A%22BINANCE%3AAVAXUSDT%22%2C%22displayName%22%3A%22AVAX%22%7D%2C%7B%22name%22%3A%22BINANCE%3ADOTUSDT%22%2C%22displayName%22%3A%22DOT%22%7D%2C%7B%22name%22%3A%22BINANCE%3ASUIUSDT%22%2C%22displayName%22%3A%22SUI%22%7D%2C%7B%22name%22%3A%22OKX%3ALEOUSDT%22%2C%22displayName%22%3A%22LEO%22%7D%5D%7D%5D%2C%22utm_source%22%3A%22hotstockvn.com%22%2C%22utm_medium%22%3A%22widget_new%22%2C%22utm_campaign%22%3A%22market-quotes%22%2C%22page-uri%22%3A%22hotstockvn.com%2Fcrypto%2F%22%7D",
  FX: "https://www.widgets.investing.com/live-currency-cross-rates?theme=darkTheme&pairs=1,3,2,4,7,5,8,6,2214,1206220,1062759,2229",
  GOLD: "https://tygiausd.org/giavangfull/dat-gia-vang/widgets",
  CALENDAR: "https://www.tradingview.com/economic-calendar/",
  STOCK_VN: "https://trading.bsi.com.vn/",
} as const;

export const { CRYPTO, FX, GOLD, CALENDAR, STOCK_VN } = MARKET_SOURCES;
