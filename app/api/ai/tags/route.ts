import { NextResponse } from "next/server"
import { createClient } from "@/lib/supabase/server"
import { GoogleGenerativeAI } from "@google/generative-ai"

export async function POST(request: Request) {
  try {
    const supabase = await createClient()
    const {
      data: { user },
    } = await supabase.auth.getUser()

    if (!user) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 })
    }

    const { title, content } = await request.json()

    if (!content || content.trim().length === 0) {
      return NextResponse.json(
        { error: "Content is required" },
        { status: 400 }
      )
    }

    if (!process.env.GEMINI_API_KEY) {
      return NextResponse.json(
        { error: "no API key" },
        { status: 503 }
      )
    }

    const genAI = new GoogleGenerativeAI(process.env.GEMINI_API_KEY)
    const model = genAI.getGenerativeModel({
      model: "gemini-2.5-flash",
    })

    const prompt = `
Generate 3–5 relevant tags for the following note.

Rules:
- Return ONLY a comma-separated list
- No explanations
- No numbering
- Use short, lowercase words

Title:
${title}

Content:
${content}

Tags:
`

    const result = await model.generateContent(prompt)
    const rawText = result.response.text()

    const tags = rawText
      .split(",")
      .map((tag) => tag.trim().toLowerCase())
      .filter((tag) => tag.length > 0)

    return NextResponse.json({ tags })
  } catch (error) {
    console.error(error)
    return NextResponse.json(
      { error: "Failed to generate tags" },
      { status: 500 }
    )
  }
}
