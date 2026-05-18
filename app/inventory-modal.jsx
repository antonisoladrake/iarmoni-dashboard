// Lost-instrument inventory modal — opens from KPI 1's "12 400 €" link.
// Shows SAP ERP integration header + sortable/searchable table of lost items.

function InventoryModal({ open, onClose }) {
  if (!open) return null;
  const { LOST_INSTRUMENTS } = window.KPI_DATA;
  const [query, setQuery] = React.useState('');
  const [sortBy, setSortBy] = React.useState('total'); // ref | name | cat | qty | unit | total
  const [dir, setDir] = React.useState('desc');

  const fmtEur = (v) => v.toLocaleString('es-ES', { style:'currency', currency:'EUR', maximumFractionDigits:0 });
  const fmtDate = (s) => {
    const [y,m,d] = s.split('-');
    const months = ['ene','feb','mar','abr','may','jun','jul','ago','sep','oct','nov','dic'];
    return `${d} ${months[+m-1]} ${y}`;
  };

  const filtered = LOST_INSTRUMENTS
    .map(i => ({ ...i, total: i.qty * i.unit }))
    .filter(i => {
      if (!query) return true;
      const q = query.toLowerCase();
      return i.name.toLowerCase().includes(q) || i.ref.toLowerCase().includes(q) || i.cat.toLowerCase().includes(q);
    })
    .sort((a,b) => {
      const va = a[sortBy], vb = b[sortBy];
      const c = typeof va === 'string' ? va.localeCompare(vb, 'es') : va - vb;
      return dir === 'asc' ? c : -c;
    });

  const totalUnits = filtered.reduce((s,i)=>s+i.qty,0);
  const totalCost = filtered.reduce((s,i)=>s+i.total,0);

  const setSort = (col) => {
    if (sortBy === col) {
      setDir(dir === 'asc' ? 'desc' : 'asc');
    } else {
      setSortBy(col);
      setDir(col === 'name' || col === 'cat' || col === 'ref' ? 'asc' : 'desc');
    }
  };

  const SortHead = ({ col, label, align }) => (
    <th onClick={() => setSort(col)} className={`sortable${sortBy===col?' active':''} ${align||''}`}>
      <span className="th-inner">
        {label}
        <span className="sort-ind">
          {sortBy === col ? (dir === 'asc' ? '↑' : '↓') : '↕'}
        </span>
      </span>
    </th>
  );

  return (
    <>
      <div className="modal-scrim" onClick={onClose}></div>
      <div className="modal modal-wide" role="dialog" aria-modal="true">
        <div className="modal-head">
          <div>
            <div className="modal-eyebrow">Eficiencia de la central · KPI 01</div>
            <div className="modal-title">Instrumental perdido · detalle por pieza</div>
          </div>
          <button className="drawer-close" onClick={onClose} aria-label="Cerrar">
            <UiIcon name="cross" size={18} />
          </button>
        </div>
        <div className="modal-body">
          {/* SAP ERP integration banner */}
          <div className="erp-banner">
            <div className="erp-logo">
              <span className="erp-mark">SAP</span>
            </div>
            <div className="erp-info">
              <div className="erp-name">SAP ERP <span className="erp-pill">conectado</span></div>
              <div className="erp-meta">
                Última actualización de precios: <b>12 mayo 2026, 09:14</b>
                <span className="erp-sep">·</span>
                Maestro de materiales sincronizado
              </div>
            </div>
            <button className="erp-sync">
              <UiIcon name="refresh" size={15} />
              Sincronizar ahora
            </button>
          </div>

          {/* Toolbar: search + totals */}
          <div className="inv-toolbar">
            <div className="inv-search">
              <UiIcon name="search" size={16} />
              <input
                type="text"
                placeholder="Buscar por referencia, instrumento o categoría…"
                value={query}
                onChange={(e) => setQuery(e.target.value)}
              />
              {query && <button className="inv-search-clear" onClick={()=>setQuery('')}><UiIcon name="cross" size={14} /></button>}
            </div>
            <div className="inv-totals">
              <div className="inv-total-block">
                <div className="inv-total-l">Piezas perdidas</div>
                <div className="inv-total-v">{totalUnits}</div>
              </div>
              <div className="inv-total-block">
                <div className="inv-total-l">Coste total</div>
                <div className="inv-total-v inv-total-cost">{fmtEur(totalCost)}</div>
              </div>
            </div>
          </div>

          {/* Table */}
          <div className="inv-table-wrap">
            <table className="inv-table">
              <thead>
                <tr>
                  <SortHead col="ref"      label="Referencia" />
                  <SortHead col="name"     label="Instrumento" />
                  <SortHead col="cat"      label="Categoría" />
                  <SortHead col="lastSeen" label="Última vez visto" />
                  <SortHead col="qty"      label="Piezas"        align="right" />
                  <SortHead col="unit"     label="Coste unit."  align="right" />
                  <SortHead col="total"    label="Coste total"  align="right" />
                </tr>
              </thead>
              <tbody>
                {filtered.map(i => (
                  <tr key={i.ref}>
                    <td className="mono">{i.ref}</td>
                    <td><div className="inv-name">{i.name}</div><div className="inv-or">{i.or}</div></td>
                    <td><span className="inv-cat">{i.cat}</span></td>
                    <td className="muted">{fmtDate(i.lastSeen)}</td>
                    <td className="num">{i.qty}</td>
                    <td className="num muted">{fmtEur(i.unit)}</td>
                    <td className="num bold">{fmtEur(i.total)}</td>
                  </tr>
                ))}
              </tbody>
              <tfoot>
                <tr>
                  <td colSpan="4" className="foot-l">Total ({filtered.length} referencias)</td>
                  <td className="num bold">{totalUnits}</td>
                  <td></td>
                  <td className="num bold inv-total-cost">{fmtEur(totalCost)}</td>
                </tr>
              </tfoot>
            </table>
          </div>
        </div>
        <div className="modal-foot">
          <button className="btn-primary">
            <UiIcon name="download" size={15} />
            Exportar inventario (CSV)
          </button>
          <button className="btn-secondary">Ver evolución histórica</button>
        </div>
      </div>
    </>
  );
}

window.InventoryModal = InventoryModal;
