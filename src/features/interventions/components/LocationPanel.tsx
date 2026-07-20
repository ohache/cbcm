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
      className="flex items-center gap-2"
      aria-label="Localización de la intervención"
    >
      <label htmlFor="intervention-address" className="sr-only">
        Dirección de la intervención
      </label>

      <input
        id="intervention-address"
        type="text"
        value={address}
        onChange={(event) => onAddressChange(event.target.value)}
        placeholder="Dirección de la intervención"
        className={
          'w-72 rounded-md border-2 border-slate-300 bg-white px-3 py-2 ' +
          'text-sm text-slate-900 outline-none transition-colors ' +
          'placeholder:text-slate-400 focus:border-cyan-600'
        }
      />

      {googleMapsUrl ? (
        <a
          href={googleMapsUrl}
          target="_blank"
          rel="noopener noreferrer"
          className={
            'rounded-md border border-cyan-700 bg-cyan-800 px-3 py-2 ' +
            'text-sm font-semibold text-white transition-colors ' +
            'hover:border-cyan-500 hover:bg-cyan-700'
          }
        >
          Google Maps
        </a>
      ) : (
        <span
          className={
            'cursor-not-allowed rounded-md border border-slate-300 ' +
            'bg-slate-200 px-3 py-2 text-sm font-semibold text-slate-500'
          }
          aria-disabled="true"
        >
          Google Maps
        </span>
      )}

      <a
        href={CATASTRO_URL}
        target="_blank"
        rel="noopener noreferrer"
        className={
          'rounded-md border border-cyan-700 bg-white px-3 py-2 ' +
          'text-sm font-semibold text-cyan-800 transition-colors ' +
          'hover:border-cyan-500 hover:bg-cyan-50'
        }
      >
        Catastro
      </a>
    </section>
  )
}