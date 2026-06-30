import { useState } from 'react'
import { motion } from 'framer-motion'
import type { PetNoteEntry } from '@/modules/pets'

interface PetNotesSectionProps {
  notes: PetNoteEntry[]
  onAdd: (text: string) => void
}

export function PetNotesSection({ notes, onAdd }: PetNotesSectionProps) {
  const [draft, setDraft] = useState('')

  const handleSubmit = () => {
    if (!draft.trim()) return
    onAdd(draft)
    setDraft('')
  }

  return (
    <div className="space-y-4">
      <div className="flex gap-2">
        <input
          type="text"
          value={draft}
          onChange={(e) => setDraft(e.target.value)}
          onKeyDown={(e) => e.key === 'Enter' && handleSubmit()}
          placeholder="Add a note about today..."
          className="flex-1 rounded-xl border border-white/10 bg-white/[0.04] px-4 py-2.5 text-sm text-white placeholder:text-white/30 focus:outline-none focus:border-accent/40"
        />
        <motion.button
          type="button"
          whileTap={{ scale: 0.98 }}
          onClick={handleSubmit}
          className="rounded-xl bg-white/10 px-4 py-2.5 text-sm font-semibold text-white hover:bg-white/15 transition-colors"
        >
          Add
        </motion.button>
      </div>

      {notes.length === 0 ? (
        <p className="text-sm text-white/35 text-center py-6">Notes will build your pet history over time.</p>
      ) : (
        <ul className="space-y-3">
          {notes.slice(0, 10).map((note) => (
            <li
              key={note.id}
              className="rounded-2xl border border-white/8 bg-white/[0.03] px-4 py-3"
            >
              <p className="text-sm text-white/75 leading-relaxed">{note.text}</p>
              <p className="text-[10px] text-white/30 mt-2">{note.dateKey}</p>
            </li>
          ))}
        </ul>
      )}
    </div>
  )
}
