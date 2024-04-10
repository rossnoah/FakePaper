// import {
//   buildPrompt,
//   cleanLatex as cleanLaTeX,
//   generateLatex,
// } from "@/lib/generator";
// import { NextResponse } from "next/server";

// interface generateRequestBody {
//   topic: string;
//   isPremium: boolean;
// }

// export interface generateReponseFormat {
//   message: string;
//   url: string;
//   title: string;
// }

// export async function POST(request: Request) {
//   try {
//     const body: generateRequestBody = await request.json();

//     const { topic, isPremium } = body;

//     if (typeof topic !== "string" || typeof isPremium !== "boolean") {
//       return new NextResponse("Invalid request", { status: 400 });
//     }

//     if (!topic) {
//       return new NextResponse("Missing topic", { status: 400 });
//     }

//     const generatedPrompt = await buildPrompt(topic);
//     if (!generatedPrompt) {
//       return new NextResponse("An error occurred", { status: 500 });
//     }

//     const response = await generateLatex(generatedPrompt, false);
//     if (!response) {
//       return new NextResponse("An error occurred", { status: 500 });
//     }

//     const latex = cleanLaTeX(response);

//     //send a post request to worker.fakepaper.app/latex with the latex as a plain text body
//     const workerResponse = await fetch("https://worker.fakepaper.app/latex", {
//       method: "POST",
//       headers: {
//         "Content-Type": "text/plain",
//         Authorization: "Bearer " + process.env.WORKER_AUTH_TOKEN,
//       },
//       body: latex,
//     });

//     if (!workerResponse.ok) {
//       return new NextResponse("An error occurred in the worker", {
//         status: 500,
//       });
//     }
//     const workerResponseJson = await workerResponse.json();

//     return NextResponse.json(workerResponseJson);
//   } catch (error) {
//     return new NextResponse("An error occurred", { status: 500 });
//   }
// }
