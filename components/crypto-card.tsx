"use client"

import { useState, useEffect } from "react"
import { Bitcoin, RefreshCw, TrendingUp, TrendingDown, AlertCircle } from "lucide-react"

interface CryptoData {
  name: string
  symbol: string
  price: number
  change24h: number
}

type CryptoStatus = "loading" | "success" | "error"

export function CryptoCard() {
  const [cryptos, setCryptos] = useState<CryptoData[]>([])
  const [status, setStatus] = useState<CryptoStatus>("loading")

  const fetchCrypto = async () => {
    setStatus("loading")
    try {
      // Using CoinGecko API (free, no API key required)
      const response = await fetch(
        "https://api.coingecko.com/api/v3/simple/price?ids=bitcoin,ethereum,solana&vs_currencies=usd&include_24hr_change=true"
      )
      if (!response.ok) throw new Error("Failed to fetch crypto")
      const data = await response.json()
      
      setCryptos([
        { name: "Bitcoin", symbol: "BTC", price: data.bitcoin.usd, change24h: data.bitcoin.usd_24h_change },
        { name: "Ethereum", symbol: "ETH", price: data.ethereum.usd, change24h: data.ethereum.usd_24h_change },
        { name: "Solana", symbol: "SOL", price: data.solana.usd, change24h: data.solana.usd_24h_change },
      ])
      setStatus("success")
    } catch {
      setStatus("error")
    }
  }

  useEffect(() => {
    fetchCrypto()
    const interval = setInterval(fetchCrypto, 60000) // Refresh every minute
    return () => clearInterval(interval)
  }, [])

  const formatPrice = (price: number) => {
    return price >= 1 ? price.toLocaleString("en-US", { maximumFractionDigits: 2 }) : price.toFixed(4)
  }

  if (status === "loading") {
    return (
      <div className="p-5 rounded-2xl backdrop-blur-xl bg-white/10 border border-white/20 shadow-xl w-full animate-fade-in">
        <div className="flex items-center justify-center h-24">
          <RefreshCw className="w-5 h-5 text-white/60 animate-spin" />
        </div>
      </div>
    )
  }

  if (status === "error") {
    return (
      <div className="p-5 rounded-2xl backdrop-blur-xl bg-white/10 border border-white/20 shadow-xl w-full animate-fade-in">
        <div className="flex flex-col items-center gap-2">
          <AlertCircle className="w-6 h-6 text-white/60" />
          <p className="text-xs text-white/60">Unable to load prices</p>
          <button onClick={fetchCrypto} className="text-xs text-white/80 hover:text-white">
            Retry
          </button>
        </div>
      </div>
    )
  }

  return (
    <div className="p-5 rounded-2xl backdrop-blur-xl bg-white/10 border border-white/20 shadow-xl w-full animate-fade-in">
      <div className="flex items-center justify-between mb-3">
        <div className="flex items-center gap-2">
          <Bitcoin className="w-5 h-5 text-yellow-500" />
          <span className="text-sm font-medium text-white/80">Crypto</span>
        </div>
        <button
          onClick={fetchCrypto}
          className="text-white/60 hover:text-white transition-all hover:rotate-180 duration-500"
        >
          <RefreshCw className="w-4 h-4" />
        </button>
      </div>

      <div className="space-y-2">
        {cryptos.map((crypto) => (
          <div key={crypto.symbol} className="flex items-center justify-between">
            <span className="text-xs text-white/70">{crypto.symbol}</span>
            <div className="text-right">
              <p className="text-sm text-white font-medium">${formatPrice(crypto.price)}</p>
              <p className={`text-xs flex items-center gap-0.5 ${crypto.change24h >= 0 ? 'text-green-400' : 'text-red-400'}`}>
                {crypto.change24h >= 0 ? <TrendingUp className="w-3 h-3" /> : <TrendingDown className="w-3 h-3" />}
                {Math.abs(crypto.change24h).toFixed(1)}%
              </p>
            </div>
          </div>
        ))}
      </div>
    </div>
  )
}
