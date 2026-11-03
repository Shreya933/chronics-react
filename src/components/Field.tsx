import type { ChangeEvent } from 'react'

interface FieldProps {
  id: string
  label: string
  value: string
  onChange: (value: string) => void
  error?: string
  type?: string
  placeholder?: string
}

export function Field({ id, label, value, onChange, error, type = 'text', placeholder }: FieldProps) {
  return (
    <label className="f">
      {label}
      <input
        id={id}
        type={type}
        value={value}
        placeholder={placeholder}
        aria-invalid={error ? true : undefined}
        onChange={(e: ChangeEvent<HTMLInputElement>) => onChange(e.target.value)}
      />
      <small className="er">{error}</small>
    </label>
  )
}

/** Moves focus to the first field (in document order of `order`) that has an error. */
export function focusFirstError(errors: Record<string, string>, order: string[]) {
  const first = order.find((k) => errors[k])
  if (first) document.getElementById(first)?.focus()
}
