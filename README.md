# Lucas · Clientes 2026 🟢

Dashboard de facturación y gestión de clientes — listo para Netlify.

---

## 📁 Estructura del proyecto

```
lucas-clientes-2026/
├── public/
│   └── favicon.svg
├── src/
│   ├── components/
│   │   ├── KPICard.jsx          → Tarjetas de indicadores
│   │   ├── EditableCell.jsx     → Celda editable al hacer clic
│   │   ├── ClientTable.jsx      → Tabla de clientes/proyectos (con agregar/quitar)
│   │   ├── Indicators.jsx       → Gráficos y estadísticas
│   │   ├── CalendarWidget.jsx   → Calendario de cobros + notificaciones
│   │   └── TodoList.jsx         → Lista de tareas con prioridad
│   ├── data/
│   │   ├── initialData.js       → Datos iniciales (clientes, proyectos, etc.)
│   │   └── helpers.js           → Funciones de cálculo y formato
│   ├── styles/
│   │   ├── global.css           → Variables CSS, reset, utilidades
│   │   └── components.css       → Estilos de todos los componentes
│   ├── App.jsx                  → Componente raíz
│   └── main.jsx                 → Entry point React
├── index.html
├── vite.config.js
├── netlify.toml
└── package.json
```

---

## 🚀 Cómo correrlo en VS Code

### 1. Requisitos previos
- [Node.js](https://nodejs.org/) v18 o superior
- [VS Code](https://code.visualstudio.com/)

### 2. Instalar dependencias

Abrí la carpeta del proyecto en VS Code, luego en la terminal integrada (`Ctrl + `` ` ``):

```bash
npm install
```

### 3. Correr en modo desarrollo

```bash
npm run dev
```

Abrí el navegador en → **http://localhost:5173**

---

## 🏗️ Generar el build para producción

```bash
npm run build
```

Esto genera la carpeta `dist/` con todos los archivos optimizados listos para subir.

Para previsualizar el build localmente antes de subir:

```bash
npm run preview
```

---

## ☁️ Deploy en Netlify

### Opción A — Drag & Drop (más rápido)

1. Corré `npm run build` → se genera la carpeta `dist/`
2. Entrá a [app.netlify.com](https://app.netlify.com)
3. Hacé login y en la pantalla principal arrastrá la carpeta **`dist/`** directamente
4. ¡Listo! Netlify te da una URL pública en segundos

---

### Opción B — Conectar con GitHub (recomendado para actualizaciones automáticas)

1. Subí el proyecto a un repositorio de GitHub:
   ```bash
   git init
   git add .
   git commit -m "first commit"
   git remote add origin https://github.com/TU_USUARIO/lucas-clientes-2026.git
   git push -u origin main
   ```

2. En [app.netlify.com](https://app.netlify.com) → **"Add new site"** → **"Import an existing project"**

3. Conectá tu cuenta de GitHub y seleccioná el repositorio

4. Configuración del build (ya está en `netlify.toml`, se autocompleta):
   - **Build command:** `npm run build`
   - **Publish directory:** `dist`

5. Hacé clic en **"Deploy site"**

Cada vez que hagas `git push`, Netlify hace un nuevo deploy automáticamente.

---

## ✏️ Cómo personalizar los datos

Para cambiar clientes, montos o proyectos iniciales editá:

```
src/data/initialData.js
```

Para cambiar el objetivo mensual:

```js
// src/data/initialData.js
export const OBJETIVO_MENSUAL = 2000000  // ← cambiá este valor
```

---

## 💡 Features

| Feature | Descripción |
|---|---|
| **Planilla** | Réplica del Google Sheet. Montos y cobros editables al hacer clic |
| **Agregar/Quitar** | Botón en cada tabla para agregar o eliminar clientes/proyectos |
| **Indicadores** | Gráfico de barras, top clientes, estado de cobros, proyección anual |
| **Calendario** | Recordatorios de cobros con fecha. Notificaciones del navegador |
| **To-Do** | Lista de tareas con prioridad alta/normal/baja |
| **Objetivo** | Barra de progreso y comparación vs objetivo mensual |

---

## 🔧 Extensiones VS Code recomendadas

- **ES7+ React/Redux/React-Native snippets** (`dsznajder.es7-react-js-snippets`)
- **Prettier** (`esbenp.prettier-vscode`)
- **CSS Variables** (`vunguyentuan.vscode-css-variables`)
