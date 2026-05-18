// Weekly evolution modal — bar chart + month calendar selector + summary stats.

function WeeklyChartModal({ kpi, onClose }) {
  if (!kpi) return null;
  const { WEEKLY, CATS, NORMS } = window.KPI_DATA;
  const data = WEEKLY[kpi.n] || [];
  const cat = CATS[kpi.cat];
  const barColor = {
    central: '#7C3AED', quiro: '#1D4ED8',
    seguridad: '#B91C1C', registro: '#0F766E', sosten: '#15803D',
  }[kpi.cat] || '#7C3AED';

  // Demo: weeks span the last 3 months. Today = May 16 2026 ≈ W20.
  // Show calendar with W14..W25 (12 weeks, ~ March 30 to June 21).
  const [selectedRange, setSelectedRange] = React.useState('3M'); // '1M' | '3M' | '6M'
  const rangeMap = { '1M': data.slice(-4), '3M': data, '6M': data }; // demo: 6M same as 3M
  const points = rangeMap[selectedRange];
  const weekLabels = ['W14','W15','W16','W17','W18','W19','W20','W21','W22','W23','W24','W25'];
  const labels = selectedRange === '1M' ? weekLabels.slice(-4) : weekLabels;

  const max = Math.max(...points), min = Math.min(...points);
  const avg = points.reduce((a,b)=>a+b, 0) / points.length;
  const trend = points[points.length-1] - points[0];

  // Format helpers
  const fmt = (v) => {
    if (v >= 1000) return Math.round(v).toLocaleString('es-ES');
    if (v >= 100) return Math.round(v).toString();
    if (v >= 10) return v.toFixed(1);
    return v.toFixed(2);
  };
  const unit = (() => {
    if (/%/.test(kpi.value)) return '%';
    if (/€/.test(kpi.value)) return '€';
    return '';
  })();
  const fmtV = (v) => `${fmt(v)}${unit}`;

  return (
    <>
      <div className="modal-scrim" onClick={onClose}></div>
      <div className="modal" role="dialog" aria-modal="true">
        <div className="modal-head">
          <div>
            <div className="modal-eyebrow">{cat.label} · KPI {String(kpi.n).padStart(2,'0')}</div>
            <div className="modal-title">Evolución semanal · {kpi.title}</div>
          </div>
          <button className="drawer-close" onClick={onClose} aria-label="Cerrar">
            <UiIcon name="cross" size={18} />
          </button>
        </div>
        <div className="modal-body">
          {/* Stats summary */}
          <div className="ws-stats">
            <div className="ws-stat">
              <div className="ws-stat-l">Actual</div>
              <div className="ws-stat-v">{kpi.value}</div>
            </div>
            <div className="ws-stat">
              <div className="ws-stat-l">Media periodo</div>
              <div className="ws-stat-v">{fmtV(avg)}</div>
            </div>
            <div className="ws-stat">
              <div className="ws-stat-l">Máximo</div>
              <div className="ws-stat-v">{fmtV(max)}</div>
            </div>
            <div className="ws-stat">
              <div className="ws-stat-l">Mínimo</div>
              <div className="ws-stat-v">{fmtV(min)}</div>
            </div>
            <div className="ws-stat">
              <div className="ws-stat-l">Variación</div>
              <div className="ws-stat-v" style={{ color: trend >= 0 ? '#16A34A' : '#DC2626' }}>
                {trend >= 0 ? '+' : '−'}{fmt(Math.abs(trend))}{unit}
              </div>
            </div>
          </div>

          {/* Range selector */}
          <div className="ws-toolbar">
            <div className="ws-range">
              {['1M','3M','6M'].map(r => (
                <button key={r} className={`ws-range-btn${selectedRange===r?' active':''}`} onClick={()=>setSelectedRange(r)}>{r}</button>
              ))}
            </div>
            <button className="ws-cal-btn">
              <UiIcon name="calendar" size={16} />
              Mar 30 — Jun 21, 2026
            </button>
            <div style={{ flex:1 }}></div>
            <button className="ws-export">
              <UiIcon name="download" size={15} />
              Exportar CSV
            </button>
          </div>

          {/* Bar chart */}
          <div className="ws-chart">
            <WeeklyBars data={points} labels={labels} color={barColor} target={kpi.target} unit={unit} />
          </div>

          {/* Calendar */}
          <div className="ws-cal">
            <div className="ws-cal-head">
              <div className="ws-cal-title">Mayo 2026</div>
              <div className="ws-cal-nav">
                <button aria-label="Mes anterior"><UiIcon name="chevron-right" size={14} /></button>
                <button aria-label="Mes siguiente"><UiIcon name="chevron-right" size={14} /></button>
              </div>
            </div>
            <CalendarGrid year={2026} month={4 /* May */} highlights={[19, 20, 21]} />
          </div>
        </div>
        <div className="modal-foot">
          <button className="btn-primary">Ver detalle por especialidad</button>
          <button className="btn-secondary">Exportar PDF</button>
        </div>
      </div>
    </>
  );
}

// Bar chart for weekly data
function WeeklyBars({ data, labels, color, target, unit }) {
  const w = 760, h = 240;
  const padL = 44, padR = 16, padT = 12, padB = 30;
  const inner = { x: padL, y: padT, w: w - padL - padR, h: h - padT - padB };
  const max = Math.max(...data) * 1.1;
  const min = Math.min(0, Math.min(...data) * 0.95);
  const range = max - min || 1;
  const barW = inner.w / data.length;

  // Y axis ticks
  const ticks = 4;
  const tickVals = [];
  for (let i = 0; i <= ticks; i++) tickVals.push(min + (range * i / ticks));

  // Target line if numeric
  const targetNum = (() => {
    const m = String(target).match(/(\d+(?:[.,]\d+)?)/);
    return m ? parseFloat(m[1].replace(',','.')) : null;
  })();

  const fmtTick = (v) => {
    if (Math.abs(v) >= 1000) return Math.round(v).toLocaleString('es-ES');
    if (Math.abs(v) >= 100) return Math.round(v).toString();
    if (Math.abs(v) >= 10) return v.toFixed(1);
    return v.toFixed(2);
  };

  return (
    <svg width="100%" height={h} viewBox={`0 0 ${w} ${h}`} preserveAspectRatio="xMidYMid meet">
      {/* horizontal grid + y labels */}
      {tickVals.map((v, i) => {
        const y = inner.y + inner.h - ((v - min) / range) * inner.h;
        return (
          <g key={i}>
            <line x1={inner.x} y1={y} x2={inner.x + inner.w} y2={y}
              stroke="#E5E7EB" strokeWidth="1" strokeDasharray={i === 0 ? '0' : '2 3'} />
            <text x={inner.x - 8} y={y + 4} fontSize="11" fill="#6B7280" textAnchor="end" fontFamily="Inter, sans-serif">{fmtTick(v)}{unit}</text>
          </g>
        );
      })}
      {/* target line */}
      {targetNum !== null && targetNum >= min && targetNum <= max && (
        <g>
          <line x1={inner.x} y1={inner.y + inner.h - ((targetNum - min) / range) * inner.h}
            x2={inner.x + inner.w} y2={inner.y + inner.h - ((targetNum - min) / range) * inner.h}
            stroke="#7C3AED" strokeWidth="1.4" strokeDasharray="4 3" />
          <text x={inner.x + inner.w - 6} y={inner.y + inner.h - ((targetNum - min) / range) * inner.h - 5}
            fontSize="11" fill="#7C3AED" textAnchor="end" fontFamily="Inter, sans-serif">objetivo {fmtTick(targetNum)}{unit}</text>
        </g>
      )}
      {/* bars */}
      {data.map((v, i) => {
        const x = inner.x + barW * i + 4;
        const bH = ((v - min) / range) * inner.h;
        const y = inner.y + inner.h - bH;
        return (
          <g key={i}>
            <rect x={x} y={y} width={barW - 8} height={bH} fill={color} opacity={i === data.length - 1 ? 1 : 0.75} rx="3" />
            <text x={x + (barW - 8) / 2} y={inner.y + inner.h + 16}
              fontSize="11" fill="#6B7280" textAnchor="middle" fontFamily="Inter, sans-serif">{labels[i]}</text>
          </g>
        );
      })}
    </svg>
  );
}

// Mini month calendar — highlights specific days
function CalendarGrid({ year, month, highlights = [] }) {
  // month 0-indexed; Mon-Sun week start
  const first = new Date(year, month, 1);
  const startDay = (first.getDay() + 6) % 7; // 0 = Mon
  const last = new Date(year, month + 1, 0).getDate();
  const cells = [];
  for (let i = 0; i < startDay; i++) cells.push(null);
  for (let d = 1; d <= last; d++) cells.push(d);
  while (cells.length % 7 !== 0) cells.push(null);
  const weekdays = ['L','M','X','J','V','S','D'];
  return (
    <div className="cal-grid">
      {weekdays.map(d => <div key={d} className="cal-wd">{d}</div>)}
      {cells.map((d, i) => (
        <div key={i} className={`cal-d${d===null?' empty':''}${d && highlights.includes(d) ? ' hl' : ''}`}>
          {d || ''}
        </div>
      ))}
    </div>
  );
}

window.WeeklyChartModal = WeeklyChartModal;
