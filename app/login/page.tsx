'use client';

import { useState } from 'react';
import { useRouter } from 'next/navigation';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Mail, Lock, Eye, EyeOff, AlertCircle, Loader2, Sparkles, Activity, User } from 'lucide-react';
import { toast } from 'sonner';

export default function RealLoginPage() {
  const router = useRouter();
  const [isLogin, setIsLogin] = useState(true);
  const [name, setName] = useState('');
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [role, setRole] = useState('VIEWER');
  const [showPassword, setShowPassword] = useState(false);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError('');
    setLoading(true);

    try {
      if (isLogin) {
        // Real Login Logic - Supabase or API
        const response = await fetch('/api/auth/login', {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify({ email, password }),
        });

        const data = await response.json();

        if (data.success) {
          localStorage.setItem('token', data.token);
          localStorage.setItem('user', JSON.stringify(data.user));

          toast.success('Login Berhasil! Mengalihkan ke Dashboard.');

          // Redirect to real dashboard
          setTimeout(() => {
            router.push('/admin/dashboard');
          }, 800);
        } else {
          const errMsg = data.error || 'Login gagal. Periksa kembali email & password Anda.';
          setError(errMsg);
          toast.error(errMsg);
        }
      } else {
        // Real Register Logic - Supabase or API
        const response = await fetch('/api/auth/register', {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify({ email, name, password, role }),
        });

        const data = await response.json();

        if (data.success) {
          localStorage.setItem('token', data.token);
          localStorage.setItem('user', JSON.stringify(data.user));
          
          toast.success('Registrasi Berhasil! Mengalihkan ke Dashboard.');
          
          setTimeout(() => {
            router.push('/admin/dashboard');
          }, 800);
        } else {
          const errMsg = data.error || 'Registrasi gagal. Silakan periksa data Anda.';
          setError(errMsg);
          toast.error(errMsg);
        }
      }
    } catch (err) {
      setError('Terjadi kesalahan koneksi database. Silakan coba lagi.');
      toast.error('Gagal terhubung ke database.');
    } finally {
      if (isLogin) setLoading(false);
    }
  };

  return (
    <div className="min-h-screen bg-[#4252f5] p-4 sm:p-8 font-sans antialiased flex flex-col justify-center">
      
      {/* Main Container */}
      <div className="flex flex-col md:flex-row w-full max-w-[1000px] mx-auto bg-white rounded-3xl overflow-hidden shadow-2xl my-auto">
        
        {/* LEFT SIDE: Brand Presentation */}
        <div className="relative hidden md:flex md:w-1/2 p-10 flex-col justify-between bg-gradient-to-b from-blue-500 to-indigo-800 text-white overflow-hidden">
          {/* Overlay image */}
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
              Pantau antrean tiket, tangani SLA secara real-time, dan tingkatkan kepuasan pengguna dengan VibeDesk Admin Portal. Terhubung langsung ke sistem database Real-Time.
            </p>

            {/* Stats Boxes */}
            <div className="flex gap-3">
              <div className="bg-white/10 border border-white/20 backdrop-blur-md rounded-xl p-3 flex-1">
                <p className="text-[10px] uppercase tracking-widest text-blue-200 font-semibold mb-1">Database</p>
                <p className="text-lg font-bold">Live</p>
              </div>
              <div className="bg-white/10 border border-white/20 backdrop-blur-md rounded-xl p-3 flex-1">
                <p className="text-[10px] uppercase tracking-widest text-blue-200 font-semibold mb-1">Sync</p>
                <p className="text-lg font-bold">100%</p>
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

        {/* RIGHT SIDE: Form */}
        <div className="w-full md:w-1/2 p-6 sm:p-8 md:p-12 flex flex-col justify-center bg-white relative">
          
          <button
            onClick={() => router.push('/landing')}
            className="absolute top-6 right-6 md:top-8 md:right-8 flex items-center gap-1.5 text-xs font-bold text-slate-400 hover:text-blue-600 transition"
          >
            ← Kembali ke Landing
          </button>

          <div className="mb-8 mt-4 md:mt-0">
            <div className="flex items-center gap-2 mb-2">
              <span className="text-[11px] font-bold uppercase tracking-widest text-emerald-500 bg-emerald-50 px-2 py-1 rounded-md">Live Database</span>
            </div>
            <h2 className="text-3xl font-serif font-bold text-slate-900 mb-2">
              {isLogin ? 'Login Admin' : 'Register Admin'}
            </h2>
            <p className="text-sm text-slate-500">
              {isLogin ? 'Masuk ke dashboard real monitoring VibeDesk.' : 'Buat akun admin baru yang akan terhubung ke Supabase.'}
            </p>
          </div>

          <form onSubmit={handleSubmit} className="space-y-5">
            {error && (
              <div className="p-3 rounded-lg bg-red-50 border border-red-100 text-red-600 text-xs flex items-center gap-2">
                <AlertCircle className="w-4 h-4 shrink-0" />
                <span>{error}</span>
              </div>
            )}

            {!isLogin && (
              <div className="space-y-4">
                <div className="space-y-1.5">
                  <label className="text-xs font-bold text-slate-700">Full Name</label>
                  <div className="relative">
                    <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                      <User className="h-4 w-4 text-slate-400" />
                    </div>
                    <Input
                      type="text"
                      placeholder="Nama Lengkap"
                      value={name}
                      onChange={(e) => setName(e.target.value)}
                      disabled={loading}
                      className="w-full pl-10 pr-4 py-3 bg-white border border-slate-200 text-slate-900 placeholder:text-slate-400 focus:border-slate-400 focus:ring-1 focus:ring-slate-400 transition-all rounded-lg text-sm"
                      required={!isLogin}
                    />
                  </div>
                </div>
                
                <div className="space-y-1.5">
                  <label className="text-xs font-bold text-slate-700">Pilih Role / Peran</label>
                  <select
                    value={role}
                    onChange={(e) => setRole(e.target.value)}
                    disabled={loading}
                    className="w-full px-4 py-3 bg-white border border-slate-200 text-slate-900 focus:border-slate-400 focus:ring-1 focus:ring-slate-400 transition-all rounded-lg text-sm appearance-none outline-none"
                    required={!isLogin}
                  >
                    <option value="VIEWER">🌟 Pengguna Biasa (User) - Disarankan</option>
                    <option value="FUNCTIONAL_TEAM">Functional Team (Support)</option>
                    <option value="DEVELOPER">Developer (Teknis)</option>
                    <option value="QA">Quality Assurance (QA)</option>
                  </select>
                  <p className="text-[10px] text-slate-500 mt-1">
                    *Pilih <strong>Pengguna Biasa</strong> jika Anda hanya ingin membuat laporan atau tiket kendala.
                  </p>
                </div>
              </div>
            )}

            <div className="space-y-1.5">
              <label className="text-xs font-bold text-slate-700">Email Address</label>
              <div className="relative">
                <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                  <Mail className="h-4 w-4 text-slate-400" />
                </div>
                <Input
                  type="email"
                  placeholder="admin@vibedesk.com"
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  disabled={loading}
                  className="w-full pl-10 pr-4 py-3 bg-white border border-slate-200 text-slate-900 placeholder:text-slate-400 focus:border-slate-400 focus:ring-1 focus:ring-slate-400 transition-all rounded-lg text-sm"
                  required
                />
              </div>
            </div>

            <div className="space-y-1.5 relative">
              <label className="text-xs font-bold text-slate-700">Password</label>
              <div className="relative">
                <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                  <Lock className="h-4 w-4 text-slate-400" />
                </div>
                <Input
                  type={showPassword ? 'text' : 'password'}
                  placeholder="Password"
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  disabled={loading}
                  className="w-full pl-10 pr-10 py-3 bg-white border border-slate-200 text-slate-900 placeholder:text-slate-400 focus:border-slate-400 focus:ring-1 focus:ring-slate-400 transition-all rounded-lg text-sm"
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

            {isLogin && (
              <div className="flex items-center justify-between pt-1">
                <div className="flex items-center gap-2">
                  <input
                    type="checkbox"
                    id="remember"
                    className="w-3.5 h-3.5 rounded border-slate-300 text-slate-800 focus:ring-slate-800"
                  />
                  <label htmlFor="remember" className="text-xs font-medium text-slate-600 cursor-pointer">
                    Remember me
                  </label>
                </div>
                <a href="#" className="text-xs font-semibold text-blue-600 hover:underline">Lupa Password?</a>
              </div>
            )}

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
                  {isLogin ? 'Login Now' : 'Daftar Sekarang'} <span className="ml-1">→</span>
                </>
              )}
            </Button>
          </form>

          {/* Toggle Login/Register */}
          <div className="mt-6 text-center">
            <p className="text-xs text-slate-500">
              {isLogin ? "Belum punya akun? " : "Sudah punya akun? "}
              <button 
                type="button"
                onClick={() => setIsLogin(!isLogin)} 
                className="font-bold text-blue-600 hover:underline hover:text-blue-700 transition"
              >
                {isLogin ? "Daftar di sini" : "Login di sini"}
              </button>
            </p>
          </div>

          {/* Bottom Info Boxes */}
          <div className="mt-8 grid grid-cols-1 gap-4">
            <div className="bg-slate-50 border border-slate-100 p-4 rounded-xl">
              <p className="text-xs font-bold text-slate-800 mb-1">Production System Ready</p>
              <p className="text-[10px] text-slate-500 leading-relaxed">Mendukung koneksi ke database SQL (seperti Supabase) untuk penyimpanan data permanen.</p>
            </div>
          </div>

        </div>
      </div>
    </div>
  );
}
