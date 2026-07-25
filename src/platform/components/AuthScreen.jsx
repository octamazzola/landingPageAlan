import { useState } from 'react'
import { isSupabaseConfigured, supabase } from '../lib/supabase'

export default function AuthScreen() {
  const [email, setEmail] = useState('')
  const [status, setStatus] = useState('idle')
  const [message, setMessage] = useState('')

  async function submit(event) {
    event.preventDefault()
    if (!email.trim()) return
    setStatus('loading')
    setMessage('')
    if (!isSupabaseConfigured) {
      setStatus('error')
      setMessage('Falta configurar VITE_SUPABASE_URL y VITE_SUPABASE_ANON_KEY.')
      return
    }
    const { error } = await supabase.auth.signInWithOtp({
      email: email.trim().toLowerCase(),
      options: {
        shouldCreateUser: false,
        emailRedirectTo: window.location.origin,
      },
    })
    if (error) {
      setStatus('error')
      setMessage(error.message.includes('Signups not allowed')
        ? 'Ese correo todavía no está habilitado. Verificá que sea el mismo utilizado en la compra.'
        : error.message)
      return
    }
    setStatus('sent')
    setMessage('Revisá tu correo. Te enviamos un enlace de acceso seguro.')
  }

  return (
    <main className="auth-page">
      <section className="auth-card blueprint-panel">
        <div className="brand-lockup"><span>VISUALPROMPT</span> <strong>STUDIO</strong></div>
        <p className="eyebrow">PLATAFORMA PROFESIONAL</p>
        <h1>Ingresá con el email de tu compra</h1>
        <p className="muted">El acceso es privado. No necesitás crear una contraseña.</p>
        <form onSubmit={submit} className="auth-form">
          <label htmlFor="email">Correo electrónico</label>
          <input id="email" type="email" autoComplete="email" value={email} onChange={(event) => setEmail(event.target.value)} placeholder="nombre@email.com" required />
          <button className="button primary" disabled={status === 'loading'}>{status === 'loading' ? 'Enviando…' : 'Enviar enlace de acceso'}</button>
        </form>
        {message && <div className={`notice ${status}`}>{message}</div>}
        <p className="auth-foot">Acceso protegido · Visual Prompt Studio</p>
      </section>
    </main>
  )
}
