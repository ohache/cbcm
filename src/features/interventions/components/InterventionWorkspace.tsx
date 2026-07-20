import { useEffect, useRef, useState } from 'react'
import { Link, useOutletContext, useParams } from 'react-router'
import { AdvicePanel } from '@/features/interventions/components/AdvicePanel'
import { AlarmLevelIndicator } from '@/features/interventions/components/AlarmLevelIndicator'
import { QuestionsPanel } from '@/features/interventions/components/QuestionsPanel'
import { loadIntervention } from '@/features/interventions/data/loadIntervention'
import { useInterventionSession } from '@/features/interventions/hooks/useInterventionSession'
import type { InterventionsOutletContext } from '@/features/interventions/pages/InterventionsPage'
import type { Intervention } from '@/features/interventions/types/intervention.types'
import { InterventionSheetModal } from '@/features/interventions/components/InterventionSheetModal'
import { DocumentsPanel } from '@/features/interventions/components/DocumentsPanel'
import { LocationPanel } from '@/features/interventions/components/LocationPanel'
import { SpecialInterventionsButton } from '@/features/interventions/components/SpecialInterventionsButton'

type LoadingStatus = 'loading' | 'ready' | 'not-found' | 'error'

const TRANSCRIPT_PREFIX = "Alertante indica: "

interface InterventionContentProps {
  intervention: Intervention
}

function InterventionContent({ intervention }: InterventionContentProps) {
  const { setTranscript, address, setAddress } = useOutletContext<InterventionsOutletContext>()

  const [isSheetModalOpen, setIsSheetModalOpen] = useState(false)

  const sheetImageSrc = `${import.meta.env.BASE_URL}fichas/${intervention.id}.png`

  const previousGeneratedTranscript = useRef('')

  const { answers, visibleQuestions, alarmLevel, activeAdvice, generatedTranscript, selectAnswer } = useInterventionSession(intervention)

  /* Añade el encabezado únicamente cuando se accede a una intervención. */
  useEffect(() => {
    setTranscript((currentTranscript) => currentTranscript.trim() ? currentTranscript : TRANSCRIPT_PREFIX + ' ')
  }, [setTranscript])

  /* Añade inicialmente el texto generado y, si cambia una respuesta, sustituye el bloque generado anterior sin impedir la edición manual */
  useEffect(() => {
    const normalizedTranscript = generatedTranscript.trim()
    const previousTranscript = previousGeneratedTranscript.current

    if (previousTranscript === normalizedTranscript) return

    setTranscript((currentTranscript) => {
      if (previousTranscript && currentTranscript.includes(previousTranscript)) {
        return currentTranscript.replace(previousTranscript, normalizedTranscript)
      }

      if (!normalizedTranscript) return currentTranscript

      return currentTranscript.trim() ? currentTranscript.trimEnd() + ' ' + normalizedTranscript : TRANSCRIPT_PREFIX + ' ' + normalizedTranscript
    })

    previousGeneratedTranscript.current = normalizedTranscript
  }, [generatedTranscript, setTranscript])

  return (
    <section
      className="flex min-h-0 flex-1 flex-col overflow-hidden p-6"
      aria-labelledby="intervention-title"
    >
      <header className="mb-4 flex shrink-0 items-center justify-between gap-4">
        <div>
          <Link
            to="/interrogatorios"
            className="text-sm font-medium text-slate-500 hover:text-red-700"
          >
            ← Volver a intervenciones
          </Link>

          <h1
            id="intervention-title"
            className="mt-1 text-2xl font-semibold text-slate-900"
          >
            {intervention.title}
          </h1>
        </div>

        <div className="flex flex-wrap items-center justify-end gap-4">
          <LocationPanel
            address={address}
            onAddressChange={setAddress}
          />

          <SpecialInterventionsButton />

          <AlarmLevelIndicator
            level={alarmLevel}
            onClick={() => setIsSheetModalOpen(true)}
          />
        </div>
      </header>

      <div className="grid min-h-0 flex-1 grid-cols-1 gap-4 overflow-hidden lg:grid-cols-[minmax(0,2fr)_minmax(16rem,1fr)]">
        <QuestionsPanel
          questions={visibleQuestions}
          answers={answers}
          onSelectAnswer={selectAnswer}
        />

        <div className="flex min-h-0 flex-col gap-4 overflow-hidden">
          <AdvicePanel advice={activeAdvice} />

          <DocumentsPanel documents={intervention.documents} />
        </div>
      </div>

      {isSheetModalOpen && (
        <InterventionSheetModal
          title={intervention.title}
          alarmLevel={alarmLevel}
          imageSrc={sheetImageSrc}
          onClose={() => setIsSheetModalOpen(false)}
        />
      )}
    </section>
  )
}

/* Zona de trabajo de una intervención seleccionada */
export function InterventionWorkspace() {
  const { interventionId } = useParams<{ interventionId: string }>()
  const [intervention, setIntervention] = useState<Intervention>()
  const [status, setStatus] = useState<LoadingStatus>('loading')

  useEffect(() => {
    let cancelled = false

    async function getIntervention() {
      if (!interventionId) {
        setStatus('not-found')
        return
      }

      setIntervention(undefined)
      setStatus('loading')

      try {
        const loadedIntervention = await loadIntervention(interventionId)

        if (cancelled) return

        if (!loadedIntervention) {
          setStatus('not-found')
          return
        }

        setIntervention(loadedIntervention)
        setStatus('ready')
      } catch {
        if (!cancelled) setStatus('error')
      }
    }

    void getIntervention()

    return () => { cancelled = true }
  }, [interventionId])

  if (status === 'loading') {
    return (
      <section className="min-h-0 flex-1 p-6">
        <p className="text-slate-600">Cargando intervención…</p>
      </section>
    )
  }

  if (status !== 'ready' || !intervention) {
    return (
      <section className="min-h-0 flex-1 p-6">
        <p className="text-slate-700">
          {status === 'error' ? 'No se ha podido cargar la intervención.' : 'La intervención no existe.'}
        </p>

        <Link
          to="/interrogatorios"
          className="mt-3 inline-block font-semibold text-red-700 hover:text-red-800"
        >
          Volver a intervenciones
        </Link>
      </section>
    )
  }

  return (
    <InterventionContent
      key={intervention.id}
      intervention={intervention}
    />
  )
}
