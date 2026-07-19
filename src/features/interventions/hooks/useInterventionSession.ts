import { useCallback, useMemo, useState } from 'react'
import type { AlarmLevel, AnswerOption, Intervention, InterventionAdvice, InterventionQuestion } from '@/features/interventions/types/intervention.types'

type AnswersByQuestionId = Record<string, string>

interface SessionState {
  interventionId: string
  answers: AnswersByQuestionId
}

export interface InterventionSession {
  answers: AnswersByQuestionId
  visibleQuestions: InterventionQuestion[]
  alarmLevel: AlarmLevel
  activeAdvice: InterventionAdvice[]
  generatedTranscript: string
  selectAnswer: (questionId: string, optionId: string) => void
  resetSession: () => void
}

/* Comprueba si se cumple la condición de visibilidad de una pregunta. */
function isQuestionVisible(question: InterventionQuestion, answers: AnswersByQuestionId): boolean {
  if (!question.visibleWhen) return true

  return (answers[question.visibleWhen.questionId] === question.visibleWhen.optionId)
}

/* Elimina las respuestas de preguntas que hayan quedado ocultas */
function removeHiddenAnswers(intervention: Intervention, currentAnswers: AnswersByQuestionId): AnswersByQuestionId {
  const answers = { ...currentAnswers }
  let answerRemoved: boolean

  do {
    answerRemoved = false

    for (const question of intervention.questions) {
      if (answers[question.id] && !isQuestionVisible(question, answers)) {
        delete answers[question.id]
        answerRemoved = true
      }
    }
  } while (answerRemoved)

  return answers
}

/* Localiza la opción seleccionada de una pregunta. */
function findSelectedOption(question: InterventionQuestion, answers: AnswersByQuestionId): AnswerOption | undefined {
  const selectedOptionId = answers[question.id]
  return question.options.find((option) => option.id === selectedOptionId)
}

/** Gestiona el estado y todos los valores derivados de un interrogatorio. */
export function useInterventionSession(intervention: Intervention): InterventionSession {
  const [session, setSession] = useState<SessionState>({ interventionId: intervention.id, answers: {} })

  /* Si cambia la intervención, se presenta inmediatamente una sesión vacía. */
  const answers = session.interventionId === intervention.id ? session.answers : {}

  const visibleQuestions = useMemo(() =>
    intervention.questions.filter((question) => isQuestionVisible(question, answers)).sort((a, b) => a.order - b.order),
    [answers, intervention],
  )

  const alarmLevel = useMemo(() => {
    let level = intervention.initialAlarmLevel

    for (const question of visibleQuestions) {
      const selectedOption = findSelectedOption(question, answers)

      if (selectedOption && selectedOption.minimumAlarmLevel > level) level = selectedOption.minimumAlarmLevel
    }

    return level
  }, [answers, intervention.initialAlarmLevel, visibleQuestions])

  const activeAdvice = useMemo(() => {
    const activeAdviceIds = new Set<string>()

    for (const question of visibleQuestions) {
      const selectedOption = findSelectedOption(question, answers)
      selectedOption?.adviceIds.forEach((id) => activeAdviceIds.add(id))
    }

    return intervention.advice.filter((advice) => activeAdviceIds.has(advice.id)).sort((a, b) => a.order - b.order)
  }, [answers, intervention.advice, visibleQuestions])

  const generatedTranscript = useMemo(() =>
      visibleQuestions.map((question) => findSelectedOption(question, answers)?.transcriptText.trim()).filter((text): text is string => Boolean(text)).join(' '),
    [answers, visibleQuestions],
  )

  const selectAnswer = useCallback((questionId: string, optionId: string) => {
      setSession((currentSession) => {
        const currentAnswers = currentSession.interventionId === intervention.id ? currentSession.answers : {}
        const question = intervention.questions.find((item) => item.id === questionId)

        if (!question || !isQuestionVisible(question, currentAnswers) || !question.options.some((option) => option.id === optionId)) {
          return currentSession
        }

        const nextAnswers = removeHiddenAnswers(intervention, { ...currentAnswers, [questionId]: optionId })

        return { interventionId: intervention.id, answers: nextAnswers }
      })
    }, [intervention],
  )

  const resetSession = useCallback(() => {
    setSession({ interventionId: intervention.id, answers: {} })
  }, [intervention.id])

  return {
    answers, visibleQuestions, alarmLevel, activeAdvice, generatedTranscript, selectAnswer, resetSession,
  }
}
