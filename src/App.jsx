import "./styles/components.css"

import KPICard        from "./components/KPICard"
import ClientTable    from "./components/ClientTable"
import Indicators     from "./components/Indicators"
import CalendarWidget from "./components/CalendarWidget"
import TodoList       from "./components/TodoList"
import LoginScreen    from "./components/LoginScreen"

import { MONTHS, MONTH_KEYS, OBJETIVO_MENSUAL } from "./data/initialData"
import { totalMonto, totalCobro, totalSaldo, fmt, fmtSigned } from "./data/helpers"
import { useSupabaseSync } from "./lib/useSupabaseSync"
import { useAuth } from "./lib/useAuth"
import { useState } from "react"

const TABS = [
  { id:"planilla",    label:"📊 Planilla"   },
  { id:"indicadores", label:"📈 Indicadores" },
  { id:"calendario",  label:"🗓 Calendario"  },
  { id:"todo",        label:"✅ To-Do"       },
]

// ── Dashboard (solo usuarios autenticados) ──────────────────
function Dashboard({ user, onLogout }) {
  const [selectedMonth, setSelectedMonth] = useState(0)
  const [activeTab,     setActiveTab]     = useState("planilla")

  const {
    clientes, proyectos, events, todos, loading, error,
    addCliente, updateCliente, deleteCliente,
    addProyecto, updateProyecto, deleteProyecto,
    addEvento, deleteEvento, updateEvento,
    addTodo, toggleTodo, deleteTodo, updateTodo,
  } = useSupabaseSync()

  const mk = MONTH_KEYS[selectedMonth]
  const totalClientes  = totalMonto(clientes,  mk)
  const totalProy      = totalMonto(proyectos, mk)
  const totalGeneral   = totalClientes + totalProy
  const totalCobrado   = totalCobro(clientes, mk) + totalCobro(proyectos, mk)
  const totalPendiente = totalSaldo(clientes, mk) + totalSaldo(proyectos, mk)
  const saldoObjetivo  = totalGeneral - OBJETIVO_MENSUAL
  const pctObjetivo    = Math.min(100, Math.round((totalGeneral / OBJETIVO_MENSUAL) * 100))
  const pctCobrado     = totalGeneral > 0 ? Math.round((totalCobrado / totalGeneral) * 100) : 0

  if (loading) return (
    <div style={{ minHeight:"100vh", display:"flex", alignItems:"center", justifyContent:"center", flexDirection:"column", gap:16 }}>
      <div style={{ width:48, height:48, border:"2px solid rgba(0,212,255,0.15)", borderTop:"2px solid var(--cyan)", borderRadius:"50%", animation:"spin 0.8s linear infinite" }} />
      <style>{`@keyframes spin { to { transform: rotate(360deg); } }`}</style>
      <div style={{ fontFamily:"var(--font-display)", fontSize:12, letterSpacing:3, color:"var(--text-muted)", textTransform:"uppercase" }}>
        Cargando datos...
      </div>
    </div>
  )

  if (error) return (
    <div style={{ minHeight:"100vh", display:"flex", alignItems:"center", justifyContent:"center" }}>
      <div style={{ fontFamily:"var(--font-display)", color:"var(--neon-red)", fontSize:14, letterSpacing:1 }}>
        ⚠ Error de conexión: {error}
      </div>
    </div>
  )

  return (
    <div style={{ minHeight:"100vh" }}>

      {/* ── HEADER ── */}
      <header className="app-header">
        <div className="app-header__brand">
          <div className="app-header__logo-mark">LC</div>
          <div>
            <div className="app-header__title">Lucas <span>Conti</span></div>
            <div className="app-header__subtitle">DASHBOARD · CLIENTES 2026</div>
          </div>
        </div>

        <nav className="app-header__tabs">
          {TABS.map(t => (
            <button
              key={t.id}
              className={`tab-btn ${activeTab===t.id ? "tab-btn--active" : ""}`}
              onClick={() => setActiveTab(t.id)}
            >
              {t.label}
            </button>
          ))}
        </nav>

        {/* User badge + logout */}
        <div style={{ display:"flex", alignItems:"center", gap:12, marginLeft:8 }}>
          <div style={{ display:"flex", alignItems:"center", gap:8, padding:"6px 14px", borderRadius:50, border:`1px solid ${user.color}40`, background:`${user.color}10` }}>
            <div style={{ width:22, height:22, borderRadius:"50%", background:`${user.color}25`, border:`1px solid ${user.color}60`, display:"flex", alignItems:"center", justifyContent:"center", fontFamily:"var(--font-display)", fontWeight:800, fontSize:9, color:user.color }}>
              {user.initials}
            </div>
            <span style={{ fontFamily:"var(--font-display)", fontSize:12, fontWeight:700, color:"var(--text-secondary)", letterSpacing:0.5 }}>
              {user.name}
            </span>
          </div>
          <button
            onClick={onLogout}
            style={{ background:"rgba(255,51,102,0.08)", border:"1px solid rgba(255,51,102,0.3)", color:"#ff3366", padding:"6px 14px", borderRadius:50, fontSize:11, fontFamily:"var(--font-display)", fontWeight:700, letterSpacing:1, transition:"all 0.2s" }}
            onMouseEnter={e => { e.target.style.background="rgba(255,51,102,0.18)"; e.target.style.boxShadow="0 0 12px rgba(255,51,102,0.2)"; }}
            onMouseLeave={e => { e.target.style.background="rgba(255,51,102,0.08)"; e.target.style.boxShadow="none"; }}
          >
            Salir
          </button>
        </div>
      </header>

      {/* ── MONTH BAR ── */}
      <div className="month-bar">
        {MONTHS.map((m, i) => {
          const total = totalMonto(clientes, MONTH_KEYS[i]) + totalMonto(proyectos, MONTH_KEYS[i])
          const ok    = total >= OBJETIVO_MENSUAL
          let cls     = "month-btn"
          if (selectedMonth===i) cls += ok ? " month-btn--active-ok" : " month-btn--active-warn"
          return (
            <button key={m} className={cls} onClick={() => setSelectedMonth(i)}>
              {m.slice(0,3)} {ok ? "✓" : ""}
            </button>
          )
        })}
      </div>

      {/* ── CONTENT ── */}
      <main className="page-content">

        <div className="kpi-strip">
          <KPICard label="Facturado"   value={fmt(totalGeneral)}        sub={MONTHS[selectedMonth]}      color="#00d4ff" glowColor="rgba(0,212,255,0.5)" />
          <KPICard label="Cobrado"     value={fmt(totalCobrado)}        sub={`${pctCobrado}% del total`} color="#00ff88" glowColor="rgba(0,255,136,0.5)" />
          <KPICard label="Pendiente"   value={fmt(totalPendiente)}      sub="Por cobrar"                 color="#ffdd00" glowColor="rgba(255,221,0,0.5)" />
          <KPICard label="vs Objetivo" value={fmtSigned(saldoObjetivo)} sub={`${pctObjetivo}% del objetivo`}
            color={saldoObjetivo>=0?"#00d4ff":"#ff3366"}
            glowColor={saldoObjetivo>=0?"rgba(0,212,255,0.5)":"rgba(255,51,102,0.5)"} />
        </div>

        <div className="progress-wrap">
          <div className="progress-wrap__meta">
            <span>Progreso hacia objetivo {fmt(OBJETIVO_MENSUAL)}</span>
            <span className="mono" style={{ color:pctObjetivo>=100?"var(--cyan)":"var(--neon-yellow)", textShadow:pctObjetivo>=100?"0 0 10px var(--cyan-glow)":"0 0 10px var(--neon-yellow-glow)" }}>
              {pctObjetivo}%
            </span>
          </div>
          <div className="progress-track">
            <div className={`progress-fill ${pctObjetivo>=100?"progress-fill--ok":"progress-fill--warn"}`} style={{ width:`${pctObjetivo}%` }} />
          </div>
        </div>

        {activeTab === "planilla" && (
          <>
            <ClientTable title="Clientes"  clients={clientes}  monthKey={mk} onAdd={addCliente}  onUpdate={updateCliente}  onDelete={deleteCliente}  />
            <ClientTable title="Proyectos" clients={proyectos} monthKey={mk} onAdd={addProyecto} onUpdate={updateProyecto} onDelete={deleteProyecto} />
            <div className="summary-box">
              <div className="summary-grid">
                {[
                  { label:"Total Clientes",  value:fmt(totalClientes),      color:"var(--cyan)" },
                  { label:"Total Proyectos", value:fmt(totalProy),           color:"var(--blue-electric)" },
                  { label:"Total General",   value:fmt(totalGeneral),        color:"var(--text-primary)" },
                  { label:"Objetivo",        value:fmt(OBJETIVO_MENSUAL),    color:"var(--text-muted)" },
                  { label:"Real",            value:fmt(totalGeneral),        color:"var(--text-primary)" },
                  { label:"Saldo Real",      value:fmtSigned(saldoObjetivo), color:saldoObjetivo>=0?"var(--cyan)":"var(--neon-red)", shadow:saldoObjetivo>=0?"0 0 14px var(--cyan-glow)":"0 0 14px var(--neon-red-glow)" },
                ].map((item,i) => (
                  <div key={i} className="summary-item">
                    <div className="summary-item__label">{item.label}</div>
                    <div className="summary-item__value" style={{ color:item.color, textShadow:item.shadow||"none" }}>{item.value}</div>
                  </div>
                ))}
              </div>
            </div>
          </>
        )}

        {activeTab === "indicadores" && <Indicators clientes={clientes} proyectos={proyectos} selectedMonth={selectedMonth} />}
        {activeTab === "calendario"  && <CalendarWidget events={events} onAdd={addEvento} onDelete={deleteEvento} onUpdate={updateEvento} />}
        {activeTab === "todo"        && <TodoList todos={todos} onAdd={addTodo} onToggle={toggleTodo} onDelete={deleteTodo} onUpdate={updateTodo} />}

      </main>
    </div>
  )
}

// ── Root App — maneja login/logout ──────────────────────────
export default function App() {
  const { user, error, login, logout, setError } = useAuth()

  if (!user) {
    return <LoginScreen onLogin={login} error={error} setError={setError} />
  }

  return <Dashboard user={user} onLogout={logout} />
}
