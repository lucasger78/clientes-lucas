import { useState } from "react"
import EditableCell from "./EditableCell"
import { calcSaldo, fmt, fmtSigned, totalMonto, totalCobro, totalSaldo } from "../data/helpers"

// ClientTable ahora recibe callbacks directos a Supabase
// onAdd(name), onUpdate(id, newData), onDelete(id)
export default function ClientTable({ title, clients, monthKey, onAdd, onUpdate, onDelete }) {
  const mk = monthKey
  const [newName, setNewName] = useState("")

  const handleCellChange = (client, field, val) => {
    const newData = {
      ...client.data,
      [mk]: { ...client.data[mk], [field]: val }
    }
    onUpdate(client.id, newData)
  }

  const handleAdd = () => {
    const name = newName.trim().toUpperCase()
    if (!name) return
    onAdd(name)
    setNewName("")
  }

  const handleDelete = (id) => {
    if (!window.confirm("¿Eliminar este registro?")) return
    onDelete(id)
  }

  const totM = totalMonto(clients, mk)
  const totC = totalCobro(clients, mk)
  const totS = totalSaldo(clients, mk)

  return (
    <div className="table-section">
      <div className="table-section__header">
        <span className="label-caps">{title}</span>
        <span style={{ fontFamily:"var(--font-mono)", fontSize:11, color:"var(--text-muted)", letterSpacing:1 }}>
          {clients.length} registro{clients.length !== 1 ? "s" : ""}
        </span>
      </div>

      <div className="table-wrapper">
        <table>
          <thead>
            <tr>
              <th style={{ textAlign:"left", color:"var(--text-muted)", minWidth:195 }}>Nombre</th>
              <th style={{ textAlign:"right", color:"var(--text-secondary)" }}>Monto</th>
              <th style={{ textAlign:"right", color:"var(--cyan)", textShadow:"0 0 8px var(--cyan-glow)" }}>Cobros</th>
              <th style={{ textAlign:"right", color:"var(--neon-yellow)", textShadow:"0 0 8px var(--neon-yellow-glow)" }}>Saldo</th>
              <th style={{ textAlign:"center", color:"var(--text-muted)" }}>Estado</th>
              <th style={{ width:36 }}></th>
            </tr>
          </thead>
          <tbody>
            {clients.map(c => {
              const monto = c.data[mk]?.monto || 0
              const cobro = c.data[mk]?.cobro || 0
              const saldo = calcSaldo(c, mk)
              const paid    = saldo === 0 && monto > 0
              const partial = saldo > 0 && cobro > 0
              return (
                <tr key={c.id}>
                  <td style={{ color:"var(--text-primary)", fontFamily:"var(--font-display)", fontWeight:600, letterSpacing:0.3, fontSize:13 }}>
                    {c.name}
                  </td>
                  <td style={{ textAlign:"right", color:"var(--text-secondary)" }}>
                    <EditableCell value={monto} onChange={v => handleCellChange(c, "monto", v)} />
                  </td>
                  <td style={{ textAlign:"right", color:"var(--cyan)" }}>
                    <EditableCell value={cobro} onChange={v => handleCellChange(c, "cobro", v)} />
                  </td>
                  <td style={{ textAlign:"right", fontFamily:"var(--font-mono)", fontSize:13,
                    color: saldo===0 ? "var(--neon-green)" : "var(--neon-yellow)",
                    textShadow: saldo===0 ? "0 0 8px var(--neon-green-glow)" : "0 0 8px var(--neon-yellow-glow)" }}>
                    {fmtSigned(saldo)}
                  </td>
                  <td style={{ textAlign:"center" }}>
                    {monto === 0
                      ? <span style={{ fontSize:10, color:"var(--text-faint)" }}>—</span>
                      : paid    ? <span className="badge badge--paid">✓ Cobrado</span>
                      : partial ? <span className="badge badge--partial">Parcial</span>
                      :           <span className="badge badge--pending">Pendiente</span>
                    }
                  </td>
                  <td style={{ textAlign:"center" }}>
                    <button className="btn-icon" title="Eliminar" onClick={() => handleDelete(c.id)}>×</button>
                  </td>
                </tr>
              )
            })}
          </tbody>
          <tfoot>
            <tr>
              <td style={{ fontFamily:"var(--font-display)", fontSize:10, letterSpacing:2, textTransform:"uppercase", color:"var(--text-muted)", fontWeight:700 }}>
                Total {title}
              </td>
              <td style={{ textAlign:"right", color:"var(--text-secondary)" }}>{fmt(totM)}</td>
              <td style={{ textAlign:"right", color:"var(--cyan)", textShadow:"0 0 8px var(--cyan-glow)" }}>{fmt(totC)}</td>
              <td style={{ textAlign:"right",
                color: totS===0 ? "var(--neon-green)" : "var(--neon-yellow)",
                textShadow: totS===0 ? "0 0 8px var(--neon-green-glow)" : "0 0 8px var(--neon-yellow-glow)" }}>
                {fmtSigned(totS)}
              </td>
              <td colSpan={2}></td>
            </tr>
          </tfoot>
        </table>
      </div>

      {/* Add row */}
      <div className="add-client-form">
        <input
          className="add-client-input"
          placeholder={`+ Agregar ${title === "Clientes" ? "cliente" : "proyecto"}...`}
          value={newName}
          onChange={e => setNewName(e.target.value)}
          onKeyDown={e => e.key === "Enter" && handleAdd()}
        />
        <button className="btn-primary" onClick={handleAdd} style={{ whiteSpace:"nowrap" }}>
          Agregar
        </button>
      </div>
    </div>
  )
}
