import { useState, useRef, useEffect } from "react"
import { fmt } from "../data/helpers"

export default function EditableCell({ value, onChange }) {
  const [editing, setEditing] = useState(false)
  const [val, setVal]         = useState(value)
  const ref = useRef()

  useEffect(() => { if (editing) ref.current?.select() }, [editing])

  const commit = () => { setEditing(false); onChange(Number(val)) }

  if (editing) {
    return (
      <input
        ref={ref}
        className="editable-input"
        value={val}
        onChange={e => setVal(e.target.value.replace(/[^0-9]/g, ""))}
        onBlur={commit}
        onKeyDown={e => { if (e.key === "Enter") commit() }}
      />
    )
  }
  return (
    <span className="editable-cell" onClick={() => { setVal(value); setEditing(true) }}>
      {fmt(value)}
    </span>
  )
}
