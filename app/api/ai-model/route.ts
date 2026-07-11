import { NextRequest, NextResponse } from "next/server";
import { GoogleGenAI } from "@google/genai";

export async function POST(req: NextRequest) {
  try {
    const { messages } = await req.json();

    const apiKey = process.env.GEMINI_API_KEY;

    const genAI = new GoogleGenAI({
      apiKey,
    });

    const contents = messages.map((m: any) => ({
      role: m.role === "assistant" ? "model" : "user",
      parts: [{ text: m.content }],
    }));
    const asyncGen = await genAI.models.generateContentStream({
      model: "gemini-2.5-flash",
      contents,
    });

    const encoder = new TextEncoder();

    const stream = new ReadableStream({
      async start(controller) {
        try {
          for await (const chunk of asyncGen) {
            const text = chunk?.text;
            if (text) controller.enqueue(encoder.encode(text));
          }

          controller.close();
        } catch (err) {
          console.error("stream error:", err);
          controller.error(err);
        }
      },
    });

    return new NextResponse(stream, {
      headers: {
        "Content-Type": "text/plain; charset=utf-8",
      },
    });
  } catch (error: any) {
    console.error("Gemini API error:", error);

    return NextResponse.json(
      { error: error?.message || "Request failed" },
      { status: 500 }
    );
  }
}
