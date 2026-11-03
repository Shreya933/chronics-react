import { useState, type FormEvent } from 'react'
import { Link } from 'react-router-dom'
import { newsletterEmailSchema } from '../lib/validation'
import { useStore } from '../store/useStore'
import { Icon } from './Icon'
import { Logo } from './Header'

const SHOP_LINKS = ['Women’s Wear', 'Men’s Wear', 'Shoes', 'Bags'] as const

export function Footer() {
  const setCategory = useStore((s) => s.setCategory)
  const [email, setEmail] = useState('')
  const [msg, setMsg] = useState<{ text: string; error: boolean }>({ text: '', error: false })

  const subscribe = (e: FormEvent) => {
    e.preventDefault()
    if (!newsletterEmailSchema.safeParse(email).success) {
      setMsg({ text: 'Enter a valid email, like name@example.com.', error: true })
      return
    }
    setMsg({ text: 'You’re subscribed. Check your inbox for 10% off.', error: false })
    setEmail('')
  }

  return (
    <footer id="foot">
      <div className="wrap g">
        <div>
          <Logo muted />
          <p>Discover the latest fashion trends and elevate your style with Chronics.</p>
        </div>
        <div>
          <h4>Shop</h4>
          <ul>
            {SHOP_LINKS.map((c) => (
              <li key={c}><Link to="/shop" onClick={() => setCategory(c)}>{c}</Link></li>
            ))}
          </ul>
        </div>
        <div>
          <h4>Customer support</h4>
          <ul>
            <li><Link to="/contact">FAQs</Link></li>
            <li>Shipping policy</li>
            <li>Returns &amp; refunds</li>
            <li>Track order</li>
          </ul>
        </div>
        <div>
          <h4>Quick links</h4>
          <ul>
            <li>About us</li>
            <li>Blog</li>
            <li>Size guide</li>
            <li>Careers</li>
          </ul>
        </div>
        <div>
          <h4>Subscribe to our newsletter</h4>
          <p>Get updates on new arrivals and exclusive offers.</p>
          <form className="nl" noValidate onSubmit={subscribe}>
            <input type="email" placeholder="Enter your email address" aria-label="Email address" value={email} onChange={(e) => setEmail(e.target.value)} />
            <button aria-label="Subscribe"><Icon name="arrow" /></button>
          </form>
          <div className={`msg${msg.error ? ' err' : ''}`} role="status">{msg.text}</div>
        </div>
      </div>
      <div className="wrap bot">
        <span>© 2026 Chronics. All rights reserved.</span>
        <span>Privacy policy | Terms of service | Refund policy</span>
        <span className="pay" aria-label="Visa, Mastercard, PayPal, Amex">
          <b>VISA</b><b>Mastercard</b><b>PayPal</b><b>AMEX</b>
        </span>
      </div>
    </footer>
  )
}
