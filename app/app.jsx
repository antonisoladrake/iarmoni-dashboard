// Dashboard — aligned with iArmoni platform look & feel.

const { KPIS, NORMS, CATS, ROLES } = window.KPI_DATA;

const UP_IS_GOOD = {
  1:false, 2:false, 3:false, 4:true, 5:false,
  6:false, 7:true, 8:true, 9:true, 10:true,
  11:true, 12:false,
};

const NORM_FAMILIES = [
  { id:'Estatal',       label:'Normativa estatal' },
  { id:'Europea',       label:'Normativa europea' },
  { id:'Norma técnica', label:'Normas técnicas' },
  { id:'Autonómica',    label:'Autonómicas' },
  { id:'Medioambiente', label:'Medioambiente' },
];

const ROLE_LIST = ['todos','calidad','central','quirofano','gerencia'];

// Icon per category — drawn at the section header (no per-KPI icons)
const CAT_ICONS = {
  central:   'expire',     // sterilization cycle
  quiro:     'request',    // hand / OR
  seguridad: 'shield',     // patient safety
  registro:  'checklist',  // documentary records
  sosten:    'resources',  // water / energy / sustainability
};

// ─── Topbar ─────────────────────────────────────────────────────────
function Topbar() {
  return (
    <header className="topbar">
      <div className="topbar-inner">
        <div className="brand">
          <div className="brand-mark"></div>
          <div className="brand-label">Menu</div>
        </div>
        <div className="topbar-spacer"></div>
        <div className="topbar-actions">
          <button className="suggest-pill">
            <UiIcon name="edit" size={16} />
            Send your suggestions
            <span className="x">×</span>
          </button>
          <button className="iconbtn">
            <span className="ico-wrap"><UiIcon name="help" size={22} /></span>
            <span className="lbl">Help</span>
          </button>
          <button className="iconbtn">
            <span className="ico-wrap">
              <svg width="22" height="22" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.4" strokeLinecap="square">
                <path d="M14 4 L20 4 L20 20 L14 20" />
                <path d="M3 12 L16 12" />
                <path d="M12 8 L16 12 L12 16" />
              </svg>
            </span>
            <span className="lbl">Logout</span>
          </button>
        </div>
      </div>
    </header>
  );
}

// ─── Page head ──────────────────────────────────────────────────────
function PageHead() {
  return (
    <div className="page-head">
      <div>
        <h1 className="page-h1">Cuadro de mando Avanzado</h1>
        <div className="page-sub">Hospital de Terrassa · iArmoni · trazabilidad y eficiencia quirúrgica</div>
      </div>
      <button className="date-picker">
        <UiIcon name="calendar" size={20} />
        <div>
          <span className="label">Periodo</span>
          <span className="value">Mayo 2026</span>
        </div>
      </button>
    </div>
  );
}

// ─── Summary cards ──────────────────────────────────────────────────
function SummaryStrip({ visible }) {
  const counts = { ok:0, warn:0, alert:0, na:0 };
  visible.forEach(k => counts[k.status] = (counts[k.status]||0)+1);
  return (
    <div className="summary">
      <div className="sum-card">
        <div className="num">{visible.length}</div>
        <div className="txt">
          <div className="lbl">Total visibles</div>
          <div className="sub">de {KPIS.length} · {counts.na} sin datos</div>
        </div>
      </div>
      <div className="sum-card alert">
        <div className="num">{counts.alert}</div>
        <div className="txt">
          <div className="lbl">Crítico</div>
          <div className="sub">acción inmediata</div>
        </div>
      </div>
      <div className="sum-card warn">
        <div className="num">{counts.warn}</div>
        <div className="txt">
          <div className="lbl">A vigilar</div>
          <div className="sub">cerca del límite</div>
        </div>
      </div>
      <div className="sum-card ok">
        <div className="num">{counts.ok}</div>
        <div className="txt">
          <div className="lbl">Correctos</div>
          <div className="sub">dentro del objetivo</div>
        </div>
      </div>
    </div>
  );
}

// ─── Role tabs ──────────────────────────────────────────────────────
function RoleTabs({ role, setRole }) {
  return (
    <div className="roletabs-inner">
      {ROLE_LIST.map(rid => {
        const r = ROLES[rid];
        const count = rid === 'todos' ? KPIS.length : KPIS.filter(k => k.roles && k.roles.includes(rid)).length;
        return (
          <button key={rid} className={`roletab${role===rid ? ' active' : ''}`} onClick={() => setRole(rid)}>
            <span>{r.short}</span>
            <span className="ct">{count}</span>
          </button>
        );
      })}
    </div>
  );
}

// ─── Normativa dropdown (multi-select) ──────────────────────────────
function NormativaDropdown({ filter, setFilter }) {
  const [open, setOpen] = React.useState(false);
  const ref = React.useRef(null);

  React.useEffect(() => {
    if (!open) return;
    const onClick = (e) => { if (ref.current && !ref.current.contains(e.target)) setOpen(false); };
    document.addEventListener('mousedown', onClick);
    return () => document.removeEventListener('mousedown', onClick);
  }, [open]);

  const toggle = (id) => {
    const s = new Set(filter);
    s.has(id) ? s.delete(id) : s.add(id);
    setFilter(s);
  };
  const clear = () => setFilter(new Set());

  const grouped = NORM_FAMILIES.map(fam => ({
    fam,
    items: Object.values(NORMS).filter(n => n.family === fam.id),
  })).filter(g => g.items.length);

  const label = filter.size === 0
    ? 'Filtrar por normativa'
    : filter.size === 1
      ? NORMS[[...filter][0]].short
      : `${filter.size} normativas`;

  return (
    <div className="normdd" ref={ref}>
      <button className={`normdd-btn${open ? ' open' : ''}`} onClick={() => setOpen(!open)}>
        <span style={{ display:'inline-flex', alignItems:'center', gap:8 }}>
          <span className="ico-left"><UiIcon name="filter" size={16} /></span>
          {label}
          {filter.size > 0 && <span className="count-badge">{filter.size}</span>}
        </span>
        <span className="chev"><UiIcon name="chevron-right" size={14} /></span>
      </button>
      {open && (
        <div className="normdd-panel">
          <div className="normdd-head">
            <div className="normdd-h">Selecciona una o varias</div>
            <button className="normdd-clear" onClick={clear} disabled={filter.size === 0}>limpiar</button>
          </div>
          {grouped.map(g => (
            <div key={g.fam.id}>
              <div className="normdd-group-h">{g.fam.label}</div>
              {g.items.map(n => {
                const count = KPIS.filter(k => k.norms.includes(n.id)).length;
                const checked = filter.has(n.id);
                return (
                  <div key={n.id} className={`normdd-item${checked ? ' checked' : ''}`} onClick={() => toggle(n.id)}>
                    <span className="cb">{checked && <UiIcon name="check" size={11} />}</span>
                    <span title={n.full}>{n.short}</span>
                    <span className="ct">{count}</span>
                  </div>
                );
              })}
            </div>
          ))}
        </div>
      )}
    </div>
  );
}

// ─── KPI compact row ────────────────────────────────────────────────
function KpiRow({ kpi, filter, onChart, onHelp, onInventory, onCollisions, onUtilization, onDigitization }) {
  const upIsGood = UP_IS_GOOD[kpi.n];
  const t = kpi.trend;
  const trendCls = t === 0 ? 'flat' : ((t > 0) === upIsGood ? 'good' : 'bad');
  const trendArrow = t > 0 ? '▲' : t < 0 ? '▼' : '';
  const trendLabel = t === 0 ? 'sin cambio' : `${t > 0 ? '+' : '−'}${Math.abs(t)}${kpi.trendUnit}`;

  // Show up to 3 norm chips, then "+N"
  const maxChips = 3;
  const visibleChips = kpi.norms.slice(0, maxChips);
  const extraChips = kpi.norms.length - maxChips;

  return (
    <article className="kpi" onClick={() => onChart(kpi)}>
      <div className="kpi-title-block">
        <div className="kpi-num">KPI {String(kpi.n).padStart(2,'0')}</div>
        <div className="kpi-name" title={kpi.title}>{kpi.title}</div>
      </div>
      <div className="kpi-chips">
        {visibleChips.map(id => {
          const n = NORMS[id];
          const match = filter.has(id);
          return <span key={id} className={`norm-chip${match ? ' match' : ''}`} title={n.full}>{n.short}</span>;
        })}
        {extraChips > 0 && (
          <span className="norm-chip more" title={kpi.norms.slice(maxChips).map(id => NORMS[id].short).join(' · ')}>
            +{extraChips}
          </span>
        )}
      </div>
      <div className="kpi-value-block">
        {kpi.dualLayout ? (
          <div className="kpi-dual">
            <div className="kpi-dual-item">
              <span className="kpi-dual-n">{kpi.dualLayout.left.n}</span>
              <span className="kpi-dual-u">{kpi.dualLayout.left.u}</span>
            </div>
            <div className="kpi-dual-sep" aria-hidden="true"></div>
            <div className="kpi-dual-item">
              <span className="kpi-dual-n">{kpi.dualLayout.right.n}</span>
              <span className="kpi-dual-u">{kpi.dualLayout.right.u}</span>
            </div>
          </div>
        ) : (
          <>
            {kpi.n === 3 ? (
              <button className="kpi-num-big-link" onClick={(e) => { e.stopPropagation(); onCollisions(); }} title="Ver detalle por lote">
                {kpi.value}
                <UiIcon name="external" size={13} />
              </button>
            ) : kpi.n === 4 ? (
              <button className="kpi-num-big-link" onClick={(e) => { e.stopPropagation(); onUtilization(); }} title="Ver lotes con material no utilizado">
                {kpi.value}
                <UiIcon name="external" size={13} />
              </button>
            ) : kpi.n === 11 ? (
              <button className="kpi-num-big-link" onClick={(e) => { e.stopPropagation(); onDigitization(); }} title="Ver registros digitalizados">
                {kpi.value}
                <UiIcon name="external" size={13} />
              </button>
            ) : (
              <div className="kpi-num-big">{kpi.value}</div>
            )}
            {kpi.extra && (
              kpi.n === 1 ? (
                <button className="kpi-num-extra-link" onClick={(e) => { e.stopPropagation(); onInventory(); }} title="Ver detalle por instrumento">
                  {kpi.extra}
                  <UiIcon name="external" size={11} />
                </button>
              ) : kpi.n === 3 ? (
                <button className="kpi-num-extra-link" onClick={(e) => { e.stopPropagation(); onCollisions(); }} title="Ver detalle por lote">
                  {kpi.extra}
                  <UiIcon name="external" size={11} />
                </button>
              ) : (
                <div className="kpi-num-extra">{kpi.extra}</div>
              )
            )}
          </>
        )}
      </div>
      <span className={`kpi-trend ${trendCls}`}>
        {trendArrow && <span>{trendArrow}</span>}{trendLabel}
      </span>
      <StatusPill status={kpi.status} />
      <div className="kpi-actions">
        <button className="kpi-action" onClick={(e) => { e.stopPropagation(); onChart(kpi); }} aria-label="Ver evolución semanal" title="Ver evolución semanal">
          <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.4" strokeLinecap="square">
            <path d="M4 19 L20 19" />
            <rect x="6" y="11" width="3" height="6" />
            <rect x="11" y="7" width="3" height="10" />
            <rect x="16" y="13" width="3" height="4" />
          </svg>
        </button>
        <button className="kpi-action" onClick={(e) => { e.stopPropagation(); onHelp(kpi); }} aria-label="Ayuda" title="¿Qué mide este KPI?">
          <UiIcon name="help" size={18} />
        </button>
      </div>
    </article>
  );
}

function StatusPill({ status }) {
  const label = { ok:'OK', warn:'A vigilar', alert:'Crítico', na:'Sin datos' }[status];
  return (
    <span className={`status-pill ${status}`}>
      <span className="dot"></span>
      {label}
    </span>
  );
}

// ─── Help drawer ────────────────────────────────────────────────────
function HelpDrawer({ kpi, onClose, onChart }) {
  if (!kpi) return null;
  const cat = CATS[kpi.cat];
  const iconBg = {
    central:'var(--plat-lavender-bg)', quiro:'#DBEAFE',
    seguridad:'#FEE2E2', registro:'#CFFAF4', sosten:'#DCFCE7'
  }[kpi.cat];
  const iconFg = {
    central:'var(--plat-violet-text)', quiro:'#1D4ED8',
    seguridad:'#B91C1C', registro:'#0F766E', sosten:'#15803D'
  }[kpi.cat];

  return (
    <>
      <div className="drawer-scrim" onClick={onClose}></div>
      <aside className="drawer" role="dialog" aria-modal="true">
        <div className="drawer-head">
          <div className="icoblock" style={{ background: iconBg, color: iconFg }}>
            <KpiIcon name={kpi.icon} size={34} />
          </div>
          <div style={{ flex:1, minWidth:0 }}>
            <div className="drawer-eyebrow">{cat.label} · KPI {String(kpi.n).padStart(2,'0')}</div>
            <div className="drawer-title">{kpi.title}</div>
          </div>
          <button className="drawer-close" onClick={onClose} aria-label="Cerrar">
            <UiIcon name="cross" size={18} />
          </button>
        </div>
        <div className="drawer-body">
          <div className="drawer-stat">
            <div>
              <div className="val">{kpi.value}</div>
              {kpi.extra && <div className="extra">{kpi.extra}</div>}
            </div>
            <div className="right">
              <StatusPill status={kpi.status} />
              <div className="tgt">Objetivo: {kpi.target}</div>
            </div>
          </div>
          <div className="drawer-section">
            <h4>Qué mide</h4>
            <p>{kpi.whatMeasures}</p>
          </div>
          <div className="drawer-section">
            <h4>Por qué importa</h4>
            <p>{kpi.whyMatters}</p>
          </div>
          <div className="drawer-section">
            <h4>Dato necesario</h4>
            <p>{kpi.dataNeeded}</p>
          </div>
          <div className="drawer-section">
            <h4>Normativa de referencia</h4>
            <div className="drawer-norms">
              {kpi.detail.map((line, i) => (
                <div className="row" key={i}>
                  <span className="dot" style={{ background: NORMS[kpi.norms[Math.min(i, kpi.norms.length-1)]]?.color || 'var(--plat-violet)' }}></span>
                  <span className="text">{line}</span>
                </div>
              ))}
            </div>
          </div>
        </div>
        <div className="drawer-foot">
          <button className="btn-primary" onClick={() => { onClose(); onChart(kpi); }}>
            Ver evolución semanal
            <UiIcon name="chevron-right" size={14} />
          </button>
          <button className="btn-secondary">Exportar PDF</button>
        </div>
      </aside>
    </>
  );
}

// ─── App ────────────────────────────────────────────────────────────
function App() {
  const [role, setRole] = React.useState('todos');
  const [filter, setFilter] = React.useState(new Set());
  const [helpKpi, setHelpKpi] = React.useState(null);
  const [chartKpi, setChartKpi] = React.useState(null);
  const [inventoryOpen, setInventoryOpen] = React.useState(false);
  const [collisionsOpen, setCollisionsOpen] = React.useState(false);
  const [utilizationOpen, setUtilizationOpen] = React.useState(false);
  const [digitizationOpen, setDigitizationOpen] = React.useState(false);

  const visible = KPIS.filter(k => filter.size === 0 || k.norms.some(n => filter.has(n)));
  const catOrder = ROLES[role].order;
  const groupedByCat = catOrder.map(cid => ({
    cat: CATS[cid],
    items: visible.filter(k => k.cat === cid),
  })).filter(g => g.items.length > 0);

  return (
    <div className="app">
      <Topbar />
      <PageHead />
      <SummaryStrip visible={visible} />
      <div className="toolbar">
        <RoleTabs role={role} setRole={setRole} />
        <div className="toolbar-spacer"></div>
        <NormativaDropdown filter={filter} setFilter={setFilter} />
      </div>
      <div className="body">
        <div className="kpi-content">
          {groupedByCat.length === 0 ? (
            <div className="empty">
              <h3>Ningún KPI cumple los filtros actuales</h3>
              <p>Prueba a quitar alguna normativa del desplegable o cambia de vista de rol.</p>
            </div>
          ) : groupedByCat.map(g => (
            <section key={g.cat.id}>
              <header className="cat-head">
                <div className={`cat-ico cat-${g.cat.id}`}>
                  <KpiIcon name={CAT_ICONS[g.cat.id]} size={22} />
                </div>
                <h2 className="cat-h">{g.cat.label}</h2>
                <span className="cat-meta">{g.items.length} indicador{g.items.length===1?'':'es'}</span>
              </header>
              <div className="cat-rows">
                {g.items.map(k => (
                  <KpiRow key={k.n} kpi={k} filter={filter}
                    onChart={setChartKpi} onHelp={setHelpKpi}
                    onInventory={() => setInventoryOpen(true)}
                    onCollisions={() => setCollisionsOpen(true)}
                    onUtilization={() => setUtilizationOpen(true)}
                    onDigitization={() => setDigitizationOpen(true)} />
                ))}
              </div>
            </section>
          ))}
        </div>
      </div>
      <HelpDrawer kpi={helpKpi} onClose={() => setHelpKpi(null)} onChart={setChartKpi} />
      <WeeklyChartModal kpi={chartKpi} onClose={() => setChartKpi(null)} />
      <InventoryModal open={inventoryOpen} onClose={() => setInventoryOpen(false)} />
      <CollisionsModal open={collisionsOpen} onClose={() => setCollisionsOpen(false)} />
      <UtilizationModal open={utilizationOpen} onClose={() => setUtilizationOpen(false)} />
      <DigitizationModal open={digitizationOpen} onClose={() => setDigitizationOpen(false)} />
    </div>
  );
}

ReactDOM.createRoot(document.getElementById('root')).render(<App />);
