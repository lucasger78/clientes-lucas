// ============================================================
//  useSupabaseSync.js
//  Hook central: carga datos, escucha cambios en tiempo real
//  y expone funciones CRUD para las 4 tablas.
// ============================================================
import { useState, useEffect, useCallback } from 'react'
import { supabase } from './supabaseClient'
import { nullMonths } from '../data/initialData'

// ── helpers internos ────────────────────────────────────────
const rowToClient = (row) => ({ id: row.id, name: row.name, data: row.data })
const rowToEvento = (row) => ({
  id:     row.id,
  title:  row.title,
  client: row.client,
  date:   row.date,
  amount: row.amount,
})
const rowToTodo = (row) => ({
  id:           row.id,
  text:         row.text,
  done:         row.done,
  priority:     row.priority,
  created:      row.created,
  day_of_week:  row.day_of_week ?? 1,
})

// ============================================================
export function useSupabaseSync() {
  const [clientes,  setClientes]  = useState([])
  const [proyectos, setProyectos] = useState([])
  const [events,    setEvents]    = useState([])
  const [todos,     setTodos]     = useState([])
  const [loading,   setLoading]   = useState(true)
  const [error,     setError]     = useState(null)

  // ── Carga inicial ──────────────────────────────────────────
  const fetchAll = useCallback(async () => {
    setLoading(true)
    setError(null)
    try {
      const [c, p, e, t] = await Promise.all([
        supabase.from('clientes').select('*').order('id'),
        supabase.from('proyectos').select('*').order('id'),
        supabase.from('eventos').select('*').order('date'),
        supabase.from('todos').select('*').order('id'),
      ])
      if (c.error) throw c.error
      if (p.error) throw p.error
      if (e.error) throw e.error
      if (t.error) throw t.error

      setClientes(c.data.map(rowToClient))
      setProyectos(p.data.map(rowToClient))
      setEvents(e.data.map(rowToEvento))
      setTodos(t.data.map(rowToTodo))
    } catch (err) {
      console.error('Supabase fetch error:', err)
      setError(err.message)
    } finally {
      setLoading(false)
    }
  }, [])

  // ── Suscripciones realtime ─────────────────────────────────
  useEffect(() => {
    fetchAll()

    // ---- CLIENTES ----
    const chanClientes = supabase
      .channel('clientes-changes')
      .on('postgres_changes', { event: '*', schema: 'public', table: 'clientes' }, payload => {
        if (payload.eventType === 'INSERT') {
          setClientes(prev => [...prev, rowToClient(payload.new)])
        } else if (payload.eventType === 'UPDATE') {
          setClientes(prev => prev.map(c => c.id === payload.new.id ? rowToClient(payload.new) : c))
        } else if (payload.eventType === 'DELETE') {
          setClientes(prev => prev.filter(c => c.id !== payload.old.id))
        }
      })
      .subscribe()

    // ---- PROYECTOS ----
    const chanProyectos = supabase
      .channel('proyectos-changes')
      .on('postgres_changes', { event: '*', schema: 'public', table: 'proyectos' }, payload => {
        if (payload.eventType === 'INSERT') {
          setProyectos(prev => [...prev, rowToClient(payload.new)])
        } else if (payload.eventType === 'UPDATE') {
          setProyectos(prev => prev.map(c => c.id === payload.new.id ? rowToClient(payload.new) : c))
        } else if (payload.eventType === 'DELETE') {
          setProyectos(prev => prev.filter(c => c.id !== payload.old.id))
        }
      })
      .subscribe()

    // ---- EVENTOS ----
    const chanEventos = supabase
      .channel('eventos-changes')
      .on('postgres_changes', { event: '*', schema: 'public', table: 'eventos' }, payload => {
        if (payload.eventType === 'INSERT') {
          setEvents(prev => [...prev, rowToEvento(payload.new)])
        } else if (payload.eventType === 'UPDATE') {
          setEvents(prev => prev.map(e => e.id === payload.new.id ? rowToEvento(payload.new) : e))
        } else if (payload.eventType === 'DELETE') {
          setEvents(prev => prev.filter(e => e.id !== payload.old.id))
        }
      })
      .subscribe()

    // ---- TODOS ----
    const chanTodos = supabase
      .channel('todos-changes')
      .on('postgres_changes', { event: '*', schema: 'public', table: 'todos' }, payload => {
        if (payload.eventType === 'INSERT') {
          setTodos(prev => [...prev, rowToTodo(payload.new)])
        } else if (payload.eventType === 'UPDATE') {
          setTodos(prev => prev.map(t => t.id === payload.new.id ? rowToTodo(payload.new) : t))
        } else if (payload.eventType === 'DELETE') {
          setTodos(prev => prev.filter(t => t.id !== payload.old.id))
        }
      })
      .subscribe()

    return () => {
      supabase.removeChannel(chanClientes)
      supabase.removeChannel(chanProyectos)
      supabase.removeChannel(chanEventos)
      supabase.removeChannel(chanTodos)
    }
  }, [fetchAll])

  // ──────────────────────────────────────────────────────────
  //  CRUD — CLIENTES
  // ──────────────────────────────────────────────────────────
  // scope: "this" → solo el mes activo | "forward" → mes activo + todos los siguientes
  // forwardKeys: array de claves de meses desde el activo en adelante (sin meses pasados)
  const addCliente = async (name, monthKey, scope = 'this', forwardKeys = [monthKey]) => {
    const keysToActivate = scope === 'forward' ? forwardKeys : [monthKey]
    const data = {
      ...nullMonths(),
      ...Object.fromEntries(keysToActivate.map(k => [k, { monto: 0, cobro: 0 }]))
    }
    const { error } = await supabase
      .from('clientes')
      .insert({ name, data })
    if (error) console.error('addCliente:', error)
  }

  const updateCliente = async (id, newData) => {
    const { error } = await supabase
      .from('clientes')
      .update({ data: newData })
      .eq('id', id)
    if (error) console.error('updateCliente:', error)
  }

  // Soft-delete por mes. scope: "this" → solo mes activo | "forward" → mes activo + meses siguientes
  const deleteCliente = async (id, monthKey, scope = 'this', forwardKeys = [monthKey]) => {
    const client = clientes.find(c => c.id === id)
    if (!client) return
    const keysToDelete = scope === 'forward' ? forwardKeys : [monthKey]
    const newData = { ...client.data }
    keysToDelete.forEach(k => { newData[k] = null })
    const allNull = Object.values(newData).every(v => v === null)
    if (allNull) {
      const { error } = await supabase.from('clientes').delete().eq('id', id)
      if (error) console.error('deleteCliente (full):', error)
    } else {
      const { error } = await supabase.from('clientes').update({ data: newData }).eq('id', id)
      if (error) console.error('deleteCliente (month):', error)
    }
  }

  // ──────────────────────────────────────────────────────────
  //  CRUD — PROYECTOS
  // ──────────────────────────────────────────────────────────
  const addProyecto = async (name, monthKey, scope = 'this', forwardKeys = [monthKey]) => {
    const keysToActivate = scope === 'forward' ? forwardKeys : [monthKey]
    const data = {
      ...nullMonths(),
      ...Object.fromEntries(keysToActivate.map(k => [k, { monto: 0, cobro: 0 }]))
    }
    const { error } = await supabase
      .from('proyectos')
      .insert({ name, data })
    if (error) console.error('addProyecto:', error)
  }

  const updateProyecto = async (id, newData) => {
    const { error } = await supabase
      .from('proyectos')
      .update({ data: newData })
      .eq('id', id)
    if (error) console.error('updateProyecto:', error)
  }

  // Soft-delete por mes. scope: "this" → solo mes activo | "forward" → mes activo + meses siguientes
  const deleteProyecto = async (id, monthKey, scope = 'this', forwardKeys = [monthKey]) => {
    const proyecto = proyectos.find(p => p.id === id)
    if (!proyecto) return
    const keysToDelete = scope === 'forward' ? forwardKeys : [monthKey]
    const newData = { ...proyecto.data }
    keysToDelete.forEach(k => { newData[k] = null })
    const allNull = Object.values(newData).every(v => v === null)
    if (allNull) {
      const { error } = await supabase.from('proyectos').delete().eq('id', id)
      if (error) console.error('deleteProyecto (full):', error)
    } else {
      const { error } = await supabase.from('proyectos').update({ data: newData }).eq('id', id)
      if (error) console.error('deleteProyecto (month):', error)
    }
  }

  // ──────────────────────────────────────────────────────────
  //  CRUD — EVENTOS
  // ──────────────────────────────────────────────────────────
  const addEvento = async ({ title, client, date, amount }) => {
    const { error } = await supabase
      .from('eventos')
      .insert({ title, client, date, amount })
    if (error) console.error('addEvento:', error)
  }

  const deleteEvento = async (id) => {
    const { error } = await supabase.from('eventos').delete().eq('id', id)
    if (error) console.error('deleteEvento:', error)
  }

  const updateEvento = async (id, fields) => {
    const { error } = await supabase.from('eventos').update(fields).eq('id', id)
    if (error) console.error('updateEvento:', error)
  }

  // ──────────────────────────────────────────────────────────
  //  CRUD — TODOS
  // ──────────────────────────────────────────────────────────
  const addTodo = async ({ text, priority, day_of_week = 1 }) => {
    const created = new Date().toLocaleDateString('es-AR')
    const { error } = await supabase
      .from('todos')
      .insert({ text, done: false, priority, day_of_week, created })
    if (error) console.error('addTodo:', error)
  }

  const toggleTodo = async (id, currentDone) => {
    const { error } = await supabase
      .from('todos')
      .update({ done: !currentDone })
      .eq('id', id)
    if (error) console.error('toggleTodo:', error)
  }

  const deleteTodo = async (id) => {
    const { error } = await supabase.from('todos').delete().eq('id', id)
    if (error) console.error('deleteTodo:', error)
  }

  const updateTodo = async (id, { text, priority, day_of_week }) => {
    const updates = { text, priority, ...(day_of_week !== undefined && { day_of_week }) }
    const { error } = await supabase.from('todos').update(updates).eq('id', id)
    if (error) console.error('updateTodo:', error)
  }

  // ──────────────────────────────────────────────────────────
  return {
    // state
    clientes, proyectos, events, todos, loading, error,
    // clientes
    addCliente, updateCliente, deleteCliente,
    // proyectos
    addProyecto, updateProyecto, deleteProyecto,
    // eventos
    addEvento, deleteEvento, updateEvento,
    // todos
    addTodo, toggleTodo, deleteTodo, updateTodo,
  }
}
