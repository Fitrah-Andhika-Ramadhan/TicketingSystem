'use client';

import { useState } from 'react';
import Link from 'next/link';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Mail, ArrowLeft, AlertCircle, Loader2, Sparkles, Activity, ShieldCheck, CheckCircle2 } from 'lucide-react';
import { toast } from 'sonner';

export default function ForgotPasswordPage() {
  const [email, setEmail] = useState('');
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');
  const [success, setSuccess] = useState(false);
  const [generatedLink, setGeneratedLink] = useState('');

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError('');
    setSuccess(false);
    setGeneratedLink('');
    setLoading(true);

    try {
      const response = await fetch('/api/auth/forgot-password', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ email }),
      });

      const data = await response.json();

      if (response.ok) {
        setSuccess(true);
        toast.success('Link atur ulang sandi berhasil dibuat!');
        if (data.resetLink) {
          setGeneratedLink(data.resetLink);
        }
      } else {
        const errMsg = data.error || 'Gagal memproses permintaan lupa password.';
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
              Sistem Autentikasi Aman
            </div>
            <h2 className="text-3xl lg:text-4xl font-extrabold leading-tight text-white">
              Atur ulang sandi Anda secara <span className="text-cyan-300">cepat & aman</span>.
            </h2>
            <p className="text-blue-100 text-sm max-w-md leading-relaxed opacity-90">
              Cukup masukkan email yang terdaftar, kami akan memverifikasi dan membantu Anda menyetel ulang kata sandi baru dalam hitungan menit.
            </p>
          </div>

          {/* Secure System Widget */}
          <div className="relative w-full max-w-md rounded-2xl bg-white/10 border border-white/10 p-5 shadow-2xl space-y-4 backdrop-blur-md">
            <div className="flex items-center justify-between border-b border-white/10 pb-3">
              <div className="flex items-center gap-1.5">
                <span className="w-2.5 h-2.5 rounded-full bg-emerald-400"></span>
                <span className="w-2.5 h-2.5 rounded-full bg-blue-400"></span>
                <span className="w-2.5 h-2.5 rounded-full bg-cyan-400"></span>
              </div>
              <span className="text-[10px] text-blue-200 font-mono opacity-85">security_auth_audit.json</span>
            </div>
            
            <div className="space-y-2.5">
              <div className="p-3 rounded-xl bg-white/5 border border-white/10 flex items-center justify-between">
                <div className="flex items-center gap-3">
                  <div className="p-2 rounded-lg bg-emerald-500/20 text-emerald-300">
                    <ShieldCheck className="w-4 h-4" />
                  </div>
                  <div>
                    <h4 className="text-xs font-semibold text-white">Token JWT Terenkripsi</h4>
                    <p className="text-[9px] text-blue-200">Kedaluwarsa otomatis dalam 15 menit</p>
                  </div>
                </div>
                <span className="text-[9px] px-2 py-0.5 rounded bg-emerald-500/20 text-emerald-200 border border-emerald-500/30 font-medium">Aktif</span>
              </div>
            </div>
          </div>
        </div>

        {/* Brand Footer */}
        <div className="relative z-10 text-xs text-blue-200 opacity-80">
          <p>© 2026 VibeDesk. Powered by FitrahPro.</p>
        </div>
      </div>

      {/* RIGHT SIDE: Forgot Password Card */}
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

        <div className="w-full max-w-md space-y-6">
          
          <div className="space-y-2 text-left">
            <Link 
              href="/login" 
              className="inline-flex items-center gap-2 text-xs font-semibold text-slate-500 hover:text-slate-800 transition mb-2"
            >
              <ArrowLeft className="w-3.5 h-3.5" />
              Kembali ke Halaman Login
            </Link>
            <h2 className="text-2xl font-extrabold tracking-tight text-slate-900 md:text-3xl">
              Lupa Password?
            </h2>
            <p className="text-sm text-slate-500">
              Masukkan alamat email Anda untuk menerima link atur ulang sandi.
            </p>
          </div>

          {/* Form Card */}
          <div className="rounded-2xl border border-slate-200/80 bg-white p-6 md:p-8 shadow-xl shadow-slate-100/50 relative overflow-hidden">
            
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
                    'Kirim Link Reset'
                  )}
                </Button>
              </form>
            ) : (
              <div className="text-center py-4 space-y-4">
                <div className="inline-flex items-center justify-center w-12 h-12 rounded-full bg-emerald-100 text-emerald-600 mb-2">
                  <CheckCircle2 className="w-6 h-6" />
                </div>
                <h3 className="text-lg font-bold text-slate-900">Permintaan Terkirim!</h3>
                <p className="text-sm text-slate-500 leading-relaxed">
                  Link pengaturan ulang password telah berhasil dibuat untuk <strong>{email}</strong>.
                </p>

                {/* Simulation Link helper */}
                {generatedLink && (
                  <div className="mt-4 p-4 rounded-xl bg-blue-50/50 border border-blue-100 text-left space-y-2">
                    <p className="text-[11px] font-bold text-blue-700 uppercase tracking-wider">
                      🛠️ Pintasan Pengujian (Mock/Dev Mode)
                    </p>
                    <p className="text-xs text-slate-650">
                      Karena ini adalah lingkungan pengembangan, Anda dapat langsung mengklik link di bawah ini tanpa membuka email:
                    </p>
                    <a 
                      href={generatedLink}
                      className="block text-xs text-blue-600 hover:underline break-all font-mono p-2 bg-white rounded border border-blue-200"
                    >
                      {generatedLink}
                    </a>
                  </div>
                )}

                <div className="pt-2">
                  <Link 
                    href="/login" 
                    className="inline-flex items-center gap-1.5 text-xs font-semibold text-blue-600 hover:text-blue-700 hover:underline transition"
                  >
                    Kembali ke halaman login
                  </Link>
                </div>
              </div>
            )}
          </div>
          
        </div>
      </div>
      
    </div>
  );
}
