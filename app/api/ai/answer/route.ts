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
    const { question, notes } = await request.json()

    if (!question || !notes || notes.length === 0) {
      return NextResponse.json(
        { error: "Question and notes are required" },
        { status: 400 }
      )
    }

    const notesContext = notes
      .map(
        (note: { title: string; content: string }) =>
          `Title: ${note.title}\nContent: ${note.content}`
      )
      .join("\n\n---\n\n")

    const genAI = new GoogleGenerativeAI(process.env.GEMINI_API_KEY!)
    const model = genAI.getGenerativeModel({
      model: "gemini-2.5-flash",
    })

    const prompt = `
          You are a helpful assistant that answers questions based ONLY on the user's notes.

          Rules:
          - Use only the provided notes
          - If the answer is not present, say "The answer is not available in the notes."

          Notes:
          ${notesContext}

          Question:
          ${question}

          Answer:
`

    const result = await model.generateContent(prompt)
    const text = result.response.text()

    return NextResponse.json({ answer: text })
  } catch (error) {
    console.error(error);
    return NextResponse.json(
      { error: "Failed to generate answer" },
      { status: 500 }
    )
  }
}
