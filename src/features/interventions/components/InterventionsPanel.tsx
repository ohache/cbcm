import { useState } from 'react'
import { SpecialInterventionsButton } from '@/features/interventions/components/SpecialInterventionsButton'
import { InterventionCard } from '@/features/interventions/components/InterventionCard'
import interventionsCatalog from '@/features/interventions/data/generated/index.json'

/* Normaliza el texto para ignorar mayúsculas, minúsculas y tildes. */
function normalizeText(text: string): string {
  return text.normalize('NFD').replace(/\p{Diacritic}/gu, '').toLocaleLowerCase('es').trim()
}

/* Panel principal del módulo de interrogatorios */
export function InterventionsPanel() {
  const [search, setSearch] = useState('');

  const normalizedSearch = normalizeText(search);

  const filteredInterventions = interventionsCatalog.filter((intervention) => normalizeText(intervention.title).includes(normalizedSearch));

  return (
    <section
      className="flex min-h-0 flex-1 flex-col overflow-hidden p-6"
      aria-labelledby="interventions-title"
    >
      <h1 id="interventions-title" className="sr-only">
        Intervenciones
      </h1>

      <div className="mb-5 flex shrink-0 flex-wrap items-center justify-center gap-3">
        <label
          htmlFor="interventions-search"
          className="sr-only"
        >
          Buscar intervención
        </label>

        <input
          id="interventions-search"
          type="search"
          value={search}
          onChange={(event) => setSearch(event.target.value)}
          placeholder="Buscador de intervenciones"
          className={
            'w-full max-w-md rounded-md border-2 border-slate-300 bg-white ' +
            'px-4 py-2 text-slate-900 outline-none transition-colors ' +
            'placeholder:text-slate-400 focus:border-cyan-600'
          }
        />

        <SpecialInterventionsButton />
      </div>

      <div className="min-h-0 flex-1 overflow-y-auto">
        {filteredInterventions.length > 0 ? (
          <div className="grid grid-cols-[repeat(auto-fill,11rem)] items-start gap-4">
            {filteredInterventions.map((intervention) => (
              <InterventionCard
                key={intervention.id}
                id={intervention.id}
                title={intervention.title}
              />
            ))}
          </div>
        ) : (
          <p className="text-sm text-slate-500">
            No hay intervenciones que coincidan con la búsqueda.
          </p>
        )}
      </div>
    </section>
  )
}