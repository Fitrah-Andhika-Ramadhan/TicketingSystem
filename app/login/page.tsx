'use client';

import { useState } from 'react';
import { useRouter } from 'next/navigation';
import Link from 'next/link';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Mail, Lock, Eye, EyeOff, AlertCircle, Loader2, Sparkles, Activity, ShieldCheck, HelpCircle } from 'lucide-react';
import { toast } from 'sonner';

export default function LoginPage() {
  const router = useRouter();
  const [email, setEmail] = useState('admin@fitrahpro.com');
  const [password, setPassword] = useState('FitrahPro@2026');
  const [showPassword, setShowPassword] = useState(false);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');
  const [showDemoHelp, setShowDemoHelp] = useState(true);

  const handleLogin = async (e: React.FormEvent) => {
    e.preventDefault();
    setError('');
    setLoading(true);

    try {
      const response = await fetch('/api/auth/login', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ email, password }),
      });

      const data = await response.json();

      if (data.success) {
        localStorage.setItem('token', data.token);
        localStorage.setItem('user', JSON.stringify(data.user));

        toast.success('Login Berhasil! Selamat datang di VibeDesk.');

        // Redirect to dashboard
        setTimeout(() => {
          router.push('/dashboard');
        }, 800);
      } else {
        const errMsg = data.error || 'Login gagal. Periksa kembali email & password Anda.';
        setError(errMsg);
        toast.error(errMsg);
      }
    } catch (err: any) {
      setError('Terjadi kesalahan koneksi. Silakan coba lagi.');
      toast.error('Gagal terhubung ke server. Silakan periksa jaringan Anda.');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen flex flex-col md:flex-row bg-slate-50 text-slate-800 font-sans antialiased overflow-x-hidden">
      
      {/* LEFT SIDE: Brand Presentation (Visible on md+ screens) */}
      <div className="hidden md:flex md:w-[45%] lg:w-[50%] p-12 flex-col justify-between relative bg-gradient-to-br from-blue-900 via-blue-850 to-cyan-900 border-r border-slate-100 overflow-hidden">
        
        {/* Glow Effects */}
        <div className="absolute top-[-20%] left-[-10%] w-[60%] aspect-square rounded-full bg-blue-500/10 blur-[120px] pointer-events-none" />
        <div className="absolute bottom-[-10%] right-[-10%] w-[50%] aspect-square rounded-full bg-cyan-500/10 blur-[100px] pointer-events-none" />
        
        {/* Brand Header */}
        <div className="relative z-10 flex items-center gap-2.5">
          <img 
            src="/icon.svg" 
            alt="VibeDesk Logo" 
            className="h-10 w-10 rounded-xl border border-white/20 shadow-lg object-cover bg-white"
          />
          <div>
            <h1 className="text-xl font-bold tracking-tight text-white">
              VibeDesk
            </h1>
            <p className="text-[10px] text-blue-200 tracking-wider uppercase font-medium">Ticketing System</p>
          </div>
        </div>

        {/* Visual Presentation / Interactive Widget */}
        <div className="relative z-10 my-auto py-10 space-y-8">
          <div className="space-y-3">
            <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-white/10 border border-white/20 text-white text-xs font-medium">
              <Sparkles className="w-3.5 h-3.5 text-cyan-300" />
              Sistem Pelaporan Terpadu
            </div>
            <h2 className="text-3xl lg:text-4xl font-extrabold leading-tight text-white">
              Kelola kendala teknis dan tim dalam <span className="text-cyan-300">satu platform</span>.
            </h2>
            <p className="text-blue-100 text-sm max-w-md leading-relaxed opacity-90">
              Pantau antrean tiket, tangani SLA secara real-time, dan tingkatkan kepuasan pengguna dengan VibeDesk Admin Portal.
            </p>
          </div>

          {/* Glowing Mock Dashboard Widget */}
          <div className="relative w-full max-w-md rounded-2xl bg-white/10 border border-white/10 p-5 shadow-2xl space-y-4 backdrop-blur-md">
            <div className="flex items-center justify-between border-b border-white/10 pb-3">
              <div className="flex items-center gap-1.5">
                <span className="w-2.5 h-2.5 rounded-full bg-red-400"></span>
                <span className="w-2.5 h-2.5 rounded-full bg-yellow-400"></span>
                <span className="w-2.5 h-2.5 rounded-full bg-green-400"></span>
              </div>
              <span className="text-[10px] text-blue-200 font-mono opacity-85">system_metrics_active.json</span>
            </div>
            
            <div className="space-y-2.5">
              <div className="p-3 rounded-xl bg-white/5 border border-white/10 flex items-center justify-between">
                <div className="flex items-center gap-3">
                  <div className="p-2 rounded-lg bg-red-500/20 text-red-300">
                    <Activity className="w-4 h-4" />
                  </div>
                  <div>
                    <h4 className="text-xs font-semibold text-white">Warning SLA Breach</h4>
                    <p className="text-[9px] text-blue-200">Ticket #VD-2041 • High Priority</p>
                  </div>
                </div>
                <span className="text-[9px] px-2 py-0.5 rounded bg-red-500/20 text-red-200 border border-red-500/30 font-medium">Critical</span>
              </div>

              <div className="p-3 rounded-xl bg-white/5 border border-white/10 flex items-center justify-between">
                <div className="flex items-center gap-3">
                  <div className="p-2 rounded-lg bg-emerald-500/20 text-emerald-300">
                    <ShieldCheck className="w-4 h-4" />
                  </div>
                  <div>
                    <h4 className="text-xs font-semibold text-white">Database Engine</h4>
                    <p className="text-[9px] text-blue-200">Uptime 99.98% • Sync Operational</p>
                  </div>
                </div>
                <span className="text-[9px] px-2 py-0.5 rounded bg-emerald-500/20 text-emerald-200 border border-emerald-500/30 font-medium">Normal</span>
              </div>
            </div>
          </div>
        </div>

        {/* Brand Footer */}
        <div className="relative z-10 flex justify-between items-center text-xs text-blue-200 opacity-80">
          <p>© 2026 VibeDesk. Powered by FitrahPro.</p>
          <div className="flex gap-4">
            <span className="hover:text-white cursor-pointer transition">Support</span>
            <span className="hover:text-white cursor-pointer transition">Privacy Policy</span>
          </div>
        </div>
      </div>

      {/* RIGHT SIDE: Login Card */}
      <div className="flex-1 flex flex-col justify-center items-center p-6 md:p-12 bg-slate-50 relative overflow-hidden">
        
        {/* Mobile Logo Header */}
        <div className="md:hidden flex items-center gap-2.5 mb-8 self-start">
          <img 
            src="/icon.svg" 
            alt="VibeDesk Logo" 
            className="h-9 w-9 rounded-lg border border-blue-500/20 shadow-md object-cover"
          />
          <div>
            <h1 className="text-lg font-bold tracking-tight text-slate-900">VibeDesk</h1>
            <p className="text-[8px] text-slate-400 uppercase tracking-wider font-bold">Admin Portal</p>
          </div>
        </div>

        {/* Background Glows for Login Page */}
        <div className="absolute top-[20%] right-[-10%] w-[50%] aspect-square rounded-full bg-blue-500/5 blur-[120px] pointer-events-none" />
        <div className="absolute bottom-[20%] left-[-10%] w-[50%] aspect-square rounded-full bg-cyan-500/5 blur-[120px] pointer-events-none" />

        <div className="w-full max-w-md space-y-6">
          
          <div className="space-y-2 text-left">
            <h2 className="text-2xl font-extrabold tracking-tight text-slate-900 md:text-3xl">
              Portal Admin
            </h2>
            <p className="text-sm text-slate-500">
              Silakan login untuk mengelola sistem tiket VibeDesk.
            </p>
          </div>

          {/* Login Card */}
          <div className="rounded-2xl border border-slate-200/80 bg-white p-6 md:p-8 shadow-xl shadow-slate-100/50 relative overflow-hidden">
            
            <form onSubmit={handleLogin} className="space-y-4">
              
              {/* Alert Error */}
              {error && (
                <div className="flex items-start gap-2.5 p-3 rounded-lg bg-red-50 border border-red-200 text-red-600 text-xs">
                  <AlertCircle className="w-4 h-4 shrink-0 mt-0.5 text-red-500" />
                  <div>
                    <span className="font-bold">Login Gagal:</span> {error}
                  </div>
                </div>
              )}

              {/* Email Input */}
              <div className="space-y-1.5">
                <label className="text-xs font-bold text-slate-600">
                  Email Address
                </label>
                <div className="relative">
                  <span className="absolute inset-y-0 left-0 flex items-center pl-3 text-slate-400">
                    <Mail className="w-4 h-4" />
                  </span>
                  <Input
                    type="email"
                    placeholder="nama@email.com"
                    value={email}
                    onChange={(e) => setEmail(e.target.value)}
                    disabled={loading}
                    className="w-full pl-10 pr-4 py-2.5 bg-slate-50 border-slate-200 text-slate-900 placeholder:text-slate-400 focus:border-blue-500 focus:ring-1 focus:ring-blue-500 transition-all rounded-lg"
                    required
                  />
                </div>
              </div>

              {/* Password Input */}
              <div className="space-y-1.5">
                <div className="flex justify-between items-center">
                  <label className="text-xs font-bold text-slate-600">
                    Password
                  </label>
                  <Link href="/forgot-password" className="text-xs text-blue-600 hover:text-blue-700 hover:underline cursor-pointer transition font-medium">
                    Lupa Password?
                  </Link>
                </div>
                <div className="relative">
                  <span className="absolute inset-y-0 left-0 flex items-center pl-3 text-slate-400">
                    <Lock className="w-4 h-4" />
                  </span>
                  <Input
                    type={showPassword ? 'text' : 'password'}
                    placeholder="••••••••"
                    value={password}
                    onChange={(e) => setPassword(e.target.value)}
                    disabled={loading}
                    className="w-full pl-10 pr-10 py-2.5 bg-slate-50 border-slate-200 text-slate-900 placeholder:text-slate-400 focus:border-blue-500 focus:ring-1 focus:ring-blue-500 transition-all rounded-lg"
                    required
                  />
                  <button
                    type="button"
                    onClick={() => setShowPassword(!showPassword)}
                    className="absolute inset-y-0 right-0 flex items-center pr-3 text-slate-450 hover:text-slate-700 transition"
                  >
                    {showPassword ? <EyeOff className="w-4 h-4" /> : <Eye className="w-4 h-4" />}
                  </button>
                </div>
              </div>

              {/* Remember Me Checkbox */}
              <div className="flex items-center gap-2 py-1">
                <input
                  type="checkbox"
                  id="remember"
                  className="w-3.5 h-3.5 rounded border-slate-350 bg-white accent-blue-600"
                />
                <label htmlFor="remember" className="text-xs text-slate-500 select-none cursor-pointer font-medium">
                  Ingat perangkat ini
                </label>
              </div>

              {/* Submit Button */}
              <Button
                type="submit"
                disabled={loading}
                className="w-full py-2.5 mt-2 bg-gradient-to-r from-blue-600 to-cyan-500 hover:from-blue-700 hover:to-cyan-600 text-white font-semibold rounded-lg shadow-lg shadow-blue-500/10 active:scale-[0.98] transition-all flex items-center justify-center gap-2 border-0 cursor-pointer"
              >
                {loading ? (
                  <>
                    <Loader2 className="w-4 h-4 animate-spin" />
                    Memproses...
                  </>
                ) : (
                  'Masuk ke Dashboard'
                )}
              </Button>
            </form>
          </div>

          {/* Collapsible Demo Credentials Alert */}
          <div className="rounded-xl border border-slate-200/80 bg-white p-4 shadow-md">
            <button
              onClick={() => setShowDemoHelp(!showDemoHelp)}
              className="w-full flex items-center justify-between text-xs text-slate-500 font-bold hover:text-slate-800 transition"
            >
              <div className="flex items-center gap-2">
                <HelpCircle className="w-4 h-4 text-blue-500" />
                <span>Informasi Akun Demo</span>
              </div>
              <span className="text-[10px] bg-slate-100 px-2 py-0.5 rounded text-slate-600">
                {showDemoHelp ? 'Sembunyikan' : 'Tampilkan'}
              </span>
            </button>

            {showDemoHelp && (
              <div className="mt-3 pt-3 border-t border-slate-100 space-y-1.5 text-xs text-slate-500 text-left">
                <p>Gunakan kredensial berikut untuk masuk sebagai administrator:</p>
                <div className="bg-slate-50 p-2.5 rounded-lg border border-slate-200/60 space-y-1 font-mono text-[11px] text-slate-700">
                  <p><span className="text-slate-400 font-bold">Email:</span> admin@fitrahpro.com</p>
                  <p><span className="text-slate-400 font-bold">Pass :</span> FitrahPro@2026</p>
                </div>
              </div>
            )}
          </div>
          
        </div>
      </div>
      
    </div>
  );
}
