/** Which explanation a student sees. Kept free of server-only imports. */

import { isStructured } from './parse';

/**
 * The structured version once it exists and has passed the checks (or an
 * admin published it), otherwise the original text.
 */
export function explanationForStudents(row: {
  explanation: string | null;
  explanation_structured?: string | null;
  explanation_structured_status?: string | null;
}): { explanation: string | null; explanationFormat: 'structured' | 'plain' } {
  if (row.explanation_structured && row.explanation_structured_status === 'ok') {
    return { explanation: row.explanation_structured, explanationFormat: 'structured' };
  }
  return { explanation: row.explanation, explanationFormat: isStructured(row.explanation) ? 'structured' : 'plain' };
}
