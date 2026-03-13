// ============================================
//  DATA — Clientes Lucas 2026
// ============================================

export const MONTHS = [
  "MARZO","ABRIL","MAYO","JUNIO","JULIO",
  "AGOSTO","SEPTIEMBRE","OCTUBRE","NOVIEMBRE","DICIEMBRE"
]

export const MONTH_KEYS = [
  "mar","abr","may","jun","jul","ago","sep","oct","nov","dic"
]

export const OBJETIVO_MENSUAL = 2000000

// Empty month data template
export const emptyMonths = () =>
  Object.fromEntries(MONTH_KEYS.map(k => [k, { monto: 0, cobro: 0 }]))

// ---- CLIENTES FIJOS (ahora llamados "Clientes") ----
export const initialClientes = [
  { id: 1,  name: "+PV",                 data: { mar:{monto:15000,cobro:15000}, abr:{monto:15000,cobro:0}, may:{monto:15000,cobro:0}, jun:{monto:15000,cobro:0}, jul:{monto:15000,cobro:0}, ago:{monto:15000,cobro:0}, sep:{monto:15000,cobro:0}, oct:{monto:15000,cobro:0}, nov:{monto:15000,cobro:0}, dic:{monto:15000,cobro:0} } },
  { id: 2,  name: "ORENO",               data: { mar:{monto:15000,cobro:15000}, abr:{monto:15000,cobro:0}, may:{monto:15000,cobro:0}, jun:{monto:15000,cobro:0}, jul:{monto:15000,cobro:0}, ago:{monto:15000,cobro:0}, sep:{monto:15000,cobro:0}, oct:{monto:15000,cobro:0}, nov:{monto:15000,cobro:0}, dic:{monto:15000,cobro:0} } },
  { id: 3,  name: "DR. MASCARELLO",      data: { mar:{monto:17000,cobro:17000}, abr:{monto:17000,cobro:0}, may:{monto:17000,cobro:0}, jun:{monto:17000,cobro:0}, jul:{monto:17000,cobro:0}, ago:{monto:17000,cobro:0}, sep:{monto:17000,cobro:0}, oct:{monto:17000,cobro:0}, nov:{monto:17000,cobro:0}, dic:{monto:17000,cobro:0} } },
  { id: 4,  name: "VC ROMPECABEZAS",     data: { mar:{monto:45000,cobro:0},     abr:{monto:45000,cobro:0}, may:{monto:45000,cobro:0}, jun:{monto:45000,cobro:0}, jul:{monto:45000,cobro:0}, ago:{monto:45000,cobro:0}, sep:{monto:45000,cobro:0}, oct:{monto:45000,cobro:0}, nov:{monto:45000,cobro:0}, dic:{monto:45000,cobro:0} } },
  { id: 5,  name: "SAL DE CAMPO",        data: { mar:{monto:25000,cobro:0},     abr:{monto:25000,cobro:0}, may:{monto:25000,cobro:0}, jun:{monto:25000,cobro:0}, jul:{monto:25000,cobro:0}, ago:{monto:25000,cobro:0}, sep:{monto:25000,cobro:0}, oct:{monto:25000,cobro:0}, nov:{monto:25000,cobro:0}, dic:{monto:25000,cobro:0} } },
  { id: 6,  name: "SYNAPTX",             data: { mar:{monto:500000,cobro:500000},abr:{monto:1000000,cobro:0},may:{monto:1000000,cobro:0},jun:{monto:1000000,cobro:0},jul:{monto:1000000,cobro:0},ago:{monto:1000000,cobro:0},sep:{monto:1000000,cobro:0},oct:{monto:1000000,cobro:0},nov:{monto:1000000,cobro:0},dic:{monto:1000000,cobro:0} } },
  { id: 7,  name: "CALYCON",             data: { mar:{monto:120000,cobro:0},    abr:{monto:120000,cobro:0}, may:{monto:120000,cobro:0}, jun:{monto:120000,cobro:0}, jul:{monto:120000,cobro:0}, ago:{monto:120000,cobro:0}, sep:{monto:120000,cobro:0}, oct:{monto:120000,cobro:0}, nov:{monto:120000,cobro:0}, dic:{monto:120000,cobro:0} } },
  { id: 8,  name: "ACCME",               data: { mar:{monto:300000,cobro:0},    abr:{monto:100000,cobro:0}, may:{monto:100000,cobro:0}, jun:{monto:100000,cobro:0}, jul:{monto:100000,cobro:0}, ago:{monto:100000,cobro:0}, sep:{monto:100000,cobro:0}, oct:{monto:100000,cobro:0}, nov:{monto:100000,cobro:0}, dic:{monto:100000,cobro:0} } },
  { id: 9,  name: "LUCY (COSAS RICAS)",  data: { mar:{monto:80000,cobro:0},     abr:{monto:80000,cobro:0},  may:{monto:80000,cobro:0},  jun:{monto:80000,cobro:0},  jul:{monto:80000,cobro:0},  ago:{monto:80000,cobro:0},  sep:{monto:80000,cobro:0},  oct:{monto:80000,cobro:0},  nov:{monto:80000,cobro:0},  dic:{monto:80000,cobro:0} } },
  { id: 10, name: "EL PROGRESO",         data: { mar:{monto:120000,cobro:120000},abr:{monto:120000,cobro:0},may:{monto:120000,cobro:0},jun:{monto:120000,cobro:0},jul:{monto:120000,cobro:0},ago:{monto:120000,cobro:0},sep:{monto:120000,cobro:0},oct:{monto:120000,cobro:0},nov:{monto:120000,cobro:0},dic:{monto:120000,cobro:0} } },
  { id: 11, name: "ELITE",               data: { mar:{monto:100000,cobro:100000},abr:{monto:100000,cobro:0},may:{monto:100000,cobro:0},jun:{monto:100000,cobro:0},jul:{monto:100000,cobro:0},ago:{monto:100000,cobro:0},sep:{monto:100000,cobro:0},oct:{monto:100000,cobro:0},nov:{monto:100000,cobro:0},dic:{monto:100000,cobro:0} } },
  { id: 12, name: "MATIAS GALLO",        data: { mar:{monto:150000,cobro:0},    abr:{monto:150000,cobro:0}, may:{monto:150000,cobro:0}, jun:{monto:150000,cobro:0}, jul:{monto:150000,cobro:0}, ago:{monto:150000,cobro:0}, sep:{monto:150000,cobro:0}, oct:{monto:150000,cobro:0}, nov:{monto:150000,cobro:0}, dic:{monto:150000,cobro:0} } },
  { id: 13, name: "LEONARDI GLOBAL",     data: emptyMonths() },
  { id: 14, name: "DURITO CASA POTRERO", data: emptyMonths() },
  { id: 15, name: "EVENTUALES FACEBOOK", data: { mar:{monto:30000,cobro:30000}, abr:{monto:0,cobro:0}, may:{monto:0,cobro:0}, jun:{monto:0,cobro:0}, jul:{monto:0,cobro:0}, ago:{monto:0,cobro:0}, sep:{monto:0,cobro:0}, oct:{monto:0,cobro:0}, nov:{monto:0,cobro:0}, dic:{monto:0,cobro:0} } },
]

// ---- PROYECTOS ----
export const initialProyectos = [
  { id: 101, name: "PROYECTOS EXTRAS",   data: emptyMonths() },
  { id: 102, name: "CALYCON FORMULARIO", data: { mar:{monto:200000,cobro:0}, abr:{monto:0,cobro:0}, may:{monto:0,cobro:0}, jun:{monto:0,cobro:0}, jul:{monto:0,cobro:0}, ago:{monto:0,cobro:0}, sep:{monto:0,cobro:0}, oct:{monto:0,cobro:0}, nov:{monto:0,cobro:0}, dic:{monto:0,cobro:0} } },
  { id: 103, name: "SAL DE CAMPO IVAN",  data: emptyMonths() },
  { id: 104, name: "LUCY APP",           data: emptyMonths() },
  { id: 105, name: "JASFLY",             data: emptyMonths() },
  { id: 106, name: "LEONARDI GLOBAL",    data: emptyMonths() },
  { id: 107, name: "PROTECTORES",        data: { mar:{monto:300000,cobro:0}, abr:{monto:300000,cobro:0}, may:{monto:0,cobro:0}, jun:{monto:0,cobro:0}, jul:{monto:0,cobro:0}, ago:{monto:0,cobro:0}, sep:{monto:0,cobro:0}, oct:{monto:0,cobro:0}, nov:{monto:0,cobro:0}, dic:{monto:0,cobro:0} } },
]

// ---- INITIAL CALENDAR EVENTS ----
export const initialEvents = [
  { id: 1, title: "Cobro mensual SYNAPTX",      client: "SYNAPTX",          date: "2026-03-15", amount: "500000" },
  { id: 2, title: "Cobro CALYCON FORMULARIO",   client: "CALYCON",          date: "2026-03-20", amount: "200000" },
  { id: 3, title: "Cobro VC ROMPECABEZAS",      client: "VC ROMPECABEZAS",  date: "2026-04-05", amount: "45000"  },
]

// ---- INITIAL TODOS ----
export const initialTodos = [
  { id: 1, text: "Llamar a SAL DE CAMPO para confirmar pago", done: false, priority: "alta",   created: "10/03/2026" },
  { id: 2, text: "Enviar factura a CALYCON FORMULARIO",        done: false, priority: "alta",   created: "10/03/2026" },
  { id: 3, text: "Seguimiento LUCY APP",                       done: true,  priority: "normal", created: "09/03/2026" },
]
