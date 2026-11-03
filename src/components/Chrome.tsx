import { useEffect, useState } from 'react'
import { useLocation } from 'react-router-dom'
import { useStore } from '../store/useStore'
import { Icon } from './Icon'

export function Toast() {
  const { msg, on } = useStore((s) => s.toast)
  return <div className={`toast${on ? ' on' : ''}`} role="status">{msg}</div>
}

export function BackToTop() {
  const [on, setOn] = useState(false)
  useEffect(() => {
    const onScroll = () => setOn(window.scrollY > 600)
    onScroll()
    window.addEventListener('scroll', onScroll, { passive: true })
    return () => window.removeEventListener('scroll', onScroll)
  }, [])
  return (
    <button className={`up${on ? ' on' : ''}`} aria-label="Back to top" onClick={() => window.scrollTo({ top: 0 })}>
      <Icon name="arrow-up" />
    </button>
  )
}

/** Scrolls to a home section (or the top) on every navigation, and closes the drawers. */
export function ScrollManager() {
  const location = useLocation()
  const closeDrawers = useStore((s) => s.closeDrawers)

  useEffect(() => {
    const section = (location.state as { section?: string } | null)?.section
    const target = location.pathname === '/' && section ? document.getElementById(section) : null
    if (target) target.scrollIntoView()
    else window.scrollTo(0, 0)
  }, [location.key, location.pathname, location.state])

  useEffect(() => {
    const onKey = (e: KeyboardEvent) => e.key === 'Escape' && closeDrawers()
    document.addEventListener('keydown', onKey)
    return () => document.removeEventListener('keydown', onKey)
  }, [closeDrawers])

  return null
}

export function useTitle(title: string) {
  useEffect(() => {
    document.title = title
  }, [title])
}
