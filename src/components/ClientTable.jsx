import { useState } from "react"
import Swal from "sweetalert2"
import EditableCell from "./EditableCell"
import { calcSaldo, fmt, fmtSigned, totalMonto, totalCobro, totalSaldo } from "../data/helpers"
import { MONTH_KEYS, MONTHS } from "../data/initialData"

// forwardKeys: claves de meses desde el mes activo en adelante (sin pasados)
// ClientTable ahora recibe callbacks directos a Supabase
// onAdd(name, scope, forwardKeys), onUpdate(id, newData), onDelete(id, scope, forwardKeys)
export default function ClientTable({
  title, clients, monthKey, selectedMonthIndex,
  onAdd, onUpdate, onDelete
}) {
  const mk = monthKey
  const [newName, setNewName] = useState("")

  // Meses desde el activo en adelante (sin meses pasados)
  const forwardKeys = MONTH_KEYS.slice(selectedMonthIndex)

  // Solo mostrar clientes/proyectos que existen en este mes
  const activeClients = clients.filter(c => c.data[mk] !== null && c.data[mk] !== undefined)

  const handleCellChange = (client, field, val) => {
    const newData = {
      ...client.data,
      [mk]: { ...client.data[mk], [field]: val }
    }
    onUpdate(client.id, newData)
  }

  const handleAdd = async () => {
    const name = newName.trim().toUpperCase()
    if (!name) return

    const currentMonthLabel = MONTHS[selectedMonthIndex]
    const isLastMonth = selectedMonthIndex === MONTH_KEYS.length - 1

    // Si es el último mes no tiene sentido preguntar "en adelante"
    if (isLastMonth) {
      onAdd(name, 'this', forwardKeys)
      setNewName("")
      return
    }

    const result = await Swal.fire({
      title: `¿Agregar "${name}"?`,
      html: `
        <div style="font-family: 'Rajdhani', sans-serif; font-size: 14px; color: #94a3b8; line-height: 1.6; margin-top: 4px;">
          ¿En qué meses querés que aparezca este ${title === "Clientes" ? "cliente" : "proyecto"}?
        </div>
      `,
      icon: 'question',
      showCancelButton: true,
      showDenyButton: true,
      confirmButtonText: `📅 Solo ${currentMonthLabel}`,
      denyButtonText: `🗓️ ${currentMonthLabel} en adelante`,
      cancelButtonText: 'Cancelar',
      background: '#0f172a',
      color: '#e2e8f0',
      confirmButtonColor: '#0ea5e9',
      denyButtonColor: '#7c3aed',
      cancelButtonColor: '#475569',
      customClass: {
        popup: 'swal-custom-popup',
        title: 'swal-custom-title',
        confirmButton: 'swal-btn-confirm',
        denyButton: 'swal-btn-deny',
        cancelButton: 'swal-btn-cancel',
      }
    })

    if (result.isConfirmed) {
      onAdd(name, 'this', forwardKeys)
      setNewName("")
    } else if (result.isDenied) {
      onAdd(name, 'forward', forwardKeys)
      setNewName("")
    }
    // Si canceló no hace nada
  }

  const handleDelete = async (id, clientName) => {
    const currentMonthLabel = MONTHS[selectedMonthIndex]
    const isLastMonth = selectedMonthIndex === MONTH_KEYS.length - 1

    if (isLastMonth) {
      const confirm = await Swal.fire({
        title: `¿Eliminar "${clientName}"?`,
        text: `Se eliminará de ${currentMonthLabel}.`,
        icon: 'warning',
        showCancelButton: true,
        confirmButtonText: 'Sí, eliminar',
        cancelButtonText: 'Cancelar',
        background: '#0f172a',
        color: '#e2e8f0',
        confirmButtonColor: '#ef4444',
        cancelButtonColor: '#475569',
      })
      if (confirm.isConfirmed) onDelete(id, 'this', forwardKeys)
      return
    }

    const result = await Swal.fire({
      title: `¿Eliminar "${clientName}"?`,
      html: `
        <div style="font-family: 'Rajdhani', sans-serif; font-size: 14px; color: #94a3b8; line-height: 1.6; margin-top: 4px;">
          Elegí desde qué meses querés eliminar este ${title === "Clientes" ? "cliente" : "proyecto"}.<br/>
          <span style="color:#fbbf24; font-size:12px;">⚠ Los meses anteriores a ${currentMonthLabel} no se modifican.</span>
        </div>
      `,
      icon: 'warning',
      showCancelButton: true,
      showDenyButton: true,
      confirmButtonText: `🗑 Solo ${currentMonthLabel}`,
      denyButtonText: `🗑 ${currentMonthLabel} en adelante`,
      cancelButtonText: 'Cancelar',
      background: '#0f172a',
      color: '#e2e8f0',
      confirmButtonColor: '#ef4444',
      denyButtonColor: '#dc2626',
      cancelButtonColor: '#475569',
      customClass: {
        popup: 'swal-custom-popup',
        title: 'swal-custom-title',
      }
    })

    if (result.isConfirmed) {
      onDelete(id, 'this', forwardKeys)
    } else if (result.isDenied) {
      onDelete(id, 'forward', forwardKeys)
    }
  }

  const totM = totalMonto(activeClients, mk)
  const totC = totalCobro(activeClients, mk)
  const totS = totalSaldo(activeClients, mk)

  return (
    <div className="table-section">
      <div className="table-section__header">
        <span className="label-caps">{title}</span>
        <span style={{ fontFamily:"var(--font-mono)", fontSize:11, color:"var(--text-muted)", letterSpacing:1 }}>
          {activeClients.length} registro{activeClients.length !== 1 ? "s" : ""}
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
            {activeClients.map(c => {
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
                    <button className="btn-icon" title="Eliminar" onClick={() => handleDelete(c.id, c.name)}>×</button>
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
