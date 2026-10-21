'use client';

import { createContext, useCallback, useContext, useState, type ReactNode } from 'react';
import { RequestVideoButton } from '@/components/practice/RequestVideoButton';

/**
 * Shares the practice page's "last stopped" question between PracticeSession
 * and the header's "Request a video" button. Not a new tracking system: the
 * session reports the question it is showing (its own state), and until it
 * has, the server's answer from practice_attempts is used (`initialQuestionId`,
 * lib/practice/position.ts). Nothing is persisted here.
 */

interface PracticePositionValue {
  questionId: string | null;
  reportViewed: (questionId: string) => void;
}

const PracticePositionContext = createContext<PracticePositionValue | null>(null);

export function PracticePositionProvider({
  initialQuestionId,
  children,
}: {
  initialQuestionId: string | null;
  children: ReactNode;
}) {
  const [viewed, setViewed] = useState<string | null>(null);
  const reportViewed = useCallback((id: string) => setViewed(id), []);
  return (
    <PracticePositionContext.Provider value={{ questionId: viewed ?? initialQuestionId, reportViewed }}>
      {children}
    </PracticePositionContext.Provider>
  );
}

/** For PracticeSession: a no-op outside a provider. */
export function useReportViewedQuestion(): (questionId: string) => void {
  return useContext(PracticePositionContext)?.reportViewed ?? noop;
}

function noop() {}

/** The header button, following the question the student is on. */
export function PracticeRequestVideoButton({ lessonId }: { lessonId: string }) {
  const questionId = useContext(PracticePositionContext)?.questionId ?? null;
  return <RequestVideoButton lessonId={lessonId} questionId={questionId} />;
}
