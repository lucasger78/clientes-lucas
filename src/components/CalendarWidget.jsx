import { useState, useEffect } from "react"
import { fmt } from "../data/helpers"

function formatDateAR(isoDate) {
  if (!isoDate) return ""
  const [y, m, d] = isoDate.split("-")
  return `${d}/${m}/${y}`
}

export default function CalendarWidget({ events, onAdd, onDelete, onUpdate }) {
  const [form,     setForm]     = useState({ title:"", date:"", client:"", amount:"" })
  const [notified, setNotified] = useState([])
  const [editing,  setEditing]  = useState(null)
  const [notifStatus, setNotifStatus] = useState(Notification.permission) // 'default' | 'granted' | 'denied'

  useEffect(() => {
    const today = new Date().toISOString().split("T")[0]
    events.forEach(ev => {
      if (ev.date === today && !notified.includes(ev.id)) {
        if (Notification.permission === "granted") {
          new Notification(`💰 Cobro pendiente: ${ev.client || ev.title}`, {
            body: ev.amount ? `Monto: ${fmt(Number(ev.amount))}` : ev.title,
          })
        }
        setNotified(prev => [...prev, ev.id])
      }
    })
  }, [events])

  const requestNotif = async () => {
    const result = await Notification.requestPermission()
    setNotifStatus(result)
  }

  const handleAdd = () => {
    if (!form.title.trim() || !form.date) return
    onAdd({ ...form })
    setForm({ title:"", date:"", client:"", amount:"" })
  }

  const startEdit = (ev) => setEditing({
    id: ev.id, title: ev.title, date: ev.date,
    client: ev.client || "", amount: ev.amount || "",
  })

  const saveEdit = () => {
    if (!editing?.title.trim() || !editing.date) return
    onUpdate(editing.id, {
      title:  editing.title.trim(),
      date:   editing.date,
      client: editing.client.trim(),
      amount: editing.amount.replace(/[^0-9]/g, ""),
    })
    setEditing(null)
  }

  const sorted = [...events].sort((a,b) => a.date.localeCompare(b.date))
  const today  = new Date().toISOString().split("T")[0]

  // Badge de estado de notificaciones
  const notifBadge = {
    granted: { label:"🔔 Notificaciones activas",   color:"#00ff88", bg:"rgba(0,255,136,0.08)", border:"rgba(0,255,136,0.3)" },
    denied:  { label:"🔕 Notificaciones bloqueadas", color:"#ff3366", bg:"rgba(255,51,102,0.08)", border:"rgba(255,51,102,0.3)" },
    default: { label:"🔔 Activar notificaciones",    color:"#ffdd00", bg:"rgba(255,221,0,0.06)",  border:"rgba(255,221,0,0.25)" },
  }[notifStatus]

  return (
    <div className="calendar-card">
      <div className="calendar-header">
        <span className="label-caps">Calendario de Cobros</span>

        {/* Badge de estado */}
        <button
          onClick={notifStatus !== "granted" ? requestNotif : undefined}
          style={{
            padding:"5px 14px", borderRadius:20,
            border:`1px solid ${notifBadge.border}`,
            background: notifBadge.bg,
            color: notifBadge.color,
            fontFamily:"var(--font-display)", fontSize:11, fontWeight:700,
            letterSpacing:0.5,
            cursor: notifStatus === "granted" ? "default" : "pointer",
            textShadow:`0 0 8px ${notifBadge.color}60`,
            boxShadow: notifStatus === "granted" ? `0 0 10px ${notifBadge.color}25` : "none",
            transition:"all 0.2s",
          }}
        >
          {notifBadge.label}
        </button>
      </div>

      {notifStatus === "denied" && (
        <div style={{
          fontFamily:"var(--font-display)", fontSize:11, color:"#ff3366",
          background:"rgba(255,51,102,0.06)", border:"1px solid rgba(255,51,102,0.2)",
          borderRadius:8, padding:"8px 14px", marginBottom:16,
        }}>
          ⚠ Las notificaciones están bloqueadas en el navegador. Activalas desde la configuración del sitio.
        </div>
      )}

      {/* Formulario agregar */}
      <div className="form-grid-2">
        <input className="form-input" placeholder="Título del cobro" value={form.title}  onChange={e => setForm({...form, title:e.target.value})} />
        <input className="form-input" placeholder="Cliente"          value={form.client} onChange={e => setForm({...form, client:e.target.value})} />
        <input className="form-input" type="date"                    value={form.date}   onChange={e => setForm({...form, date:e.target.value})} />
        <input className="form-input" placeholder="Monto (opcional)" value={form.amount} onChange={e => setForm({...form, amount:e.target.value.replace(/[^0-9]/g,"")})} />
      </div>
      <button className="btn-primary btn-primary--full" onClick={handleAdd}>+ Agregar recordatorio</button>

      {/* Lista */}
      <div className="event-list">
        {sorted.length === 0 && <div className="empty-state">Sin eventos agendados</div>}
        {sorted.map(ev => {
          const isToday   = ev.date === today
          const isPast    = ev.date < today
          const cls       = isToday ? "event-item--today" : isPast ? "event-item--past" : "event-item--future"
          const isEditing = editing?.id === ev.id

          return (
            <div key={ev.id} className={`event-item ${cls}`}>
              {isEditing ? (
                <div style={{ flex:1, display:"flex", flexDirection:"column", gap:8 }}>
                  <div className="form-grid-2" style={{ margin:0 }}>
                    <input className="form-input" placeholder="Título"  value={editing.title}  onChange={e => setEditing(p => ({...p, title:e.target.value}))} autoFocus />
                    <input className="form-input" placeholder="Cliente" value={editing.client} onChange={e => setEditing(p => ({...p, client:e.target.value}))} />
                    <input className="form-input" type="date"           value={editing.date}   onChange={e => setEditing(p => ({...p, date:e.target.value}))} />
                    <input className="form-input" placeholder="Monto"   value={editing.amount} onChange={e => setEditing(p => ({...p, amount:e.target.value.replace(/[^0-9]/g,"")}))} />
                  </div>
                  <div style={{ display:"flex", gap:8, justifyContent:"flex-end" }}>
                    <button className="btn-primary" onClick={saveEdit} style={{ padding:"7px 18px", fontSize:12 }}>✓ Guardar</button>
                    <button className="btn-icon" onClick={() => setEditing(null)} style={{ fontSize:18, opacity:0.6, padding:"4px 10px" }}>×</button>
                  </div>
                </div>
              ) : (
                <>
                  <div style={{ flex:1 }}>
                    <div className="event-item__title" style={{
                      color: isToday ? "var(--cyan)" : isPast ? "var(--text-muted)" : "var(--text-primary)",
                      textShadow: isToday ? "0 0 10px var(--cyan-glow)" : "none",
                    }}>{ev.title}</div>
                    <div className="event-item__meta">
                      {ev.client}{ev.amount ? ` · ${fmt(Number(ev.amount))}` : ""}
                    </div>
                  </div>
                  <div style={{ display:"flex", alignItems:"center", gap:10 }}>
                    <div style={{ textAlign:"right" }}>
                      <div className="event-item__date" style={{
                        color: isToday ? "var(--cyan)" : isPast ? "var(--text-muted)" : "var(--text-secondary)"
                      }}>
                        {formatDateAR(ev.date)}
                      </div>
                      {isToday && <div className="event-item__tag" style={{ color:"var(--cyan)", textShadow:"0 0 8px var(--cyan-glow)" }}>HOY</div>}
                      {isPast   && <div className="event-item__tag" style={{ color:"var(--text-muted)" }}>Pasado</div>}
                    </div>
                    <button className="btn-icon" title="Editar" onClick={() => startEdit(ev)} style={{ opacity:0.5, fontSize:13 }}>✎</button>
                    <button className="btn-icon" onClick={() => onDelete(ev.id)}>×</button>
                  </div>
                </>
              )}
            </div>
          )
        })}
      </div>
    </div>
  )
}
