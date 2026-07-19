import { QuestionItem } from '@/features/interventions/components/QuestionItem'
import type { InterventionQuestion } from '@/features/interventions/types/intervention.types'

interface QuestionsPanelProps {
  questions: InterventionQuestion[]
  answers: Record<string, string>
  onSelectAnswer: (questionId: string, optionId: string) => void
}

/* Lista las preguntas visibles del interrogatorio. */
export function QuestionsPanel({ questions, answers, onSelectAnswer }: QuestionsPanelProps) {
  return (
    <section
      className="flex h-full min-h-0 flex-col overflow-hidden rounded-lg border border-slate-200 bg-slate-50"
      aria-labelledby="questions-title"
    >
      <header className="shrink border-b border-slate-200 bg-white px-4 py-3">
        <h2
          id="questions-title"
          className="font-semibold text-[18px] text-slate-900 text-center"
        >
          Preguntas
        </h2>
      </header>

      {/* Esta zona mantiene su propio scroll cuando crece el interrogatorio. */}
      <div className="min-h-0 flex-1 space-y-4 overflow-y-auto p-4">
        {questions.length > 0 ? (
          questions.map((question) => (
            <QuestionItem
              key={question.id}
              question={question}
              selectedOptionId={answers[question.id]}
              onSelect={onSelectAnswer}
            />
          ))
        ) : (
          <p className="text-sm text-slate-500">
            No hay preguntas disponibles.
          </p>
        )}
      </div>
    </section>
  )
}
