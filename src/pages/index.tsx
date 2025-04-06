import ChartWithRSI from "@/components/ChartWithRSI"

export default function Home() {
  return (
    <main className="min-h-screen bg-gray-50 p-6">
      <h1 className="text-3xl font-bold mb-6">Crypto AI 分析系统</h1>
      <ChartWithRSI />
    </main>
  )
}
