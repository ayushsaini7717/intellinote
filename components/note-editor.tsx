"use client"

import { useState } from "react"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Textarea } from "@/components/ui/textarea"
import { Label } from "@/components/ui/label"
import { Badge } from "@/components/ui/badge"
import { createClient } from "@/lib/supabase/client"
import { Sparkles, X, Loader2, Save, Pin, Archive } from "lucide-react"
import type { Note } from "@/lib/types"

interface NoteEditorProps {
  note?: Note
  onSave: () => void
  onCancel: () => void
}

export function NoteEditor({ note, onSave, onCancel }: NoteEditorProps) {
  const [title, setTitle] = useState(note?.title || "")
  const [content, setContent] = useState(note?.content || "")
  const [tags, setTags] = useState<string[]>(note?.tags || [])
  const [newTag, setNewTag] = useState("")
  const [folder, setFolder] = useState(note?.folder || "general")
  const [isPinned, setIsPinned] = useState(note?.is_pinned || false)
  const [isArchived, setIsArchived] = useState(note?.is_archived || false)
  const [isSaving, setIsSaving] = useState(false)
  const [isGeneratingSummary, setIsGeneratingSummary] = useState(false)
  const [isGeneratingTags, setIsGeneratingTags] = useState(false)

  const supabase = createClient()

  const handleAddTag = () => {
    if (newTag.trim() && !tags.includes(newTag.trim().toLowerCase())) {
      setTags([...tags, newTag.trim().toLowerCase()])
      setNewTag("")
    }
  }

  const handleRemoveTag = (tagToRemove: string) => {
    setTags(tags.filter((tag) => tag !== tagToRemove))
  }

  const handleGenerateSummary = async () => {
    if (!content.trim()) return

    setIsGeneratingSummary(true)
    try {
      const response = await fetch("/api/ai/summarize", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ content }),
      })
      const data = await response.json()
      if (data.summary) {
        alert(`Summary: ${data.summary}`)
      }
    } catch (error) {
      console.error(error)
    } finally {
      setIsGeneratingSummary(false)
    }
  }

  const handleGenerateTags = async () => {
    if (!content.trim()) return

    setIsGeneratingTags(true)
    try {
      const response = await fetch("/api/ai/tags", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ title, content }),
      })
      const data = await response.json()
      if (data.tags) {
        setTags([...new Set([...tags, ...data.tags])])
      }
    } catch (error) {
      console.error(error)
    } finally {
      setIsGeneratingTags(false)
    }
  }

  const handleSave = async () => {
    if (!title.trim() || !content.trim()) {
      alert("Title and content are required")
      return
    }

    setIsSaving(true)
    try {
      const {
        data: { user },
      } = await supabase.auth.getUser()

      if (!user) {
        alert("You must be logged in")
        return
      }

      if (note) {
        const { error } = await supabase
          .from("notes")
          .update({
            title,
            content,
            tags,
            folder,
            is_pinned: isPinned,
            is_archived: isArchived,
          })
          .eq("id", note.id)

        if (error) throw error
      } else {
        const { error } = await supabase.from("notes").insert({
          user_id: user.id,
          title,
          content,
          tags,
          folder,
          is_pinned: isPinned,
          is_archived: isArchived,
        })

        if (error) throw error
      }

      onSave()
    } catch (error) {
      console.error(error)
      alert("Failed to save note")
    } finally {
      setIsSaving(false)
    }
  }

  return (
    <div className="flex h-full flex-col gap-6">
      <div className="grid gap-4">
        <div className="grid gap-2">
          <Label htmlFor="title">Title</Label>
          <Input
            id="title"
            placeholder="Enter note title..."
            value={title}
            onChange={(e) => setTitle(e.target.value)}
          />
        </div>

        <div className="grid gap-2">
          <Label htmlFor="content">Content</Label>
          <Textarea
            id="content"
            placeholder="Start writing your note..."
            className="min-h-[300px] resize-none"
            value={content}
            onChange={(e) => setContent(e.target.value)}
          />
        </div>

        <div className="flex gap-2">
          <Button
            type="button"
            variant="outline"
            size="sm"
            onClick={handleGenerateSummary}
            disabled={isGeneratingSummary || !content.trim()}
          >
            {isGeneratingSummary ? <Loader2 className="size-4 animate-spin" /> : <Sparkles className="size-4" />}
            <span className="ml-2">Generate Summary</span>
          </Button>
        </div>

        <div className="grid gap-2">
          <Label htmlFor="tags">Tags</Label>
          <div className="flex gap-2">
            <Input
              id="tags"
              placeholder="Add a tag..."
              value={newTag}
              onChange={(e) => setNewTag(e.target.value)}
              onKeyDown={(e) => {
                if (e.key === "Enter") {
                  e.preventDefault()
                  handleAddTag()
                }
              }}
            />
            <Button type="button" variant="outline" size="sm" onClick={handleAddTag}>
              Add
            </Button>
            <Button
              type="button"
              variant="outline"
              size="sm"
              onClick={handleGenerateTags}
              disabled={isGeneratingTags || !content.trim()}
            >
              {isGeneratingTags ? <Loader2 className="size-4 animate-spin" /> : <Sparkles className="size-4" />}
            </Button>
          </div>
          {tags.length > 0 && (
            <div className="flex flex-wrap gap-2">
              {tags.map((tag) => (
                <Badge key={tag} variant="secondary" className="gap-1">
                  {tag}
                  <button type="button" onClick={() => handleRemoveTag(tag)} className="ml-1">
                    <X className="size-3" />
                  </button>
                </Badge>
              ))}
            </div>
          )}
        </div>

        <div className="grid gap-2">
          <Label htmlFor="folder">Folder</Label>
          <Input id="folder" placeholder="Folder name..." value={folder} onChange={(e) => setFolder(e.target.value)} />
        </div>

        <div className="flex gap-4">
          <label className="flex cursor-pointer items-center gap-2">
            <input
              type="checkbox"
              checked={isPinned}
              onChange={(e) => setIsPinned(e.target.checked)}
              className="size-4"
            />
            <Pin className="size-4" />
            <span className="text-sm">Pin note</span>
          </label>
          <label className="flex cursor-pointer items-center gap-2">
            <input
              type="checkbox"
              checked={isArchived}
              onChange={(e) => setIsArchived(e.target.checked)}
              className="size-4"
            />
            <Archive className="size-4" />
            <span className="text-sm">Archive</span>
          </label>
        </div>
      </div>

      <div className="flex gap-2">
        <Button onClick={handleSave} disabled={isSaving}>
          {isSaving ? <Loader2 className="size-4 animate-spin" /> : <Save className="size-4" />}
          <span className="ml-2">{note ? "Update" : "Create"} Note</span>
        </Button>
        <Button variant="outline" onClick={onCancel}>
          Cancel
        </Button>
      </div>
    </div>
  )
}
