"use client"

import { useEffect, useState } from "react"

type Coin = {
  id: string
  name: string
  symbol: string
  image: string
  current_price: number
  price_change_percentage_24h: number
}

export default function Home() {
  const [coins, setCoins] = useState<Coin[]>([])
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    fetch("/api/markets")
      .then(r => r.json())
      .then(data => {
        setCoins(Array.isArray(data) ? data : [])
        setLoading(false)
      })
      .catch(() => setLoading(false))
  }, [])

  return (
    <main className="min-h-screen bg-black text-white">

      <header className="border-b border-zinc-800">
        <div className="max-w-6xl mx-auto flex justify-between items-center p-6">
          <h1 className="text-2xl font-bold text-yellow-500">BitSun</h1>

          <div className="flex gap-6 text-sm text-zinc-400">
            <a href="#markets" className="hover:text-white">بازار</a>
            <a href="#features" className="hover:text-white">ویژگی‌ها</a>
            <a href="#start" className="hover:text-white">شروع</a>
          </div>

          <button className="bg-yellow-500 text-black px-5 py-2 rounded-lg font-semibold" onClick={() => { window.location.href = "/login" }}>
            ورود
          </button>
        </div>
      </header>

      <section className="max-w-5xl mx-auto text-center py-24 px-6">
        <h2 className="text-5xl font-bold mb-6 leading-tight">
          معامله رمزارز
          <span className="text-yellow-500"> سریع و امن</span>
        </h2>

        <p className="text-zinc-400 mb-10">
          خرید و فروش بیش از 100 رمزارز با تسویه سریع و کارمزد کم
        </p>

        <div className="flex justify-center gap-4">
          <button className="bg-yellow-500 text-black px-8 py-3 rounded-xl font-bold" onClick={() => { window.location.href = "/login" }}>
            شروع معامله
          </button>

          <button className="border border-zinc-700 px-8 py-3 rounded-xl" onClick={() => { document.getElementById("markets")?.scrollIntoView({ behavior: "smooth" }) }}>
            مشاهده بازار
          </button>
        </div>
      </section>

      <section id="markets" className="max-w-6xl mx-auto px-6 py-16">
        <h3 className="text-2xl font-bold mb-10">قیمت لحظه‌ای بازار</h3>

        <div className="bg-zinc-900 rounded-xl overflow-hidden">
          <table className="w-full text-right">
            <thead className="text-zinc-400 text-sm border-b border-zinc-800">
              <tr>
                <th className="p-4">ارز</th>
                <th className="p-4">قیمت</th>
                <th className="p-4">تغییر 24h</th>
              </tr>
            </thead>

            <tbody>
              {loading ? (
                <tr>
                  <td colSpan={3} className="p-10 text-center text-zinc-500">
                    loading market...
                  </td>
                </tr>
              ) : (
                coins.map((coin) => (
                  <tr key={coin.id} className="border-b border-zinc-800">
                    <td className="p-4 flex items-center gap-3">
                      <img src={coin.image} className="w-6 h-6" />
                      {coin.name}
                    </td>

                    <td className="p-4">
                      ${coin.current_price.toLocaleString()}
                    </td>

                    <td className={`p-4 ${
                      coin.price_change_percentage_24h > 0
                        ? "text-green-500"
                        : "text-red-500"
                    }`}>
                      {coin.price_change_percentage_24h.toFixed(2)}%
                    </td>
                  </tr>
                ))
              )}
            </tbody>
          </table>
        </div>
      </section>

      <section id="features" className="bg-zinc-950 py-20">
        <div className="max-w-6xl mx-auto grid md:grid-cols-3 gap-10 px-6">

          <div className="bg-zinc-900 p-8 rounded-xl">
            <h4 className="text-lg font-bold mb-3">امنیت بالا</h4>
            <p className="text-zinc-400 text-sm">
              نگهداری امن دارایی‌ها با استانداردهای پیشرفته
            </p>
          </div>

          <div className="bg-zinc-900 p-8 rounded-xl">
            <h4 className="text-lg font-bold mb-3">کارمزد کم</h4>
            <p className="text-zinc-400 text-sm">
              معاملات سریع با کمترین کارمزد بازار
            </p>
          </div>

          <div className="bg-zinc-900 p-8 rounded-xl">
            <h4 className="text-lg font-bold mb-3">نقدینگی بالا</h4>
            <p className="text-zinc-400 text-sm">
              اتصال به بازارهای بین‌المللی
            </p>
          </div>

        </div>
      </section>

      <section id="start" className="text-center py-24">
        <h3 className="text-3xl font-bold mb-6">
          همین امروز معامله را شروع کن
        </h3>

        <button className="bg-yellow-500 text-black px-10 py-4 rounded-xl font-bold" onClick={() => { window.location.href = "/login" }}>
          ثبت نام در BitSun
        </button>
      </section>

      <footer className="border-t border-zinc-800 text-center p-8 text-zinc-500 text-sm">
        © 2026 BitSun Exchange
      </footer>

    </main>
  )
}
