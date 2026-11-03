import { useEffect, useState, type FormEvent } from 'react'
import { Link } from 'react-router-dom'
import { IMG } from '../assets/images'
import { Field, focusFirstError } from '../components/Field'
import { Icon } from '../components/Icon'
import { useTitle } from '../components/Chrome'
import { FREE_SHIPPING_FROM, findProduct } from '../data/products'
import { formatCardNumber, formatExpiry, money, shippingCost } from '../lib/format'
import { cardSchema, shippingSchema, upiSchema, validate, type Errors } from '../lib/validation'
import { cartSubtotal, useStore, type PayMethod, type ShippingDetails } from '../store/useStore'

function Summary() {
  const cart = useStore((s) => s.cart)
  const ship = useStore((s) => s.checkout.ship)
  const sub = cartSubtotal(cart)
  const shipping = shippingCost(sub, ship)
  return (
    <div className="box">
      <h3>Order summary</h3>
      {cart.map((c) => {
        const p = findProduct(c.id)
        if (!p) return null
        return (
          <div className="mini" key={c.k}>
            <img src={IMG[p.image]} alt="" />
            <span style={{ flex: 1 }}>
              {p.name}<br />
              <small style={{ color: 'var(--muted)' }}>{c.sz ? `Size ${c.sz} · ` : ''}Qty {c.q}</small>
            </span>
            <b>{money(c.q * p.price)}</b>
          </div>
        )
      })}
      <div className="ln"><span>Subtotal</span><span>{money(sub)}</span></div>
      <div className="ln"><span>Shipping</span><span>{shipping ? money(shipping) : 'Free'}</span></div>
      <div className="ln t"><span>Total</span><span>{money(sub + shipping)}</span></div>
    </div>
  )
}

const DETAIL_FIELDS = ['name', 'email', 'phone', 'zip', 'address', 'city']

function DetailsForm() {
  const saved = useStore((s) => s.checkout.details)
  const patchCheckout = useStore((s) => s.patchCheckout)
  const [v, setV] = useState<ShippingDetails>({ name: '', email: '', phone: '', zip: '', address: '', city: '', ...saved })
  const [errors, setErrors] = useState<Errors>({})
  const set = (k: keyof ShippingDetails) => (val: string) => setV((x) => ({ ...x, [k]: val }))
  const id = (k: string) => `ship-${k}`

  const submit = (e: FormEvent) => {
    e.preventDefault()
    const errs = validate(shippingSchema, v)
    setErrors(errs)
    if (Object.keys(errs).length) {
      focusFirstError(Object.fromEntries(Object.entries(errs).map(([k, m]) => [id(k), m])), DETAIL_FIELDS.map(id))
      return
    }
    patchCheckout({
      step: 2,
      details: Object.fromEntries(Object.entries(v).map(([k, x]) => [k, x.trim()])) as unknown as ShippingDetails,
    })
  }

  return (
    <form className="box" noValidate onSubmit={submit}>
      <h3>Shipping details</h3>
      <div className="g2">
        <Field id={id('name')} label="Full name" value={v.name} onChange={set('name')} error={errors.name} />
        <Field id={id('email')} label="Email" type="email" value={v.email} onChange={set('email')} error={errors.email} />
      </div>
      <div className="g2">
        <Field id={id('phone')} label="Phone" type="tel" value={v.phone} onChange={set('phone')} error={errors.phone} />
        <Field id={id('zip')} label="PIN / ZIP code" value={v.zip} onChange={set('zip')} error={errors.zip} />
      </div>
      <Field id={id('address')} label="Address" value={v.address} onChange={set('address')} error={errors.address} />
      <Field id={id('city')} label="City" value={v.city} onChange={set('city')} error={errors.city} />
      <button className="btn p">Continue to payment</button>
    </form>
  )
}

const PAYMENTS: ReadonlyArray<readonly [PayMethod, string]> = [
  ['card', 'Credit / debit card'],
  ['upi', 'UPI'],
  ['cod', 'Cash on delivery'],
]

function PaymentForm() {
  const cart = useStore((s) => s.cart)
  const { ship, pay } = useStore((s) => s.checkout)
  const patchCheckout = useStore((s) => s.patchCheckout)
  const placeOrder = useStore((s) => s.placeOrder)
  const [card, setCard] = useState({ cardName: '', cardNumber: '', cardExpiry: '', cardCvv: '' })
  const [upiId, setUpiId] = useState('')
  const [errors, setErrors] = useState<Errors>({})

  const submit = (e: FormEvent) => {
    e.preventDefault()
    const errs = pay === 'card' ? validate(cardSchema, card) : pay === 'upi' ? validate(upiSchema, { upiId }) : {}
    setErrors(errs)
    if (Object.keys(errs).length) {
      focusFirstError(errs, ['cardName', 'cardNumber', 'cardExpiry', 'cardCvv', 'upiId'])
      return
    }
    placeOrder()
  }

  return (
    <form className="box" noValidate onSubmit={submit}>
      <h3>Delivery</h3>
      <label className="opt2">
        <input type="radio" name="ship" checked={ship === 'std'} onChange={() => patchCheckout({ ship: 'std' })} />
        Standard · 4–6 days<span>{cartSubtotal(cart) >= FREE_SHIPPING_FROM ? 'Free' : '$4.99'}</span>
      </label>
      <label className="opt2">
        <input type="radio" name="ship" checked={ship === 'exp'} onChange={() => patchCheckout({ ship: 'exp' })} />
        Express · 1–2 days<span>$9.99</span>
      </label>

      <h3 style={{ marginTop: 20 }}>Payment</h3>
      {PAYMENTS.map(([value, label]) => (
        <label className="opt2" key={value}>
          <input type="radio" name="pay" checked={pay === value} onChange={() => { setErrors({}); patchCheckout({ pay: value }) }} />
          {label}
        </label>
      ))}

      <div hidden={pay !== 'card'}>
        <Field id="cardName" label="Name on card" value={card.cardName} onChange={(x) => setCard({ ...card, cardName: x })} error={errors.cardName} />
        <Field id="cardNumber" label="Card number" placeholder="1234 5678 9012 3456" value={card.cardNumber} onChange={(x) => setCard({ ...card, cardNumber: formatCardNumber(x) })} error={errors.cardNumber} />
        <div className="g2">
          <Field id="cardExpiry" label="Expiry" placeholder="MM/YY" value={card.cardExpiry} onChange={(x) => setCard({ ...card, cardExpiry: formatExpiry(x) })} error={errors.cardExpiry} />
          <Field id="cardCvv" label="CVV" type="password" value={card.cardCvv} onChange={(x) => setCard({ ...card, cardCvv: x })} error={errors.cardCvv} />
        </div>
      </div>
      <div hidden={pay !== 'upi'}>
        <Field id="upiId" label="UPI ID" placeholder="name@bank" value={upiId} onChange={setUpiId} error={errors.upiId} />
      </div>

      <p style={{ fontSize: 12, color: 'var(--muted)' }}>Demo only: no payment is taken. Please don’t enter real card details.</p>
      <div style={{ display: 'flex', gap: 10 }}>
        <button type="button" className="btn o" onClick={() => patchCheckout({ step: 1 })}>Back</button>
        <button className="btn p">Place order</button>
      </div>
    </form>
  )
}

export function Checkout() {
  useTitle('Checkout — Chronics')
  const cart = useStore((s) => s.cart)
  const { step, details, order } = useStore((s) => s.checkout)
  const leaveCheckout = useStore((s) => s.leaveCheckout)

  useEffect(() => leaveCheckout, [leaveCheckout])

  if (step === 3 && order) {
    return (
      <div className="wrap pg">
        <div className="ok">
          <span className="big"><Icon name="check" /></span>
          <h1 className="h1">Thank you, {order.name}!</h1>
          <p>Your order <b>{order.id}</b> is confirmed. We’ll email updates to {details.email}.</p>
          <div className="box" style={{ textAlign: 'left' }}>
            {order.items.map((c) => {
              const p = findProduct(c.id)
              return p ? <div className="ln" key={c.k}><span>{p.name} × {c.q}</span><span>{money(c.q * p.price)}</span></div> : null
            })}
            <div className="ln t"><span>Total paid</span><span>{money(order.tot)}</span></div>
          </div>
          <p><Link className="btn p" to="/shop">Continue shopping</Link></p>
        </div>
      </div>
    )
  }

  if (!cart.length) {
    return (
      <div className="wrap pg">
        <div className="empty">
          <b><Icon name="bag" /></b>
          Your cart is empty.<br /><br />
          <Link className="btn p sm" to="/shop">Browse the shop</Link>
        </div>
      </div>
    )
  }

  return (
    <div className="wrap pg">
      <h1 className="h1">Checkout</h1>
      <div className="steps">
        {['Details', 'Payment', 'Done'].map((name, i) => (
          <span key={name} className={i + 1 === step ? 'on' : i + 1 < step ? 'dn' : ''}>{i + 1}. {name}</span>
        ))}
      </div>
      <div className="co">
        {step === 1 ? <DetailsForm /> : <PaymentForm />}
        <Summary />
      </div>
    </div>
  )
}
