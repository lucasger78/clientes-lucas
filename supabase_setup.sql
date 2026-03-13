-- ============================================================
--  SCRIPT SQL — Lucas Clientes 2026
--  Supabase / PostgreSQL
--  Ejecutar en: Supabase > SQL Editor > New Query
-- ============================================================

-- ── 1. CLIENTES (clientes fijos mensuales) ──────────────────
CREATE TABLE IF NOT EXISTS clientes (
  id          BIGSERIAL PRIMARY KEY,
  name        TEXT NOT NULL,
  data        JSONB NOT NULL DEFAULT '{}',
  created_at  TIMESTAMPTZ DEFAULT NOW()
);

-- ── 2. PROYECTOS ────────────────────────────────────────────
CREATE TABLE IF NOT EXISTS proyectos (
  id          BIGSERIAL PRIMARY KEY,
  name        TEXT NOT NULL,
  data        JSONB NOT NULL DEFAULT '{}',
  created_at  TIMESTAMPTZ DEFAULT NOW()
);

-- ── 3. EVENTOS / ALERTAS DE CALENDARIO ──────────────────────
CREATE TABLE IF NOT EXISTS eventos (
  id          BIGSERIAL PRIMARY KEY,
  title       TEXT NOT NULL,
  client      TEXT DEFAULT '',
  date        TEXT NOT NULL,        -- formato 'YYYY-MM-DD'
  amount      TEXT DEFAULT '',
  created_at  TIMESTAMPTZ DEFAULT NOW()
);

-- ── 4. TO-DO LIST ────────────────────────────────────────────
CREATE TABLE IF NOT EXISTS todos (
  id          BIGSERIAL PRIMARY KEY,
  text        TEXT NOT NULL,
  done        BOOLEAN NOT NULL DEFAULT FALSE,
  priority    TEXT NOT NULL DEFAULT 'normal',  -- 'alta' | 'normal' | 'baja'
  created     TEXT DEFAULT '',                 -- fecha legible ej: '10/03/2026'
  created_at  TIMESTAMPTZ DEFAULT NOW()
);

-- ============================================================
--  HABILITAR REALTIME en las 4 tablas
--  (Supabase requiere esto para subscripciones en tiempo real)
-- ============================================================

ALTER PUBLICATION supabase_realtime ADD TABLE clientes;
ALTER PUBLICATION supabase_realtime ADD TABLE proyectos;
ALTER PUBLICATION supabase_realtime ADD TABLE eventos;
ALTER PUBLICATION supabase_realtime ADD TABLE todos;

-- ============================================================
--  POLÍTICAS RLS (Row Level Security)
--  Permitir acceso público con anon key (ajustar según necesidad)
-- ============================================================

ALTER TABLE clientes ENABLE ROW LEVEL SECURITY;
ALTER TABLE proyectos ENABLE ROW LEVEL SECURITY;
ALTER TABLE eventos  ENABLE ROW LEVEL SECURITY;
ALTER TABLE todos    ENABLE ROW LEVEL SECURITY;

-- Política: permitir todo al rol anon (app sin auth)
CREATE POLICY "allow_all_clientes"  ON clientes  FOR ALL TO anon USING (true) WITH CHECK (true);
CREATE POLICY "allow_all_proyectos" ON proyectos FOR ALL TO anon USING (true) WITH CHECK (true);
CREATE POLICY "allow_all_eventos"   ON eventos   FOR ALL TO anon USING (true) WITH CHECK (true);
CREATE POLICY "allow_all_todos"     ON todos     FOR ALL TO anon USING (true) WITH CHECK (true);

-- ============================================================
--  DATOS INICIALES — Clientes
-- ============================================================

INSERT INTO clientes (name, data) VALUES
('+PV',               '{"mar":{"monto":15000,"cobro":15000},"abr":{"monto":15000,"cobro":0},"may":{"monto":15000,"cobro":0},"jun":{"monto":15000,"cobro":0},"jul":{"monto":15000,"cobro":0},"ago":{"monto":15000,"cobro":0},"sep":{"monto":15000,"cobro":0},"oct":{"monto":15000,"cobro":0},"nov":{"monto":15000,"cobro":0},"dic":{"monto":15000,"cobro":0}}'),
('ORENO',             '{"mar":{"monto":15000,"cobro":15000},"abr":{"monto":15000,"cobro":0},"may":{"monto":15000,"cobro":0},"jun":{"monto":15000,"cobro":0},"jul":{"monto":15000,"cobro":0},"ago":{"monto":15000,"cobro":0},"sep":{"monto":15000,"cobro":0},"oct":{"monto":15000,"cobro":0},"nov":{"monto":15000,"cobro":0},"dic":{"monto":15000,"cobro":0}}'),
('DR. MASCARELLO',    '{"mar":{"monto":17000,"cobro":17000},"abr":{"monto":17000,"cobro":0},"may":{"monto":17000,"cobro":0},"jun":{"monto":17000,"cobro":0},"jul":{"monto":17000,"cobro":0},"ago":{"monto":17000,"cobro":0},"sep":{"monto":17000,"cobro":0},"oct":{"monto":17000,"cobro":0},"nov":{"monto":17000,"cobro":0},"dic":{"monto":17000,"cobro":0}}'),
('VC ROMPECABEZAS',   '{"mar":{"monto":45000,"cobro":0},"abr":{"monto":45000,"cobro":0},"may":{"monto":45000,"cobro":0},"jun":{"monto":45000,"cobro":0},"jul":{"monto":45000,"cobro":0},"ago":{"monto":45000,"cobro":0},"sep":{"monto":45000,"cobro":0},"oct":{"monto":45000,"cobro":0},"nov":{"monto":45000,"cobro":0},"dic":{"monto":45000,"cobro":0}}'),
('SAL DE CAMPO',      '{"mar":{"monto":25000,"cobro":0},"abr":{"monto":25000,"cobro":0},"may":{"monto":25000,"cobro":0},"jun":{"monto":25000,"cobro":0},"jul":{"monto":25000,"cobro":0},"ago":{"monto":25000,"cobro":0},"sep":{"monto":25000,"cobro":0},"oct":{"monto":25000,"cobro":0},"nov":{"monto":25000,"cobro":0},"dic":{"monto":25000,"cobro":0}}'),
('SYNAPTX',           '{"mar":{"monto":500000,"cobro":500000},"abr":{"monto":1000000,"cobro":0},"may":{"monto":1000000,"cobro":0},"jun":{"monto":1000000,"cobro":0},"jul":{"monto":1000000,"cobro":0},"ago":{"monto":1000000,"cobro":0},"sep":{"monto":1000000,"cobro":0},"oct":{"monto":1000000,"cobro":0},"nov":{"monto":1000000,"cobro":0},"dic":{"monto":1000000,"cobro":0}}'),
('CALYCON',           '{"mar":{"monto":120000,"cobro":0},"abr":{"monto":120000,"cobro":0},"may":{"monto":120000,"cobro":0},"jun":{"monto":120000,"cobro":0},"jul":{"monto":120000,"cobro":0},"ago":{"monto":120000,"cobro":0},"sep":{"monto":120000,"cobro":0},"oct":{"monto":120000,"cobro":0},"nov":{"monto":120000,"cobro":0},"dic":{"monto":120000,"cobro":0}}'),
('ACCME',             '{"mar":{"monto":300000,"cobro":0},"abr":{"monto":100000,"cobro":0},"may":{"monto":100000,"cobro":0},"jun":{"monto":100000,"cobro":0},"jul":{"monto":100000,"cobro":0},"ago":{"monto":100000,"cobro":0},"sep":{"monto":100000,"cobro":0},"oct":{"monto":100000,"cobro":0},"nov":{"monto":100000,"cobro":0},"dic":{"monto":100000,"cobro":0}}'),
('LUCY (COSAS RICAS)','{"mar":{"monto":80000,"cobro":0},"abr":{"monto":80000,"cobro":0},"may":{"monto":80000,"cobro":0},"jun":{"monto":80000,"cobro":0},"jul":{"monto":80000,"cobro":0},"ago":{"monto":80000,"cobro":0},"sep":{"monto":80000,"cobro":0},"oct":{"monto":80000,"cobro":0},"nov":{"monto":80000,"cobro":0},"dic":{"monto":80000,"cobro":0}}'),
('EL PROGRESO',       '{"mar":{"monto":120000,"cobro":120000},"abr":{"monto":120000,"cobro":0},"may":{"monto":120000,"cobro":0},"jun":{"monto":120000,"cobro":0},"jul":{"monto":120000,"cobro":0},"ago":{"monto":120000,"cobro":0},"sep":{"monto":120000,"cobro":0},"oct":{"monto":120000,"cobro":0},"nov":{"monto":120000,"cobro":0},"dic":{"monto":120000,"cobro":0}}'),
('ELITE',             '{"mar":{"monto":100000,"cobro":100000},"abr":{"monto":100000,"cobro":0},"may":{"monto":100000,"cobro":0},"jun":{"monto":100000,"cobro":0},"jul":{"monto":100000,"cobro":0},"ago":{"monto":100000,"cobro":0},"sep":{"monto":100000,"cobro":0},"oct":{"monto":100000,"cobro":0},"nov":{"monto":100000,"cobro":0},"dic":{"monto":100000,"cobro":0}}'),
('MATIAS GALLO',      '{"mar":{"monto":150000,"cobro":0},"abr":{"monto":150000,"cobro":0},"may":{"monto":150000,"cobro":0},"jun":{"monto":150000,"cobro":0},"jul":{"monto":150000,"cobro":0},"ago":{"monto":150000,"cobro":0},"sep":{"monto":150000,"cobro":0},"oct":{"monto":150000,"cobro":0},"nov":{"monto":150000,"cobro":0},"dic":{"monto":150000,"cobro":0}}'),
('LEONARDI GLOBAL',   '{"mar":{"monto":0,"cobro":0},"abr":{"monto":0,"cobro":0},"may":{"monto":0,"cobro":0},"jun":{"monto":0,"cobro":0},"jul":{"monto":0,"cobro":0},"ago":{"monto":0,"cobro":0},"sep":{"monto":0,"cobro":0},"oct":{"monto":0,"cobro":0},"nov":{"monto":0,"cobro":0},"dic":{"monto":0,"cobro":0}}'),
('DURITO CASA POTRERO','{"mar":{"monto":0,"cobro":0},"abr":{"monto":0,"cobro":0},"may":{"monto":0,"cobro":0},"jun":{"monto":0,"cobro":0},"jul":{"monto":0,"cobro":0},"ago":{"monto":0,"cobro":0},"sep":{"monto":0,"cobro":0},"oct":{"monto":0,"cobro":0},"nov":{"monto":0,"cobro":0},"dic":{"monto":0,"cobro":0}}'),
('EVENTUALES FACEBOOK','{"mar":{"monto":30000,"cobro":30000},"abr":{"monto":0,"cobro":0},"may":{"monto":0,"cobro":0},"jun":{"monto":0,"cobro":0},"jul":{"monto":0,"cobro":0},"ago":{"monto":0,"cobro":0},"sep":{"monto":0,"cobro":0},"oct":{"monto":0,"cobro":0},"nov":{"monto":0,"cobro":0},"dic":{"monto":0,"cobro":0}}');

-- ── Datos iniciales — Proyectos ──────────────────────────────
INSERT INTO proyectos (name, data) VALUES
('PROYECTOS EXTRAS',  '{"mar":{"monto":0,"cobro":0},"abr":{"monto":0,"cobro":0},"may":{"monto":0,"cobro":0},"jun":{"monto":0,"cobro":0},"jul":{"monto":0,"cobro":0},"ago":{"monto":0,"cobro":0},"sep":{"monto":0,"cobro":0},"oct":{"monto":0,"cobro":0},"nov":{"monto":0,"cobro":0},"dic":{"monto":0,"cobro":0}}'),
('CALYCON FORMULARIO','{"mar":{"monto":200000,"cobro":0},"abr":{"monto":0,"cobro":0},"may":{"monto":0,"cobro":0},"jun":{"monto":0,"cobro":0},"jul":{"monto":0,"cobro":0},"ago":{"monto":0,"cobro":0},"sep":{"monto":0,"cobro":0},"oct":{"monto":0,"cobro":0},"nov":{"monto":0,"cobro":0},"dic":{"monto":0,"cobro":0}}'),
('SAL DE CAMPO IVAN', '{"mar":{"monto":0,"cobro":0},"abr":{"monto":0,"cobro":0},"may":{"monto":0,"cobro":0},"jun":{"monto":0,"cobro":0},"jul":{"monto":0,"cobro":0},"ago":{"monto":0,"cobro":0},"sep":{"monto":0,"cobro":0},"oct":{"monto":0,"cobro":0},"nov":{"monto":0,"cobro":0},"dic":{"monto":0,"cobro":0}}'),
('LUCY APP',          '{"mar":{"monto":0,"cobro":0},"abr":{"monto":0,"cobro":0},"may":{"monto":0,"cobro":0},"jun":{"monto":0,"cobro":0},"jul":{"monto":0,"cobro":0},"ago":{"monto":0,"cobro":0},"sep":{"monto":0,"cobro":0},"oct":{"monto":0,"cobro":0},"nov":{"monto":0,"cobro":0},"dic":{"monto":0,"cobro":0}}'),
('JASFLY',            '{"mar":{"monto":0,"cobro":0},"abr":{"monto":0,"cobro":0},"may":{"monto":0,"cobro":0},"jun":{"monto":0,"cobro":0},"jul":{"monto":0,"cobro":0},"ago":{"monto":0,"cobro":0},"sep":{"monto":0,"cobro":0},"oct":{"monto":0,"cobro":0},"nov":{"monto":0,"cobro":0},"dic":{"monto":0,"cobro":0}}'),
('LEONARDI GLOBAL',   '{"mar":{"monto":0,"cobro":0},"abr":{"monto":0,"cobro":0},"may":{"monto":0,"cobro":0},"jun":{"monto":0,"cobro":0},"jul":{"monto":0,"cobro":0},"ago":{"monto":0,"cobro":0},"sep":{"monto":0,"cobro":0},"oct":{"monto":0,"cobro":0},"nov":{"monto":0,"cobro":0},"dic":{"monto":0,"cobro":0}}'),
('PROTECTORES',       '{"mar":{"monto":300000,"cobro":0},"abr":{"monto":300000,"cobro":0},"may":{"monto":0,"cobro":0},"jun":{"monto":0,"cobro":0},"jul":{"monto":0,"cobro":0},"ago":{"monto":0,"cobro":0},"sep":{"monto":0,"cobro":0},"oct":{"monto":0,"cobro":0},"nov":{"monto":0,"cobro":0},"dic":{"monto":0,"cobro":0}}');

-- ── Datos iniciales — Eventos ────────────────────────────────
INSERT INTO eventos (title, client, date, amount) VALUES
('Cobro mensual SYNAPTX',    'SYNAPTX',         '2026-03-15', '500000'),
('Cobro CALYCON FORMULARIO', 'CALYCON',         '2026-03-20', '200000'),
('Cobro VC ROMPECABEZAS',    'VC ROMPECABEZAS', '2026-04-05', '45000');

-- ── Datos iniciales — Todos ──────────────────────────────────
INSERT INTO todos (text, done, priority, created) VALUES
('Llamar a SAL DE CAMPO para confirmar pago', false, 'alta',   '10/03/2026'),
('Enviar factura a CALYCON FORMULARIO',        false, 'alta',   '10/03/2026'),
('Seguimiento LUCY APP',                       true,  'normal', '09/03/2026');

-- ============================================================
--  FIN DEL SCRIPT
-- ============================================================
