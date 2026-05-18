// Digitization detail modal — opens from KPI 11's "4 820" link.
// Shows every paper record across the full reprocessing cycle that gets digitized in Armoni.

function DigitizationModal({ open, onClose }) {
  if (!open) return null;
  const { DIGITIZATION, DIGITIZATION_META } = window.KPI_DATA;
  const [query, setQuery] = React.useState('');
  const [stageF, setStageF] = React.useState('all');

  const STAGES = [
    { id: 'lavado',         label: 'Lavado',         color: '#0F766E' },
    { id: 'empaquetado',    label: 'Empaquetado',    color: '#0E7490' },
    { id: 'esterilización', label: 'Esterilización', color: '#1D4ED8' },
    { id: 'almacenaje',     label: 'Almacenaje',     color: '#7C3AED' },
    { id: 'envío',          label: 'Envío',          color: '#A16207' },
    { id: 'devolución',     label: 'Devolución',     color: '#B91C1C' },
    { id: 'incidencias',    label: 'Incidencias',    color: '#DC2626' },
    { id: 'mantenimiento',  label: 'Mantenimiento',  color: '#6B7280' },
  ];
  const stageById = Object.fromEntries(STAGES.map(s => [s.id, s]));

  const fmtNum = (v) => v.toLocaleString('es-ES');
  const fmtEur = (v) => v.toLocaleString('es-ES', { minimumFractionDigits: 2, maximumFractionDigits: 2 }) + ' €';

  const enriched = DIGITIZATION.map(d => {
    const pages = d.monthlyDocs * d.pagesPerDoc;
    const savings = pages * DIGITIZATION_META.costPerPage;
    return { ...d, pages, savings };
  });

  const filtered = enriched
    .filter(d => stageF === 'all' || d.stage === stageF)
    .filter(d => {
      if (!query) return true;
      const q = query.toLowerCase();
      return d.name.toLowerCase().includes(q)
          || d.desc.toLowerCase().includes(q)
          || d.norm.toLowerCase().includes(q);
    });

  const totalDocs = enriched.reduce((s, d) => s + d.monthlyDocs, 0);
  const totalPages = enriched.reduce((s, d) => s + d.pages, 0);
  const totalSavings = enriched.reduce((s, d) => s + d.savings, 0);
  const stageCount = (sid) => enriched.filter(d => d.stage === sid).length;

  return (
    <>
      <div className="modal-scrim" onClick={onClose}></div>
      <div className="modal modal-wide" role="dialog" aria-modal="true">
        <div className="modal-head">
          <div>
            <div className="modal-eyebrow">Sostenibilidad · KPI 11</div>
            <div className="modal-title">Registros en papel digitalizados · detalle por etapa del ciclo</div>
          </div>
          <button className="drawer-close" onClick={onClose} aria-label="Cerrar">
            <UiIcon name="cross" size={18} />
          </button>
        </div>
        <div className="modal-body">
          {/* Stats row */}
          <div className="col-stats" style={{ gridTemplateColumns: 'repeat(4, 1fr)' }}>
            <div className="col-stat">
              <div className="col-stat-l">Tipos de registro</div>
              <div className="col-stat-v">{enriched.length}</div>
              <div className="col-stat-s">a lo largo del ciclo</div>
            </div>
            <div className="col-stat">
              <div className="col-stat-l">Documentos / mes</div>
              <div className="col-stat-v">{fmtNum(totalDocs)}</div>
              <div className="col-stat-s">generados digitalmente</div>
            </div>
            <div className="col-stat ok">
              <div className="col-stat-l">Páginas evitadas / mes</div>
              <div className="col-stat-v">{fmtNum(totalPages)}</div>
              <div className="col-stat-s">no se imprimen</div>
            </div>
            <div className="col-stat ok">
              <div className="col-stat-l">Ahorro estimado / mes</div>
              <div className="col-stat-v">{fmtEur(totalSavings)}</div>
              <div className="col-stat-s">{DIGITIZATION_META.costPerPage} €/página</div>
            </div>
          </div>

          {/* Toolbar */}
          <div className="inv-toolbar">
            <div className="inv-search">
              <UiIcon name="search" size={16} />
              <input
                type="text"
                placeholder="Buscar por registro, descripción o normativa…"
                value={query}
                onChange={(e) => setQuery(e.target.value)}
              />
              {query && <button className="inv-search-clear" onClick={()=>setQuery('')}><UiIcon name="cross" size={14} /></button>}
            </div>
            <div className="dig-stages">
              <button className={`dig-stage-btn${stageF==='all'?' active':''}`} onClick={()=>setStageF('all')}>
                Todas · {enriched.length}
              </button>
              {STAGES.map(s => stageCount(s.id) > 0 && (
                <button key={s.id}
                  className={`dig-stage-btn${stageF===s.id?' active':''}`}
                  style={stageF===s.id ? { color: s.color, borderColor: s.color, background:'#fff' } : null}
                  onClick={()=>setStageF(s.id)}>
                  <span className="dig-stage-dot" style={{ background: s.color }}></span>
                  {s.label} · {stageCount(s.id)}
                </button>
              ))}
            </div>
          </div>

          {/* Table */}
          <div className="inv-table-wrap">
            <table className="inv-table">
              <thead>
                <tr>
                  <th>Registro</th>
                  <th>Etapa del ciclo</th>
                  <th>Normativa</th>
                  <th className="num">Doc / mes</th>
                  <th className="num">Páginas evitadas</th>
                  <th className="num">Ahorro</th>
                </tr>
              </thead>
              <tbody>
                {filtered.map(d => {
                  const s = stageById[d.stage];
                  return (
                    <tr key={d.id}>
                      <td>
                        <div className="inv-name">{d.name}</div>
                        <div className="inv-or">{d.desc}</div>
                      </td>
                      <td>
                        <span className="dig-stage-chip" style={{ color: s.color, borderColor: s.color }}>
                          <span className="dig-stage-dot" style={{ background: s.color }}></span>
                          {s.label}
                        </span>
                      </td>
                      <td><span className="inv-cat">{d.norm}</span>{d.required && <span className="dig-req">obligatorio</span>}</td>
                      <td className="num">{fmtNum(d.monthlyDocs)}</td>
                      <td className="num">{fmtNum(d.pages)}</td>
                      <td className="num bold" style={{ color:'var(--plat-ok-text)' }}>{fmtEur(d.savings)}</td>
                    </tr>
                  );
                })}
                {filtered.length === 0 && (
                  <tr><td colSpan="6" className="inv-empty">Sin resultados con esos filtros.</td></tr>
                )}
              </tbody>
              <tfoot>
                <tr>
                  <td colSpan="3" className="foot-l">Total ({filtered.length} registros)</td>
                  <td className="num bold">{fmtNum(filtered.reduce((s,d)=>s+d.monthlyDocs,0))}</td>
                  <td className="num bold">{fmtNum(filtered.reduce((s,d)=>s+d.pages,0))}</td>
                  <td className="num bold" style={{ color:'var(--plat-ok-text)' }}>{fmtEur(filtered.reduce((s,d)=>s+d.savings,0))}</td>
                </tr>
              </tfoot>
            </table>
          </div>
        </div>
        <div className="modal-foot">
          <button className="btn-primary"><UiIcon name="download" size={15} />Exportar listado</button>
          <button className="btn-secondary">Ver impacto medioambiental (CO₂)</button>
        </div>
      </div>
    </>
  );
}

window.DigitizationModal = DigitizationModal;
