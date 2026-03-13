import { useState } from "react"
import { PRIORITY_COLORS } from "../data/helpers"

const PRIORITY_GLOWS = {
  alta:   "rgba(255,51,102,0.4)",
  normal: "rgba(255,221,0,0.4)",
  baja:   "rgba(0,212,255,0.4)",
}

const DAYS = [
  { key: 0, label: "DOM", full: "Domingo"   },
  { key: 1, label: "LUN", full: "Lunes"     },
  { key: 2, label: "MAR", full: "Martes"    },
  { key: 3, label: "MIÉ", full: "Miércoles" },
  { key: 4, label: "JUE", full: "Jueves"    },
  { key: 5, label: "VIE", full: "Viernes"   },
  { key: 6, label: "SÁB", full: "Sábado"    },
]

const todayKey = new Date().getDay() // 0-6

function DayColumn({ day, todos, onAdd, onToggle, onDelete, onUpdate }) {
  const [input,    setInput]    = useState("")
  const [priority, setPriority] = useState("normal")
  const [editing,  setEditing]  = useState(null)
  const [open,     setOpen]     = useState(false)

  const isToday = day.key === todayKey

  const handleAdd = () => {
    const text = input.trim()
    if (!text) return
    onAdd({ text, priority, day_of_week: day.key })
    setInput("")
    setOpen(false)
  }

  const startEdit = (t) => setEditing({ id: t.id, text: t.text, priority: t.priority, day_of_week: t.day_of_week ?? day.key })
  const saveEdit  = () => {
    if (!editing?.text.trim()) return
    onUpdate(editing.id, { text: editing.text.trim(), priority: editing.priority, day_of_week: editing.day_of_week })
    setEditing(null)
  }

  const pending = todos.filter(t => !t.done).length

  return (
    <div style={{
      flex: 1,
      minWidth: 0,
      borderRadius: 10,
      border: isToday
        ? "1px solid rgba(0,212,255,0.45)"
        : "1px solid rgba(255,255,255,0.06)",
      background: isToday
        ? "rgba(0,212,255,0.04)"
        : "rgba(255,255,255,0.015)",
      display: "flex",
      flexDirection: "column",
      overflow: "hidden",
      boxShadow: isToday ? "0 0 20px rgba(0,212,255,0.08)" : "none",
      transition: "border-color 0.2s",
    }}>
      {/* Header del día */}
      <div style={{
        padding: "10px 10px 8px",
        borderBottom: isToday
          ? "1px solid rgba(0,212,255,0.2)"
          : "1px solid rgba(255,255,255,0.05)",
        display: "flex",
        alignItems: "center",
        justifyContent: "space-between",
        background: isToday ? "rgba(0,212,255,0.06)" : "transparent",
      }}>
        <div>
          <div style={{
            fontFamily: "var(--font-display)",
            fontSize: 11,
            fontWeight: 800,
            letterSpacing: 2,
            color: isToday ? "var(--cyan)" : "var(--text-secondary)",
            textShadow: isToday ? "0 0 8px var(--cyan-glow)" : "none",
          }}>
            {day.label}
            {isToday && (
              <span style={{ marginLeft: 4, fontSize: 8, color: "var(--cyan)", opacity: 0.8 }}>●</span>
            )}
          </div>
          {pending > 0 && (
            <div style={{
              fontFamily: "var(--font-mono)",
              fontSize: 9,
              color: "var(--text-muted)",
              marginTop: 2,
            }}>{pending} pend.</div>
          )}
        </div>
        <button
          onClick={() => setOpen(o => !o)}
          style={{
            width: 20, height: 20, borderRadius: "50%",
            border: "1px solid rgba(0,212,255,0.3)",
            background: open ? "rgba(0,212,255,0.15)" : "transparent",
            color: "var(--cyan)", fontSize: 14, lineHeight: 1,
            cursor: "pointer", display: "flex", alignItems: "center", justifyContent: "center",
            transition: "all 0.15s", flexShrink: 0,
          }}
        >+</button>
      </div>

      {/* Form agregar */}
      {open && (
        <div style={{ padding: "8px 8px 4px", borderBottom: "1px solid rgba(255,255,255,0.05)", background: "rgba(0,0,0,0.2)" }}>
          <input
            className="form-input"
            style={{ width: "100%", padding: "6px 8px", fontSize: 12, marginBottom: 6, boxSizing: "border-box" }}
            placeholder="Nueva tarea..."
            value={input}
            onChange={e => setInput(e.target.value)}
            onKeyDown={e => { if(e.key === "Enter") handleAdd(); if(e.key === "Escape") setOpen(false) }}
            autoFocus
          />
          <div style={{ display: "flex", gap: 4 }}>
            <select
              className="todo-select"
              style={{ flex: 1, padding: "4px 6px", fontSize: 10 }}
              value={priority}
              onChange={e => setPriority(e.target.value)}
            >
              <option value="alta">🔴 Alta</option>
              <option value="normal">🟡 Normal</option>
              <option value="baja">🟢 Baja</option>
            </select>
            <button className="btn-primary" onClick={handleAdd} style={{ padding: "4px 10px", fontSize: 11 }}>✓</button>
          </div>
        </div>
      )}

      {/* Lista de tareas */}
      <div style={{ flex: 1, overflowY: "auto", padding: "4px 0" }}>
        {todos.length === 0 && !open && (
          <div style={{
            textAlign: "center", padding: "12px 4px",
            fontFamily: "var(--font-mono)", fontSize: 9,
            color: "var(--text-faint)", letterSpacing: 1,
          }}>vacío</div>
        )}
        {todos.map(t => {
          const color     = PRIORITY_COLORS[t.priority]
          const glow      = PRIORITY_GLOWS[t.priority]
          const isEditing = editing?.id === t.id

          return (
            <div key={t.id} style={{
              padding: "5px 8px",
              borderBottom: "1px solid rgba(255,255,255,0.03)",
              display: "flex",
              alignItems: "flex-start",
              gap: 5,
              opacity: t.done ? 0.45 : 1,
              transition: "opacity 0.2s",
            }}>
              {/* Dot prioridad */}
              <div style={{
                width: 5, height: 5, borderRadius: "50%",
                background: color, boxShadow: `0 0 4px ${glow}`,
                marginTop: 5, flexShrink: 0,
              }} />

              {isEditing ? (
                <div style={{ flex: 1, display: "flex", flexDirection: "column", gap: 4 }}>
                  <input
                    className="form-input"
                    style={{ width: "100%", padding: "4px 6px", fontSize: 11, boxSizing: "border-box" }}
                    value={editing.text}
                    onChange={e => setEditing(p => ({ ...p, text: e.target.value }))}
                    onKeyDown={e => { if(e.key==="Enter") saveEdit(); if(e.key==="Escape") setEditing(null) }}
                    autoFocus
                  />
                  <div style={{ display: "flex", gap: 4, flexWrap: "wrap" }}>
                    <select
                      className="todo-select"
                      style={{ flex: 1, padding: "3px 5px", fontSize: 10 }}
                      value={editing.priority}
                      onChange={e => setEditing(p => ({ ...p, priority: e.target.value }))}
                    >
                      <option value="alta">🔴 Alta</option>
                      <option value="normal">🟡 Normal</option>
                      <option value="baja">🟢 Baja</option>
                    </select>
                    <select
                      className="todo-select"
                      style={{ flex: 1, padding: "3px 5px", fontSize: 10, color: "var(--cyan)", borderColor: "rgba(0,212,255,0.3)" }}
                      value={editing.day_of_week}
                      onChange={e => setEditing(p => ({ ...p, day_of_week: Number(e.target.value) }))}
                    >
                      <option value={0}>📅 Dom</option>
                      <option value={1}>📅 Lun</option>
                      <option value={2}>📅 Mar</option>
                      <option value={3}>📅 Mié</option>
                      <option value={4}>📅 Jue</option>
                      <option value={5}>📅 Vie</option>
                      <option value={6}>📅 Sáb</option>
                    </select>
                    <button className="btn-primary" onClick={saveEdit}       style={{ padding: "2px 8px", fontSize: 10 }}>✓</button>
                    <button className="btn-icon"    onClick={() => setEditing(null)} style={{ fontSize: 13 }}>×</button>
                  </div>
                </div>
              ) : (
                <>
                  {/* Texto + check */}
                  <div
                    style={{ flex: 1, minWidth: 0, cursor: "pointer" }}
                    onClick={() => onToggle(t.id, t.done)}
                  >
                    <div style={{
                      fontFamily: "var(--font-display)",
                      fontSize: 11,
                      fontWeight: 600,
                      color: t.done ? "var(--text-muted)" : "var(--text-primary)",
                      textDecoration: t.done ? "line-through" : "none",
                      wordBreak: "break-word",
                      overflowWrap: "break-word",
                      lineHeight: 1.4,
                      whiteSpace: "normal",
                    }}>{t.text}</div>
                  </div>
                  {/* Acciones */}
                  <button
                    className="btn-icon"
                    onClick={() => startEdit(t)}
                    style={{ opacity: 0.4, fontSize: 11, padding: "1px 3px", flexShrink: 0 }}
                  >✎</button>
                  <button
                    className="btn-icon"
                    onClick={() => onDelete(t.id)}
                    style={{ opacity: 0.4, fontSize: 12, padding: "1px 3px", flexShrink: 0 }}
                  >×</button>
                </>
              )}
            </div>
          )
        })}
      </div>
    </div>
  )
}

export default function TodoList({ todos, onAdd, onToggle, onDelete, onUpdate }) {
  const totalPending   = todos.filter(t => !t.done).length
  const totalCompleted = todos.filter(t =>  t.done).length

  return (
    <div className="todo-card">
      <div style={{ display: "flex", alignItems: "center", justifyContent: "space-between", marginBottom: 16 }}>
        <div className="label-caps">Semana de trabajo</div>
        <div style={{ fontFamily: "var(--font-mono)", fontSize: 10, color: "var(--text-muted)" }}>
          {totalPending} pendiente{totalPending !== 1 ? "s" : ""} · {totalCompleted} completada{totalCompleted !== 1 ? "s" : ""}
        </div>
      </div>

      {/* Grid semanal */}
      <div style={{
        display: "grid",
        gridTemplateColumns: "repeat(7, 1fr)",
        gap: 10,
        alignItems: "stretch",
        minHeight: 360,
        width: "100%",
      }}>
        {DAYS.map(day => (
          <DayColumn
            key={day.key}
            day={day}
            todos={todos.filter(t => (t.day_of_week ?? 1) === day.key)}
            onAdd={onAdd}
            onToggle={onToggle}
            onDelete={onDelete}
            onUpdate={onUpdate}
          />
        ))}
      </div>
    </div>
  )
}
