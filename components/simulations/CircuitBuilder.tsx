'use client';

import { useEffect, useRef, useState, useMemo } from 'react';

// ============================================================
// Grid & data model
// ============================================================

const GRID_COLS = 6;
const GRID_ROWS = 4;
const SPACING = 80;
const PADDING = 40;
const SVG_W = (GRID_COLS - 1) * SPACING + PADDING * 2;
const SVG_H = (GRID_ROWS - 1) * SPACING + PADDING * 2;

interface NodeId {
  col: number;
  row: number;
}

function nodeKey(n: NodeId) {
  return `${n.col},${n.row}`;
}

function edgeKey(a: NodeId, b: NodeId) {
  const ka = nodeKey(a);
  const kb = nodeKey(b);
  return ka < kb ? `${ka}|${kb}` : `${kb}|${ka}`;
}

function nodePos(n: NodeId) {
  return { x: PADDING + n.col * SPACING, y: PADDING + n.row * SPACING };
}

type ComponentType = 'wire' | 'resistor' | 'battery' | 'switch' | 'led';

interface ComponentData {
  type: ComponentType;
  a: NodeId;
  b: NodeId;
  value: number; // ohms for resistor, volts for battery; unused otherwise
  closed?: boolean; // switch state
}

interface SolveResult {
  ok: boolean;
  message?: string;
  totalCurrent: number;
  equivalentResistance: number | null;
  edgeCurrents: Record<string, number>; // signed, a->b positive
  nodeDistance: Record<string, number>; // BFS distance from battery + terminal, for wire animation direction
}

const RESISTOR_VALUES = [2, 5, 10, 20, 50];
const BATTERY_VALUES = [3, 6, 9, 12];
const LED_RESISTANCE = 15;
const WIRE_RESISTANCE = 0.0005;

// ============================================================
// Union-Find (merges nodes joined by ideal wires / closed switches)
// ============================================================

class DSU {
  parent = new Map<string, string>();
  find(x: string): string {
    if (!this.parent.has(x)) this.parent.set(x, x);
    let root = x;
    while (this.parent.get(root) !== root) root = this.parent.get(root)!;
    let cur = x;
    while (this.parent.get(cur) !== root) {
      const next = this.parent.get(cur)!;
      this.parent.set(cur, root);
      cur = next;
    }
    return root;
  }
  union(x: string, y: string) {
    const rx = this.find(x);
    const ry = this.find(y);
    if (rx !== ry) this.parent.set(rx, ry);
  }
}

function gaussianSolve(A: number[][], B: number[]): number[] {
  const n = B.length;
  if (n === 0) return [];
  const M = A.map((row, i) => [...row, B[i]]);
  for (let col = 0; col < n; col++) {
    let pivotRow = col;
    for (let r = col + 1; r < n; r++) {
      if (Math.abs(M[r][col]) > Math.abs(M[pivotRow][col])) pivotRow = r;
    }
    [M[col], M[pivotRow]] = [M[pivotRow], M[col]];
    if (Math.abs(M[col][col]) < 1e-9) continue;
    for (let r = 0; r < n; r++) {
      if (r === col) continue;
      const factor = M[r][col] / M[col][col];
      for (let c = col; c <= n; c++) M[r][c] -= factor * M[col][c];
    }
  }
  return M.map((row, i) => (Math.abs(row[i]) < 1e-9 ? 0 : row[n] / row[i]));
}

// ============================================================
// Circuit solver: real nodal analysis (handles any topology,
// not just simple series/parallel)
// ============================================================

function solveCircuit(components: Map<string, ComponentData>): SolveResult {
  const empty: SolveResult = {
    ok: false,
    totalCurrent: 0,
    equivalentResistance: null,
    edgeCurrents: {},
    nodeDistance: {},
  };

  const batteries = [...components.values()].filter((c) => c.type === 'battery');
  if (batteries.length === 0) return { ...empty, message: 'Add a battery to power the circuit.' };
  if (batteries.length > 1) return { ...empty, message: 'Only one battery is supported at a time.' };
  const battery = batteries[0];

  const dsu = new DSU();
  components.forEach((c) => {
    const ka = nodeKey(c.a);
    const kb = nodeKey(c.b);
    dsu.find(ka);
    dsu.find(kb);
    if (c.type === 'wire' || (c.type === 'switch' && c.closed)) {
      dsu.union(ka, kb);
    }
  });

  const posRoot = dsu.find(nodeKey(battery.a));
  const negRoot = dsu.find(nodeKey(battery.b));
  if (posRoot === negRoot) {
    return { ...empty, message: 'Short circuit! The battery terminals are joined by plain wire.' };
  }

  // resistive edges: resistors and LEDs, and open switches are simply excluded
  const resistiveEdges = [...components.entries()].filter(
    ([, c]) => c.type === 'resistor' || c.type === 'led'
  );

  const rootsInvolved = new Set<string>();
  resistiveEdges.forEach(([, c]) => {
    rootsInvolved.add(dsu.find(nodeKey(c.a)));
    rootsInvolved.add(dsu.find(nodeKey(c.b)));
  });
  rootsInvolved.add(posRoot);
  rootsInvolved.add(negRoot);

  const unknownRoots = [...rootsInvolved].filter((r) => r !== posRoot && r !== negRoot);
  const indexOf = new Map<string, number>();
  unknownRoots.forEach((r, i) => indexOf.set(r, i));

  const n = unknownRoots.length;
  const A: number[][] = Array.from({ length: n }, () => Array(n).fill(0));
  const B: number[] = Array(n).fill(0);

  const resistanceOf = (c: ComponentData) => (c.type === 'led' ? LED_RESISTANCE : Math.max(0.01, c.value));

  resistiveEdges.forEach(([, c]) => {
    const rA = dsu.find(nodeKey(c.a));
    const rB = dsu.find(nodeKey(c.b));
    if (rA === rB) return; // shorted out by a wire elsewhere; carries no current
    const g = 1 / resistanceOf(c);

    const iA = rA === posRoot ? -1 : rA === negRoot ? -2 : indexOf.get(rA)!;
    const iB = rB === posRoot ? -1 : rB === negRoot ? -2 : indexOf.get(rB)!;
    const vA = rA === posRoot ? battery.value : rA === negRoot ? 0 : null;
    const vB = rB === posRoot ? battery.value : rB === negRoot ? 0 : null;

    if (iA >= 0 && iB >= 0) {
      A[iA][iA] += g;
      A[iA][iB] -= g;
      A[iB][iB] += g;
      A[iB][iA] -= g;
    } else if (iA >= 0 && vB !== null) {
      A[iA][iA] += g;
      B[iA] += g * vB;
    } else if (iB >= 0 && vA !== null) {
      A[iB][iB] += g;
      B[iB] += g * vA;
    }
  });

  const solved = gaussianSolve(A, B);
  const nodeVoltage = new Map<string, number>();
  nodeVoltage.set(posRoot, battery.value);
  nodeVoltage.set(negRoot, 0);
  unknownRoots.forEach((r, i) => nodeVoltage.set(r, solved[i]));

  const edgeCurrents: Record<string, number> = {};
  resistiveEdges.forEach(([key, c]) => {
    const rA = dsu.find(nodeKey(c.a));
    const rB = dsu.find(nodeKey(c.b));
    if (rA === rB) {
      edgeCurrents[key] = 0;
      return;
    }
    const vA = nodeVoltage.get(rA) ?? 0;
    const vB = nodeVoltage.get(rB) ?? 0;
    edgeCurrents[key] = (vA - vB) / resistanceOf(c);
  });

  // total current leaving the battery's + terminal (sum over directly attached resistive edges)
  let totalCurrent = 0;
  resistiveEdges.forEach(([key, c]) => {
    const rA = dsu.find(nodeKey(c.a));
    const rB = dsu.find(nodeKey(c.b));
    if (rA === posRoot) totalCurrent += edgeCurrents[key];
    else if (rB === posRoot) totalCurrent -= edgeCurrents[key];
  });

  // BFS distance from the + terminal supernode, across ALL edges (for wire animation direction)
  const adj = new Map<string, string[]>();
  components.forEach((c) => {
    const rA = dsu.find(nodeKey(c.a));
    const rB = dsu.find(nodeKey(c.b));
    if (!adj.has(rA)) adj.set(rA, []);
    if (!adj.has(rB)) adj.set(rB, []);
    adj.get(rA)!.push(rB);
    adj.get(rB)!.push(rA);
  });
  const nodeDistance: Record<string, number> = {};
  const queue: string[] = [posRoot];
  nodeDistance[posRoot] = 0;
  while (queue.length) {
    const cur = queue.shift()!;
    for (const nxt of adj.get(cur) || []) {
      if (nodeDistance[nxt] === undefined) {
        nodeDistance[nxt] = nodeDistance[cur] + 1;
        queue.push(nxt);
      }
    }
  }
  // expand root distances back onto every original grid node
  const fullNodeDistance: Record<string, number> = {};
  for (let c = 0; c < GRID_COLS; c++) {
    for (let r = 0; r < GRID_ROWS; r++) {
      const k = nodeKey({ col: c, row: r });
      const root = dsu.find(k);
      if (nodeDistance[root] !== undefined) fullNodeDistance[k] = nodeDistance[root];
    }
  }

  const equivalentResistance = Math.abs(totalCurrent) > 1e-6 ? battery.value / Math.abs(totalCurrent) : null;

  return {
    ok: true,
    totalCurrent,
    equivalentResistance,
    edgeCurrents,
    nodeDistance: fullNodeDistance,
  };
}

// ============================================================
// Component symbol rendering (SVG path strings)
// ============================================================

function componentPath(type: ComponentType, x1: number, y1: number, x2: number, y2: number): string {
  const dx = x2 - x1;
  const dy = y2 - y1;
  const len = Math.hypot(dx, dy);
  const ux = dx / len;
  const uy = dy / len;
  const px = -uy;
  const py = ux;

  if (type === 'wire' || type === 'switch') {
    return `M ${x1} ${y1} L ${x2} ${y2}`;
  }

  if (type === 'resistor') {
    const bodyLen = len * 0.5;
    const leadLen = (len - bodyLen) / 2;
    const zigzags = 5;
    const segLen = bodyLen / zigzags;
    let d = `M ${x1} ${y1} L ${x1 + ux * leadLen} ${y1 + uy * leadLen} `;
    for (let i = 0; i < zigzags; i++) {
      const startD = leadLen + i * segLen;
      const midD = startD + segLen / 2;
      const amp = i % 2 === 0 ? -8 : 8;
      const mx = x1 + ux * midD + px * amp;
      const my = y1 + uy * midD + py * amp;
      d += `L ${mx} ${my} `;
    }
    d += `L ${x1 + ux * (leadLen + bodyLen)} ${y1 + uy * (leadLen + bodyLen)} L ${x2} ${y2}`;
    return d;
  }

  // battery / led: just leads, symbol drawn separately at midpoint
  const leadLen = len * 0.32;
  return `M ${x1} ${y1} L ${x1 + ux * leadLen} ${y1 + uy * leadLen} M ${x2 - ux * leadLen} ${
    y2 - uy * leadLen
  } L ${x2} ${y2}`;
}

// ============================================================
// Main component
// ============================================================

type Tool = ComponentType | 'erase';

const TOOLS: { id: Tool; label: string; hint: string }[] = [
  { id: 'wire', label: '⎯ Wire', hint: 'Plain conductor' },
  { id: 'resistor', label: '⌇ Resistor', hint: 'Click to cycle value' },
  { id: 'battery', label: '⊢ Battery', hint: 'Click to cycle voltage' },
  { id: 'switch', label: '⌁ Switch', hint: 'Click to open/close' },
  { id: 'led', label: '◭ LED', hint: 'Lights up with current' },
  { id: 'erase', label: '✕ Erase', hint: 'Remove a component' },
];

export function CircuitBuilder() {
  const [components, setComponents] = useState<Map<string, ComponentData>>(new Map());
  const [tool, setTool] = useState<Tool>('battery');
  const canvasRef = useRef<HTMLCanvasElement>(null);
  const phaseRef = useRef(0);
  const solveRef = useRef<SolveResult | null>(null);

  const allEdges = useMemo(() => {
    const edges: { a: NodeId; b: NodeId; key: string }[] = [];
    for (let col = 0; col < GRID_COLS; col++) {
      for (let row = 0; row < GRID_ROWS; row++) {
        if (col < GRID_COLS - 1) {
          const a = { col, row };
          const b = { col: col + 1, row };
          edges.push({ a, b, key: edgeKey(a, b) });
        }
        if (row < GRID_ROWS - 1) {
          const a = { col, row };
          const b = { col, row: row + 1 };
          edges.push({ a, b, key: edgeKey(a, b) });
        }
      }
    }
    return edges;
  }, []);

  const solveResult = useMemo(() => solveCircuit(components), [components]);
  solveRef.current = solveResult;

  const handleEdgeClick = (a: NodeId, b: NodeId) => {
    const key = edgeKey(a, b);
    setComponents((prev) => {
      const next = new Map(prev);
      const existing = next.get(key);

      if (tool === 'erase') {
        next.delete(key);
        return next;
      }

      if (existing && existing.type === tool) {
        if (tool === 'resistor') {
          const idx = RESISTOR_VALUES.indexOf(existing.value);
          const nextVal = RESISTOR_VALUES[(idx + 1) % RESISTOR_VALUES.length];
          next.set(key, { ...existing, value: nextVal });
        } else if (tool === 'battery') {
          const idx = BATTERY_VALUES.indexOf(existing.value);
          const nextVal = BATTERY_VALUES[(idx + 1) % BATTERY_VALUES.length];
          next.set(key, { ...existing, value: nextVal });
        } else if (tool === 'switch') {
          next.set(key, { ...existing, closed: !existing.closed });
        }
        return next;
      }

      // placing a new component (replacing whatever was there, if anything)
      if (tool === 'battery') {
        // enforce a single battery: remove any existing one first
        for (const [k, c] of next) {
          if (c.type === 'battery') next.delete(k);
        }
      }

      const data: ComponentData = {
        type: tool,
        a,
        b,
        value: tool === 'resistor' ? 10 : tool === 'battery' ? 6 : 0,
        closed: tool === 'switch' ? true : undefined,
      };
      next.set(key, data);
      return next;
    });
  };

  const drawOverlay = () => {
    const canvas = canvasRef.current;
    if (!canvas) return;
    const ctx = canvas.getContext('2d');
    if (!ctx) return;
    ctx.clearRect(0, 0, SVG_W, SVG_H);

    const result = solveRef.current;
    if (!result || !result.ok) return;

    const speed = Math.min(3, Math.max(0.4, Math.abs(result.totalCurrent) * 1.4));
    phaseRef.current += speed;

    components.forEach((c, key) => {
      let flowing = false;
      let forward = true;

      if (c.type === 'resistor' || c.type === 'led') {
        const cur = result.edgeCurrents[key] ?? 0;
        flowing = Math.abs(cur) > 0.01;
        forward = cur >= 0;
      } else if (c.type === 'wire' || (c.type === 'switch' && c.closed)) {
        const da = result.nodeDistance[nodeKey(c.a)];
        const db = result.nodeDistance[nodeKey(c.b)];
        if (da !== undefined && db !== undefined && da !== db) {
          flowing = Math.abs(result.totalCurrent) > 0.01;
          forward = da < db;
        }
      }

      if (!flowing) return;

      const pa = nodePos(c.a);
      const pb = nodePos(c.b);
      const [p0, p1] = forward ? [pa, pb] : [pb, pa];
      const len = Math.hypot(p1.x - p0.x, p1.y - p0.y);
      const dotCount = Math.max(1, Math.round(len / 26));

      for (let i = 0; i < dotCount; i++) {
        const t = ((phaseRef.current / 40 + i / dotCount) % 1 + 1) % 1;
        const x = p0.x + (p1.x - p0.x) * t;
        const y = p0.y + (p1.y - p0.y) * t;
        ctx.fillStyle = '#2e7d6b';
        ctx.beginPath();
        ctx.arc(x, y, 2.8, 0, Math.PI * 2);
        ctx.fill();
      }
    });
  };

  useEffect(() => {
    let raf: number;
    const loop = () => {
      drawOverlay();
      raf = requestAnimationFrame(loop);
    };
    raf = requestAnimationFrame(loop);
    return () => cancelAnimationFrame(raf);
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [components]);

  return (
    <div className="circuit-builder">
      <div className="bg-white border border-[#e4ddcc] rounded overflow-hidden mb-5">
        <div className="flex justify-between items-baseline px-4 pt-3">
          <span className="font-mono text-[11px] tracking-wide uppercase text-[#4a5a72]">
            Build Your Circuit
          </span>
          <span className="font-mono text-[11px] tracking-wide uppercase text-[#4a5a72]">
            {solveResult.ok ? `I = ${Math.abs(solveResult.totalCurrent).toFixed(2)} A` : 'Not solved'}
          </span>
        </div>

        <div className="px-4 pt-3 flex flex-wrap gap-1.5">
          {TOOLS.map((t) => (
            <button
              key={t.id}
              onClick={() => setTool(t.id)}
              title={t.hint}
              className={`text-[12px] font-semibold px-3 py-1.5 rounded-full border ${
                tool === t.id
                  ? 'bg-[#1b2a41] text-white border-[#1b2a41]'
                  : 'bg-transparent text-[#1b2a41] border-[#d8cfb6] hover:bg-[#f5f0e2]'
              }`}
            >
              {t.label}
            </button>
          ))}
          <button
            onClick={() => setComponents(new Map())}
            className="text-[12px] font-semibold px-3 py-1.5 rounded-full border border-[#d8cfb6] text-[#b34a3c] hover:bg-[#f5f0e2] ml-auto"
          >
            ⟲ Clear All
          </button>
        </div>

        <div className="relative overflow-x-auto p-4">
          <div className="relative" style={{ width: SVG_W, height: SVG_H }}>
            <svg width={SVG_W} height={SVG_H} className="block">
              {allEdges.map(({ a, b, key }) => {
                const pa = nodePos(a);
                const pb = nodePos(b);
                const comp = components.get(key);
                return (
                  <g key={key}>
                    <line
                      x1={pa.x}
                      y1={pa.y}
                      x2={pb.x}
                      y2={pb.y}
                      stroke="transparent"
                      strokeWidth={18}
                      className="cursor-pointer"
                      onClick={() => handleEdgeClick(a, b)}
                    />
                    {!comp && (
                      <line
                        x1={pa.x}
                        y1={pa.y}
                        x2={pb.x}
                        y2={pb.y}
                        stroke="#e6ded0"
                        strokeWidth={1}
                        strokeDasharray="2,4"
                        pointerEvents="none"
                      />
                    )}
                    {comp && (
                      <ComponentSymbol
                        comp={comp}
                        pa={pa}
                        pb={pb}
                        current={solveResult.edgeCurrents[key]}
                        onClick={() => handleEdgeClick(a, b)}
                      />
                    )}
                  </g>
                );
              })}
              {Array.from({ length: GRID_COLS }).map((_, col) =>
                Array.from({ length: GRID_ROWS }).map((_, row) => {
                  const p = nodePos({ col, row });
                  return <circle key={`${col}-${row}`} cx={p.x} cy={p.y} r={2.5} fill="#d8cfb6" />;
                })
              )}
            </svg>
            <canvas
              ref={canvasRef}
              width={SVG_W}
              height={SVG_H}
              className="absolute top-0 left-0 pointer-events-none"
            />
          </div>
        </div>

        {!solveResult.ok && (
          <div className="px-4 pb-4">
            <p className="text-[12.5px] text-[#b34a3c] font-medium">{solveResult.message}</p>
          </div>
        )}
      </div>

      <div className="bg-white border border-[#e4ddcc] rounded p-4 mb-5">
        <h2 className="font-mono text-[15px] tracking-wide uppercase text-[#4a5a72] border-b border-[#eee6d3] pb-2 mb-3.5">
          Readouts
        </h2>
        <div className="grid grid-cols-1 sm:grid-cols-3 gap-2.5">
          <div className="bg-[#faf7f0] border border-[#eee6d3] rounded px-3 py-2.5">
            <div className="text-[11px] text-[#4a5a72] mb-1">Total current</div>
            <div className="font-mono text-xl font-bold text-[#2e7d6b]">
              {solveResult.ok ? Math.abs(solveResult.totalCurrent).toFixed(2) : '—'} A
            </div>
          </div>
          <div className="bg-[#faf7f0] border border-[#eee6d3] rounded px-3 py-2.5">
            <div className="text-[11px] text-[#4a5a72] mb-1">Equivalent resistance</div>
            <div className="font-mono text-xl font-bold text-[#b8823d]">
              {solveResult.ok && solveResult.equivalentResistance !== null
                ? solveResult.equivalentResistance.toFixed(1)
                : '—'}{' '}
              Ω
            </div>
          </div>
          <div className="bg-[#faf7f0] border border-[#eee6d3] rounded px-3 py-2.5">
            <div className="text-[11px] text-[#4a5a72] mb-1">Components placed</div>
            <div className="font-mono text-xl font-bold">{components.size}</div>
          </div>
        </div>
      </div>

      <div className="bg-white border border-[#e4ddcc] rounded p-4 mb-5">
        <h2 className="font-mono text-[15px] tracking-wide uppercase text-[#4a5a72] border-b border-[#eee6d3] pb-2 mb-3.5">
          How To Use It
        </h2>
        <div className="space-y-1.5 text-[12.5px] text-[#4a5a72]">
          <p>Pick a tool above, then click any grid line to place it there.</p>
          <p>Click a placed <b>resistor</b> again to cycle its value; click a <b>battery</b> to cycle its voltage.</p>
          <p>Click a <b>switch</b> to open or close it. Use <b>Erase</b> to remove anything.</p>
          <p>Every current shown is computed by actually solving the circuit&rsquo;s node voltages &mdash; try building a series loop, then a parallel branch, and compare.</p>
        </div>
      </div>

      <div className="bg-white border border-[#e4ddcc] rounded p-4">
        <h2 className="font-mono text-[15px] tracking-wide uppercase text-[#4a5a72] border-b border-[#eee6d3] pb-2 mb-3.5">
          Series & Parallel Formulas
        </h2>
        <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
          <div className="bg-[#faf7f0] border border-[#eee6d3] rounded px-4 py-3 text-center">
            <div className="italic text-[16px] text-[#8f6428]" style={{ fontFamily: 'Georgia, serif' }}>
              R = R₁ + R₂ + ...
            </div>
            <div className="text-[11px] text-[#4a5a72] mt-1">resistors in series</div>
          </div>
          <div className="bg-[#faf7f0] border border-[#eee6d3] rounded px-4 py-3 text-center">
            <div className="italic text-[16px] text-[#8f6428]" style={{ fontFamily: 'Georgia, serif' }}>
              1/R = 1/R₁ + 1/R₂ + ...
            </div>
            <div className="text-[11px] text-[#4a5a72] mt-1">resistors in parallel</div>
          </div>
        </div>
      </div>
    </div>
  );
}

function ComponentSymbol({
  comp,
  pa,
  pb,
  current,
  onClick,
}: {
  comp: ComponentData;
  pa: { x: number; y: number };
  pb: { x: number; y: number };
  current?: number;
  onClick: () => void;
}) {
  const midX = (pa.x + pb.x) / 2;
  const midY = (pa.y + pb.y) / 2;
  const dx = pb.x - pa.x;
  const dy = pb.y - pa.y;
  const angle = Math.atan2(dy, dx) * (180 / Math.PI);

  const path = componentPath(comp.type, pa.x, pa.y, pb.x, pb.y);
  const lit = comp.type === 'led' && current !== undefined && Math.abs(current) > 0.01;

  return (
    <g onClick={onClick} className="cursor-pointer">
      <path d={path} stroke="#3d4653" strokeWidth={2.2} fill="none" strokeLinecap="round" />

      {comp.type === 'battery' && (
        <g transform={`translate(${midX} ${midY}) rotate(${angle})`}>
          <line x1={-6} y1={-11} x2={-6} y2={11} stroke="#1b2a41" strokeWidth={2.5} />
          <line x1={4} y1={-6} x2={4} y2={6} stroke="#1b2a41" strokeWidth={4.5} />
          <text x={-6} y={-16} fontSize={9} fontWeight={700} fill="#4a5a72" textAnchor="middle">
            +
          </text>
        </g>
      )}

      {comp.type === 'switch' && (
        <g transform={`translate(${midX} ${midY}) rotate(${angle})`}>
          <circle cx={-9} cy={0} r={2.5} fill="#3d4653" />
          <circle cx={9} cy={0} r={2.5} fill="#3d4653" />
          {comp.closed ? (
            <line x1={-9} y1={0} x2={9} y2={0} stroke="#2e7d6b" strokeWidth={2.5} />
          ) : (
            <line x1={-9} y1={0} x2={7} y2={-10} stroke="#b34a3c" strokeWidth={2.5} />
          )}
        </g>
      )}

      {comp.type === 'led' && (
        <g transform={`translate(${midX} ${midY}) rotate(${angle})`}>
          <polygon
            points="-8,-8 -8,8 8,0"
            fill={lit ? '#e0d24a' : '#faf7f0'}
            stroke="#3d4653"
            strokeWidth={1.6}
          />
          <line x1={8} y1={-8} x2={8} y2={8} stroke="#3d4653" strokeWidth={2} />
          {lit && <circle cx={0} cy={0} r={13} fill="rgba(224,210,74,0.35)" />}
        </g>
      )}

      {(comp.type === 'resistor' || comp.type === 'battery') && (
        <text
          x={midX}
          y={midY - 14}
          fontSize={10}
          fontWeight={700}
          fill="#8f6428"
          textAnchor="middle"
          fontFamily="Courier New, monospace"
        >
          {comp.type === 'resistor' ? `${comp.value}Ω` : `${comp.value}V`}
        </text>
      )}

      {comp.type === 'resistor' && current !== undefined && Math.abs(current) > 0.005 && (
        <text
          x={midX}
          y={midY + 22}
          fontSize={9.5}
          fontWeight={700}
          fill="#2e7d6b"
          textAnchor="middle"
          fontFamily="Courier New, monospace"
        >
          {Math.abs(current).toFixed(2)}A
        </text>
      )}
    </g>
  );
}
