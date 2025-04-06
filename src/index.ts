export default {
  async fetch(request: Request): Promise<Response> {
    const { pathname, searchParams } = new URL(request.url)

    if (pathname === '/binance') {
      const symbol = searchParams.get('symbol') || 'BTCUSDT'
      const interval = searchParams.get('interval') || '1h'
      const limit = searchParams.get('limit') || '100'

      const url = `https://api.binance.com/api/v3/klines?symbol=${symbol}&interval=${interval}&limit=${limit}`

      const response = await fetch(url)
      const data = await response.json()
      return Response.json({ data })
    }

    if (pathname === '/openai') {
      const body = await request.json()
      const prompt = body.prompt || '给我一条 BTC 投资建议'

      const res = await fetch('https://api.openai.com/v1/chat/completions', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer sk-xxxxxx` // ⚠️ 替换为你自己的 Key
        },
        body: JSON.stringify({
          model: 'gpt-3.5-turbo',
          messages: [{ role: 'user', content: prompt }]
        })
      })

      const json = await res.json()
      return Response.json({ result: json.choices[0].message.content })
    }

    if (pathname === '/mail') {
      const body = await request.json()
      const { to, subject, content } = body

      const res = await fetch('https://api.resend.com/emails', {
        method: 'POST',
        headers: {
          'Authorization': 'Bearer re_xxxxx', // ⚠️ 替换为你的 Resend Key
          'Content-Type': 'application/json'
        },
        body: JSON.stringify({
          from: 'noreply@168.112583.xyz',
          to,
          subject,
          html: `<strong>${content}</strong>`
        })
      })

      const result = await res.json()
      return Response.json(result)
    }

    return new Response('Hello from Cloudflare Worker API!', { status: 200 })
  }
}
