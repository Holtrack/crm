import { useState } from 'react'
import { createFileRoute, redirect, useNavigate } from '@tanstack/react-router'
import {
  LayoutGrid,
  Mail,
  Lock,
  Eye,
  EyeOff,
  Sparkles,
  TrendingUp,
  ShieldCheck,
} from 'lucide-react'
import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import { Label } from '@/components/ui/label'
import { cn } from '@/lib/utils'
import { isAuthenticated, login, LoginError } from '@/lib/auth'

export const Route = createFileRoute('/login')({
  beforeLoad: () => {
    if (isAuthenticated()) {
      throw redirect({ to: '/' })
    }
  },
  component: LoginPage,
})

function LoginPage() {
  const navigate = useNavigate()
  const [email, setEmail] = useState('')
  const [password, setPassword] = useState('')
  const [error, setError] = useState('')
  const [submitting, setSubmitting] = useState(false)
  const [showPassword, setShowPassword] = useState(false)

  async function handleSubmit(event: React.FormEvent) {
    event.preventDefault()
    setError('')
    setSubmitting(true)
    try {
      await login(email, password)
      navigate({ to: '/' })
    } catch (err) {
      setError(
        err instanceof LoginError ? err.message : 'Email atau password salah.',
      )
    } finally {
      setSubmitting(false)
    }
  }

  return (
    <div className="relative flex min-h-svh items-center justify-center overflow-hidden bg-[#05070f] p-4 sm:p-6">
      {/* Ambient background */}
      <div className="pointer-events-none absolute inset-0">
        <div className="absolute -top-40 -left-40 size-[32rem] rounded-full bg-blue-600/30 blur-[120px]" />
        <div className="absolute -right-40 top-1/3 size-[28rem] rounded-full bg-indigo-500/20 blur-[120px]" />
        <div className="absolute bottom-0 left-1/3 size-[24rem] rounded-full bg-cyan-500/10 blur-[120px]" />
        <div className="absolute inset-0 bg-[linear-gradient(to_right,#ffffff08_1px,transparent_1px),linear-gradient(to_bottom,#ffffff08_1px,transparent_1px)] bg-[size:44px_44px] [mask-image:radial-gradient(ellipse_at_center,black,transparent_75%)]" />
      </div>

      <div className="relative grid w-full max-w-4xl overflow-hidden rounded-3xl border border-white/10 bg-white/[0.03] shadow-2xl shadow-black/50 backdrop-blur-xl md:grid-cols-2">
        {/* Branding panel */}
        <div className="relative hidden flex-col justify-between overflow-hidden bg-gradient-to-br from-blue-600 via-indigo-700 to-[#05070f] p-10 md:flex">
          <div className="pointer-events-none absolute inset-0 bg-[radial-gradient(circle_at_top_left,#ffffff22,transparent_55%)]" />
          <div className="relative flex items-center gap-2.5">
            <div className="flex size-9 items-center justify-center rounded-lg bg-white/15 text-white ring-1 ring-white/20 backdrop-blur">
              <LayoutGrid className="size-4.5" />
            </div>
            <span className="text-sm font-semibold tracking-wide text-white">
              CRM Holtrack
            </span>
          </div>

          <div className="relative flex flex-col gap-6">
            <h2 className="text-3xl leading-tight font-semibold tracking-tight text-white">
              Kelola relasi bisnis Anda dengan lebih elegan.
            </h2>
            <p className="text-sm leading-relaxed text-white/70">
              Satu tempat untuk memantau perusahaan, kontak, deal, dan
              aktivitas tim penjualan Anda secara real-time.
            </p>
            <div className="flex flex-col gap-3">
              {[
                { icon: TrendingUp, text: 'Pantau pipeline dan konversi secara instan' },
                { icon: Sparkles, text: 'Alur kerja tim penjualan yang lebih rapi' },
                { icon: ShieldCheck, text: 'Data tersimpan aman dan terpusat' },
              ].map(({ icon: Icon, text }) => (
                <div key={text} className="flex items-center gap-3">
                  <span className="flex size-8 shrink-0 items-center justify-center rounded-full bg-white/10 text-white ring-1 ring-white/15">
                    <Icon className="size-4" />
                  </span>
                  <span className="text-sm text-white/80">{text}</span>
                </div>
              ))}
            </div>
          </div>

          <p className="relative text-xs text-white/40">
            Indonesia B2B Sales &middot; Sales Administrator Workspace
          </p>
        </div>

        {/* Form panel */}
        <div className="flex flex-col justify-center p-8 sm:p-10">
          <div className="mb-8 flex flex-col gap-1.5 md:hidden">
            <div className="flex size-10 items-center justify-center rounded-lg bg-blue-600 text-white">
              <LayoutGrid className="size-5" />
            </div>
          </div>

          <div className="flex flex-col gap-1.5">
            <h1 className="text-2xl font-semibold tracking-tight text-white">
              Selamat datang kembali
            </h1>
            <p className="text-sm text-white/50">
              Masuk untuk melanjutkan ke dashboard Anda.
            </p>
          </div>

          <form onSubmit={handleSubmit} className="mt-7 flex flex-col gap-4">
            <div className="flex flex-col gap-1.5">
              <Label htmlFor="email" className="text-white/70">
                Email
              </Label>
              <div className="relative">
                <Mail className="pointer-events-none absolute top-1/2 left-3 size-4 -translate-y-1/2 text-white/35" />
                <Input
                  id="email"
                  type="email"
                  autoFocus
                  value={email}
                  onChange={(event) => setEmail(event.target.value)}
                  placeholder="admin@holtrack.com"
                  className="h-11 border-white/10 bg-white/[0.04] pl-10 text-white placeholder:text-white/30 focus-visible:border-blue-400/60 focus-visible:ring-blue-400/20"
                />
              </div>
            </div>
            <div className="flex flex-col gap-1.5">
              <Label htmlFor="password" className="text-white/70">
                Password
              </Label>
              <div className="relative">
                <Lock className="pointer-events-none absolute top-1/2 left-3 size-4 -translate-y-1/2 text-white/35" />
                <Input
                  id="password"
                  type={showPassword ? 'text' : 'password'}
                  value={password}
                  onChange={(event) => setPassword(event.target.value)}
                  placeholder="••••••••"
                  className="h-11 border-white/10 bg-white/[0.04] pl-10 text-white placeholder:text-white/30 focus-visible:border-blue-400/60 focus-visible:ring-blue-400/20"
                />
                <button
                  type="button"
                  onClick={() => setShowPassword((prev) => !prev)}
                  className="absolute top-1/2 right-3 -translate-y-1/2 text-white/35 transition-colors hover:text-white/70"
                  tabIndex={-1}
                >
                  {showPassword ? (
                    <EyeOff className="size-4" />
                  ) : (
                    <Eye className="size-4" />
                  )}
                </button>
              </div>
            </div>

            {error && (
              <p className="rounded-lg border border-rose-500/20 bg-rose-500/10 px-3 py-2 text-sm text-rose-300">
                {error}
              </p>
            )}

            <Button
              type="submit"
              disabled={submitting}
              className={cn(
                'mt-1 h-11 bg-gradient-to-r from-blue-600 to-indigo-600 font-medium text-white shadow-lg shadow-blue-600/25',
                'hover:from-blue-500 hover:to-indigo-500',
              )}
            >
              {submitting ? 'Memproses...' : 'Masuk'}
            </Button>
          </form>
        </div>
      </div>
    </div>
  )
}
