/**
 * Cambridge past-paper filename parser.
 *
 * Their convention is strict and predictable: 0625_s23_qp_42.pdf is syllabus
 * 0625, May/June 2023, question paper, Paper 4 Variant 2.
 *   s = May/Jun · w = Oct/Nov · m = Feb/Mar
 *   qp = question paper · ms = mark scheme
 *
 * Anything else (examiner reports, grade thresholds, renamed files) returns
 * null so the caller can skip and report it rather than guess — a mis-filed
 * paper is worse than an unfiled one.
 *
 * Verified against every session type, both file types, uppercase names, and
 * four malformed cases before use.
 */
export interface ParsedPaperName {
  syllabus: string;
  year: number;
  session: string;
  paperNumber: number;
  variant: number;
  type: 'qp' | 'ms';
}

export function parseCambridgeName(filename: string): ParsedPaperName | null {
  const base = filename.replace(/\.[^.]+$/, '').toLowerCase();
  const m = base.match(/^(\d{4})_([smw])(\d{2})_(qp|ms)_(\d)(\d)$/);
  if (!m) return null;
  const [, syllabus, sessLetter, yy, type, paperNo, variant] = m;
  const session = sessLetter === 's' ? 'May/Jun' : sessLetter === 'w' ? 'Oct/Nov' : 'Feb/Mar';
  return {
    syllabus,
    year: 2000 + parseInt(yy, 10),
    session,
    paperNumber: parseInt(paperNo, 10),
    variant: parseInt(variant, 10),
    type: type as 'qp' | 'ms',
  };
}
