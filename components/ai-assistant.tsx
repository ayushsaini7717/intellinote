"use client"

import { useState } from "react"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Loader2, Send, Brain } from "lucide-react"
import type { Note } from "@/lib/types"

interface AIAssistantProps {
  notes: Note[]
}

export function AIAssistant({ notes }: AIAssistantProps) {
  const [question, setQuestion] = useState("")
  const [answer, setAnswer] = useState<string | null>(null)
  const [isLoading, setIsLoading] = useState(false)

  const handleAsk = async () => {
    if (!question.trim() || notes.length === 0) return

    setIsLoading(true)
    setAnswer(null)

    try {
      const response = await fetch("/api/ai/answer", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          question,
          notes: notes.map((note) => ({
            title: note.title,
            content: note.content,
          })),
        }),
      })
      const data = await response.json()
      if (data.answer) {
        setAnswer(data.answer)
      }
    } catch (error) {
      console.error(error)
      setAnswer("Sorry, I couldn't generate an answer. Please try again.")
    } finally {
      setIsLoading(false)
    }
  }

  return (
    <Card>
      <CardHeader>
        <CardTitle className="flex items-center gap-2">
          <Brain className="size-5 text-primary" />
          AI Assistant
        </CardTitle>
        <CardDescription>Ask questions about your notes</CardDescription>
      </CardHeader>
      <CardContent className="space-y-4">
        <div className="flex gap-2">
          <Input
            placeholder="Ask me anything about your notes..."
            value={question}
            onChange={(e) => setQuestion(e.target.value)}
            onKeyDown={(e) => {
              if (e.key === "Enter") {
                e.preventDefault()
                handleAsk()
              }
            }}
            disabled={isLoading || notes.length === 0}
          />
          <Button onClick={handleAsk} disabled={isLoading || !question.trim() || notes.length === 0}>
            {isLoading ? <Loader2 className="size-4 animate-spin" /> : <Send className="size-4" />}
          </Button>
        </div>
        {notes.length === 0 && (
          <p className="text-sm text-muted-foreground">Create some notes first to use the AI assistant.</p>
        )}
        {answer && (
          <div className="rounded-lg border bg-muted/50 p-4">
            <p className="text-sm leading-relaxed">{answer}</p>
          </div>
        )}
      </CardContent>
    </Card>
  )
}
