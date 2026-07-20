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
      className={'flex min-h-0 flex-1 flex-col overflow-hidden rounded-lg border-2 border-slate-600 bg-slate-90'}
    >
      <header className="shrink-0 border-b-2 border-slate-600 bg-slate-900 px-4 py-3">
        <h2
          id="questions-title"
          className="font-semibold text-[18px] text-white text-center"
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
          <p className="text-sm text-slate-200">
            No hay preguntas disponibles.
          </p>
        )}
      </div>
    </section>
  )
}
