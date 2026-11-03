import { useState, type FormEvent } from 'react'
import { Field, focusFirstError } from '../components/Field'
import { useTitle } from '../components/Chrome'
import { money } from '../lib/format'
import { signInSchema, signUpSchema, validate, type Errors } from '../lib/validation'
import { useStore } from '../store/useStore'

function AuthForm({ signUp }: { signUp: boolean }) {
  const signIn = useStore((s) => s.signIn)
  const [v, setV] = useState({ name: '', email: '', password: '' })
  const [errors, setErrors] = useState<Errors>({})

  const submit = (e: FormEvent) => {
    e.preventDefault()
    const errs = validate(signUp ? signUpSchema : signInSchema, v)
    setErrors(errs)
    if (Object.keys(errs).length) {
      focusFirstError(errs, signUp ? ['name', 'email', 'password'] : ['email', 'password'])
      return
    }
    const email = v.email.trim()
    signIn({ name: signUp ? v.name.trim() : email.split('@')[0], email }, signUp)
  }

  return (
    <form className="box" noValidate onSubmit={submit}>
      {signUp ? <Field id="name" label="Full name" value={v.name} onChange={(x) => setV({ ...v, name: x })} error={errors.name} /> : null}
      <Field id="email" label="Email" type="email" value={v.email} onChange={(x) => setV({ ...v, email: x })} error={errors.email} />
      <Field id="password" label="Password" type="password" value={v.password} onChange={(x) => setV({ ...v, password: x })} error={errors.password} />
      <button className="btn p" style={{ width: '100%', justifyContent: 'center' }}>{signUp ? 'Create account' : 'Sign in'}</button>
      <p style={{ fontSize: 12, color: 'var(--muted)' }}>Demo only: details stay in this browser.</p>
    </form>
  )
}

export function Account() {
  useTitle('Account — Chronics')
  const user = useStore((s) => s.user)
  const orders = useStore((s) => s.orders)
  const mode = useStore((s) => s.authMode)
  const setAuthMode = useStore((s) => s.setAuthMode)
  const signOut = useStore((s) => s.signOut)

  if (user) {
    return (
      <div className="wrap pg" style={{ maxWidth: 640 }}>
        <h1 className="h1">Hi, {user.name}</h1>
        <div className="box">
          <h3>Account</h3>
          <p>{user.email}</p>
          <button className="btn o sm" onClick={signOut}>Sign out</button>
        </div>
        <div className="box" style={{ marginTop: 16 }}>
          <h3>Your orders</h3>
          {orders.length ? (
            orders.map((o) => (
              <div className="ln" key={o.id}><span>{o.id} · {o.date}</span><b>{money(o.tot)}</b></div>
            ))
          ) : (
            <p style={{ color: 'var(--muted)' }}>No orders yet. Orders you place will show up here.</p>
          )}
        </div>
      </div>
    )
  }

  return (
    <div className="wrap pg" style={{ maxWidth: 440 }}>
      <h1 className="h1">{mode === 'in' ? 'Sign in' : 'Create account'}</h1>
      <div className="tw">
        <button className={mode === 'in' ? 'on' : ''} onClick={() => setAuthMode('in')}>Sign in</button>
        <button className={mode === 'up' ? 'on' : ''} onClick={() => setAuthMode('up')}>Create account</button>
      </div>
      <AuthForm key={mode} signUp={mode === 'up'} />
    </div>
  )
}
