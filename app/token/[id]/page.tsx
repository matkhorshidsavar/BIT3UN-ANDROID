import TradingViewChart from "@/components/TradingViewChart";
import { getPersianDescription } from "@/lib/persianDescriptions";

// نگاشت شناسه‌های CoinGecko به نماد معاملاتی بایننس
const binanceSymbolMap: Record<string, string> = {
  bitcoin: "BINANCE:BTCUSDT",
  ethereum: "BINANCE:ETHUSDT",
  tether: "BINANCE:USDTUSDC",
  binancecoin: "BINANCE:BNBUSDT",
  ripple: "BINANCE:XRPUSDT",
  cardano: "BINANCE:ADAUSDT",
  solana: "BINANCE:SOLUSDT",
  polkadot: "BINANCE:DOTUSDT",
  dogecoin: "BINANCE:DOGEUSDT",
  shiba_inu: "BINANCE:SHIBUSDT",
  avalanche: "BINANCE:AVAXUSDT",
  chainlink: "BINANCE:LINKUSDT",
  uniswap: "BINANCE:UNIUSDT",
  litecoin: "BINANCE:LTCUSDT",
  tron: "BINANCE:TRXUSDT",
};

async function getCoinData(id: string) {
  try {
    const res = await fetch(
      `https://api.coingecko.com/api/v3/coins/${id}?localization=false&tickers=false&community_data=false&developer_data=false`,
      { next: { revalidate: 300 } }
    );
    if (!res.ok) return null;
    return res.json();
  } catch (error) {
    return null;
  }
}

export default async function TokenPage({ params }: { params: { id: string } }) {
  const coin = await getCoinData(params.id);

  if (!coin) {
    return (
      <div style={{ padding: 40, color: "#fff", textAlign: "center" }}>
        <h1>توکن یافت نشد</h1>
        <p>لطفاً شناسه صحیح توکن را وارد کنید.</p>
      </div>
    );
  }

  const symbol = binanceSymbolMap[coin.id] || `BINANCE:${coin.symbol.toUpperCase()}USDT`;
  const persianDesc = getPersianDescription(
    coin.id,
    coin.description?.en
  );

  return (
    <div style={{ maxWidth: 1200, margin: "0 auto", padding: 24, color: "#fff" }}>
      {/* عنوان و قیمت */}
      <div style={{ display: "flex", alignItems: "center", justifyContent: "space-between", marginBottom: 24 }}>
        <div>
          <h1 style={{ fontSize: 32, color: "#f0c040" }}>
            {coin.name} ({coin.symbol.toUpperCase()})
          </h1>
          <p style={{ color: "#aaa", marginTop: 8 }}>
            قیمت فعلی: ${coin.market_data?.current_price?.usd ?? "---"}
          </p>
        </div>
        <span
          style={{
            background: "linear-gradient(135deg, #f0c040, #d4a020)",
            color: "#0a0a0f",
            padding: "8px 20px",
            borderRadius: 20,
            fontWeight: "bold",
            fontSize: 18,
          }}
        >
          لوریج: تا 100x
        </span>
      </div>

      {/* چارت معاملاتی */}
      <div style={{ marginBottom: 32 }}>
        <TradingViewChart symbol={symbol} />
      </div>

      {/* توضیحات فارسی */}
      <div
        style={{
          background: "rgba(255,255,255,0.03)",
          backdropFilter: "blur(10px)",
          borderRadius: 12,
          padding: 24,
          marginBottom: 32,
        }}
      >
        <h2 style={{ fontSize: 20, marginBottom: 16, color: "#f0c040" }}>درباره {coin.name}</h2>
        <p style={{ lineHeight: 1.8, color: "#ccc" }}>{persianDesc}</p>
      </div>
    </div>
  );
}
