import React, { useState } from "react"
import { motion } from "framer-motion"
import { Loader2, Copy } from "lucide-react"

const coins = [
  { label: "BTC", icon: "₿" },
  { label: "ETH", icon: "🟣" },
  { label: "BNB", icon: "🟡" },
  { label: "DOGE", icon: "🐶" }
]

export default function AIAdvice() {
  const [symbol, setSymbol] = useState("BTC")
  const [loading, setLoading] = useState(false)
  const [advice, setAdvice] = useState("")
  const [copied, setCopied] = useState(false)

  const getAdvice = async () => {
    setLoading(true)
    setAdvice("")
    setCopied(false)

    try {
      const res = await fetch("https://crypto-api.hupan0210.workers.dev/openai", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          prompt: `请结合技术指标和市场情绪，生成一条关于${symbol}的最新投资建议。格式：简洁 + 可执行建议`
        })
      })
      const json = await res.json()
      setAdvice(json.result)
    } catch {
      setAdvice("⚠️ 获取建议失败，请稍后重试。")
    } finally {
      setLoading(false)
    }
  }

  const handleCopy = () => {
    navigator.clipboard.writeText(advice)
    setCopied(true)
    setTimeout(() => setCopied(false), 1500)
  }

  return (
    <motion.div
      className="w-full p-6 rounded-2xl bg-gradient-to-r from-blue-100 to-white shadow-xl mt-8"
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
    >
      <h2 className="text-2xl font-bold mb-4 flex items-center gap-2">
        🤖 AI 投资建议
      </h2>

      <div className="flex items-center gap-3 mb-5">
        <select
          value={symbol}
          onChange={(e) => setSymbol(e.target.value)}
          className="p-2 rounded border bg-white shadow"
        >
          {coins.map((coin) => (
            <option key={coin.label} value={coin.label}>
              {coin.icon} {coin.label}
            </option>
          ))}
        </select>
        <button
          onClick={getAdvice}
          className="bg-blue-600 hover:bg-blue-700 text-white px-4 py-2 rounded transition font-medium shadow"
        >
          生成建议
        </button>
      </div>

      {loading && (
        <div className="flex items-center text-gray-500 gap-2">
          <Loader2 className="animate-spin" size={20} />
          正在生成 AI 分析...
        </div>
      )}

      {!loading && advice && (
        <motion.div
          className="relative bg-white p-4 rounded-xl shadow-md border text-gray-800 whitespace-pre-wrap"
          initial={{ scale: 0.98, opacity: 0 }}
          animate={{ scale: 1, opacity: 1 }}
        >
          <button
            onClick={handleCopy}
            className="absolute top-2 right-2 text-blue-600 hover:text-blue-800 transition"
          >
            <Copy size={16} />
          </button>
          {advice}
          {copied && (
            <span className="text-sm text-green-600 mt-2 block">✅ 已复制到剪贴板</span>
          )}
        </motion.div>
      )}
    </motion.div>
  )
}
