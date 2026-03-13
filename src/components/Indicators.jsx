import { MONTHS, MONTH_KEYS, OBJETIVO_MENSUAL } from "../data/initialData"
import { totalMonto, totalCobro, calcSaldo, fmt, fmtSigned } from "../data/helpers"

function BarChart({ clientes, proyectos }) {
  const maxVal = 2500000
  return (
    <div>
      <div className="bar-chart">
        {MONTH_KEYS.map((mk, i) => {
          const total   = totalMonto(clientes, mk) + totalMonto(proyectos, mk)
          const cobrado = totalCobro(clientes, mk)  + totalCobro(proyectos, mk)
          const h  = Math.round((total   / maxVal) * 110)
          const hC = Math.round((cobrado / maxVal) * 110)
          const ok = total >= OBJETIVO_MENSUAL
          return (
            <div key={mk} className="bar-col">
              <div
                className="bar-icon"
                style={{ color: ok ? "var(--cyan)" : "var(--neon-yellow)", textShadow: ok ? "0 0 8px var(--cyan-glow)" : "0 0 8px var(--neon-yellow-glow)" }}
              >
                {ok ? "✓" : "○"}
              </div>
              <div className="bar-track">
                <div className="bar-fill" style={{ height: h }}>
                  <div className="bar-fill__cobrado" style={{ height: hC }} />
                </div>
              </div>
              <div className="bar-label">{MONTHS[i].slice(0, 3)}</div>
            </div>
          )
        })}
      </div>
      <div className="chart-legend">
        <div className="legend-item">
          <div className="legend-dot" style={{ background: "rgba(0,102,255,0.5)" }} /> Facturado
        </div>
        <div className="legend-item">
          <div className="legend-dot" style={{ background: "var(--cyan)", boxShadow: "0 0 6px var(--cyan-glow)" }} /> Cobrado
        </div>
      </div>
    </div>
  )
}

export default function Indicators({ clientes, proyectos, selectedMonth }) {
  const mk = MONTH_KEYS[selectedMonth]
  const allClients = [...clientes, ...proyectos]
  const totalG     = totalMonto(clientes, mk) + totalMonto(proyectos, mk)
  const saldoReal  = totalG - OBJETIVO_MENSUAL

  const withMonto  = allClients.filter(c => (c.data[mk]?.monto || 0) > 0)
  const cobrados   = withMonto.filter(c => calcSaldo(c, mk) === 0).length
  const pendientes = withMonto.filter(c => calcSaldo(c, mk) > 0 && !(c.data[mk]?.cobro || 0)).length
  const parciales  = withMonto.filter(c => calcSaldo(c, mk) > 0 && (c.data[mk]?.cobro || 0) > 0).length

  const anual    = MONTH_KEYS.reduce((s, m) => s + totalMonto(clientes, m) + totalMonto(proyectos, m), 0)
  const anualObj = OBJETIVO_MENSUAL * 10
  const pctAnual = Math.min(100, Math.round((anual / anualObj) * 100))

  const topClients = [...allClients]
    .filter(c => (c.data[mk]?.monto || 0) > 0)
    .sort((a, b) => (b.data[mk]?.monto || 0) - (a.data[mk]?.monto || 0))
    .slice(0, 8)

  return (
    <div className="indicators-grid">

      <div className="card">
        <div className="label-caps" style={{ marginBottom: 16 }}>Facturación por Mes</div>
        <BarChart clientes={clientes} proyectos={proyectos} />
      </div>

      <div className="card">
        <div className="label-caps" style={{ marginBottom: 16 }}>Top Clientes — {MONTHS[selectedMonth]}</div>
        {topClients.length === 0
          ? <div className="empty-state">Sin datos este mes</div>
          : topClients.map(c => {
              const m   = c.data[mk]?.monto || 0
              const pct = totalG > 0 ? Math.round((m / totalG) * 100) : 0
              return (
                <div key={c.id} className="top-client-row">
                  <div className="top-client-meta">
                    <span style={{ color: "var(--text-secondary)", fontFamily: "var(--font-display)", fontWeight: 600 }}>{c.name}</span>
                    <span style={{ color: "var(--cyan)", fontFamily: "var(--font-mono)", fontSize: 11, textShadow: "0 0 8px var(--cyan-glow)" }}>
                      {fmt(m)} ({pct}%)
                    </span>
                  </div>
                  <div className="top-client-bar-track">
                    <div className="top-client-bar-fill" style={{ width: `${pct}%` }} />
                  </div>
                </div>
              )
            })
        }
      </div>

      <div className="card">
        <div className="label-caps" style={{ marginBottom: 16 }}>Estado Cobros — {MONTHS[selectedMonth]}</div>
        {[
          { label: "Cobrados",   count: cobrados,   color: "var(--neon-green)",  glow: "var(--neon-green-glow)"  },
          { label: "Pendientes", count: pendientes, color: "var(--neon-red)",    glow: "var(--neon-red-glow)"    },
          { label: "Parciales",  count: parciales,  color: "var(--neon-yellow)", glow: "var(--neon-yellow-glow)" },
        ].map(s => (
          <div key={s.label} className="status-row">
            <div className="status-label">
              <div className="status-dot" style={{ background: s.color, boxShadow: `0 0 6px ${s.glow}` }} />
              {s.label}
            </div>
            <div style={{ fontFamily: "var(--font-mono)", fontSize: 14, color: s.color, textShadow: `0 0 8px ${s.glow}` }}>
              {s.count} <span style={{ color: "var(--text-muted)", fontSize: 11 }}>/ {withMonto.length}</span>
            </div>
          </div>
        ))}
      </div>

      <div className="card">
        <div className="label-caps" style={{ marginBottom: 16 }}>Proyección Anual</div>
        <div className="projection-value">{fmt(anual)}</div>
        <div className="projection-sub">vs objetivo anual {fmt(anualObj)}</div>
        <div className="progress-track">
          <div
            className={`progress-fill ${pctAnual >= 100 ? "progress-fill--ok" : "progress-fill--warn"}`}
            style={{ width: `${pctAnual}%` }}
          />
        </div>
        <div style={{ fontFamily: "var(--font-mono)", fontSize: 11, color: "var(--text-muted)", textAlign: "right", marginTop: 6 }}>
          {pctAnual}% completado
        </div>
        <div style={{ marginTop: 20, paddingTop: 16, borderTop: "1px solid var(--border)" }}>
          <div style={{ fontFamily: "var(--font-display)", fontSize: 10, color: "var(--text-muted)", letterSpacing: 2, textTransform: "uppercase", marginBottom: 6 }}>
            Saldo vs Objetivo · {MONTHS[selectedMonth]}
          </div>
          <div style={{
            fontFamily: "var(--font-display)", fontSize: 22, fontWeight: 900,
            color: saldoReal >= 0 ? "var(--cyan)" : "var(--neon-red)",
            textShadow: saldoReal >= 0 ? "0 0 16px var(--cyan-glow)" : "0 0 16px var(--neon-red-glow)",
          }}>
            {fmtSigned(saldoReal)}
          </div>
        </div>
      </div>

    </div>
  )
}
