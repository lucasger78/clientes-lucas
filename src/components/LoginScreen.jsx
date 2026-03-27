import { useState } from 'react'

export default function LoginScreen({ onLogin, error, setError }) {
  const [dni,     setDni]     = useState('')
  const [shaking, setShaking] = useState(false)

  const handleSubmit = (e) => {
    e.preventDefault()
    const ok = onLogin(dni)
    if (!ok) {
      setShaking(true)
      setTimeout(() => setShaking(false), 500)
    }
  }

  const handleDniChange = (e) => {
    setDni(e.target.value.replace(/\D/g, '').slice(0, 10))
    if (error) setError('')
  }

  return (
    <div style={{
      minHeight: '100vh',
      display: 'grid',
      gridTemplateColumns: '60% 40%',
      position: 'relative',
      overflow: 'hidden',
      backgroundColor: 'var(--bg-base)',
    }}>
      <style>{`
        @keyframes fadeUp  { from{opacity:0;transform:translateY(20px)} to{opacity:1;transform:translateY(0)} }
        @keyframes shake   { 0%,100%{transform:translateX(0)} 20%{transform:translateX(-8px)} 40%{transform:translateX(8px)} 60%{transform:translateX(-5px)} 80%{transform:translateX(5px)} }
        @keyframes scanline{ from{top:-6%} to{top:106%} }
        @keyframes scanline2{ from{top:-6%} to{top:106%} }
        @keyframes glitch  { 0%,89%,100%{clip-path:none;transform:none} 90%{clip-path:inset(18% 0 62% 0);transform:translateX(-5px);color:#ff3366} 93%{clip-path:inset(68% 0 8% 0);transform:translateX(5px);color:#00d4ff} 96%{clip-path:none;transform:none} }
        @keyframes pulseBorder { 0%,100%{box-shadow:0 0 0 0 rgba(0,212,255,0.5)} 50%{box-shadow:0 0 0 7px rgba(0,212,255,0)} }
        @keyframes photoIn { from{opacity:0;transform:scale(1.04)} to{opacity:1;transform:scale(1)} }

        .l-title   { animation: fadeUp 0.55s ease both; }
        .l-title-2 { animation: fadeUp 0.55s ease 0.12s both; }
        .l-form    { animation: fadeUp 0.6s ease 0.3s both; }
        .l-users   { animation: fadeUp 0.6s ease 0.5s both; }
        .l-photo   { animation: photoIn 1.1s ease both; }
        .l-form.shake { animation: shake 0.45s ease !important; }

        .dni-input {
          width:100%; background:rgba(0,212,255,0.04);
          border:1px solid rgba(0,212,255,0.22); color:#fff;
          padding:15px 18px; border-radius:10px;
          font-family:'Share Tech Mono',monospace; font-size:22px;
          letter-spacing:6px; text-align:center; outline:none;
          transition:all 0.2s; box-sizing:border-box;
        }
        .dni-input:focus {
          border-color:#00d4ff;
          background:rgba(0,212,255,0.07);
          box-shadow:0 0 22px rgba(0,212,255,0.18), inset 0 0 16px rgba(0,212,255,0.04);
        }
        .dni-input.err { border-color:#ff3366; box-shadow:0 0 18px rgba(255,51,102,0.25); }
        .dni-input::placeholder { color:rgba(255,255,255,0.14); font-size:14px; letter-spacing:2px; }

        .btn-login {
          width:100%; padding:14px; border-radius:10px; margin-top:10px;
          border:1px solid rgba(0,102,255,0.5);
          background:linear-gradient(135deg,#0066ff,rgba(0,102,255,0.6));
          color:#fff; font-family:'Exo 2',sans-serif; font-size:13px;
          font-weight:800; letter-spacing:4px; text-transform:uppercase;
          cursor:pointer; transition:all 0.22s;
          box-shadow:0 0 18px rgba(0,102,255,0.22);
          box-sizing:border-box;
        }
        .btn-login:hover {
          background:linear-gradient(135deg,#0077ff,#00d4ff);
          box-shadow:0 0 28px rgba(0,212,255,0.32);
          transform:translateY(-2px); letter-spacing:5px;
        }
        .user-pill {
          display:flex; align-items:center; gap:10px;
          padding:8px 13px; border-radius:50px;
          border:1px solid rgba(255,255,255,0.07);
          background:rgba(255,255,255,0.025);
          transition:all 0.18s;
        }
        .user-pill:hover { border-color:rgba(0,212,255,0.28); background:rgba(0,212,255,0.04); }
      `}</style>

      {/* ════════════ LEFT — login panel ════════════ */}
      <div style={{
        display:'flex', flexDirection:'column', justifyContent:'center',
        padding:'56px 52px', position:'relative', zIndex:2,
        backgroundImage:
          'linear-gradient(rgba(255,255,255,0.035) 1px, transparent 1px),' +
          'linear-gradient(90deg, rgba(255,255,255,0.035) 1px, transparent 1px)',
        backgroundSize:'40px 40px',
        backgroundColor:'var(--bg-base)',
      }}>
        {/* top accent */}
        <div style={{ position:'absolute', top:0, left:0, right:0, height:2, background:'linear-gradient(90deg,transparent,var(--cyan),var(--blue-electric),transparent)', boxShadow:'0 0 10px var(--cyan-glow)' }} />

        {/* Logo badge */}
        <div style={{ marginBottom:44 }}>
          <div style={{ display:'flex', alignItems:'center', gap:13 }}>
            <div style={{
              width:42, height:42, border:'1.5px solid var(--cyan)', borderRadius:10,
              display:'flex', alignItems:'center', justifyContent:'center',
              fontFamily:"'Exo 2',sans-serif", fontWeight:900, fontSize:15, color:'var(--cyan)',
              boxShadow:'0 0 14px var(--cyan-glow), inset 0 0 14px rgba(0,212,255,0.06)',
              animation:'pulseBorder 3s ease infinite', flexShrink:0,
            }}>LC</div>
            <div>
              <div style={{ fontFamily:"'Share Tech Mono',monospace", fontSize:9, letterSpacing:3, color:'var(--text-muted)', textTransform:'uppercase' }}>Sistema de gestión</div>
              <div style={{ fontFamily:"'Exo 2',sans-serif", fontSize:12, fontWeight:700, color:'var(--text-secondary)', letterSpacing:1 }}>CLIENTES 2026</div>
            </div>
          </div>
        </div>

        {/* Título */}
        <div style={{ marginBottom:38 }}>
          <div className="l-title" style={{ fontFamily:"'Exo 2',sans-serif", fontWeight:900, fontSize:58, lineHeight:1, letterSpacing:-2, animation:'glitch 9s ease infinite' }}>
            <span style={{ color:'#fff' }}>LU</span><span style={{ color:'var(--cyan)', textShadow:'0 0 18px var(--cyan-glow)' }}>C</span><span style={{ color:'#fff' }}>AS</span>
          </div>
          <div className="l-title-2" style={{ fontFamily:"'Exo 2',sans-serif", fontWeight:900, fontSize:58, lineHeight:1, letterSpacing:-2 }}>
            <span style={{ color:'rgba(255,255,255,0.28)' }}>CON</span><span style={{ color:'#ff3366', textShadow:'0 0 14px rgba(255,51,102,0.5)' }}>TI</span>
          </div>
          <div style={{ fontFamily:"'Share Tech Mono',monospace", fontSize:10, letterSpacing:5, color:'var(--text-muted)', marginTop:10 }}>
            · · · ACCESO RESTRINGIDO · · ·
          </div>
        </div>

        {/* Form */}
        <form onSubmit={handleSubmit}>
          <div className={`l-form ${shaking ? 'shake' : ''}`}>
            <div style={{ fontFamily:"'Exo 2',sans-serif", fontSize:10, letterSpacing:3, color:'var(--cyan)', textTransform:'uppercase', marginBottom:10, textShadow:'0 0 10px var(--cyan-glow)' }}>
              // Ingresá tu DNI
            </div>
            <input
              className={`dni-input${error ? ' err' : ''}`}
              type="text" inputMode="numeric"
              placeholder="00000000"
              value={dni} onChange={handleDniChange} autoFocus
            />
            <div style={{ height:30, display:'flex', alignItems:'center' }}>
              {error && <div style={{ fontFamily:"'Exo 2',sans-serif", fontSize:11, color:'#ff3366', textShadow:'0 0 8px rgba(255,51,102,0.4)', letterSpacing:0.5, animation:'fadeUp 0.3s ease' }}>⚠ {error}</div>}
            </div>
            <button className="btn-login" type="submit">Ingresar al Dashboard</button>
          </div>
        </form>

        {/* Usuarios */}
        <div className="l-users" style={{ marginTop:40 }}>
          <div style={{ fontFamily:"'Share Tech Mono',monospace", fontSize:9, letterSpacing:3, color:'var(--text-muted)', textTransform:'uppercase', marginBottom:10, borderBottom:'1px solid rgba(0,212,255,0.1)', paddingBottom:8 }}>
            Usuarios autorizados
          </div>
          <div style={{ display:'flex', flexDirection:'column', gap:8 }}>
            {[
              { name:'Lucas Conti', dni:'26.469.376', role:'Admin',  color:'#00d4ff', initials:'LC' },
              { name:'Majo Reyes',  dni:'28.273.545', role:'Viewer', color:'#ff3366', initials:'MR' },
            ].map(u => (
              <div key={u.dni} className="user-pill">
                <div style={{ width:30, height:30, borderRadius:'50%', background:`${u.color}18`, border:`1px solid ${u.color}45`, display:'flex', alignItems:'center', justifyContent:'center', fontFamily:"'Exo 2',sans-serif", fontWeight:900, fontSize:10, color:u.color, flexShrink:0 }}>{u.initials}</div>
                <div style={{ flex:1 }}>
                  <div style={{ fontFamily:"'Exo 2',sans-serif", fontSize:13, fontWeight:700, color:'var(--text-primary)' }}>{u.name}</div>
                  {/* <div style={{ fontFamily:"'Share Tech Mono',monospace", fontSize:10, color:'var(--text-muted)' }}>DNI {u.dni}</div> */}
                </div>
                <div style={{ fontFamily:"'Exo 2',sans-serif", fontSize:9, fontWeight:700, padding:'3px 10px', borderRadius:20, border:`1px solid ${u.color}35`, background:`${u.color}10`, color:u.color, letterSpacing:1, textTransform:'uppercase' }}>{u.role}</div>
              </div>
            ))}
          </div>
        </div>

        <div style={{ marginTop:'auto', paddingTop:36, fontFamily:"'Share Tech Mono',monospace", fontSize:9, color:'var(--text-faint)', letterSpacing:2 }}>
          © 2026 · LUCAS CONTI · SISTEMA PRIVADO
        </div>

        {/* Separador neon derecho */}
       <div style={{ 
          position:'absolute', top:0, bottom:0, 
          right:'-1px',   // ← se sale 1px del panel, solapa exacto con el borde de la foto
          width:1, 
          background:'linear-gradient(to bottom,transparent,var(--cyan) 30%,var(--blue-electric) 70%,transparent)', 
          boxShadow:'0 0 16px var(--cyan-glow)' 
        }} />

        </div>

      {/* ════════════ RIGHT — foto estilo portfolio ════════════ */}
      <div className="l-photo" style={{
        position:'relative',
        overflow:'hidden',
      }}>
        {/* La foto ocupa TODO el panel, recortada igual que en el portfolio */}
        <div style={{
            position:'absolute', inset:0,
            backgroundImage:'url(/lucas-profile.png)',
            backgroundSize:'95%',              // ← más chica que cover
            backgroundRepeat:'no-repeat',
            backgroundPosition:'right 15%',   // ← pegada a la derecha, cara arriba
            transform:'rotate(3deg) scale(1.05)',  // ← leve inclinación, scale para no ver bordes blancos
            transformOrigin:'center center',
            filter:'grayscale(15%) contrast(1.05)',
          }} />

        {/* Cuadrillé encima de la foto — sutil */}
        <div style={{
          position:'absolute', inset:0, zIndex:1,
          backgroundImage:
            'linear-gradient(rgba(255,255,255,0.025) 1px, transparent 1px),' +
            'linear-gradient(90deg, rgba(255,255,255,0.025) 1px, transparent 1px)',
          backgroundSize:'40px 40px',
        }} />

        {/* Gradiente izquierdo — fusiona con el panel login */}
        <div style={{ position:'absolute', inset:0, zIndex:2, background:'linear-gradient(to right, var(--bg-base) 0%, rgba(5,5,8,0.3) 25%, transparent 50%)' }} />

        {/* Gradiente bottom — oscurece un poco abajo */}
        <div style={{ position:'absolute', inset:0, zIndex:2, background:'linear-gradient(to top, rgba(5,5,8,0.6) 0%, transparent 35%)' }} />

        {/* Scanline 1 — rápida */}
        <div style={{ position:'absolute', left:0, right:0, height:'4%', zIndex:3, pointerEvents:'none', background:'linear-gradient(to bottom,transparent,rgba(0,212,255,0.07),transparent)', animation:'scanline 4.5s linear infinite' }} />

        {/* Scanline 2 — lenta */}
        <div style={{ position:'absolute', left:0, right:0, height:'2%', zIndex:3, pointerEvents:'none', background:'linear-gradient(to bottom,transparent,rgba(0,212,255,0.04),transparent)', animation:'scanline2 9s linear infinite', animationDelay:'3s' }} />

        {/* Tag inferior */}
        <div style={{ position:'absolute', bottom:24, left:28, zIndex:4, fontFamily:"'Share Tech Mono',monospace", fontSize:9, letterSpacing:3, color:'var(--cyan)', textShadow:'0 0 8px var(--cyan-glow)', animation:'fadeUp 0.8s ease 0.5s both' }}>
          FULLSTACK DEV · CBA, AR
        </div>
      </div>

    </div>
  )
}
