'use client';

import { useState, useEffect } from 'react';
import Link from 'next/link';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import {
  Ticket,
  MessageSquare,
  Clock,
  BarChart3,
  ArrowRight,
  CheckCircle2,
  Shield,
  Zap,
  Users,
  Mail,
  Phone,
  MapPin,
  Twitter,
  Linkedin,
  Github,
  ChevronLeft,
  ChevronRight,
  Sparkles,
  ChevronRightSquare,
  AlertCircle,
  FileText
} from 'lucide-react';

export default function Landing() {
  const [email, setEmail] = useState('');
  const [subscribed, setSubscribed] = useState(false);
  
  // Text Rotator State
  const rotatorWords = ['Ticketing System', 'SLA Management', 'Customer Support', 'Team Workflows'];
  const [rotatorIndex, setRotatorIndex] = useState(0);

  // Slider State
  const [activeSlide, setActiveSlide] = useState(0);
  const [isHovered, setIsHovered] = useState(false);

  // Rotate text words
  useEffect(() => {
    const textInterval = setInterval(() => {
      setRotatorIndex((prev) => (prev + 1) % rotatorWords.length);
    }, 2800);
    return () => clearInterval(textInterval);
  }, []);

  // Autoplay Slider
  useEffect(() => {
    if (isHovered) return;
    const slideInterval = setInterval(() => {
      setActiveSlide((prev) => (prev + 1) % 3);
    }, 5000);
    return () => clearInterval(slideInterval);
  }, [isHovered]);

  const handleSubscribe = (e: React.FormEvent) => {
    e.preventDefault();
    if (email) {
      setSubscribed(true);
      setEmail('');
      setTimeout(() => setSubscribed(false), 3000);
    }
  };

  const nextSlide = () => {
    setActiveSlide((prev) => (prev + 1) % 3);
  };

  const prevSlide = () => {
    setActiveSlide((prev) => (prev - 1 + 3) % 3);
  };

  return (
    <div className="min-h-screen bg-[#07090e] text-slate-100 font-sans antialiased overflow-x-hidden">
      
      {/* Navigation */}
      <nav className="border-b border-slate-900 sticky top-0 bg-[#07090e]/80 backdrop-blur-md z-50">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-4 flex justify-between items-center">
          <div className="flex items-center gap-2.5 text-2xl font-bold tracking-tight text-white">
            <div className="h-9 w-9 rounded-lg bg-gradient-to-tr from-violet-600 to-blue-500 flex items-center justify-center shadow-md shadow-violet-600/10">
              <Ticket className="w-5 h-5 text-white" />
            </div>
            <span>VibeDesk</span>
          </div>
          <div className="hidden md:flex items-center gap-8 text-sm font-medium text-slate-400">
            <a href="#features" className="hover:text-white transition">Features</a>
            <a href="#slider-showcase" className="hover:text-white transition">Showcase</a>
            <a href="#how-it-works" className="hover:text-white transition">How It Works</a>
            <a href="#contact" className="hover:text-white transition">Contact</a>
            <Link href="/login">
              <Button className="bg-gradient-to-r from-violet-600 to-blue-600 hover:from-violet-500 hover:to-blue-500 border-0 text-white font-semibold shadow-lg shadow-violet-600/15">
                Login Portal
              </Button>
            </Link>
          </div>
          <Link href="/login" className="md:hidden">
            <Button size="sm" className="bg-gradient-to-r from-violet-600 to-blue-600 hover:from-violet-500 hover:to-blue-500 border-0">
              Login
            </Button>
          </Link>
        </div>
      </nav>

      {/* Hero Section */}
      <section className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-24 relative">
        {/* Background Mesh Orbs */}
        <div className="absolute top-[10%] left-[-10%] w-[45%] aspect-square rounded-full bg-violet-600/10 blur-[130px] pointer-events-none" />
        <div className="absolute top-[20%] right-[-10%] w-[35%] aspect-square rounded-full bg-blue-600/10 blur-[110px] pointer-events-none" />

        <div className="text-center mb-16 relative z-10 space-y-6">
          <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-violet-500/10 border border-violet-500/20 text-violet-400 text-xs font-semibold">
            <Sparkles className="w-3.5 h-3.5" />
            Sistem Manajemen Tiket Masa Kini
          </div>
          
          <h1 className="text-4xl sm:text-5xl md:text-6xl lg:text-7xl font-extrabold tracking-tight text-white max-w-4xl mx-auto leading-[1.1]">
            Platform Modern untuk{' '}
            <span className="block h-[1.2em] relative overflow-hidden text-transparent bg-clip-text bg-gradient-to-r from-violet-400 via-indigo-400 to-blue-400">
              <span 
                key={rotatorIndex} 
                className="absolute inset-x-0 top-0 animate-slide-up"
              >
                {rotatorWords[rotatorIndex]}
              </span>
            </span>
          </h1>

          <p className="text-lg md:text-xl text-slate-400 max-w-2xl mx-auto leading-relaxed">
            Kelola, delegasikan, dan selesaikan semua kendala dukungan operasional dengan cepat dalam satu dasbor yang ramping.
          </p>

          <div className="flex gap-4 justify-center pt-4 flex-wrap">
            <Link href="/login">
              <Button className="bg-gradient-to-r from-violet-600 to-blue-600 hover:from-violet-500 hover:to-blue-500 border-0 text-base font-semibold px-8 py-6 flex items-center gap-2 shadow-xl shadow-violet-600/10 active:scale-[0.98] transition">
                Mulai Sekarang <ArrowRight className="w-5 h-5" />
              </Button>
            </Link>
            <a href="#slider-showcase">
              <Button variant="outline" className="text-base px-8 py-6 border-slate-800 hover:bg-slate-900/60 hover:text-white bg-transparent">
                Lihat Showcase
              </Button>
            </a>
          </div>
        </div>

        {/* Hero Quick Statistics Cards */}
        <div className="grid grid-cols-2 md:grid-cols-4 gap-4 mt-16 max-w-5xl mx-auto relative z-10">
          {[
            { value: '50K+', label: 'Tiket Selesai' },
            { value: '2 mnt', label: 'Rata-rata Respon' },
            { value: '99.9%', label: 'Uptime SLA' },
            { value: '500+', label: 'Perusahaan Mitra' },
          ].map((stat, i) => (
            <div key={i} className="rounded-xl border border-slate-900 bg-slate-950/40 p-5 text-center backdrop-blur-sm">
              <div className="text-3xl font-extrabold text-white mb-1.5">{stat.value}</div>
              <p className="text-xs font-semibold uppercase tracking-wider text-slate-500">{stat.label}</p>
            </div>
          ))}
        </div>
      </section>

      {/* Slider Showcase Section */}
      <section id="slider-showcase" className="py-24 border-t border-slate-900 bg-slate-950/30 relative">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center mb-12 space-y-3">
            <h2 className="text-3xl font-extrabold tracking-tight text-white md:text-4xl">Showcase Dasbor Admin</h2>
            <p className="text-slate-400 text-sm max-w-lg mx-auto">Lihat langsung kemudahan alur kerja monitoring dan penyelesaian masalah di VibeDesk.</p>
          </div>

          {/* Interactive Showcase Slider */}
          <div 
            className="relative max-w-5xl mx-auto aspect-video md:aspect-[16/9] rounded-2xl border border-slate-800/80 bg-slate-900/10 overflow-hidden shadow-2xl backdrop-blur-md group"
            onMouseEnter={() => setIsHovered(true)}
            onMouseLeave={() => setIsHovered(false)}
          >
            {/* Slider Contents */}
            <div className="w-full h-full relative flex items-center justify-center p-6 md:p-12">
              
              {/* SLIDE 0: Real-time Analytics Mock */}
              {activeSlide === 0 && (
                <div className="w-full h-full flex flex-col justify-between animate-fade-in">
                  <div className="flex justify-between items-center border-b border-slate-800/60 pb-4">
                    <div>
                      <h3 className="text-lg font-bold text-white flex items-center gap-2">
                        <BarChart3 className="w-5 h-5 text-violet-400" />
                        Real-time Dashboard Analytics
                      </h3>
                      <p className="text-xs text-slate-500">Pemantauan metrik, alokasi tiket, dan workload tim secara instan.</p>
                    </div>
                    <span className="text-[10px] px-2.5 py-1 rounded-full bg-violet-500/10 text-violet-400 border border-violet-500/20 font-mono">live_stats_ok</span>
                  </div>

                  {/* Visual UI Grid Mock */}
                  <div className="grid grid-cols-1 md:grid-cols-3 gap-4 my-auto">
                    <div className="bg-slate-950/80 border border-slate-900 p-4 rounded-xl space-y-2">
                      <p className="text-[10px] text-slate-500 font-bold uppercase tracking-wider">Tiket Masuk</p>
                      <div className="text-2xl font-extrabold text-white">1,482</div>
                      <div className="w-full h-1.5 bg-slate-850 rounded-full overflow-hidden">
                        <div className="h-full bg-violet-500 w-[75%]" />
                      </div>
                      <p className="text-[9px] text-emerald-400 font-medium">+12% dari minggu lalu</p>
                    </div>

                    <div className="bg-slate-950/80 border border-slate-900 p-4 rounded-xl space-y-2">
                      <p className="text-[10px] text-slate-500 font-bold uppercase tracking-wider">Tingkat Resolusi</p>
                      <div className="text-2xl font-extrabold text-white">94.2%</div>
                      <div className="w-full h-1.5 bg-slate-850 rounded-full overflow-hidden">
                        <div className="h-full bg-blue-500 w-[94%]" />
                      </div>
                      <p className="text-[9px] text-slate-400 font-medium">Sesuai dengan target target SLA</p>
                    </div>

                    <div className="bg-slate-950/80 border border-slate-900 p-4 rounded-xl space-y-2">
                      <p className="text-[10px] text-slate-500 font-bold uppercase tracking-wider">Rata-rata Respon</p>
                      <div className="text-2xl font-extrabold text-white">1m 48s</div>
                      <div className="w-full h-1.5 bg-slate-850 rounded-full overflow-hidden">
                        <div className="h-full bg-emerald-500 w-[85%]" />
                      </div>
                      <p className="text-[9px] text-emerald-400 font-medium">Memenuhi target respon cepat</p>
                    </div>
                  </div>

                  <div className="text-center text-xs text-slate-500 pt-4 border-t border-slate-850">
                    *Tampilan grafik diperbarui setiap 5 detik dengan database PostgreSQL.
                  </div>
                </div>
              )}

              {/* SLIDE 1: SLA Control Panel Mock */}
              {activeSlide === 1 && (
                <div className="w-full h-full flex flex-col justify-between animate-fade-in">
                  <div className="flex justify-between items-center border-b border-slate-800/60 pb-4">
                    <div>
                      <h3 className="text-lg font-bold text-white flex items-center gap-2">
                        <Clock className="w-5 h-5 text-rose-400" />
                        SLA Breach Control Room
                      </h3>
                      <p className="text-xs text-slate-500">Sistem peringatan otomatis saat tiket terancam melanggar batas SLA.</p>
                    </div>
                    <span className="text-[10px] px-2.5 py-1 rounded-full bg-rose-500/10 text-rose-400 border border-rose-500/20 font-mono">sla_engine_active</span>
                  </div>

                  {/* SLA Alert List Visual */}
                  <div className="space-y-3 my-auto max-w-xl mx-auto w-full">
                    <div className="p-3 bg-slate-950/80 border border-slate-900 rounded-xl flex items-center justify-between">
                      <div className="flex items-center gap-3">
                        <div className="p-2 rounded-lg bg-rose-500/10 text-rose-400">
                          <AlertCircle className="w-4 h-4" />
                        </div>
                        <div>
                          <h4 className="text-xs font-semibold text-slate-200">SLA Breach Warning: #VD-4821</h4>
                          <p className="text-[9px] text-slate-500">Problem: Gagal bayar payment gateway • Admin NataGroup</p>
                        </div>
                      </div>
                      <span className="text-[9px] px-2.5 py-1 rounded bg-rose-500/10 text-rose-400 font-mono">12 mnt tersisa</span>
                    </div>

                    <div className="p-3 bg-slate-950/80 border border-slate-900 rounded-xl flex items-center justify-between">
                      <div className="flex items-center gap-3">
                        <div className="p-2 rounded-lg bg-amber-500/10 text-amber-400">
                          <Clock className="w-4 h-4" />
                        </div>
                        <div>
                          <h4 className="text-xs font-semibold text-slate-200">Pending Customer Action: #VD-4819</h4>
                          <p className="text-[9px] text-slate-500">Support menunggu kelengkapan bukti screenshot dari user</p>
                        </div>
                      </div>
                      <span className="text-[9px] px-2.5 py-1 rounded bg-amber-500/10 text-amber-400 font-mono">Awaiting</span>
                    </div>
                  </div>

                  <div className="text-center text-xs text-slate-500 pt-4 border-t border-slate-850">
                    Sistem notifikasi dapat diintegrasikan dengan Slack, Discord, dan Email secara instan.
                  </div>
                </div>
              )}

              {/* SLIDE 2: Team Collaboration Mock */}
              {activeSlide === 2 && (
                <div className="w-full h-full flex flex-col justify-between animate-fade-in">
                  <div className="flex justify-between items-center border-b border-slate-800/60 pb-4">
                    <div>
                      <h3 className="text-lg font-bold text-white flex items-center gap-2">
                        <MessageSquare className="w-5 h-5 text-emerald-400" />
                        Collaboration & Team Workroom
                      </h3>
                      <p className="text-xs text-slate-500">Berbagi catatan internal antar agen, membagi tim, dan melampirkan berkas penunjang.</p>
                    </div>
                    <span className="text-[10px] px-2.5 py-1 rounded-full bg-emerald-500/10 text-emerald-400 border border-emerald-500/20 font-mono">collab_online</span>
                  </div>

                  {/* Chat / Comments Visual representation */}
                  <div className="space-y-3.5 my-auto max-w-lg mx-auto w-full">
                    <div className="flex gap-3 items-start">
                      <div className="w-7 h-7 rounded-full bg-violet-600 flex items-center justify-center text-xs font-bold text-white mt-0.5">
                        A
                      </div>
                      <div className="flex-1 bg-slate-950/80 border border-slate-900 rounded-xl p-3">
                        <div className="flex justify-between items-center mb-1">
                          <span className="text-xs font-bold text-slate-200">Admin User</span>
                          <span className="text-[9px] text-slate-500">10:45 AM</span>
                        </div>
                        <p className="text-xs text-slate-400">Saya telah melakukan reset API key di sisi staging. Tolong bantu verifikasi dari klien.</p>
                      </div>
                    </div>

                    <div className="flex gap-3 items-start pl-8">
                      <div className="w-7 h-7 rounded-full bg-blue-500 flex items-center justify-center text-xs font-bold text-white mt-0.5">
                        T
                      </div>
                      <div className="flex-1 bg-violet-950/20 border border-violet-900/30 rounded-xl p-3">
                        <div className="flex justify-between items-center mb-1">
                          <span className="text-xs font-bold text-violet-300">Tim Contractor (Internal Note)</span>
                          <span className="text-[9px] text-slate-500 font-mono">Internal</span>
                        </div>
                        <p className="text-xs text-slate-300">Sudah aman di sisi staging, log DB menunjukkan status sukses.</p>
                      </div>
                    </div>
                  </div>

                  <div className="text-center text-xs text-slate-500 pt-4 border-t border-slate-850">
                    Membedakan percakapan Publik (ke Pelanggan) dan Internal (hanya untuk Agen Dukungan).
                  </div>
                </div>
              )}

            </div>

            {/* Slider Controls (Arrow Buttons) */}
            <button 
              onClick={prevSlide}
              className="absolute left-4 top-1/2 -translate-y-1/2 p-2 rounded-full border border-slate-850 bg-slate-950/60 hover:bg-slate-900 text-slate-400 hover:text-white cursor-pointer opacity-0 group-hover:opacity-100 transition"
              aria-label="Previous Slide"
            >
              <ChevronLeft className="w-5 h-5" />
            </button>
            
            <button 
              onClick={nextSlide}
              className="absolute right-4 top-1/2 -translate-y-1/2 p-2 rounded-full border border-slate-850 bg-slate-950/60 hover:bg-slate-900 text-slate-400 hover:text-white cursor-pointer opacity-0 group-hover:opacity-100 transition"
              aria-label="Next Slide"
            >
              <ChevronRight className="w-5 h-5" />
            </button>

            {/* Slide Indicators / Dots */}
            <div className="absolute bottom-4 left-1/2 -translate-x-1/2 flex gap-2">
              {[0, 1, 2].map((idx) => (
                <button
                  key={idx}
                  onClick={() => setActiveSlide(idx)}
                  className={`w-2.5 h-2.5 rounded-full border-0 transition-all cursor-pointer ${
                    activeSlide === idx ? 'bg-violet-500 w-6' : 'bg-slate-700 hover:bg-slate-650'
                  }`}
                  aria-label={`Go to slide ${idx + 1}`}
                />
              ))}
            </div>

          </div>
        </div>
      </section>

      {/* Features Grid Section */}
      <section id="features" className="py-24 border-t border-slate-900 bg-gradient-to-b from-[#07090e] to-[#040609]">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center mb-16 space-y-4">
            <h2 className="text-3xl font-extrabold tracking-tight text-white md:text-4xl">Fitur Utama Platform</h2>
            <p className="text-slate-400 text-base max-w-xl mx-auto">Semua utilitas esensial untuk melayani pelanggan dengan andal dan terstruktur.</p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
            
            {/* Ticket Management */}
            <div className="rounded-2xl border border-slate-900 bg-slate-950/40 p-6 space-y-4 hover:border-slate-800/80 hover:bg-slate-950/80 transition duration-300">
              <div className="h-12 w-12 rounded-xl bg-violet-600/10 text-violet-400 flex items-center justify-center">
                <Ticket className="w-6 h-6" />
              </div>
              <h3 className="text-xl font-bold text-white">Manajemen Tiket</h3>
              <p className="text-slate-400 text-sm leading-relaxed">
                Pembuatan tiket, pelacakan riwayat aktivitas tiket secara audit, dan prioritas kendala terotomatisasi.
              </p>
              <ul className="space-y-2 pt-2 text-xs text-slate-400">
                <li className="flex items-center gap-2"><CheckCircle2 className="w-4 h-4 text-emerald-400" /> Nomor tiket otomatis</li>
                <li className="flex items-center gap-2"><CheckCircle2 className="w-4 h-4 text-emerald-400" /> Pengelompokkan kategori lengkap</li>
                <li className="flex items-center gap-2"><CheckCircle2 className="w-4 h-4 text-emerald-400" /> Upload attachment lampiran bukti</li>
              </ul>
            </div>

            {/* Collaboration */}
            <div className="rounded-2xl border border-slate-900 bg-slate-950/40 p-6 space-y-4 hover:border-slate-800/80 hover:bg-slate-950/80 transition duration-300">
              <div className="h-12 w-12 rounded-xl bg-blue-600/10 text-blue-400 flex items-center justify-center">
                <MessageSquare className="w-6 h-6" />
              </div>
              <h3 className="text-xl font-bold text-white">Kolaborasi Tim</h3>
              <p className="text-slate-400 text-sm leading-relaxed">
                Berbagi catatan rahasia khusus tim internal dan merespon langsung ke pelanggan di halaman tiket yang sama.
              </p>
              <ul className="space-y-2 pt-2 text-xs text-slate-400">
                <li className="flex items-center gap-2"><CheckCircle2 className="w-4 h-4 text-emerald-400" /> Balasan publik ke pelanggan</li>
                <li className="flex items-center gap-2"><CheckCircle2 className="w-4 h-4 text-emerald-400" /> Catatan internal rahasia antar agen</li>
                <li className="flex items-center gap-2"><CheckCircle2 className="w-4 h-4 text-emerald-400" /> Indikator tim aktif</li>
              </ul>
            </div>

            {/* Performance SLA */}
            <div className="rounded-2xl border border-slate-900 bg-slate-950/40 p-6 space-y-4 hover:border-slate-800/80 hover:bg-slate-950/80 transition duration-300">
              <div className="h-12 w-12 rounded-xl bg-emerald-600/10 text-emerald-400 flex items-center justify-center">
                <Clock className="w-6 h-6" />
              </div>
              <h3 className="text-xl font-bold text-white">Pemantauan SLA</h3>
              <p className="text-slate-400 text-sm leading-relaxed">
                Pengukuran performa penanganan kendala berdasarkan tenggat waktu tanggap (SLA) demi komitmen layanan.
              </p>
              <ul className="space-y-2 pt-2 text-xs text-slate-400">
                <li className="flex items-center gap-2"><CheckCircle2 className="w-4 h-4 text-emerald-400" /> Countdown sisa waktu SLA</li>
                <li className="flex items-center gap-2"><CheckCircle2 className="w-4 h-4 text-emerald-400" /> Perhitungan rata-rata respon</li>
                <li className="flex items-center gap-2"><CheckCircle2 className="w-4 h-4 text-emerald-400" /> Notifikasi peringatan dini</li>
              </ul>
            </div>

          </div>
        </div>
      </section>

      {/* How It Works Section */}
      <section id="how-it-works" className="py-24 border-t border-slate-900 bg-slate-950/20">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center mb-16 space-y-4">
            <h2 className="text-3xl font-extrabold tracking-tight text-white md:text-4xl">Cara Kerja VibeDesk</h2>
            <p className="text-slate-400 text-base max-w-lg mx-auto">Alur penanganan kendala yang ringkas dalam 3 langkah terencana.</p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-12 max-w-5xl mx-auto">
            {[
              {
                step: '01',
                title: 'Kirim Kendala',
                description: 'Pelanggan atau agen mengirimkan tiket baru yang berisi deskripsi masalah dan kategori.'
              },
              {
                step: '02',
                title: 'Delegasikan & Tuntaskan',
                description: 'Tiket didistribusikan kepada agen yang tepat untuk dikoordinasikan dan diselesaikan.'
              },
              {
                step: '03',
                title: 'Monitor & Evaluasi',
                description: 'Admin memantau kualitas layanan, waktu penyelesaian, dan kepuasan pelanggan secara real-time.'
              }
            ].map((item, i) => (
              <div key={i} className="text-left relative space-y-3.5">
                <div className="text-5xl font-black text-violet-500/10 font-mono tracking-wider">{item.step}</div>
                <h3 className="text-xl font-bold text-white">{item.title}</h3>
                <p className="text-sm text-slate-400 leading-relaxed">{item.description}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* CTA Section */}
      <section className="py-20 border-t border-slate-900 bg-[#0c101a] relative overflow-hidden text-center">
        <div className="absolute top-[-50%] left-[-10%] w-[50%] aspect-square rounded-full bg-violet-600/5 blur-[120px] pointer-events-none" />
        <div className="absolute bottom-[-50%] right-[-10%] w-[50%] aspect-square rounded-full bg-blue-600/5 blur-[120px] pointer-events-none" />

        <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 relative z-10 space-y-6">
          <h2 className="text-3xl sm:text-4xl font-extrabold text-white">Siap Mengoptimalkan Operasional Dukungan Anda?</h2>
          <p className="text-base text-slate-400 max-w-lg mx-auto">
            Bergabunglah dengan tim yang mengedepankan performa respon dan penyelesaian tiket yang terstruktur.
          </p>
          <Link href="/login">
            <Button size="lg" className="bg-gradient-to-r from-violet-600 to-blue-600 hover:from-violet-500 hover:to-blue-500 text-white font-semibold shadow-lg shadow-violet-600/10 active:scale-[0.98] transition px-8 py-6 rounded-lg cursor-pointer border-0">
              Masuk Dashboard Admin
            </Button>
          </Link>
        </div>
      </section>

      {/* Contact & Newsletter Section */}
      <section id="contact" className="py-24 border-t border-slate-900 bg-slate-950/40">
        <div className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8">
          
          <div className="text-center mb-16 space-y-4">
            <h2 className="text-3xl font-extrabold tracking-tight text-white md:text-4xl">Hubungi Kami</h2>
            <p className="text-slate-400 text-base">Butuh bantuan integrasi atau info kustomisasi? Kami siap mendampingi.</p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-16">
            <div className="rounded-xl border border-slate-900 bg-slate-950/80 p-6 text-center space-y-3.5">
              <div className="h-10 w-10 rounded-lg bg-violet-600/10 text-violet-400 flex items-center justify-center mx-auto">
                <Mail className="w-5 h-5" />
              </div>
              <h3 className="font-bold text-white">Email</h3>
              <a href="mailto:support@natagroup.com" className="text-sm text-violet-400 hover:underline">
                support@natagroup.com
              </a>
            </div>

            <div className="rounded-xl border border-slate-900 bg-slate-950/80 p-6 text-center space-y-3.5">
              <div className="h-10 w-10 rounded-lg bg-blue-600/10 text-blue-400 flex items-center justify-center mx-auto">
                <Phone className="w-5 h-5" />
              </div>
              <h3 className="font-bold text-white">Telepon</h3>
              <a href="tel:+62215678900" className="text-sm text-blue-400 hover:underline">
                +62 (21) 567-8900
              </a>
            </div>

            <div className="rounded-xl border border-slate-900 bg-slate-950/80 p-6 text-center space-y-3.5">
              <div className="h-10 w-10 rounded-lg bg-emerald-600/10 text-emerald-400 flex items-center justify-center mx-auto">
                <MapPin className="w-5 h-5" />
              </div>
              <h3 className="font-bold text-white">Kantor Pusat</h3>
              <p className="text-sm text-slate-400">Jakarta, Indonesia</p>
            </div>
          </div>

          {/* Newsletter Box */}
          <div className="max-w-2xl mx-auto rounded-2xl border border-slate-850 bg-slate-900/10 p-8 text-center backdrop-blur-md">
            <h3 className="text-xl font-bold text-white mb-2">Berlangganan Newsletter</h3>
            <p className="text-slate-400 text-xs mb-6">Dapatkan info pembaruan fitur baru dan tips SLA manajemen gratis.</p>
            <form onSubmit={handleSubscribe} className="flex gap-2 max-w-md mx-auto">
              <input
                type="email"
                placeholder="alamat@email.com"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                className="flex-1 px-4 py-2.5 bg-slate-950 border border-slate-800 rounded-lg text-slate-100 placeholder:text-slate-600 focus:outline-none focus:border-violet-500 transition text-sm"
                required
              />
              <Button type="submit" className="bg-gradient-to-r from-violet-600 to-blue-600 hover:from-violet-500 hover:to-blue-500 border-0 text-white font-semibold px-5 rounded-lg active:scale-[0.98] transition cursor-pointer">
                Langganan
              </Button>
            </form>
            {subscribed && (
              <p className="text-emerald-400 text-xs mt-3">Terima kasih! Anda berhasil terdaftar ke newsletter kami.</p>
            )}
          </div>

        </div>
      </section>

      {/* Footer */}
      <footer className="bg-[#05070a] text-slate-500 py-12 border-t border-slate-950">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="grid grid-cols-1 md:grid-cols-4 gap-8 mb-8">
            <div className="space-y-3">
              <h3 className="font-bold text-white flex items-center gap-2">
                <div className="h-6 w-6 rounded bg-gradient-to-tr from-violet-600 to-blue-500 flex items-center justify-center">
                  <Ticket className="w-3.5 h-3.5 text-white" />
                </div>
                VibeDesk
              </h3>
              <p className="text-xs leading-relaxed text-slate-600">
                Solusi manajemen tiket premium untuk operasional tim dukungan Anda.
              </p>
            </div>

            <div>
              <h4 className="font-semibold text-white text-xs uppercase tracking-wider mb-4">Fitur</h4>
              <ul className="space-y-2 text-xs">
                <li><a href="#features" className="hover:text-white transition">Manajemen Tiket</a></li>
                <li><a href="#features" className="hover:text-white transition">Kolaborasi Tim</a></li>
                <li><a href="#features" className="hover:text-white transition">Pantau SLA</a></li>
              </ul>
            </div>

            <div>
              <h4 className="font-semibold text-white text-xs uppercase tracking-wider mb-4">Perusahaan</h4>
              <ul className="space-y-2 text-xs">
                <li><span className="hover:text-white cursor-pointer transition">Tentang Kami</span></li>
                <li><span className="hover:text-white cursor-pointer transition">Blog</span></li>
                <li><span className="hover:text-white cursor-pointer transition">Karir</span></li>
              </ul>
            </div>

            <div>
              <h4 className="font-semibold text-white text-xs uppercase tracking-wider mb-4">Hukum</h4>
              <ul className="space-y-2 text-xs">
                <li><span className="hover:text-white cursor-pointer transition">Kebijakan Privasi</span></li>
                <li><span className="hover:text-white cursor-pointer transition">Syarat & Ketentuan</span></li>
              </ul>
            </div>
          </div>

          <div className="border-t border-slate-900 pt-8 flex flex-col md:flex-row justify-between items-center gap-4">
            <p className="text-xs">&copy; 2026 VibeDesk. All rights reserved. Powered by NataGroup.</p>
            <div className="flex gap-4">
              <span className="hover:text-white cursor-pointer transition"><Twitter className="w-4 h-4" /></span>
              <span className="hover:text-white cursor-pointer transition"><Linkedin className="w-4 h-4" /></span>
              <span className="hover:text-white cursor-pointer transition"><Github className="w-4 h-4" /></span>
            </div>
          </div>
        </div>
      </footer>
    </div>
  );
}
