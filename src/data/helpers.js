// ============================================
//  HELPERS — format & calc utils
// ============================================

export const fmt = (n) =>
  n === 0 ? "$0" : `$${Math.abs(n).toLocaleString("es-AR")}`

export const fmtSigned = (n) => {
  if (n === 0) return "$0"
  return (n < 0 ? "-" : "+") + `$${Math.abs(n).toLocaleString("es-AR")}`
}

export const calcSaldo = (client, mk) =>
  (client.data[mk]?.monto || 0) - (client.data[mk]?.cobro || 0)

export const totalMonto = (clients, mk) =>
  clients.reduce((s, c) => s + (c.data[mk]?.monto || 0), 0)

export const totalCobro = (clients, mk) =>
  clients.reduce((s, c) => s + (c.data[mk]?.cobro || 0), 0)

export const totalSaldo = (clients, mk) =>
  clients.reduce((s, c) => s + calcSaldo(c, mk), 0)

export const PRIORITY_COLORS = {
  alta:   "#ef4444",
  normal: "#f59e0b",
  baja:   "#4ade80",
}
