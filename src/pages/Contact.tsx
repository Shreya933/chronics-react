import { useState, type FormEvent } from 'react'
import { Field, focusFirstError } from '../components/Field'
import { Icon } from '../components/Icon'
import { useTitle } from '../components/Chrome'
import { contactSchema, validate, type Errors } from '../lib/validation'

const FAQS: ReadonlyArray<readonly [string, string]> = [
  ['How long does delivery take?', 'Standard delivery takes 4–6 days. Express takes 1–2 days.'],
  ['Can I return an item?', 'Yes. Return unworn items within 30 days for a full refund.'],
  ['Do you ship worldwide?', 'Yes. Shipping is free on orders over $50.'],
  ['How do I track my order?', 'You’ll get a tracking link by email once your order ships.'],
]
const TOPICS = ['Order help', 'Returns', 'Product question', 'Something else']
const EMPTY = { name: '', email: '', topic: TOPICS[0], message: '' }

export function Contact() {
  useTitle('Contact — Chronics')
  const [v, setV] = useState(EMPTY)
  const [errors, setErrors] = useState<Errors>({})
  const [sent, setSent] = useState(false)

  const submit = (e: FormEvent) => {
    e.preventDefault()
    const errs = validate(contactSchema, v)
    setErrors(errs)
    if (Object.keys(errs).length) {
      focusFirstError(errs, ['name', 'email', 'message'])
      return
    }
    setV(EMPTY)
    setSent(true)
  }

  return (
    <div className="wrap pg">
      <h1 className="h1">Contact us</h1>
      <div className="co">
        <form className="box" noValidate onSubmit={submit}>
          <h3>Send us a message</h3>
          <div className="g2">
            <Field id="name" label="Name" value={v.name} onChange={(x) => setV({ ...v, name: x })} error={errors.name} />
            <Field id="email" label="Email" type="email" value={v.email} onChange={(x) => setV({ ...v, email: x })} error={errors.email} />
          </div>
          <label className="f">
            Topic
            <select value={v.topic} onChange={(e) => setV({ ...v, topic: e.target.value })}>
              {TOPICS.map((t) => <option key={t}>{t}</option>)}
            </select>
          </label>
          <label className="f">
            Message
            <textarea id="message" rows={5} value={v.message} aria-invalid={errors.message ? true : undefined} onChange={(e) => setV({ ...v, message: e.target.value })} />
            <small className="er">{errors.message}</small>
          </label>
          <button className="btn p">Send message</button>
          <p className="msg" role="status">{sent ? 'Thanks. We’ll reply within one working day.' : ''}</p>
        </form>

        <div className="box">
          <h3>Frequently asked questions</h3>
          {FAQS.map(([q, a]) => (
            <details className="fq" key={q}>
              <summary>{q}</summary>
              <p>{a}</p>
            </details>
          ))}
          <p style={{ fontSize: 13, color: 'var(--muted)' }}>
            <Icon name="phone" /> +1 800 567 8900 · Mon–Sat, 9am–7pm
          </p>
        </div>
      </div>
    </div>
  )
}
