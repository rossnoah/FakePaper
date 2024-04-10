import {
  buildPrompt,
  cleanLatex as cleanLaTeX,
  generateLatex,
} from "@/lib/generator";
import { NextResponse } from "next/server";

interface generateRequestBody {
  topic: string;
  isPremium: boolean;
}

export async function POST(request: Request) {
  try {
    const body: generateRequestBody = await request.json();

    const { topic, isPremium } = body;

    if (typeof topic !== "string" || typeof isPremium !== "boolean") {
      return new NextResponse("Invalid request", { status: 400 });
    }

    if (!topic) {
      return new NextResponse("Missing topic", { status: 400 });
    }

    const generatedPrompt = await buildPrompt(topic);
    if (!generatedPrompt) {
      return new NextResponse("An error occurred", { status: 500 });
    }

    const response = await generateLatex(generatedPrompt, false);
    if (!response) {
      return new NextResponse("An error occurred", { status: 500 });
    }

    const latex = cleanLaTeX(response);

    //plain text response
    return new NextResponse(latex, {
      headers: {
        "Content-Type": "text/plain",
      },
    });
  } catch (error) {
    return new NextResponse("An error occurred", { status: 500 });
  }
}
