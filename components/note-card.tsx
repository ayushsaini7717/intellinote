"use client"

import type { Note } from "@/lib/types"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { Button } from "@/components/ui/button"
import { Pin, Archive, Edit, Trash2, Eye } from "lucide-react"
import { formatDistanceToNow } from "date-fns"

interface NoteCardProps {
  note: Note
  onEdit: (note: Note) => void
  onDelete: (note: Note) => void
  onView: (note: Note) => void
}

export function NoteCard({ note, onEdit, onDelete, onView }: NoteCardProps) {
  return (
    <Card className="group relative transition-all hover:shadow-md">
      {note.is_pinned && (
        <div className="absolute right-2 top-2">
          <Pin className="size-4 fill-primary text-primary" />
        </div>
      )}
      <CardHeader className="pb-3">
        <div className="flex items-start justify-between gap-2">
          <CardTitle className="line-clamp-1 text-lg">{note.title}</CardTitle>
        </div>
        <CardDescription className="text-xs">
          {formatDistanceToNow(new Date(note.created_at), { addSuffix: true })}
        </CardDescription>
      </CardHeader>
      <CardContent className="space-y-4">
        <p className="line-clamp-3 text-sm text-muted-foreground">{note.content}</p>
        {note.tags.length > 0 && (
          <div className="flex flex-wrap gap-1">
            {note.tags.slice(0, 3).map((tag) => (
              <Badge key={tag} variant="secondary" className="text-xs">
                {tag}
              </Badge>
            ))}
            {note.tags.length > 3 && <Badge variant="outline" className="text-xs">{`+${note.tags.length - 3}`}</Badge>}
          </div>
        )}
        <div className="flex items-center gap-2 opacity-0 transition-opacity group-hover:opacity-100">
          <Button variant="ghost" size="sm" onClick={() => onView(note)}>
            <Eye className="size-4" />
          </Button>
          <Button variant="ghost" size="sm" onClick={() => onEdit(note)}>
            <Edit className="size-4" />
          </Button>
          <Button variant="ghost" size="sm" onClick={() => onDelete(note)}>
            <Trash2 className="size-4 text-destructive" />
          </Button>
        </div>
        {note.is_archived && (
          <div className="flex items-center gap-1 text-xs text-muted-foreground">
            <Archive className="size-3" />
            <span>Archived</span>
          </div>
        )}
      </CardContent>
    </Card>
  )
}
