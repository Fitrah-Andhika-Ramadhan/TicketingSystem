'use client';

import { useState, useEffect } from 'react';
import Link from 'next/link';
import { Button } from '@/components/ui/button';
import { Card, CardContent } from '@/components/ui/card';
import {
  Ticket,
  MessageSquare,
  Clock,
  BarChart3,
  ArrowRight,
  CheckCircle2,
  Sparkles,
  AlertCircle,
  ChevronLeft,
  ChevronRight,
  Mail,
  Phone,
  MapPin,
  Twitter,
  Linkedin,
  Github
} from 'lucide-react';

export default function Landing() {
  const [email, setEmail] = useState('');
  const [subscribed, setSubscribed] = useState(false);
  const [content, setContent] = useState<any>(null);
  const [sysSettings, setSysSettings] = useState<any>({
    email: 'support@fitrahpro.com',
    phone: '+62 (21) 567-8900',
    location: 'Jakarta, Indonesia'
  });
  
  // Text Rotator State
  const rotatorWords = ['Sistem Tiket', 'Manajemen SLA', 'Dukungan Pelanggan', 'Kolaborasi Tim'];
  const [rotatorIndex, setRotatorIndex] = useState(0);

  // Slider State
  const [activeSlide, setActiveSlide] = useState(0);
  const [isHovered, setIsHovered] = useState(false);

  // Load landing content and settings dynamically
  useEffect(() => {
    const loadContent = async () => {
      try {
        const res = await fetch('/api/landing/content');
        const data = await res.json();
        if (data.success) {
          setContent(data.data);
        }
      } catch (err) {
        console.error('Failed to load landing content:', err);
      }
    };

    const loadSettings = async () => {
      try {
        const res = await fetch('/api/settings');
        const data = await res.json();
        if (data.success) {
          setSysSettings(data.data);
        } else {
          const stored = localStorage.getItem('vibedesk_settings');
          if (stored) {
            setSysSettings(JSON.parse(stored));
          }
        }
      } catch (err) {
        const stored = localStorage.getItem('vibedesk_settings');
        if (stored) {
          setSysSettings(JSON.parse(stored));
        }
      }
    };

    loadContent();
    loadSettings();
  }, []);

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

  const c = content || {
    hero: {
      title: 'FitrahPro',
      subtitle: 'Sistem Manajemen Tiket Masa Kini',
      description: 'Kelola, delegasikan, dan selesaikan semua kendala dukungan operasional dengan cepat dalam satu dasbor yang ramping.',
      ctaText: 'Mulai Sekarang'
    },
    stats: {
      projects: 50,
      units: 2,
      yearsExperience: 99.9,
      satisfaction: 500
    },
    about: {
      title: 'Tentang FitrahPro',
      description: 'Dengan pengalaman bertahun-tahun, FitrahPro menghadirkan solusi teknologi mutakhir untuk mempermudah operasional bisnis dan penanganan dukungan pelanggan di Indonesia.',
      mission: 'Menyediakan platform manajemen operasional & dukungan pelanggan yang mulus bagi seluruh pelaku industri digital.',
      vision: 'Menjadi standar ekosistem platform helpdesk & SLA monitoring terdepan di Asia Tenggara.'
    }
  };

  return (
    <div className="min-h-screen bg-slate-50 text-slate-800 font-sans antialiased overflow-x-hidden">
      
      {/* Navigation */}
      <nav className="border-b border-slate-100 sticky top-0 bg-white/90 backdrop-blur-md z-50 shadow-sm">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-4 flex justify-between items-center">
          <div className="flex items-center gap-2.5 text-2xl font-bold tracking-tight text-slate-900">
            <img 
              src="/icon.svg" 
              alt="VibeDesk Logo" 
              className="h-9 w-9 rounded-lg border border-blue-500/20 shadow-md object-cover"
            />
            <span className="bg-gradient-to-r from-blue-700 to-cyan-600 bg-clip-text text-transparent">VibeDesk</span>
          </div>
          <div className="hidden md:flex items-center gap-8 text-sm font-semibold text-slate-600">
            <a href="#features" className="hover:text-blue-600 transition">Features</a>
            <a href="#slider-showcase" className="hover:text-blue-600 transition">Showcase</a>
            <a href="#how-it-works" className="hover:text-blue-600 transition">How It Works</a>
            <a href="#contact" className="hover:text-blue-600 transition">Contact</a>
            <Link href="/login">
              <Button className="bg-gradient-to-r from-blue-600 to-cyan-500 hover:from-blue-700 hover:to-cyan-600 border-0 text-white font-semibold shadow-lg shadow-blue-500/10 transition duration-200">
                Login Portal
              </Button>
            </Link>
          </div>
          <Link href="/login" className="md:hidden">
            <Button size="sm" className="bg-gradient-to-r from-blue-600 to-cyan-500 hover:from-blue-700 hover:to-cyan-600 border-0 text-white">
              Login
            </Button>
          </Link>
        </div>
      </nav>

      {/* Hero Section */}
      <section className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-20 relative">
        {/* Background Mesh Orbs */}
        <div className="absolute top-[10%] left-[-10%] w-[45%] aspect-square rounded-full bg-blue-500/5 blur-[130px] pointer-events-none" />
        <div className="absolute top-[20%] right-[-10%] w-[35%] aspect-square rounded-full bg-cyan-500/5 blur-[110px] pointer-events-none" />

        <div className="text-center mb-16 relative z-10 space-y-6">
          <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-blue-500/10 border border-blue-500/20 text-blue-600 text-xs font-semibold">
            <Sparkles className="w-3.5 h-3.5" />
            {c.hero.subtitle}
          </div>
          
          <h1 className="text-4xl sm:text-5xl md:text-6xl lg:text-7xl font-extrabold tracking-tight text-slate-900 max-w-4xl mx-auto leading-[1.1]">
            Platform Modern untuk{' '}
            <span className="block h-[1.2em] relative overflow-hidden">
              <span 
                key={rotatorIndex} 
                className="absolute inset-x-0 top-0 animate-slide-up text-transparent bg-clip-text bg-gradient-to-r from-blue-600 via-blue-500 to-cyan-500"
              >
                {rotatorWords[rotatorIndex]}
              </span>
            </span>
          </h1>

          <p className="text-lg md:text-xl text-slate-600 max-w-2xl mx-auto leading-relaxed">
            {c.hero.description}
          </p>

          <div className="flex gap-4 justify-center pt-4 flex-wrap">
            <Link href="/login">
              <Button className="bg-gradient-to-r from-blue-600 to-cyan-500 hover:from-blue-700 hover:to-cyan-600 border-0 text-base font-semibold px-8 py-6 flex items-center gap-2 shadow-xl shadow-blue-500/20 active:scale-[0.98] transition">
                {c.hero.ctaText} <ArrowRight className="w-5 h-5" />
              </Button>
            </Link>
            <a href="#slider-showcase">
              <Button variant="outline" className="text-base px-8 py-6 border-slate-200 hover:bg-slate-100 hover:text-slate-900 bg-white">
                Lihat Showcase
              </Button>
            </a>
          </div>
        </div>

        {/* Hero Quick Statistics Cards */}
        <div className="grid grid-cols-2 md:grid-cols-4 gap-4 mt-16 max-w-5xl mx-auto relative z-10">
          {[
            { value: `${c.stats.projects}K+`, label: 'Tiket Selesai' },
            { value: `${c.stats.units} mnt`, label: 'Rata-rata Respon' },
            { value: `${c.stats.yearsExperience}%`, label: 'Uptime SLA' },
            { value: `${c.stats.satisfaction}+`, label: 'Perusahaan Mitra' },
          ].map((stat, i) => (
            <div key={i} className="rounded-xl border border-slate-100 bg-white p-5 text-center shadow-md">
              <div className="text-3xl font-extrabold text-blue-600 mb-1.5">{stat.value}</div>
              <p className="text-xs font-bold uppercase tracking-wider text-slate-400">{stat.label}</p>
            </div>
          ))}
        </div>
      </section>

      {/* Slider Showcase Section */}
      <section id="slider-showcase" className="py-20 border-t border-slate-100 bg-white relative">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center mb-12 space-y-3">
            <h2 className="text-3xl font-extrabold tracking-tight text-slate-900 md:text-4xl">Showcase Dasbor Admin</h2>
            <p className="text-slate-600 text-sm max-w-lg mx-auto">Lihat langsung kemudahan alur kerja monitoring dan penyelesaian masalah di VibeDesk.</p>
          </div>

          {/* Interactive Showcase Slider */}
          <div 
            className="relative max-w-5xl mx-auto aspect-video md:aspect-[16/9] rounded-2xl border border-slate-200 bg-slate-50/50 overflow-hidden shadow-xl group"
            onMouseEnter={() => setIsHovered(true)}
            onMouseLeave={() => setIsHovered(false)}
          >
            {/* Slider Contents */}
            <div className="w-full h-full relative flex items-center justify-center p-6 md:p-12">
              
              {/* SLIDE 0: Real-time Analytics Mock */}
              {activeSlide === 0 && (
                <div className="w-full h-full flex flex-col justify-between animate-fade-in">
                  <div className="flex justify-between items-center border-b border-slate-200 pb-4">
                    <div>
                      <h3 className="text-lg font-bold text-slate-900 flex items-center gap-2">
                        <BarChart3 className="w-5 h-5 text-blue-600" />
                        Real-time Dashboard Analytics
                      </h3>
                      <p className="text-xs text-slate-500">Pemantauan metrik, alokasi tiket, dan workload tim secara instan.</p>
                    </div>
                    <span className="text-[10px] px-2.5 py-1 rounded-full bg-blue-50 text-blue-600 border border-blue-100 font-mono">live_stats_ok</span>
                  </div>

                  {/* Visual UI Grid Mock */}
                  <div className="grid grid-cols-1 md:grid-cols-3 gap-4 my-auto">
                    <div className="bg-white border border-slate-100 p-4 rounded-xl space-y-2 shadow-sm">
                      <p className="text-[10px] text-slate-400 font-bold uppercase tracking-wider">Tiket Masuk</p>
                      <div className="text-2xl font-extrabold text-slate-800">1,482</div>
                      <div className="w-full h-1.5 bg-slate-100 rounded-full overflow-hidden">
                        <div className="h-full bg-blue-600 w-[75%]" />
                      </div>
                      <p className="text-[9px] text-emerald-600 font-medium">+12% dari minggu lalu</p>
                    </div>

                    <div className="bg-white border border-slate-100 p-4 rounded-xl space-y-2 shadow-sm">
                      <p className="text-[10px] text-slate-400 font-bold uppercase tracking-wider">Tingkat Resolusi</p>
                      <div className="text-2xl font-extrabold text-slate-800">94.2%</div>
                      <div className="w-full h-1.5 bg-slate-100 rounded-full overflow-hidden">
                        <div className="h-full bg-cyan-500 w-[94%]" />
                      </div>
                      <p className="text-[9px] text-slate-500 font-medium">Sesuai dengan target target SLA</p>
                    </div>

                    <div className="bg-white border border-slate-100 p-4 rounded-xl space-y-2 shadow-sm">
                      <p className="text-[10px] text-slate-400 font-bold uppercase tracking-wider">Rata-rata Respon</p>
                      <div className="text-2xl font-extrabold text-slate-800">1m 48s</div>
                      <div className="w-full h-1.5 bg-slate-100 rounded-full overflow-hidden">
                        <div className="h-full bg-emerald-500 w-[85%]" />
                      </div>
                      <p className="text-[9px] text-emerald-600 font-medium">Memenuhi target respon cepat</p>
                    </div>
                  </div>

                  <div className="text-center text-xs text-slate-400 pt-4 border-t border-slate-100">
                    *Tampilan grafik diperbarui secara otomatis menggunakan client-side database.
                  </div>
                </div>
              )}

              {/* SLIDE 1: SLA Control Panel Mock */}
              {activeSlide === 1 && (
                <div className="w-full h-full flex flex-col justify-between animate-fade-in">
                  <div className="flex justify-between items-center border-b border-slate-200 pb-4">
                    <div>
                      <h3 className="text-lg font-bold text-slate-900 flex items-center gap-2">
                        <Clock className="w-5 h-5 text-rose-500" />
                        SLA Breach Control Room
                      </h3>
                      <p className="text-xs text-slate-500">Sistem peringatan otomatis saat tiket terancam melanggar batas SLA.</p>
                    </div>
                    <span className="text-[10px] px-2.5 py-1 rounded-full bg-rose-50 text-rose-600 border border-rose-100 font-mono">sla_engine_active</span>
                  </div>

                  {/* SLA Alert List Visual */}
                  <div className="space-y-3 my-auto max-w-xl mx-auto w-full">
                    <div className="p-3 bg-white border border-slate-100 rounded-xl flex items-center justify-between shadow-sm">
                      <div className="flex items-center gap-3">
                        <div className="p-2 rounded-lg bg-rose-50 text-rose-500">
                          <AlertCircle className="w-4 h-4" />
                        </div>
                        <div>
                          <h4 className="text-xs font-semibold text-slate-800">SLA Breach Warning: #VD-4821</h4>
                          <p className="text-[9px] text-slate-400">Problem: Gagal bayar payment gateway • Admin NataGroup</p>
                        </div>
                      </div>
                      <span className="text-[9px] px-2.5 py-1 rounded bg-rose-50 text-rose-600 font-mono">12 mnt tersisa</span>
                    </div>

                    <div className="p-3 bg-white border border-slate-100 rounded-xl flex items-center justify-between shadow-sm">
                      <div className="flex items-center gap-3">
                        <div className="p-2 rounded-lg bg-amber-50 text-amber-500">
                          <Clock className="w-4 h-4" />
                        </div>
                        <div>
                          <h4 className="text-xs font-semibold text-slate-800">Pending Customer Action: #VD-4819</h4>
                          <p className="text-[9px] text-slate-400">Support menunggu kelengkapan bukti screenshot dari user</p>
                        </div>
                      </div>
                      <span className="text-[9px] px-2.5 py-1 rounded bg-amber-50 text-amber-600 font-mono">Awaiting</span>
                    </div>
                  </div>

                  <div className="text-center text-xs text-slate-400 pt-4 border-t border-slate-100">
                    Sistem notifikasi dapat diintegrasikan dengan Slack, Discord, dan Email secara instan.
                  </div>
                </div>
              )}

              {/* SLIDE 2: Team Collaboration Mock */}
              {activeSlide === 2 && (
                <div className="w-full h-full flex flex-col justify-between animate-fade-in">
                  <div className="flex justify-between items-center border-b border-slate-200 pb-4">
                    <div>
                      <h3 className="text-lg font-bold text-slate-900 flex items-center gap-2">
                        <MessageSquare className="w-5 h-5 text-cyan-600" />
                        Collaboration & Team Workroom
                      </h3>
                      <p className="text-xs text-slate-500">Berbagi catatan internal antar agen, membagi tim, dan melampirkan berkas penunjang.</p>
                    </div>
                    <span className="text-[10px] px-2.5 py-1 rounded-full bg-cyan-50 text-cyan-600 border border-cyan-100 font-mono">collab_online</span>
                  </div>

                  {/* Chat / Comments Visual representation */}
                  <div className="space-y-3.5 my-auto max-w-lg mx-auto w-full">
                    <div className="flex gap-3 items-start">
                      <div className="w-7 h-7 rounded-full bg-blue-600 flex items-center justify-center text-xs font-bold text-white mt-0.5">
                        A
                      </div>
                      <div className="flex-1 bg-white border border-slate-100 rounded-xl p-3 shadow-sm">
                        <div className="flex justify-between items-center mb-1">
                          <span className="text-xs font-bold text-slate-800">Admin User</span>
                          <span className="text-[9px] text-slate-400">10:45 AM</span>
                        </div>
                        <p className="text-xs text-slate-600">Saya telah melakukan reset API key di sisi staging. Tolong bantu verifikasi dari klien.</p>
                      </div>
                    </div>

                    <div className="flex gap-3 items-start pl-8">
                      <div className="w-7 h-7 rounded-full bg-cyan-500 flex items-center justify-center text-xs font-bold text-white mt-0.5">
                        T
                      </div>
                      <div className="flex-1 bg-cyan-50 border border-cyan-100/50 rounded-xl p-3 shadow-sm">
                        <div className="flex justify-between items-center mb-1">
                          <span className="text-xs font-bold text-cyan-700">Tim Contractor (Internal Note)</span>
                          <span className="text-[9px] text-slate-400 font-mono">Internal</span>
                        </div>
                        <p className="text-xs text-cyan-900">Sudah aman di sisi staging, log DB menunjukkan status sukses.</p>
                      </div>
                    </div>
                  </div>

                  <div className="text-center text-xs text-slate-400 pt-4 border-t border-slate-100">
                    Membedakan percakapan Publik (ke Pelanggan) dan Internal (hanya untuk Agen Dukungan).
                  </div>
                </div>
              )}

            </div>

            {/* Slider Controls (Arrow Buttons) */}
            <button 
              onClick={prevSlide}
              className="absolute left-4 top-1/2 -translate-y-1/2 p-2 rounded-full border border-slate-200 bg-white/80 hover:bg-slate-100 text-slate-600 cursor-pointer opacity-0 group-hover:opacity-100 transition shadow-md"
              aria-label="Previous Slide"
            >
              <ChevronLeft className="w-5 h-5" />
            </button>
            
            <button 
              onClick={nextSlide}
              className="absolute right-4 top-1/2 -translate-y-1/2 p-2 rounded-full border border-slate-200 bg-white/80 hover:bg-slate-100 text-slate-600 cursor-pointer opacity-0 group-hover:opacity-100 transition shadow-md"
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
                    activeSlide === idx ? 'bg-blue-600 w-6' : 'bg-slate-300 hover:bg-slate-400'
                  }`}
                  aria-label={`Go to slide ${idx + 1}`}
                />
              ))}
            </div>

          </div>
        </div>
      </section>

      {/* Features Grid Section */}
      <section id="features" className="py-20 border-t border-slate-100 bg-slate-50/50">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center mb-16 space-y-4">
            <h2 className="text-3xl font-extrabold tracking-tight text-slate-900 md:text-4xl">Fitur Utama Platform</h2>
            <p className="text-slate-600 text-base max-w-xl mx-auto">Semua utilitas esensial untuk melayani pelanggan dengan andal dan terstruktur.</p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
            
            {/* Ticket Management */}
            <div className="rounded-2xl border border-slate-100 bg-white p-6 space-y-4 shadow-sm hover:shadow-md transition duration-300">
              <div className="h-12 w-12 rounded-xl bg-blue-50 text-blue-600 flex items-center justify-center">
                <Ticket className="w-6 h-6" />
              </div>
              <h3 className="text-xl font-bold text-slate-900">Manajemen Tiket</h3>
              <p className="text-slate-600 text-sm leading-relaxed">
                Pembuatan tiket, pelacakan riwayat aktivitas tiket secara audit, dan prioritas kendala terotomatisasi.
              </p>
              <ul className="space-y-2 pt-2 text-xs text-slate-500">
                <li className="flex items-center gap-2"><CheckCircle2 className="w-4 h-4 text-emerald-500" /> Nomor tiket otomatis</li>
                <li className="flex items-center gap-2"><CheckCircle2 className="w-4 h-4 text-emerald-500" /> Kategori & status terperinci</li>
                <li className="flex items-center gap-2"><CheckCircle2 className="w-4 h-4 text-emerald-500" /> Komentar dan log audit histori</li>
              </ul>
            </div>

            {/* Collaboration */}
            <div className="rounded-2xl border border-slate-100 bg-white p-6 space-y-4 shadow-sm hover:shadow-md transition duration-300">
              <div className="h-12 w-12 rounded-xl bg-cyan-50 text-cyan-600 flex items-center justify-center">
                <MessageSquare className="w-6 h-6" />
              </div>
              <h3 className="text-xl font-bold text-slate-900">Kolaborasi Tim</h3>
              <p className="text-slate-600 text-sm leading-relaxed">
                Berbagi catatan rahasia khusus tim internal dan merespon langsung ke pelanggan di halaman tiket yang sama.
              </p>
              <ul className="space-y-2 pt-2 text-xs text-slate-500">
                <li className="flex items-center gap-2"><CheckCircle2 className="w-4 h-4 text-emerald-500" /> Tanggapan publik pelanggan</li>
                <li className="flex items-center gap-2"><CheckCircle2 className="w-4 h-4 text-emerald-500" /> Catatan internal rahasia agen</li>
                <li className="flex items-center gap-2"><CheckCircle2 className="w-4 h-4 text-emerald-500" /> Pembagian tanggung jawab petugas</li>
              </ul>
            </div>

            {/* Performance SLA */}
            <div className="rounded-2xl border border-slate-100 bg-white p-6 space-y-4 shadow-sm hover:shadow-md transition duration-300">
              <div className="h-12 w-12 rounded-xl bg-emerald-50 text-emerald-600 flex items-center justify-center">
                <Clock className="w-6 h-6" />
              </div>
              <h3 className="text-xl font-bold text-slate-900">Pemantauan SLA</h3>
              <p className="text-slate-600 text-sm leading-relaxed">
                Pengukuran performa penanganan kendala berdasarkan tenggat waktu tanggap (SLA) demi komitmen layanan.
              </p>
              <ul className="space-y-2 pt-2 text-xs text-slate-500">
                <li className="flex items-center gap-2"><CheckCircle2 className="w-4 h-4 text-emerald-500" /> Countdown sisa waktu SLA</li>
                <li className="flex items-center gap-2"><CheckCircle2 className="w-4 h-4 text-emerald-500" /> Perhitungan rata-rata respon</li>
                <li className="flex items-center gap-2"><CheckCircle2 className="w-4 h-4 text-emerald-500" /> Penanda status keterlambatan</li>
              </ul>
            </div>

          </div>
        </div>
      </section>

      {/* How It Works Section */}
      <section id="how-it-works" className="py-20 border-t border-slate-100 bg-white">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center mb-16 space-y-4">
            <h2 className="text-3xl font-extrabold tracking-tight text-slate-900 md:text-4xl">Cara Kerja VibeDesk</h2>
            <p className="text-slate-600 text-base max-w-lg mx-auto">Alur penanganan kendala yang ringkas dalam 3 langkah terencana.</p>
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
                <div className="text-5xl font-black text-blue-500/10 font-mono tracking-wider">{item.step}</div>
                <h3 className="text-xl font-bold text-slate-900">{item.title}</h3>
                <p className="text-sm text-slate-600 leading-relaxed">{item.description}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* About Section */}
      <section id="about" className="py-20 border-t border-slate-100 bg-slate-50/50">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-12 items-center">
            <div className="space-y-6">
              <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-blue-500/10 border border-blue-500/20 text-blue-600 text-xs font-semibold">
                Tentang Kami
              </div>
              <h2 className="text-3xl font-extrabold tracking-tight text-slate-900 md:text-4xl">
                {c.about.title}
              </h2>
              <p className="text-slate-600 text-base leading-relaxed">
                {c.about.description}
              </p>
              <div className="space-y-4 pt-2">
                <div className="flex gap-4">
                  <div className="h-6 w-6 rounded-full bg-emerald-100 text-emerald-600 flex items-center justify-center font-bold text-xs shrink-0 mt-1">✓</div>
                  <div>
                    <h4 className="font-bold text-slate-900 text-sm">Misi Kami</h4>
                    <p className="text-slate-550 text-xs mt-1">{c.about.mission}</p>
                  </div>
                </div>
                <div className="flex gap-4">
                  <div className="h-6 w-6 rounded-full bg-emerald-100 text-emerald-600 flex items-center justify-center font-bold text-xs shrink-0 mt-1">✓</div>
                  <div>
                    <h4 className="font-bold text-slate-900 text-sm">Visi Kami</h4>
                    <p className="text-slate-550 text-xs mt-1">{c.about.vision}</p>
                  </div>
                </div>
              </div>
            </div>
            
            {/* Visual illustration of the About Section */}
            <div className="relative">
              <div className="absolute inset-0 bg-gradient-to-tr from-blue-600 to-cyan-500 rounded-3xl rotate-3 scale-[1.02] opacity-5 blur-[10px] pointer-events-none" />
              <div className="relative rounded-3xl overflow-hidden border border-slate-100 bg-white p-8 shadow-xl space-y-6">
                <div className="flex justify-between items-center pb-4 border-b border-slate-100">
                  <span className="text-xs font-bold text-slate-400">Pemberitahuan Sistem</span>
                  <span className="text-xs px-2.5 py-1 rounded-full bg-green-50 text-green-600 font-mono text-[10px]">active</span>
                </div>
                <div className="space-y-4 text-sm text-slate-600">
                  <p className="italic">"Sistem penanganan tiket FitrahPro memberikan peningkatan efisiensi operasional tim support hingga 40% dalam 30 hari pertama penggunaan."</p>
                  <div className="flex items-center gap-3 pt-2">
                    <div className="w-10 h-10 rounded-full bg-gradient-to-tr from-blue-600 to-cyan-500 text-white flex items-center justify-center font-bold">FP</div>
                    <div>
                      <h4 className="font-bold text-slate-900 text-xs">Fitrah Ramadhan</h4>
                      <p className="text-[10px] text-slate-400">Founder & CEO, FitrahPro</p>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* CTA Section */}
      <section className="py-20 border-t border-slate-100 bg-gradient-to-r from-blue-600 via-blue-500 to-cyan-500 text-center relative overflow-hidden">
        {/* Background Decorative Circles */}
        <div className="absolute top-[-50%] left-[-10%] w-[50%] aspect-square rounded-full bg-white/5 blur-[120px] pointer-events-none" />
        <div className="absolute bottom-[-50%] right-[-10%] w-[50%] aspect-square rounded-full bg-white/5 blur-[120px] pointer-events-none" />

        <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 relative z-10 space-y-6">
          <h2 className="text-3xl sm:text-4xl font-extrabold text-white">Siap Mengoptimalkan Operasional Dukungan Anda?</h2>
          <p className="text-base text-blue-50 hover:text-white max-w-lg mx-auto opacity-90">
            Bergabunglah dengan tim yang mengedepankan performa respon dan penyelesaian tiket yang terstruktur.
          </p>
          <Link href="/login">
            <Button size="lg" className="bg-white hover:bg-slate-50 text-blue-700 font-semibold shadow-xl active:scale-[0.98] transition px-8 py-6 rounded-lg cursor-pointer border-0">
              Masuk Dashboard Admin
            </Button>
          </Link>
        </div>
      </section>

      {/* Contact Section */}
      <section id="contact" className="py-20 border-t border-slate-100 bg-white">
        <div className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8">
          
          <div className="text-center mb-16 space-y-4">
            <h2 className="text-3xl font-extrabold tracking-tight text-slate-900 md:text-4xl">Hubungi Kami</h2>
            <p className="text-slate-600 text-base">Butuh bantuan integrasi atau info kustomisasi? Kami siap mendampingi.</p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-16">
            <div className="rounded-xl border border-slate-100 bg-slate-50/50 p-6 text-center space-y-3.5 shadow-sm">
              <div className="h-10 w-10 rounded-lg bg-blue-50 text-blue-600 flex items-center justify-center mx-auto">
                <Mail className="w-5 h-5" />
              </div>
              <h3 className="font-bold text-slate-900">Email</h3>
              <a href={`mailto:${sysSettings.email}`} className="text-sm text-blue-600 hover:underline font-semibold">
                {sysSettings.email}
              </a>
            </div>

            <div className="rounded-xl border border-slate-100 bg-slate-50/50 p-6 text-center space-y-3.5 shadow-sm">
              <div className="h-10 w-10 rounded-lg bg-cyan-50 text-cyan-600 flex items-center justify-center mx-auto">
                <Phone className="w-5 h-5" />
              </div>
              <h3 className="font-bold text-slate-900">Telepon</h3>
              <a href={`tel:${sysSettings.phone}`} className="text-sm text-cyan-600 hover:underline font-semibold">
                {sysSettings.phone}
              </a>
            </div>

            <div className="rounded-xl border border-slate-100 bg-slate-50/50 p-6 text-center space-y-3.5 shadow-sm">
              <div className="h-10 w-10 rounded-lg bg-emerald-50 text-emerald-600 flex items-center justify-center mx-auto">
                <MapPin className="w-5 h-5" />
              </div>
              <h3 className="font-bold text-slate-900">Kantor Pusat</h3>
              <p className="text-sm text-slate-500">{sysSettings.location}</p>
            </div>
          </div>

          {/* Newsletter Box */}
          <div className="max-w-2xl mx-auto rounded-2xl border border-slate-100 bg-slate-50/50 p-8 text-center shadow-md">
            <h3 className="text-xl font-bold text-slate-900 mb-2">Berlangganan Newsletter</h3>
            <p className="text-slate-500 text-xs mb-6">Dapatkan info pembaruan fitur baru dan tips SLA manajemen gratis.</p>
            <form onSubmit={handleSubscribe} className="flex gap-2 max-w-md mx-auto">
              <input
                type="email"
                placeholder="alamat@email.com"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                className="flex-1 px-4 py-2.5 bg-white border border-slate-200 rounded-lg text-slate-700 placeholder:text-slate-400 focus:outline-none focus:border-blue-500 transition text-sm"
                required
              />
              <Button type="submit" className="bg-gradient-to-r from-blue-600 to-cyan-500 hover:from-blue-700 hover:to-cyan-600 border-0 text-white font-semibold px-5 rounded-lg active:scale-[0.98] transition cursor-pointer">
                Langganan
              </Button>
            </form>
            {subscribed && (
              <p className="text-emerald-600 text-xs mt-3">Terima kasih! Anda berhasil terdaftar ke newsletter kami.</p>
            )}
          </div>

        </div>
      </section>

      {/* Footer */}
      <footer className="bg-slate-900 text-slate-400 py-12 border-t border-slate-800">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="grid grid-cols-1 md:grid-cols-4 gap-8 mb-8">
            <div className="space-y-3">
              <h3 className="font-bold text-white flex items-center gap-2">
                <img 
                  src="/icon.svg" 
                  alt="VibeDesk Logo" 
                  className="h-6 w-6 rounded border border-blue-500/20 object-cover"
                />
                VibeDesk
              </h3>
              <p className="text-xs leading-relaxed text-slate-400">
                Solusi manajemen tiket premium untuk operasional tim dukungan Anda.
              </p>
            </div>

            <div>
              <h4 className="font-semibold text-white text-xs uppercase tracking-wider mb-4">Fitur</h4>
              <ul className="space-y-2 text-xs text-slate-400">
                <li><a href="#features" className="hover:text-white transition">Manajemen Tiket</a></li>
                <li><a href="#features" className="hover:text-white transition">Kolaborasi Tim</a></li>
                <li><a href="#features" className="hover:text-white transition">Pantau SLA</a></li>
              </ul>
            </div>

            <div>
              <h4 className="font-semibold text-white text-xs uppercase tracking-wider mb-4">Perusahaan</h4>
              <ul className="space-y-2 text-xs text-slate-400">
                <li><span className="hover:text-white cursor-pointer transition">Tentang Kami</span></li>
                <li><span className="hover:text-white cursor-pointer transition">Blog</span></li>
                <li><span className="hover:text-white cursor-pointer transition">Karir</span></li>
              </ul>
            </div>

            <div>
              <h4 className="font-semibold text-white text-xs uppercase tracking-wider mb-4">Hukum</h4>
              <ul className="space-y-2 text-xs text-slate-400">
                <li><span className="hover:text-white cursor-pointer transition">Kebijakan Privasi</span></li>
                <li><span className="hover:text-white cursor-pointer transition">Syarat & Ketentuan</span></li>
              </ul>
            </div>
          </div>

          <div className="border-t border-slate-800 pt-8 flex flex-col md:flex-row justify-between items-center gap-4 text-xs text-slate-500">
            <p>&copy; 2026 VibeDesk. All rights reserved. Powered by FitrahPro.</p>
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
