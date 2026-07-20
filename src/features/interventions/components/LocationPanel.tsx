import { X } from 'lucide-react'

interface LocationPanelProps {
  address: string
  onAddressChange: (address: string) => void
}

const CATASTRO_URL = 'https://www1.sedecatastro.gob.es/Cartografia/mapa.aspx?buscar=S'

/* Permite consultar la dirección de la intervención en servicios cartográficos. */
export function LocationPanel({ address, onAddressChange }: LocationPanelProps) {
  const normalizedAddress = address.trim()

  const googleMapsUrl = normalizedAddress ? 'https://www.google.com/maps/search/?api=1&query=' + encodeURIComponent(normalizedAddress) : undefined

  return (
    <section
      className="flex w-full items-center gap-2"
      aria-label="Localización de la intervención"
    >
      <label htmlFor="intervention-address" className="sr-only">
        Dirección de la intervención
      </label>

      <div className="relative min-w-66 flex-1">
        <input
          id="intervention-address"
          type="text"
          value={address}
          onChange={(event) => onAddressChange(event.target.value)}
          placeholder="Dirección de la intervención"
          className="w-full rounded-md border-2 border-slate-500 bg-slate-700 py-2 pr-10 pl-3 text-sm text-white outline-none transition-colors
            placeholder:text-slate-200 focus:bg-slate-950"
        />

        {address && (
          <button
            type="button"
            onClick={() => onAddressChange('')}
            aria-label="Borrar dirección"
            className="absolute top-1/2 right-2 flex -translate-y-1/2 items-center justify-center rounded p-1 text-slate-300 transition-colors 
              hover:bg-slate-600 hover:text-white"
          >
            <X
              aria-hidden="true"
              className="h-4 w-4"
            />
          </button>
        )}
      </div>

      <button
        type="button"
        disabled={!googleMapsUrl}
        onClick={() => window.open(googleMapsUrl, '_blank', 'noopener,noreferrer')}
        className="shrink-0 whitespace-nowrap rounded-md border border-cyan-700 bg-cyan-800 px-2 py-2 text-sm font-semibold text-white 
          transition-colors hover:border-cyan-500 hover:bg-cyan-700 disabled:cursor-not-allowed disabled:border-slate-500 disabled:bg-slate-700
        disabled:text-slate-400 disabled:hover:border-slate-500 disabled:hover:bg-slate-700"
      >
        Google Maps
      </button>

      <a
        href={CATASTRO_URL}
        target="_blank"
        rel="noopener noreferrer"
        className="shrink-0 whitespace-nowrap rounded-md border-2 border-indigo-600 bg-indigo-900 px-2 py-2 text-[13px] font-semibold 
          text-white transition-colors hover:bg-indigo-800"
      >
        Catastro
      </a>
    </section>
  )
}