// Collisions detail modal — opens from KPI 3's "7" / "100% resueltas" link.
// Shows the kits (boxes) that had scheduling collisions and for which surgeries.

function CollisionsModal({ open, onClose }) {
  if (!open) return null;
  const { COLLISIONS } = window.KPI_DATA;
  const [query, setQuery] = React.useState('');
  const [statusF, setStatusF] = React.useState('all'); // all | resolved | pending

  const fmtDate = (s) => {
    const [y,m,d] = s.split('-');
    const months = ['ene','feb','mar','abr','may','jun','jul','ago','sep','oct','nov','dic'];
    return `${d} ${months[+m-1]}`;
  };

  const filtered = COLLISIONS.filter(c => {
    if (statusF !== 'all' && c.status !== statusF) return false;
    if (!query) return true;
    const q = query.toLowerCase();
    return (
      c.lot.toLowerCase().includes(q) ||
      c.lotRef.toLowerCase().includes(q) ||
      c.surgeryA.proc.toLowerCase().includes(q) ||
      c.surgeryB.proc.toLowerCase().includes(q) ||
      c.surgeryA.spec.toLowerCase().includes(q) ||
      c.surgeryB.spec.toLowerCase().includes(q)
    );
  });

  const counts = {
    total: COLLISIONS.length,
    resolved: COLLISIONS.filter(c => c.status === 'resolved').length,
    pending: COLLISIONS.filter(c => c.status === 'pending').length,
  };
  const resolutionRate = counts.total ? Math.round((counts.resolved / counts.total) * 100) : 0;

  return (
    <>
      <div className="modal-scrim" onClick={onClose}></div>
      <div className="modal modal-wide" role="dialog" aria-modal="true">
        <div className="modal-head">
          <div>
            <div className="modal-eyebrow">Eficiencia de la central · KPI 03</div>
            <div className="modal-title">Colisiones de lotes de material · detalle por cirugía</div>
          </div>
          <button className="drawer-close" onClick={onClose} aria-label="Cerrar">
            <UiIcon name="cross" size={18} />
          </button>
        </div>
        <div className="modal-body">
          {/* Stats row */}
          <div className="col-stats">
            <div className="col-stat">
              <div className="col-stat-l">Colisiones del periodo</div>
              <div className="col-stat-v">{counts.total}</div>
              <div className="col-stat-s">mayo 2026</div>
            </div>
            <div className="col-stat ok">
              <div className="col-stat-l">Resueltas a tiempo</div>
              <div className="col-stat-v">{counts.resolved} <span className="col-stat-pct">/ {resolutionRate}%</span></div>
              <div className="col-stat-s">objetivo: 100%</div>
            </div>
            <div className="col-stat">
              <div className="col-stat-l">Pendientes</div>
              <div className="col-stat-v">{counts.pending}</div>
              <div className="col-stat-s">requieren intervención</div>
            </div>
          </div>

          {/* Toolbar */}
          <div className="inv-toolbar">
            <div className="inv-search">
              <UiIcon name="search" size={16} />
              <input
                type="text"
                placeholder="Buscar por lote, cirugía o especialidad…"
                value={query}
                onChange={(e) => setQuery(e.target.value)}
              />
              {query && <button className="inv-search-clear" onClick={()=>setQuery('')}><UiIcon name="cross" size={14} /></button>}
            </div>
            <div className="inv-statusf">
              <button className={`inv-statusf-btn${statusF==='all'?' active':''}`} onClick={()=>setStatusF('all')}>Todas · {counts.total}</button>
              <button className={`inv-statusf-btn${statusF==='resolved'?' active':''}`} onClick={()=>setStatusF('resolved')}>Resueltas · {counts.resolved}</button>
              <button className={`inv-statusf-btn${statusF==='pending'?' active':''}`} onClick={()=>setStatusF('pending')}>Pendientes · {counts.pending}</button>
            </div>
          </div>

          {/* Collision cards */}
          <div className="col-list">
            {filtered.map(c => (
              <div key={c.id} className={`col-card status-${c.status}`}>
                {/* Header — lot identification */}
                <div className="col-card-head">
                  <div className="col-card-lot">
                    <div className="col-card-icon">
                      <svg width="22" height="22" viewBox="0 0 32 32" fill="none" stroke="currentColor" strokeWidth="1.4" strokeLinecap="square">
                        <path d="M16 4 L28 9 L28 23 L16 28 L4 23 L4 9 Z" />
                        <path d="M4 9 L16 14 L28 9" />
                        <path d="M16 14 L16 28" />
                      </svg>
                    </div>
                    <div>
                      <div className="col-card-name">{c.lot}</div>
                      <div className="col-card-ref">{c.lotRef} · {c.id}</div>
                    </div>
                  </div>
                  <div className="col-card-status">
                    <span className={`status-pill ${c.status === 'resolved' ? 'ok' : 'warn'}`}>
                      <span className="dot"></span>
                      {c.status === 'resolved' ? 'Resuelta' : 'Pendiente'}
                    </span>
                  </div>
                </div>

                {/* Surgeries — A vs B */}
                <div className="col-card-surgeries">
                  <Surgery letter="A" data={c.surgeryA} fmtDate={fmtDate} />
                  <div className="col-vs">
                    <div className="col-vs-line"></div>
                    <div className="col-vs-badge">vs</div>
                    <div className="col-vs-overlap">solapamiento {c.overlap}</div>
                  </div>
                  <Surgery letter="B" data={c.surgeryB} fmtDate={fmtDate} />
                </div>

                {/* Resolution */}
                <div className="col-card-resolution">
                  <div className="col-res-l">Resolución</div>
                  <div className="col-res-body">{c.resolution}</div>
                  <div className="col-res-meta">{c.resolvedBy} · {c.resolvedAt}</div>
                </div>
              </div>
            ))}
            {filtered.length === 0 && (
              <div className="empty"><h3>Sin resultados</h3><p>No hay colisiones que coincidan con los filtros.</p></div>
            )}
          </div>
        </div>
        <div className="modal-foot">
          <button className="btn-primary"><UiIcon name="download" size={15} />Exportar listado</button>
          <button className="btn-secondary">Ver planificación quirúrgica</button>
        </div>
      </div>
    </>
  );
}

function Surgery({ letter, data, fmtDate }) {
  return (
    <div className="col-surgery">
      <div className="col-surgery-head">
        <span className="col-surgery-letter">Cirugía {letter}</span>
        <span className="col-surgery-when">{fmtDate(data.date)} · {data.time}</span>
      </div>
      <div className="col-surgery-proc">{data.proc}</div>
      <div className="col-surgery-meta">
        <span className="col-surgery-spec">{data.spec}</span>
        <span className="col-surgery-sep">·</span>
        <span>{data.surgeon}</span>
        <span className="col-surgery-sep">·</span>
        <span>{data.or}</span>
      </div>
    </div>
  );
}

window.CollisionsModal = CollisionsModal;
