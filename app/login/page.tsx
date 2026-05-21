'use client';

import { useState } from 'react';
import { useRouter } from 'next/navigation';
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
    } catch (err) {
      setError('Terjadi kesalahan koneksi. Silakan coba lagi.');
      toast.error('Gagal terhubung ke server. Silakan periksa jaringan Anda.');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen flex items-center justify-center bg-[#4252f5] p-4 font-sans antialiased">
      
      {/* Main Container */}
      <div className="flex flex-col md:flex-row w-full max-w-[1000px] bg-white rounded-3xl overflow-hidden shadow-2xl min-h-[600px]">
        
        {/* LEFT SIDE: Brand Presentation */}
        <div className="relative hidden md:flex md:w-1/2 p-10 flex-col justify-between bg-gradient-to-b from-blue-500 to-indigo-800 text-white overflow-hidden">
          {/* Overlay image - Using CSS gradient for abstract building-like effect, plus glowing circles */}
          <div className="absolute inset-0 bg-[url('https://images.unsplash.com/photo-1486406146926-c627a92ad1ab?q=80&w=2070&auto=format&fit=crop')] bg-cover bg-center opacity-20 mix-blend-overlay"></div>
          <div className="absolute top-[-20%] left-[-10%] w-[60%] aspect-square rounded-full bg-blue-400/20 blur-[100px] pointer-events-none" />
          
          {/* Header */}
          <div className="relative z-10 flex items-center gap-3">
            <div className="p-2 bg-white/10 rounded-xl border border-white/20 backdrop-blur-sm">
              <Activity className="w-5 h-5 text-white" />
            </div>
            <div>
              <p className="text-[10px] uppercase tracking-widest text-blue-200 font-semibold mb-0.5">VibeDesk</p>
              <h1 className="text-sm font-bold tracking-tight">Admin Portal</h1>
            </div>
          </div>

          <div className="relative z-10 my-auto pt-8">
            <div className="w-10 h-10 rounded-full bg-white/10 flex items-center justify-center mb-6 backdrop-blur-sm border border-white/20">
              <Sparkles className="w-4 h-4 text-cyan-300" />
            </div>
            <h2 className="text-3xl lg:text-4xl font-extrabold leading-tight mb-4">
              Kelola kendala teknis dan tim dalam <span className="text-cyan-300">satu platform</span>.
            </h2>
            <p className="text-sm text-blue-100 max-w-sm leading-relaxed mb-8 opacity-90 font-light">
              Pantau antrean tiket, tangani SLA secara real-time, dan tingkatkan kepuasan pengguna dengan VibeDesk Admin Portal.
            </p>

            {/* Stats Boxes */}
            <div className="flex gap-3">
              <div className="bg-white/10 border border-white/20 backdrop-blur-md rounded-xl p-3 flex-1">
                <p className="text-[10px] uppercase tracking-widest text-blue-200 font-semibold mb-1">Tickets</p>
                <p className="text-lg font-bold">24/7</p>
              </div>
              <div className="bg-white/10 border border-white/20 backdrop-blur-md rounded-xl p-3 flex-1">
                <p className="text-[10px] uppercase tracking-widest text-blue-200 font-semibold mb-1">Knowledge</p>
                <p className="text-lg font-bold">Live</p>
              </div>
              <div className="bg-white/10 border border-white/20 backdrop-blur-md rounded-xl p-3 flex-1">
                <p className="text-[10px] uppercase tracking-widest text-blue-200 font-semibold mb-1">IT Support</p>
                <p className="text-lg font-bold">Ready</p>
              </div>
            </div>
          </div>

          <div className="relative z-10 mt-8 text-xs text-blue-200/80 font-light">
            <p>© 2026 VibeDesk. All rights reserved.</p>
          </div>
        </div>

        {/* RIGHT SIDE: Login Form */}
        <div className="w-full md:w-1/2 p-8 md:p-12 flex flex-col justify-center bg-white relative">
          
          <div className="mb-8">
            <p className="text-[11px] font-bold uppercase tracking-widest text-slate-400 mb-2">Welcome Back!</p>
            <h2 className="text-3xl font-serif font-bold text-slate-900 mb-2">Login Admin</h2>
            <p className="text-sm text-slate-500">Masuk ke dashboard monitoring VibeDesk.</p>
          </div>

          <form onSubmit={handleLogin} className="space-y-5">
            {error && (
              <div className="p-3 rounded-lg bg-red-50 border border-red-100 text-red-600 text-xs flex items-center gap-2">
                <AlertCircle className="w-4 h-4 shrink-0" />
                <span>{error}</span>
              </div>
            )}

            <div className="space-y-1.5">
              <label className="text-xs font-bold text-slate-700">Email Address</label>
              <Input
                type="email"
                placeholder="admin@vibedesk.com"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                disabled={loading}
                className="w-full px-4 py-3 bg-white border border-slate-200 text-slate-900 placeholder:text-slate-400 focus:border-slate-400 focus:ring-1 focus:ring-slate-400 transition-all rounded-lg text-sm"
                required
              />
            </div>

            <div className="space-y-1.5 relative">
              <label className="text-xs font-bold text-slate-700">Password</label>
              <div className="relative">
                <Input
                  type={showPassword ? 'text' : 'password'}
                  placeholder="Password"
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  disabled={loading}
                  className="w-full pl-4 pr-10 py-3 bg-white border border-slate-200 text-slate-900 placeholder:text-slate-400 focus:border-slate-400 focus:ring-1 focus:ring-slate-400 transition-all rounded-lg text-sm"
                  required
                />
                <button
                  type="button"
                  onClick={() => setShowPassword(!showPassword)}
                  className="absolute inset-y-0 right-0 flex items-center pr-3 text-slate-400 hover:text-slate-600 transition"
                >
                  {showPassword ? <EyeOff className="w-4 h-4" /> : <Eye className="w-4 h-4" />}
                </button>
              </div>
            </div>

            <div className="flex items-center gap-2 pt-1">
              <input
                type="checkbox"
                id="remember"
                className="w-3.5 h-3.5 rounded border-slate-300 text-slate-800 focus:ring-slate-800"
              />
              <label htmlFor="remember" className="text-xs font-medium text-slate-600 cursor-pointer">
                Remember me
              </label>
            </div>

            <Button
              type="submit"
              disabled={loading}
              className="w-full py-6 mt-2 bg-[#0f172a] hover:bg-[#1e293b] text-white font-medium rounded-xl transition-all flex items-center justify-center gap-2 shadow-lg shadow-slate-900/20"
            >
              {loading ? (
                <>
                  <Loader2 className="w-4 h-4 animate-spin" />
                  Memproses...
                </>
              ) : (
                <>
                  Login Now <span className="ml-1">→</span>
                </>
              )}
            </Button>
          </form>

          {/* Bottom Info Boxes */}
          <div className="mt-8 grid grid-cols-1 gap-4">
            <div className="bg-slate-50 border border-slate-100 p-4 rounded-xl">
              <p className="text-xs font-bold text-slate-800 mb-1">System Ready</p>
              <p className="text-[10px] text-slate-500 leading-relaxed">IT Support, Knowledge Base, and Reporting systems are available.</p>
            </div>
          </div>
          
          {/* Demo Alert at the very bottom */}
          <div className="mt-6 pt-6 border-t border-slate-100">
             <button
              onClick={() => setShowDemoHelp(!showDemoHelp)}
              className="w-full flex items-center justify-between text-xs text-slate-500 hover:text-slate-800 transition"
             >
               <span className="font-semibold flex items-center gap-2">
                 <HelpCircle className="w-3.5 h-3.5" /> Info Akun Demo
               </span>
               <span>{showDemoHelp ? 'Tutup' : 'Buka'}</span>
             </button>
             {showDemoHelp && (
               <div className="mt-3 bg-slate-50 p-3 rounded-lg border border-slate-200/60 font-mono text-[10px] text-slate-600 space-y-1">
                 <p>Email: admin@fitrahpro.com</p>
                 <p>Pass : FitrahPro@2026</p>
               </div>
             )}
          </div>

        </div>
      </div>
    </div>
  );
}
