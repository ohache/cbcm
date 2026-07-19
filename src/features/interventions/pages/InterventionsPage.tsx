import { useState, type Dispatch, type SetStateAction } from 'react'
import { Outlet } from 'react-router'
import { TranscriptArea } from '@/features/interventions/components/TranscriptArea'

export interface InterventionsOutletContext {
  transcript: string
  setTranscript: Dispatch<SetStateAction<string>>
}

/* Página principal del módulo de interrogatorios */
export function InterventionsPage() {
  const [transcript, setTranscript] = useState('')

  return (
    <div className="flex min-h-0 flex-1 flex-col">
      <Outlet
        context={{ transcript, setTranscript } satisfies InterventionsOutletContext}
      />

      <TranscriptArea
        value={transcript}
        onChange={setTranscript}
      />
    </div>
  )
}