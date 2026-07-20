import type { InterventionDocument } from '@/features/interventions/types/intervention.types'

interface DocumentsPanelProps {
  documents: InterventionDocument[]
}

/* Muestra los documentos asociados a la intervención. */
export function DocumentsPanel({ documents }: DocumentsPanelProps) {
  if (documents.length === 0) return null

  const resolveTarget = (document: InterventionDocument) => {
    if (document.type === 'web') return document.target

    return (import.meta.env.BASE_URL + document.target.replace(/^\/+/, ''))
  }

  return (
    <section
      className="flex max-h-[calc(50%-0.5rem)] min-h-0 flex-col overflow-hidden rounded-lg border-2 border-slate-600 bg-slate-900"
      aria-labelledby="documents-title"
    >
      <header className="shrink-0 border-b-2 border-slate-600 px-4 py-3">
        <h2
          id="documents-title"
          className="font-semibold text-white text-center"
        >
          Enlaces
        </h2>
      </header>

      <div className="min-h-0 flex-1 space-y-2 overflow-y-auto p-4">
        {documents.map((document) => (
          <a
            key={document.id}
            href={resolveTarget(document)}
            target="_blank"
            rel="noopener noreferrer"
            className="block rounded-md border-2 border-slate-500 bg-slate-950 px-3 py-2 text-sm font-semibold text-white text-center
              transition-colors hover:border-cyan-500 hover:bg-cyan-900"
          >
            {document.title}
          </a>
        ))}
      </div>
    </section>
  )
}