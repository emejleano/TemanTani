// services/chatgptService.ts

export async function askChatbot(
  history: { role: string; parts: { text: string }[] }[],
  question: string
): Promise<string> {
  try {
    // Gabungkan konteks obrolan
    const context = history
      .map((msg) => `${msg.role}: ${msg.parts[0].text}`)
      .join("\n");

    const fullPrompt = `${context}\nuser: ${question}`;

    const response = await fetch(
      `https://api.ferdev.my.id/ai/chatgpt?prompt=${encodeURIComponent(fullPrompt)}&apikey=key-veng`
    );

    if (!response.ok) throw new Error(`HTTP error! status: ${response.status}`);

    const raw = await response.text();

    // Coba parse JSON, tapi fallback ke raw text
    let message = raw;
    try {
      const json = JSON.parse(raw);
      message = json?.message || json?.text || json?.content || raw;
    } catch {
      message = raw;
    }

    return message.trim();
  } catch (error) {
    console.error("❌ Error calling GPT API:", error);
    return "Maaf, terjadi kesalahan saat menghubungi asisten AI. Silakan coba lagi nanti.";
  }
}
