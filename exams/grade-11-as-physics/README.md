# Grade 11 AS Physics — First Quarter Examination (50 marks)

Word files in the same layout as the Grade 12 First Quarter Examination
(Cezeri header, Calibri, maroon `8C2332` headings and marks, framed diagrams, ruled working lines).

- `Grade11_First_Quarter_Exam.docx` / `.pdf`: question paper (14 pages)
- `Grade11_First_Quarter_Exam_MarkScheme.docx` / `.pdf`: mark scheme (6 pages)

| Section | Style | Questions | Marks |
|---|---|---|---|
| A | Multiple choice (Paper 1) | 1–15 | 15 |
| B | Structured (Paper 2) | 16–19 | 25 |
| C | Practical skills (Paper 3) | 20 | 10 |

Rebuild (diagrams are drawn in `src/figs.py`):

```bash
python3 src/figs.py && node src/rasterize.js && node src/build.js
```

## Formula sheet

`formula-sheet/Grade11_Formula_Sheet_BW.pdf`: two-page A4 sheet in the layout of the Grade 12
formula sheet, covering only the equations used in this exam, with every variable made the subject.
Rebuild with `cd formula-sheet/src && npm install && node build.js` (needs Playwright).
