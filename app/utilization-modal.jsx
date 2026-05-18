// Utilization detail modal — opens from KPI 4's "62%" link.
// Lists kits sent to OR with their actual usage rate + unused instruments.

function UtilizationModal({ open, onClose }) {
  if (!open) return null;
  const { UTILIZATION } = window.KPI_DATA;
  const [query, setQuery] = React.useState('');
  const [bucketF, setBucketF] = React.useState('all'); // all | low | mid | high
  const [sortBy, setSortBy] = React.useState('util-asc'); // util-asc | util-desc | date-desc | unused-desc

  const fmtDate = (s) => {
    const [y,m,d] = s.split('-');
    const months = ['ene','feb','mar','abr','may','jun','jul','ago','sep','oct','nov','dic'];
    return `${d} ${months[+m-1]}`;
  };

  // Bucket: <50% bajo (rojo) · 50-80% medio (ámbar) · >=80% alto (verde)
  const bucketOf = (u) => u < 50 ? 'low' : u < 80 ? 'mid' : 'high';

  const enriched = UTILIZATION.map(x => {
    const util = (x.used / x.sent) * 100;
    return { ...x, util, unusedCount: x.sent - x.used, bucket: bucketOf(util) };
  });

  const filtered = enriched
    .filter(x => bucketF === 'all' || x.bucket === bucketF)
    .filter(x => {
      if (!query) return true;
      const q = query.toLowerCase();
      return x.lot.toLowerCase().includes(q)
          || x.lotRef.toLowerCase().includes(q)
          || x.surgery.proc.toLowerCase().includes(q)
          || x.surgery.spec.toLowerCase().includes(q);
    })
    .sort((a,b) => {
      const [k, dir] = sortBy.split('-');
      const sign = dir === 'asc' ? 1 : -1;
      const va = k === 'util' ? a.util : k === 'unused' ? a.unusedCount : a.surgery.date;
      const vb = k === 'util' ? b.util : k === 'unused' ? b.unusedCount : b.surgery.date;
      return (va < vb ? -1 : va > vb ? 1 : 0) * sign;
    });

  // Aggregates across full dataset
  const totalSent = enriched.reduce((s,x) => s + x.sent, 0);
  const totalUsed = enriched.reduce((s,x) => s + x.used, 0);
  const totalUnused = totalSent - totalUsed;
  const avgUtil = (totalUsed / totalSent) * 100;
  const counts = {
    all: enriched.length,
    low: enriched.filter(x => x.bucket === 'low').length,
    mid: enriched.filter(x => x.bucket === 'mid').length,
    high: enriched.filter(x => x.bucket === 'high').length,
  };

  return (
    <>
      <div className="modal-scrim" onClick={onClose}></div>
      <div className="modal modal-wide" role="dialog" aria-modal="true">
        <div className="modal-head">
          <div>
            <div className="modal-eyebrow">Eficiencia de quirófano · KPI 04</div>
            <div className="modal-title">Utilización del instrumental enviado · detalle por lote</div>
          </div>
          <button className="drawer-close" onClick={onClose} aria-label="Cerrar">
            <UiIcon name="cross" size={18} />
          </button>
        </div>
        <div className="modal-body">
          {/* Aggregate stats */}
          <div className="col-stats" style={{ gridTemplateColumns: 'repeat(4, 1fr)' }}>
            <div className="col-stat">
              <div className="col-stat-l">Lotes enviados</div>
              <div className="col-stat-v">{enriched.length}</div>
              <div className="col-stat-s">mayo 2026</div>
            </div>
            <div className="col-stat">
              <div className="col-stat-l">Instrum. enviados</div>
              <div className="col-stat-v">{totalSent.toLocaleString('es-ES')}</div>
              <div className="col-stat-s">{totalUsed.toLocaleString('es-ES')} utilizados</div>
            </div>
            <div className="col-stat alert" style={{ borderColor:'var(--plat-danger-border)', background:'#FEF2F2' }}>
              <div className="col-stat-l">Instrum. no utilizados</div>
              <div className="col-stat-v" style={{ color:'var(--plat-danger-text)' }}>{totalUnused.toLocaleString('es-ES')}</div>
              <div className="col-stat-s">se procesaron sin uso</div>
            </div>
            <div className="col-stat">
              <div className="col-stat-l">Utilización media</div>
              <div className="col-stat-v">{avgUtil.toFixed(0)}%</div>
              <div className="col-stat-s">objetivo: definir</div>
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
              <button className={`inv-statusf-btn${bucketF==='all'?' active':''}`}  onClick={()=>setBucketF('all')}>Todos · {counts.all}</button>
              <button className={`inv-statusf-btn${bucketF==='low'?' active':''}`}  onClick={()=>setBucketF('low')}>&lt; 50% · {counts.low}</button>
              <button className={`inv-statusf-btn${bucketF==='mid'?' active':''}`}  onClick={()=>setBucketF('mid')}>50–80% · {counts.mid}</button>
              <button className={`inv-statusf-btn${bucketF==='high'?' active':''}`} onClick={()=>setBucketF('high')}>≥ 80% · {counts.high}</button>
            </div>
            <div className="inv-sort">
              <label>Ordenar:</label>
              <select value={sortBy} onChange={(e) => setSortBy(e.target.value)}>
                <option value="util-asc">Utilización (menor)</option>
                <option value="util-desc">Utilización (mayor)</option>
                <option value="unused-desc">Instrum. no usados (más)</option>
                <option value="date-desc">Fecha (más reciente)</option>
              </select>
            </div>
          </div>

          {/* Lot cards */}
          <div className="col-list">
            {filtered.map(x => (
              <UtilCard key={x.id} item={x} fmtDate={fmtDate} />
            ))}
            {filtered.length === 0 && (
              <div className="empty"><h3>Sin resultados</h3><p>Ningún lote coincide con los filtros aplicados.</p></div>
            )}
          </div>
        </div>
        <div className="modal-foot">
          <button className="btn-primary"><UiIcon name="download" size={15} />Exportar listado</button>
          <button className="btn-secondary">Recomendar reconfiguración de sets</button>
        </div>
      </div>
    </>
  );
}

function UtilCard({ item, fmtDate }) {
  const pct = item.util;
  const barCls = item.bucket === 'low' ? 'low' : item.bucket === 'mid' ? 'mid' : 'high';
  const label = item.bucket === 'low' ? 'Sobredimensionado' : item.bucket === 'mid' ? 'Ajuste recomendado' : 'Óptimo';

  return (
    <div className={`util-card bucket-${item.bucket}`}>
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
            <div className="col-card-name">{item.lot}</div>
            <div className="col-card-ref">{item.lotRef} · {item.id}</div>
          </div>
        </div>
        <div>
          <span className={`util-label util-label-${item.bucket}`}>{label}</span>
        </div>
      </div>

      {/* Surgery context */}
      <div className="util-surgery">
        <div className="util-surgery-line">
          <span className="col-surgery-spec">{item.surgery.spec}</span>
          <span className="col-surgery-sep">·</span>
          <span style={{ fontWeight: 600, color:'var(--plat-text)' }}>{item.surgery.proc}</span>
        </div>
        <div className="util-surgery-meta">
          {fmtDate(item.surgery.date)} · {item.surgery.surgeon} · {item.surgery.or}
        </div>
      </div>

      {/* Utilization bar */}
      <div className="util-bar-row">
        <div className="util-bar-numbers">
          <div className="util-bar-pct">
            <span className={`util-pct util-pct-${barCls}`}>{pct.toFixed(0)}%</span>
            <span className="util-fraction">{item.used} / {item.sent}</span>
          </div>
          <div className="util-bar-meta">
            <span className="util-unused-count">{item.unusedCount}</span> instrumentos no utilizados
          </div>
        </div>
        <div className="util-bar">
          <div className={`util-bar-fill util-bar-${barCls}`} style={{ width: `${pct}%` }}></div>
        </div>
      </div>

      {/* Unused instruments list */}
      <div className="util-unused">
        <div className="util-unused-head">No utilizados en esta intervención</div>
        <div className="util-unused-grid">
          {item.unused.map((u, i) => (
            <div key={i} className="util-unused-item">
              <span className="util-unused-name">{u.name}</span>
              <span className="util-unused-qty">×{u.qty}</span>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}

window.UtilizationModal = UtilizationModal;
