export default {
  async fetch(request: Request): Promise<Response> {
    const { pathname } = new URL(request.url);

    if (pathname.startsWith("/binance")) {
      return handleBinance(request);
    }

    if (pathname === "/ai") {
      return handleAI(request);
    }

    if (pathname === "/mail") {
      return handleMail(request);
    }

    return new Response("404 Not Found", { status: 404 });
  }
};

// ✅ Binance 中转接口
async function handleBinance(request: Request): Promise<Response> {
  const url = new URL(request.url);
  const path = url.searchParams.get("path") || "/api/v3/ticker/price";
  url.searchParams.delete("path");

  const query = url.searchParams.toString();
  const fullUrl = `https://api.binance.com${path}?${query}`;

  try {
    const res = await fetch(fullUrl);
    const data = await res.json();
    return Response.json(data);
  } catch (err: any) {
    return Response.json({ error: "Binance 请求失败", detail: err.message }, { status: 500 });
  }
}

// ✅ AI 投资建议接口
async function handleAI(request: Request): Promise<Response> {
  const body = await request.json();
  const prompt = body.prompt || "帮我分析比特币现在是否值得买入。";

  const OPENAI_API_KEY = "sk-你的测试Key"; // 替换为你自己的 key

  const res = await fetch("https://api.openai.com/v1/chat/completions", {
    method: "POST",
    headers: {
      "Authorization": `Bearer ${OPENAI_API_KEY}`,
      "Content-Type": "application/json"
    },
    body: JSON.stringify({
      model: "gpt-3.5-turbo",
      messages: [{ role: "user", content: prompt }]
    })
  });

  const data = await res.json();
  return Response.json({ reply: data.choices?.[0]?.message?.content });
}

// ✅ 邮件提醒接口（Resend）
async function handleMail(request: Request): Promise<Response> {
  const body = await request.json();
  const { to, subject, text } = body;

  const RESEND_API_KEY = "re_test_你的resendKey"; // 替换为你的 Resend Key

  const res = await fetch("https://api.resend.com/emails", {
    method: "POST",
    headers: {
      "Authorization": `Bearer ${RESEND_API_KEY}`,
      "Content-Type": "application/json"
    },
    body: JSON.stringify({
      from: "Crypto AI <ai@168.112583.xyz>",
      to,
      subject,
      text
    })
  });

  const data = await res.json();
  return Response.json({ status: "sent", data });
}
