import type { ButtonHTMLAttributes, ReactNode } from 'react'
import { cn } from '../lib/utils'

export function Card({ className, children }: { className?: string; children: ReactNode }) {
  return (
    <div
      className={cn(
        'rounded-2xl bg-white p-5 shadow-card transition-transform duration-300 hover:-translate-y-0.5',
        className,
      )}
    >
      {children}
    </div>
  )
}

export function PageHeader({ title, subtitle }: { title: string; subtitle?: string }) {
  return (
    <div className="mb-6">
      <h1 className="font-serif text-2xl font-semibold text-white">{title}</h1>
      {subtitle && <p className="mt-1 text-sm text-slate-400">{subtitle}</p>}
    </div>
  )
}

export function SectionLabel({ children }: { children: ReactNode }) {
  return <p className="text-xs uppercase tracking-wider text-slate-500">{children}</p>
}

export function CardTitle({ children, className }: { children: ReactNode; className?: string }) {
  return <h2 className={cn('text-base font-medium text-slate-900', className)}>{children}</h2>
}

type BadgeTone = 'amber' | 'teal' | 'emerald' | 'slate'

const badgeTones: Record<BadgeTone, string> = {
  amber: 'bg-gradient-to-r from-blue-600 to-cyan-500 text-white',
  teal: 'bg-gradient-to-r from-purple-600 to-purple-500 text-white',
  emerald: 'bg-emerald-100 text-emerald-700',
  slate: 'bg-slate-100 text-slate-600',
}

export function Badge({
  tone = 'slate',
  className,
  children,
}: {
  tone?: BadgeTone
  className?: string
  children: ReactNode
}) {
  return (
    <span
      className={cn(
        'inline-flex items-center rounded-full px-2.5 py-0.5 text-xs font-medium',
        badgeTones[tone],
        className,
      )}
    >
      {children}
    </span>
  )
}

export function Tag({ children, className }: { children: ReactNode; className?: string }) {
  return (
    <span
      className={cn(
        'inline-flex items-center rounded-md bg-gradient-to-r from-blue-50 to-cyan-50 px-2 py-0.5 text-xs font-medium text-blue-700',
        className,
      )}
    >
      {children}
    </span>
  )
}

type ButtonVariant = 'primary' | 'secondary' | 'ghost' | 'outline'

const buttonVariants: Record<ButtonVariant, string> = {
  primary:
    'bg-primary-gradient text-white shadow-glow-blue hover:brightness-110 hover:shadow-glow-blue',
  secondary:
    'bg-secondary-gradient text-white shadow-glow-purple hover:brightness-110 hover:shadow-glow-purple',
  ghost: 'text-slate-600 hover:bg-slate-100 hover:text-slate-900',
  outline: 'border border-slate-200 text-slate-700 hover:bg-slate-50 hover:text-slate-900',
}

export function Button({
  variant = 'primary',
  className,
  children,
  ...props
}: ButtonHTMLAttributes<HTMLButtonElement> & { variant?: ButtonVariant }) {
  return (
    <button
      className={cn(
        'inline-flex items-center justify-center gap-2 rounded-xl px-4 py-2 text-sm font-medium transition-all duration-300 disabled:cursor-not-allowed disabled:opacity-60',
        buttonVariants[variant],
        className,
      )}
      {...props}
    >
      {children}
    </button>
  )
}

export function ProgressBar({ value, className }: { value: number; className?: string }) {
  return (
    <div className={cn('h-1.5 w-full overflow-hidden rounded-full bg-slate-100', className)}>
      <div
        className="h-full rounded-full bg-gradient-to-r from-blue-600 to-cyan-500"
        style={{ width: `${Math.min(100, Math.max(0, value))}%` }}
      />
    </div>
  )
}

export function ScoreRing({
  value,
  size = 140,
  stroke = 10,
}: {
  value: number
  size?: number
  stroke?: number
}) {
  const radius = (size - stroke) / 2
  const circumference = 2 * Math.PI * radius
  const offset = circumference - (value / 100) * circumference
  const gradientId = `score-gradient-${size}-${stroke}`
  return (
    <div className="relative" style={{ width: size, height: size }}>
      <svg width={size} height={size} className="-rotate-90">
        <defs>
          <linearGradient id={gradientId} x1="0%" y1="0%" x2="100%" y2="100%">
            <stop offset="0%" stopColor="#2563EB" />
            <stop offset="100%" stopColor="#06B6D4" />
          </linearGradient>
        </defs>
        <circle cx={size / 2} cy={size / 2} r={radius} fill="none" stroke="#E2E8F0" strokeWidth={stroke} />
        <circle
          cx={size / 2}
          cy={size / 2}
          r={radius}
          fill="none"
          stroke={`url(#${gradientId})`}
          strokeWidth={stroke}
          strokeLinecap="round"
          strokeDasharray={circumference}
          strokeDashoffset={offset}
        />
      </svg>
      <div className="absolute inset-0 flex flex-col items-center justify-center">
        <span className="font-serif text-3xl font-semibold text-slate-900">{value}</span>
        <span className="text-xs uppercase tracking-wider text-slate-500">/ 100</span>
      </div>
    </div>
  )
}

export function Avatar({ initials, size = 'md' }: { initials: string; size?: 'md' | 'lg' }) {
  return (
    <span
      className={cn(
        'inline-flex shrink-0 items-center justify-center rounded-full bg-gradient-to-br from-blue-600 to-cyan-500 font-semibold text-white shadow-glow-blue',
        size === 'md' ? 'h-8 w-8 text-sm' : 'h-16 w-16 text-xl',
      )}
    >
      {initials}
    </span>
  )
}
