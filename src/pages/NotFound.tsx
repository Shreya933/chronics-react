import { Link } from 'react-router-dom'
import { Icon } from '../components/Icon'
import { useTitle } from '../components/Chrome'

export function NotFound() {
  useTitle('Page not found — Chronics')
  return (
    <div className="wrap pg">
      <div className="empty">
        <b><Icon name="compass" /></b>
        We couldn’t find that page.<br /><br />
        <Link className="btn p sm" to="/" state={{}}>Back to home</Link>
      </div>
    </div>
  )
}
