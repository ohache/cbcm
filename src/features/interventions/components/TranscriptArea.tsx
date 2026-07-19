import { useState, type ChangeEvent } from 'react'

interface TranscriptAreaProps {
  value: string
  onChange: (value: string) => void
}

/* Área en la que se irá construyendo el texto de la intervención */
export function TranscriptArea({ value, onChange }: TranscriptAreaProps) {
  /* Extrae el nuevo texto del evento y lo comunica al componente padre */
  const handleChange = (event: ChangeEvent<HTMLTextAreaElement>) => onChange(event.target.value)

  const [copied, setCopied] = useState(false)

  const handleCopy = async () => {
    if (!value.trim()) return

    await navigator.clipboard.writeText(value)

    setCopied(true)

    window.setTimeout(() => {
      setCopied(false)
    }, 1500)
  }

  return (
    <section
      className="shrink-0 border-t border-slate-200 p-6 bg-slate-950"
      aria-labelledby="transcript-title"
    >
      <div className="mb-2 grid grid-cols-[1fr_auto_1fr] items-center">
        <span aria-hidden="true" />

        <label
          id="transcript-title"
          htmlFor="intervention-transcript"
          className="text-center text-[15px] font-semibold text-white"
        >
          Texto de la intervención
        </label>

        <div className="flex justify-self-end gap-2">
          <button
            type="button"
            className={
              'rounded-md border border-slate-500 px-3 py-1 text-sm font-semibold ' +
              'text-white transition-colors hover:border-cyan-400 hover:bg-cyan-700 ' +
              'disabled:cursor-not-allowed disabled:opacity-40'
            }
            disabled={!value.trim()}
            onClick={() => void handleCopy()}
            aria-live="polite"
          >
            {copied ? 'Copiado' : 'Copiar'}
          </button>

          <button
            type="button"
            className={
              'rounded-md border border-slate-500 px-3 py-1 text-sm font-semibold ' +
              'text-white transition-colors hover:border-red-400 hover:bg-red-700 ' +
              'disabled:cursor-not-allowed disabled:opacity-40'
            }
            disabled={!value}
            onClick={() => onChange('')}
          >
            Limpiar
          </button>
        </div>
      </div>

      <textarea
        id="intervention-transcript"
        value={value}
        onChange={handleChange}
        placeholder="Escribe la información comunicada por el alertante..."
        className={'h-20 w-full resize-none rounded-lg border-2 border-slate-600 bg-white p-3 text-[15px] text-black outline-none transition ' +
          'focus:border-cyan-500 focus:ring-2 focus:ring-red-700/20'}
      />
    </section>
  )
}