// pages/api/analyze.ts
import { NextRequest, NextResponse } from "next/server";

export async function POST(req: NextRequest){
    try {
        const  {content, codeContent } = await req.json();

        if (!content && !codeContent) {
        return NextResponse.json(
            { error: "No content provided" },
            { status: 400 }
        );
        }

        const prompt = `Please analyze the following input: ${content || ""} ${codeContent ? "Here is the code:\n" + codeContent : ""}`.trim();

        const response = await fetch("https://generativelanguage.googleapis.com/v1beta/models/gemini-2.0-flash:generateContent", {
            method: "POST",
            headers: {
            "X-goog-api-key": `${process.env.GEMENIAI_API_KEY}`,
            "Content-Type": "application/json",
            },
            body: JSON.stringify({
            contents: [
                {
                parts: [
                    { text: prompt }
                ]
                }
            ]
            }),
        });
        
        if (!response.ok) {
            throw new Error(`Gemini API request failed: ${response.statusText}`);
        }

        const data = await response.json();
        console.log(data)
        const analysis = data.candidates[0].content.parts.map((p: any) => p.text).join("");
        console.log(analysis)
        return NextResponse.json({ analysis });
    } catch (err: any) {
        console.error(err);
        return NextResponse.json(
        { error: `Something went wrong. Status: ${500}` },
        { status: 500 }
        );
    }
}