"use client"

import { useEffect, useState } from "react"
import { createClient } from "@/lib/supabase/client"
import { useRouter } from "next/navigation"
import type { Note } from "@/lib/types"
import { Button } from "@/components/ui/button"
import { NoteCard } from "@/components/note-card"
import { NoteEditor } from "@/components/note-editor"
import { AIAssistant } from "@/components/ai-assistant"
import { Brain, Plus, LogOut, Search, Loader2, BarChart3 } from "lucide-react"
import { Input } from "@/components/ui/input"
import { Dialog, DialogContent, DialogHeader, DialogTitle } from "@/components/ui/dialog"
import Link from "next/link"

export default function DashboardPage() {
  const [notes, setNotes] = useState<Note[]>([])
  const [filteredNotes, setFilteredNotes] = useState<Note[]>([])
  const [isLoading, setIsLoading] = useState(true)
  const [showEditor, setShowEditor] = useState(false)
  const [editingNote, setEditingNote] = useState<Note | undefined>()
  const [viewingNote, setViewingNote] = useState<Note | null>(null)
  const [searchQuery, setSearchQuery] = useState("")
  const [user, setUser] = useState<any>(null)
  const router = useRouter()
  const supabase = createClient()

  useEffect(() => {
  const init = async () => {
    const {
      data: { user },
    } = await supabase.auth.getUser()

    if (!user) {
      router.push("/auth/login")
      return
    }

    setUser(user)
    await fetchNotes(user.id)
  }

  init()
}, [])


  useEffect(() => {
    filterNotes()
  }, [notes, searchQuery])

  

 const fetchNotes = async (userId: string) => {
  if (!userId) return

  try {
    const { data, error } = await supabase
      .from("notes")
      .select("*")
      .eq("user_id", userId)
      .order("is_pinned", { ascending: false })
      .order("created_at", { ascending: false })

    if (error) throw error
    setNotes(data || [])
  } catch (error) {
    console.error(error)
  } finally {
    setIsLoading(false)
  }
}



  const filterNotes = () => {
    if (!searchQuery.trim()) {
      setFilteredNotes(notes)
      return
    }

    const query = searchQuery.toLowerCase()
    const filtered = notes.filter(
      (note) =>
        note.title.toLowerCase().includes(query) ||
        note.content.toLowerCase().includes(query) ||
        note.tags.some((tag) => tag.toLowerCase().includes(query)),
    )

    setFilteredNotes(filtered)
  }

  const handleLogout = async () => {
    await supabase.auth.signOut()
    router.push("/")
  }

  const handleEdit = (note: Note) => {
    setEditingNote(note)
    setShowEditor(true)
  }

  const handleDelete = async (note: Note) => {
  if (!confirm("Are you sure you want to delete this note?")) return

  try {
    const { error } = await supabase
      .from("notes")
      .delete()
      .eq("id", note.id)
      .eq("user_id", user.id) 

    if (error) throw error

    await fetchNotes(user.id) 
  } catch (error) {
    console.error(error)
    alert("Failed to delete note")
  }
}


  const handleView = (note: Note) => {
    setViewingNote(note)
  }

  const handleSave = async () => {
  setShowEditor(false)
  setEditingNote(undefined)
  await fetchNotes(user.id)
}


  const handleCancel = () => {
    setShowEditor(false)
    setEditingNote(undefined)
  }

  if (isLoading) {
    return (
      <div className="flex h-screen items-center justify-center">
        <Loader2 className="size-8 animate-spin text-primary" />
      </div>
    )
  }

  return (
    <div className="flex min-h-screen flex-col">
      <header className="sticky top-0 z-50 w-full border-b bg-background/95 backdrop-blur supports-[backdrop-filter]:bg-background/60">
        <div className="container mx-auto flex h-14 max-w-screen-2xl items-center justify-between px-4">
          <div className="flex items-center gap-2">
            <Brain className="size-6 text-primary" />
            <span className="text-xl font-bold">IntelliNote</span>
          </div>
          <div className="flex items-center gap-2">
            <Button asChild variant="ghost" size="sm">
              <Link href="/dashboard/analytics">
                <BarChart3 className="size-4" />
                <span className="ml-2">Analytics</span>
              </Link>
            </Button>
            <span className="text-sm text-muted-foreground">{user?.email}</span>
            <Button variant="ghost" size="sm" onClick={handleLogout}>
              <LogOut className="size-4" />
            </Button>
          </div>
        </div>
      </header>

      <main className="flex-1 py-8">
        <div className="container mx-auto max-w-screen-2xl px-4">
          <div className="mb-8 flex flex-col gap-4 md:flex-row md:items-center md:justify-between">
            <div>
              <h1 className="text-3xl font-bold tracking-tight">My Notes</h1>
              <p className="text-muted-foreground">Manage your knowledge with AI assistance</p>
            </div>
            <Button onClick={() => setShowEditor(true)}>
              <Plus className="size-4" />
              <span className="ml-2">New Note</span>
            </Button>
          </div>

          <div className="mb-6 flex gap-2">
            <div className="relative flex-1">
              <Search className="absolute left-3 top-1/2 size-4 -translate-y-1/2 text-muted-foreground" />
              <Input
                placeholder="Search notes by title, content, or tags..."
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                className="pl-9"
              />
            </div>
          </div>

          <div className="mb-8">
            <AIAssistant notes={notes} />
          </div>

          {showEditor ? (
            <div className="rounded-lg border bg-card p-6">
              <h2 className="mb-6 text-xl font-semibold">{editingNote ? "Edit Note" : "Create New Note"}</h2>
              <NoteEditor note={editingNote} onSave={handleSave} onCancel={handleCancel} />
            </div>
          ) : (
            <div>
              {filteredNotes.length === 0 ? (
                <div className="flex flex-col items-center justify-center py-12 text-center">
                  <Brain className="mb-4 size-12 text-muted-foreground" />
                  <h3 className="mb-2 text-lg font-semibold">
                    {notes.length === 0 ? "No notes yet" : "No notes found"}
                  </h3>
                  <p className="mb-4 text-sm text-muted-foreground">
                    {notes.length === 0
                      ? "Create your first note to get started with IntelliNote"
                      : "Try a different search query"}
                  </p>
                  {notes.length === 0 && (
                    <Button onClick={() => setShowEditor(true)}>
                      <Plus className="size-4" />
                      <span className="ml-2">Create Note</span>
                    </Button>
                  )}
                </div>
              ) : (
                <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
                  {filteredNotes.map((note) => (
                    <NoteCard
                      key={note.id}
                      note={note}
                      onEdit={handleEdit}
                      onDelete={handleDelete}
                      onView={handleView}
                    />
                  ))}
                </div>
              )}
            </div>
          )}
        </div>
      </main>

      <Dialog open={!!viewingNote} onOpenChange={() => setViewingNote(null)}>
        <DialogContent className="max-h-[80vh] max-w-2xl overflow-y-auto">
          <DialogHeader>
            <DialogTitle>{viewingNote?.title}</DialogTitle>
          </DialogHeader>
          <div className="space-y-4">
            <div className="whitespace-pre-wrap text-sm leading-relaxed">{viewingNote?.content}</div>
            {viewingNote?.tags && viewingNote.tags.length > 0 && (
              <div className="flex flex-wrap gap-2">
                {viewingNote.tags.map((tag) => (
                  <span key={tag} className="rounded-full bg-primary/10 px-3 py-1 text-xs font-medium">
                    {tag}
                  </span>
                ))}
              </div>
            )}
          </div>
        </DialogContent>
      </Dialog>
    </div>
  )
}
