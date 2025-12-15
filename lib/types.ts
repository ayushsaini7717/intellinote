export interface Profile {
  id: string
  full_name: string | null
  avatar_url: string | null
  created_at: string
  updated_at: string
}

export interface Note {
  id: string
  user_id: string
  title: string
  content: string
  summary: string | null
  tags: string[]
  is_pinned: boolean
  is_archived: boolean
  folder: string
  created_at: string
  updated_at: string
}

export interface Collaboration {
  id: string
  note_id: string
  user_id: string
  permission: "view" | "edit"
  created_at: string
}

export interface NoteView {
  id: string
  note_id: string
  user_id: string
  viewed_at: string
}
