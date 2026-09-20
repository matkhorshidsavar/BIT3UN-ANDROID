"use client";
import { useEffect, useRef } from "react";

export default function TradingViewChart({ symbol }: { symbol: string }) {
  const containerRef = useRef<HTMLDivElement>(null);
  
  // نرمال‌سازی نماد: تبدیل نمادهای ساده به فرمت استاندارد تریدینگ‌ویو
  const formattedSymbol = symbol.includes(":") 
    ? symbol 
    : `BINANCE:${symbol.toUpperCase().replace("USDT", "")}USDT`;
  
  const chartId = "tv_" + formattedSymbol.replace(/[^a-zA-Z0-9]/g, "");

  useEffect(() => {
    let tvScript = document.getElementById("tv-script") as HTMLScriptElement | null;
    
    const initWidget = () => {
      if ((window as any).TradingView && containerRef.current) {
        containerRef.current.innerHTML = ""; // پاکسازی گره‌های رندر شده قبلی
        new (window as any).TradingView.widget({
          autosize: true,
          container_id: chartId,
          symbol: formattedSymbol,
          interval: "D",
          timezone: "Asia/Tehran",
          theme: "dark",
          style: "1",
          locale: "en",
          toolbar_bg: "#0a0a0f",
          enable_publishing: false,
          hide_top_toolbar: true,
          allow_symbol_change: true,
          studies: ["RSI@tv-basicstudies"],
        });
      }
    };

    if (!tvScript) {
      tvScript = document.createElement("script");
      tvScript.id = "tv-script";
      tvScript.src = "https://s3.tradingview.com/tv.js";
      tvScript.async = true;
      tvScript.onload = initWidget;
      document.head.appendChild(tvScript);
    } else {
      initWidget();
    }

    // حذف چارت از حافظه هنگام تغییر صفحه یا تغییر رمزارز
    return () => {
      if (containerRef.current) {
        containerRef.current.innerHTML = "";
      }
    };
  }, [formattedSymbol, chartId]);

  return (
    <div className="w-full flex-1 flex flex-col min-h-[400px]">
      <div id={chartId} ref={containerRef} className="flex-1 w-full h-full" style={{ minHeight: "400px" }} />
    </div>
  );
}
