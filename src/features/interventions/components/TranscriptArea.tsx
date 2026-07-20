import { type ChangeEvent } from 'react'

interface TranscriptAreaProps {
  value: string
  onChange: (value: string) => void
}

/* Área en la que se irá construyendo el texto de la intervención */
export function TranscriptArea({ value, onChange }: TranscriptAreaProps) {
  /* Extrae el nuevo texto del evento y lo comunica al componente padre */
  const handleChange = (event: ChangeEvent<HTMLTextAreaElement>) => onChange(event.target.value)

  const handleCopy = async () => {
    if (value.trim()) {
      void navigator.clipboard.writeText(value);
    }
  }

  return (
    <section
      className="shrink-0 border-t-2 border-slate-600 p-6 bg-slate-950"
      aria-labelledby="transcript-title"
    >
      <div className="mb-2 flex justify-end gap-2">
        <button
          type="button"
          className={
            'rounded-md border border-slate-500 px-3 py-1 text-sm ' +
            'text-white transition-colors hover:border-cyan-600 hover:bg-cyan-900 ' +
            'disabled:cursor-not-allowed disabled:opacity-40'
          }
          disabled={!value.trim()}
          onClick={handleCopy}
        >
          Copiar
        </button>

        <button
          type="button"
          className={
            'rounded-md border border-slate-500 px-3 py-1 text-sm font-semibold ' +
            'text-white transition-colors hover:border-red-600 hover:bg-red-900 ' +
            'disabled:cursor-not-allowed disabled:opacity-40'
          }
          disabled={!value}
          onClick={() => onChange('')}
        >
          Limpiar
        </button>
      </div>

      <textarea
        id="intervention-transcript"
        value={value}
        onChange={handleChange}
        placeholder="Escribe la información comunicada por el alertante..."
        className={'h-20 w-full resize-none rounded-lg border-2 border-slate-500 bg-slate-900 p-3 text-[15px] text-white ' +
          'outline-none transition focus:bg-black placeholder:text-slate-400'}
      />
    </section>
  )
}