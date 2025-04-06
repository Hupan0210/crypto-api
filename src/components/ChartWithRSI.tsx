import React, { useEffect, useState } from 'react'
import {
  LineChart, Line, XAxis, YAxis, Tooltip, CartesianGrid, ResponsiveContainer
} from 'recharts'

type Candle = [number, string, string, string, string]

function calculateRSI(closes: number[], period = 14) {
  const rsi: number[] = []
  for (let i = period; i < closes.length; i++) {
    const slice = closes.slice(i - period, i)
    const gains = slice.map((v, j) => j === 0 ? 0 : Math.max(0, v - slice[j - 1]))
    const losses = slice.map((v, j) => j === 0 ? 0 : Math.max(0, slice[j - 1] - v))
    const avgGain = gains.reduce((a, b) => a + b) / period
    const avgLoss = losses.reduce((a, b) => a + b) / period
    const rs = avgGain / (avgLoss || 1)
    rsi.push(100 - 100 / (1 + rs))
  }
  return rsi
}

export default function ChartWithRSI() {
  const [data, setData] = useState<any[]>([])

  useEffect(() => {
    fetch('https://crypto-api.hupan0210.workers.dev/binance?symbol=BTCUSDT&interval=1h&limit=100')
      .then(res => res.json())
      .then(res => {
        const candles: Candle[] = res.data
        const closes = candles.map(c => parseFloat(c[4]))
        const rsi = calculateRSI(closes)

        const combined = candles.map((c, i) => ({
          time: new Date(c[0]).toLocaleString(),
          close: parseFloat(c[4]),
          rsi: rsi[i - 14] || null,
        }))

        setData(combined)
      })
  }, [])

  return (
    <div className="w-full p-4 bg-white rounded-2xl shadow">
      <h2 className="text-xl font-bold mb-4">BTC/USDT 行情图 + RSI 指标</h2>
      <ResponsiveContainer width="100%" height={300}>
        <LineChart data={data}>
          <XAxis dataKey="time" hide />
          <YAxis yAxisId="left" domain={['auto', 'auto']} />
          <YAxis yAxisId="right" orientation="right" domain={[0, 100]} />
          <CartesianGrid stroke="#eee" strokeDasharray="5 5" />
          <Tooltip />
          <Line yAxisId="left" type="monotone" dataKey="close" stroke="#8884d8" name="收盘价" dot={false} />
          <Line yAxisId="right" type="monotone" dataKey="rsi" stroke="#82ca9d" name="RSI" dot={false} />
        </LineChart>
      </ResponsiveContainer>
    </div>
  )
}
