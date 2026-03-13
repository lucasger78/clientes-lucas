// ============================================================
//  useAuth.js — autenticación simple por DNI
//  Usuarios habilitados: Lucas Conti y Majo Reyes
// ============================================================
import { useState, useCallback } from 'react'

const USERS = [
  {
    id:       1,
    name:     'Lucas Conti',
    dni:      '26469376',
    role:     'admin',
    initials: 'LC',
    color:    '#00d4ff',
  },
  {
    id:       2,
    name:     'Majo Reyes',
    dni:      '28273545',
    role:     'viewer',
    initials: 'MR',
    color:    '#ff3366',
  },
]

export function useAuth() {
  const [user,  setUser]  = useState(null)
  const [error, setError] = useState('')

  const login = useCallback((dni) => {
    const clean = dni.replace(/\D/g, '').trim()
    const found = USERS.find(u => u.dni === clean)
    if (found) {
      setUser(found)
      setError('')
      return true
    } else {
      setError('DNI no autorizado. Verificá el número e intentá de nuevo.')
      return false
    }
  }, [])

  const logout = useCallback(() => {
    setUser(null)
    setError('')
  }, [])

  return { user, error, login, logout, setError }
}

export { USERS }
