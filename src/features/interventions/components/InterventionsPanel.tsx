import { useState } from 'react'
import { SpecialInterventionsButton } from '@/features/interventions/components/SpecialInterventionsButton'
import { InterventionCard } from '@/features/interventions/components/InterventionCard'
import interventionsCatalog from '@/features/interventions/data/generated/index.json'
import { Search } from 'lucide-react'

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

      <div className="mb-6 grid shrink-0 grid-cols-1 items-center gap-4 md:grid-cols-[1fr_auto_1fr]">
        <div className="relative w-full max-w-lg md:col-start-2 md:w-lg">
          <label
            htmlFor="interventions-search"
            className="sr-only"
          >
            Buscar intervención
          </label>

          <Search
            aria-hidden="true"
            className="pointer-events-none absolute top-1/2 left-4 h-5 w-5 -translate-y-1/2 text-slate-600"
          />

          <input
            id="interventions-search"
            type="search"
            value={search}
            onChange={(event) => setSearch(event.target.value)}
            placeholder="Buscar intervención..."
            className={
              'w-full rounded-xl border-2 border-slate-500 bg-slate-800 py-3 pr-4 pl-12 text-white shadow-sm outline-none ' +
              'transition duration-200 placeholder:text-slate-400 focus:bg-slate-950'
            }
          />
        </div>

        <div className="flex justify-center md:col-start-3 md:justify-end">
          <SpecialInterventionsButton />
        </div>
      </div>

      <div className="min-h-0 flex-1 overflow-y-auto p-2 mt-3">
        {filteredInterventions.length > 0 ? (
          <div className="grid grid-cols-[repeat(auto-fill,11rem)] items-start gap-4">
            {filteredInterventions.map((intervention) => (
              <InterventionCard
                key={intervention.id}
                id={intervention.id}
                title={intervention.title}
                icon={intervention.icon}
              />
            ))}
          </div>
        ) : (
          <p className="text-sm text-slate-200">
            No hay intervenciones que coincidan con la búsqueda.
          </p>
        )}
      </div>
    </section>
  )
}