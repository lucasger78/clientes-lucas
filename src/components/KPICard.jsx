// KPICard — neon tech style
export default function KPICard({ label, value, sub, color, glowColor }) {
  const glow = glowColor || color
  return (
    <div
      className="kpi-card"
      style={{
        background: `linear-gradient(135deg, rgba(10,16,38,0.9), rgba(5,8,20,0.95))`,
        border: `1px solid ${color}30`,
        borderTop: `2px solid ${color}`,
        boxShadow: `0 0 20px ${glow}15, inset 0 0 20px ${glow}05`,
      }}
    >
      <div className="kpi-card__label">{label}</div>
      <div
        className="kpi-card__value"
        style={{
          color,
          textShadow: `0 0 16px ${glow}80, 0 0 40px ${glow}30`,
        }}
      >
        {value}
      </div>
      {sub && <div className="kpi-card__sub">{sub}</div>}
    </div>
  )
}
