import { NextResponse } from "next/server";

export const runtime = "nodejs";

export async function POST(request: Request) {
  try {
    const { image, concern } = await request.json();
    const apiKey = process.env.OPENROUTER_API_KEY;
    const model = process.env.NEXT_PUBLIC_OPENROUTER_MODEL || "google/gemini-flash-1.5";

    if (!apiKey && !process.env.GROQ_API_KEY && !process.env.GROK_API_KEY && !process.env.OPENAI_API_KEY) {
      return NextResponse.json({ error: "AI API key not configured" }, { status: 500 });
    }

    const prompt = `
      As a professional dermatological assistant, analyze the skin condition in the provided image.
      The user is specifically concerned about: ${concern || "General skin health"}.

      Provide a detailed analysis including hydration, oiliness, acne, and dark spots (as percentages 0-100).
      Provide a specific morning (AM) and evening (PM) routine.
      Include 4-5 recommended products available in India (under ₹500 range).

      IMPORTANT: Your entire response must be a single valid JSON object. Do not include any text before or after the JSON.

      JSON Structure:
      {
        "hydration": number,
        "oiliness": number,
        "acne": number,
        "dark_spots": number,
        "summary": "string",
        "tags": ["string"],
        "routine": {
          "am": ["string"],
          "pm": ["string"]
        },
        "recommended_products": [
          { "name": "string", "type": "string", "brand": "string", "price_range": "string" }
        ]
      }
    `;

    let apiUrl = "https://openrouter.ai/api/v1/chat/completions";
    let authHeader = `Bearer ${apiKey}`;
    let modelToUse = model;
    let provider = "OpenRouter";

    const groqApiKey = process.env.GROQ_API_KEY || process.env.GROK_API_KEY;
    const openAiApiKey = process.env.OPENAI_API_KEY;
    const groqModel =
      process.env.GROQ_MODEL === "llama-3.2-11b-vision-preview" ? undefined : process.env.GROQ_MODEL;

    if (groqApiKey) {
      apiUrl = "https://api.groq.com/openai/v1/chat/completions";
      authHeader = `Bearer ${groqApiKey}`;
      modelToUse = groqModel || "meta-llama/llama-4-scout-17b-16e-instruct";
      provider = "Groq";
    } else if (openAiApiKey) {
      apiUrl = "https://api.openai.com/v1/chat/completions";
      authHeader = `Bearer ${openAiApiKey}`;
      modelToUse = "gpt-4o-mini";
      provider = "OpenAI";
    }

    const headers: Record<string, string> = {
      Authorization: authHeader,
      "Content-Type": "application/json",
    };

    if (apiUrl.includes("openrouter.ai")) {
      headers["HTTP-Referer"] = "https://skin.chat";
      headers["X-Title"] = "Skin.Chat";
    }

    const requestBody: Record<string, unknown> = {
      model: modelToUse,
      messages: [
        {
          role: "user",
          content: [
            {
              type: "image_url",
              image_url: {
                url: image,
              },
            },
            { type: "text", text: prompt },
          ],
        },
      ],
    };

    if (provider === "Groq" || provider === "OpenAI") {
      requestBody.response_format = { type: "json_object" };
    }

    const response = await fetch(apiUrl, {
      method: "POST",
      headers,
      body: JSON.stringify(requestBody),
    });

    const data = await response.json();

    if (data.error) {
      return NextResponse.json(
        {
          error: data.error.message || `${provider} Error`,
          details: data.error,
        },
        { status: 500 },
      );
    }

    if (!data.choices?.length) {
      return NextResponse.json({ error: "No response from AI model" }, { status: 500 });
    }

    const rawContent = data.choices[0].message.content;
    let cleanContent = rawContent;
    if (cleanContent.includes("```json")) {
      cleanContent = cleanContent.split("```json")[1].split("```")[0].trim();
    } else if (cleanContent.includes("```")) {
      cleanContent = cleanContent.split("```")[1].split("```")[0].trim();
    }

    return NextResponse.json(JSON.parse(cleanContent));
  } catch (error) {
    console.error("Analysis Server Error:", error);
    return NextResponse.json({ error: "Failed to process skin analysis" }, { status: 500 });
  }
}
