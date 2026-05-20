'use client';

import { useState, Suspense } from 'react';
import { useSearchParams, useRouter } from 'next/navigation';
import Link from 'next/link';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Lock, Eye, EyeOff, AlertCircle, Loader2, Sparkles, CheckCircle2 } from 'lucide-react';
import { toast } from 'sonner';

function ResetPasswordForm() {
  const router = useRouter();
  const searchParams = useSearchParams();
  const token = searchParams.get('token');

  const [password, setPassword] = useState('');
  const [confirmPassword, setConfirmPassword] = useState('');
  const [showPassword, setShowPassword] = useState(false);
  const [showConfirmPassword, setShowConfirmPassword] = useState(false);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');
  const [success, setSuccess] = useState(false);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError('');
    setSuccess(false);

    if (!token) {
      setError('Token reset tidak valid atau tidak ditemukan di URL.');
      toast.error('Token tidak ditemukan');
      return;
    }

    if (password.length < 6) {
      setError('Password harus memiliki minimal 6 karakter.');
      return;
    }

    if (password !== confirmPassword) {
      setError('Password baru dan konfirmasi password tidak cocok.');
      return;
    }

    setLoading(true);

    try {
      const response = await fetch('/api/auth/reset-password', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ token, password }),
      });

      const data = await response.json();

      if (response.ok) {
        setSuccess(true);
        toast.success('Password Anda berhasil diatur ulang!');
        setTimeout(() => {
          router.push('/login');
        }, 3000);
      } else {
        const errMsg = data.error || 'Gagal mengatur ulang password.';
        setError(errMsg);
        toast.error(errMsg);
      }
    } catch (err: any) {
      setError('Terjadi kesalahan koneksi. Silakan coba lagi.');
      toast.error('Gagal terhubung ke server.');
    } finally {
      setLoading(false);
    }
  };

  if (!token) {
    return (
      <div className="text-center py-4 space-y-4">
        <div className="inline-flex items-center justify-center w-12 h-12 rounded-full bg-red-100 text-red-650 mb-2">
          <AlertCircle className="w-6 h-6" />
        </div>
        <h3 className="text-lg font-bold text-slate-900">Token Tidak Valid</h3>
        <p className="text-sm text-slate-500 max-w-sm mx-auto">
          Tautan atur ulang sandi ini tidak valid atau telah kedaluwarsa. Silakan ajukan permintaan lupa password baru.
        </p>
        <div className="pt-2">
          <Link 
            href="/forgot-password" 
            className="inline-flex items-center gap-1.5 text-xs font-semibold text-blue-600 hover:text-blue-700 hover:underline transition"
          >
            Minta link baru
          </Link>
        </div>
      </div>
    );
  }

  return (
    <div>
      {!success ? (
        <form onSubmit={handleSubmit} className="space-y-4">
          
          {/* Alert Error */}
          {error && (
            <div className="flex items-start gap-2.5 p-3 rounded-lg bg-red-50 border border-red-200 text-red-600 text-xs">
              <AlertCircle className="w-4 h-4 shrink-0 mt-0.5 text-red-500" />
              <div>
                <span className="font-bold">Error:</span> {error}
              </div>
            </div>
          )}

          {/* New Password Input */}
          <div className="space-y-1.5">
            <label className="text-xs font-bold text-slate-600">
              Password Baru
            </label>
            <div className="relative">
              <span className="absolute inset-y-0 left-0 flex items-center pl-3 text-slate-400">
                <Lock className="w-4 h-4" />
              </span>
              <Input
                type={showPassword ? 'text' : 'password'}
                placeholder="Buat password baru"
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

          {/* Confirm Password Input */}
          <div className="space-y-1.5">
            <label className="text-xs font-bold text-slate-600">
              Konfirmasi Password Baru
            </label>
            <div className="relative">
              <span className="absolute inset-y-0 left-0 flex items-center pl-3 text-slate-400">
                <Lock className="w-4 h-4" />
              </span>
              <Input
                type={showConfirmPassword ? 'text' : 'password'}
                placeholder="Ulangi password baru"
                value={confirmPassword}
                onChange={(e) => setConfirmPassword(e.target.value)}
                disabled={loading}
                className="w-full pl-10 pr-10 py-2.5 bg-slate-50 border-slate-200 text-slate-900 placeholder:text-slate-400 focus:border-blue-500 focus:ring-1 focus:ring-blue-500 transition-all rounded-lg"
                required
              />
              <button
                type="button"
                onClick={() => setShowConfirmPassword(!showConfirmPassword)}
                className="absolute inset-y-0 right-0 flex items-center pr-3 text-slate-450 hover:text-slate-700 transition"
              >
                {showConfirmPassword ? <EyeOff className="w-4 h-4" /> : <Eye className="w-4 h-4" />}
              </button>
            </div>
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
                Menyimpan Sandi...
              </>
            ) : (
              'Atur Ulang Sandi'
            )}
          </Button>
        </form>
      ) : (
        <div className="text-center py-4 space-y-4">
          <div className="inline-flex items-center justify-center w-12 h-12 rounded-full bg-emerald-100 text-emerald-600 mb-2">
            <CheckCircle2 className="w-6 h-6" />
          </div>
          <h3 className="text-lg font-bold text-slate-900">Kata Sandi Diperbarui!</h3>
          <p className="text-sm text-slate-500 leading-relaxed">
            Password baru Anda telah berhasil disimpan. Anda akan dialihkan ke halaman login secara otomatis dalam beberapa saat.
          </p>
          <div className="pt-2">
            <Link 
              href="/login" 
              className="inline-flex items-center gap-1.5 text-xs font-semibold text-blue-600 hover:text-blue-700 hover:underline transition"
            >
              Masuk sekarang
            </Link>
          </div>
        </div>
      )}
    </div>
  );
}

export default function ResetPasswordPage() {
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
            <h1 className="text-xl font-bold tracking-tight text-white">VibeDesk</h1>
            <p className="text-[10px] text-blue-200 tracking-wider uppercase font-medium">Ticketing System</p>
          </div>
        </div>

        {/* Visual Presentation */}
        <div className="relative z-10 my-auto py-10 space-y-8">
          <div className="space-y-3">
            <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-white/10 border border-white/20 text-white text-xs font-medium">
              <Sparkles className="w-3.5 h-3.5 text-cyan-300" />
              Sistem Keamanan Tinggi
            </div>
            <h2 className="text-3xl lg:text-4xl font-extrabold leading-tight text-white">
              Tentukan kata sandi baru <span className="text-cyan-300">Anda</span>.
            </h2>
            <p className="text-blue-100 text-sm max-w-md leading-relaxed opacity-90">
              Pilih kata sandi yang kuat dan aman untuk melindungi akun Anda dari akses yang tidak sah.
            </p>
          </div>
        </div>

        {/* Brand Footer */}
        <div className="relative z-10 text-xs text-blue-200 opacity-80">
          <p>© 2026 VibeDesk. Powered by FitrahPro.</p>
        </div>
      </div>

      {/* RIGHT SIDE: Reset Password Form Card */}
      <div className="flex-1 flex flex-col justify-center items-center p-6 md:p-12 bg-slate-50 relative overflow-hidden">
        <div className="w-full max-w-md space-y-6">
          <div className="space-y-2 text-left">
            <h2 className="text-2xl font-extrabold tracking-tight text-slate-900 md:text-3xl">
              Atur Ulang Sandi
            </h2>
            <p className="text-sm text-slate-500">
              Silakan masukkan password baru Anda di bawah ini.
            </p>
          </div>

          {/* Form Card with Suspense for Search Params */}
          <div className="rounded-2xl border border-slate-200/80 bg-white p-6 md:p-8 shadow-xl shadow-slate-100/50 relative overflow-hidden">
            <Suspense fallback={
              <div className="flex flex-col items-center justify-center py-10 space-y-4">
                <Loader2 className="w-8 h-8 animate-spin text-blue-500" />
                <p className="text-xs text-slate-550">Memuat verifikasi token...</p>
              </div>
            }>
              <ResetPasswordForm />
            </Suspense>
          </div>
        </div>
      </div>
    </div>
  );
}
