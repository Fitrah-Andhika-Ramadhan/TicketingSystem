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
import LanguageSwitcher from '@/components/LanguageSwitcher';

export default function Landing() {
  const [email, setEmail] = useState('');
  const [subscribed, setSubscribed] = useState(false);
  const [isLoggedIn, setIsLoggedIn] = useState(false);
  const [content, setContent] = useState<any>(null);
  const [sysSettings, setSysSettings] = useState<any>({
    email: 'support@fitrahpro.com',
    phone: '081289886013',
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
    <div className="min-h-screen relative text-slate-800 font-sans antialiased overflow-x-hidden scroll-smooth selection:bg-blue-500/10 selection:text-blue-600">
      
      {/* Interactive UI Runner / Animated Background */}
      <div className="fixed inset-0 z-[-3] bg-gradient-to-br from-indigo-50/50 via-white to-cyan-50/50"></div>
      <div className="fixed inset-0 z-[-2] bg-[linear-gradient(to_right,#80808012_1px,transparent_1px),linear-gradient(to_bottom,#80808012_1px,transparent_1px)] bg-[size:24px_24px]"></div>
      <div className="fixed left-0 right-0 top-0 z-[-1] m-auto h-[310px] w-[310px] rounded-full bg-blue-500 opacity-20 blur-[100px] animate-pulse"></div>
      <div className="fixed bottom-0 right-0 z-[-1] h-[400px] w-[400px] rounded-full bg-purple-500 opacity-10 blur-[120px] animate-pulse" style={{ animationDelay: '2s' }}></div>
      <div className="fixed bottom-1/2 left-0 z-[-1] h-[300px] w-[300px] rounded-full bg-cyan-400 opacity-10 blur-[100px] animate-pulse" style={{ animationDelay: '4s' }}></div>

      {/* Navigation */}
      <nav className="border-b border-slate-200/50 sticky top-0 bg-white/60 backdrop-blur-xl z-50 shadow-sm shadow-slate-200/20 transition-all duration-200">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-4 flex justify-between items-center">
          <div className="flex items-center gap-2.5 text-2xl font-bold tracking-tight text-slate-900 select-none">
            <img 
              src="/icon.svg" 
              alt="VibeDesk Logo" 
              className="h-9 w-9 rounded-lg border border-blue-500/10 shadow-sm object-cover"
            />
            <span className="bg-gradient-to-r from-blue-600 to-blue-800 bg-clip-text text-transparent">VibeDesk</span>
          </div>
          <div className="hidden md:flex items-center gap-8 text-sm font-semibold text-slate-600">
            <a href="#features" className="hover:text-blue-600 transition-all duration-200 hover:-translate-y-[1px]">Features</a>
            <a href="#slider-showcase" className="hover:text-blue-600 transition-all duration-200 hover:-translate-y-[1px]">Showcase</a>
            <a href="#how-it-works" className="hover:text-blue-600 transition-all duration-200 hover:-translate-y-[1px]">How It Works</a>
            <a href="#contact" className="hover:text-blue-600 transition-all duration-200 hover:-translate-y-[1px]">Contact</a>
            
            <div className="mx-2 flex items-center">
              <LanguageSwitcher />
            </div>

            {isLoggedIn ? (
              <Link href="/dashboard">
                <Button className="bg-blue-600 hover:bg-blue-700 border-0 text-white font-semibold rounded-lg shadow-md shadow-blue-500/10 hover:shadow-lg hover:shadow-blue-500/20 transition-all duration-200 active:scale-[0.98]">
                  Masuk Dashboard
                </Button>
              </Link>
            ) : (
              <div className="flex items-center gap-2">
                <Link href="/demo-login">
                  <Button variant="outline" className="border-slate-200 text-slate-700 hover:bg-slate-50 font-semibold rounded-lg shadow-sm transition-all duration-200">
                    Login Demo
                  </Button>
                </Link>
                <Link href="/login">
                  <Button className="bg-blue-600 hover:bg-blue-700 border-0 text-white font-semibold rounded-lg shadow-md shadow-blue-500/10 hover:shadow-lg hover:shadow-blue-500/20 transition-all duration-200 active:scale-[0.98]">
                    Login (Real)
                  </Button>
                </Link>
              </div>
            )}
          </div>
          <div className="md:hidden flex items-center gap-2">
            {isLoggedIn ? (
              <Link href="/dashboard">
                <Button size="sm" className="bg-blue-600 hover:bg-blue-700 border-0 text-white font-semibold rounded-lg">
                  Dashboard
                </Button>
              </Link>
            ) : (
              <>
                <Link href="/demo-login">
                  <Button size="sm" variant="outline" className="border-slate-200 text-slate-700">
                    Demo
                  </Button>
                </Link>
                <Link href="/login">
                  <Button size="sm" className="bg-blue-600 hover:bg-blue-700 border-0 text-white font-semibold rounded-lg">
                    Login
                  </Button>
                </Link>
              </>
            )}
          </div>
        </div>
      </nav>

      {/* Hero Section */}
      <section className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-24 relative">
        {/* Background Mesh Orbs */}
        <div className="absolute top-[10%] left-[-10%] w-[45%] aspect-square rounded-full bg-blue-500/3 blur-[130px] pointer-events-none" />
        <div className="absolute top-[20%] right-[-10%] w-[35%] aspect-square rounded-full bg-cyan-500/3 blur-[110px] pointer-events-none" />
 
        <div className="text-center mb-20 relative z-10 space-y-6">
          <div className="inline-flex items-center gap-2 px-4 py-1.5 rounded-full bg-blue-50 border border-blue-100 text-blue-600 text-xs font-bold tracking-wide select-none shadow-sm">
            <Sparkles className="w-3.5 h-3.5" />
            {c.hero.subtitle}
          </div>
          
          <h1 className="text-4xl sm:text-5xl md:text-6xl lg:text-7xl font-extrabold tracking-tight text-slate-900 max-w-4xl mx-auto leading-[1.15]">
            Platform Modern untuk{' '}
            <span className="block h-[1.25em] relative overflow-hidden">
              <span 
                key={rotatorIndex} 
                className="absolute inset-x-0 top-0 animate-slide-up text-transparent bg-clip-text bg-gradient-to-r from-blue-600 to-blue-500 font-extrabold"
              >
                {rotatorWords[rotatorIndex]}
              </span>
            </span>
          </h1>

          <p className="text-base sm:text-lg md:text-xl text-slate-500 max-w-2xl mx-auto leading-relaxed font-medium">
            {c.hero.description}
          </p>

          <div className="flex gap-4 justify-center pt-6 flex-wrap">
            {isLoggedIn ? (
              <Link href="/dashboard">
                <Button className="bg-blue-600 hover:bg-blue-700 border-0 text-base font-semibold px-8 py-6 rounded-lg flex items-center gap-2 shadow-lg shadow-blue-500/15 hover:shadow-xl hover:shadow-blue-500/25 hover:-translate-y-0.5 active:translate-y-0 active:scale-[0.98] transition-all duration-200">
                  {c.hero.ctaText} <ArrowRight className="w-5 h-5" />
                </Button>
              </Link>
            ) : (
              <>
                <Link href="/demo-login">
                  <Button variant="outline" className="bg-white border-slate-200 text-slate-700 hover:bg-slate-50 text-base font-semibold px-8 py-6 rounded-lg flex items-center gap-2 shadow-lg hover:-translate-y-0.5 active:translate-y-0 active:scale-[0.98] transition-all duration-200">
                    Login Demo
                  </Button>
                </Link>
                <Link href="/login">
                  <Button className="bg-blue-600 hover:bg-blue-700 border-0 text-base font-semibold px-8 py-6 rounded-lg flex items-center gap-2 shadow-lg shadow-blue-500/15 hover:shadow-xl hover:shadow-blue-500/25 hover:-translate-y-0.5 active:translate-y-0 active:scale-[0.98] transition-all duration-200">
                    Login (Real) <ArrowRight className="w-5 h-5" />
                  </Button>
                </Link>
              </>
            )}
            <a href="#slider-showcase">
              <Button variant="outline" className="text-base px-8 py-6 border-slate-200 text-slate-600 hover:bg-slate-50 hover:text-slate-950 bg-white rounded-lg shadow-sm hover:shadow hover:-translate-y-0.5 active:translate-y-0 active:scale-[0.98] transition-all duration-200">
                Lihat Showcase
              </Button>
            </a>
          </div>
        </div>

        {/* Hero Quick Statistics Cards */}
        <div className="grid grid-cols-2 md:grid-cols-4 gap-6 mt-20 max-w-5xl mx-auto relative z-10">
          {[
            { value: `${c.stats.projects}K+`, label: 'Tiket Selesai' },
            { value: `${c.stats.units} mnt`, label: 'Rata-rata Respon' },
            { value: `${c.stats.yearsExperience}%`, label: 'Uptime SLA' },
            { value: `${c.stats.satisfaction}+`, label: 'Perusahaan Mitra' },
          ].map((stat, i) => (
            <div key={i} className="rounded-2xl border border-slate-100 bg-white p-6 text-center shadow-md shadow-slate-100/50 hover:shadow-xl hover:shadow-slate-200/60 hover:-translate-y-1 transition-all duration-300">
              <div className="text-3xl sm:text-4xl font-extrabold text-blue-600 mb-2">{stat.value}</div>
              <p className="text-xs font-bold uppercase tracking-wider text-slate-400">{stat.label}</p>
            </div>
          ))}
        </div>
      </section>

      {/* Slider Showcase Section */}
      <section id="slider-showcase" className="py-24 border-t border-b border-slate-100 bg-white relative">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center mb-16 space-y-3">
            <h2 className="text-3xl font-extrabold tracking-tight text-slate-900 md:text-4xl">Showcase Dasbor Admin</h2>
            <p className="text-slate-500 text-sm max-w-lg mx-auto font-medium">Lihat langsung kemudahan alur kerja monitoring dan penyelesaian masalah di VibeDesk.</p>
          </div>

          {/* Interactive Showcase Slider */}
          <div 
            className="relative max-w-5xl mx-auto aspect-video md:aspect-[16/9] rounded-2xl border border-slate-100 bg-slate-50/30 overflow-hidden shadow-xl shadow-slate-100/70 group"
            onMouseEnter={() => setIsHovered(true)}
            onMouseLeave={() => setIsHovered(false)}
          >
            {/* Slider Contents */}
            <div className="w-full h-full relative flex items-center justify-center p-6 md:p-12">
              
              {/* SLIDE 0: Real-time Analytics Mock */}
              {activeSlide === 0 && (
                <div className="w-full h-full flex flex-col justify-between animate-fade-in">
                  <div className="flex justify-between items-center border-b border-slate-100 pb-4 select-none">
                    <div className="space-y-1">
                      <h3 className="text-lg font-bold text-slate-900 flex items-center gap-2">
                        <BarChart3 className="w-5 h-5 text-blue-600" />
                        Real-time Dashboard Analytics
                      </h3>
                      <p className="text-xs text-slate-400 font-medium">Pemantauan metrik, alokasi tiket, dan workload tim secara instan.</p>
                    </div>
                    <span className="text-[10px] px-3 py-1 rounded-full bg-emerald-50 text-emerald-600 border border-emerald-100 font-bold font-mono shadow-sm">active_live</span>
                  </div>

                  {/* Visual UI Grid Mock */}
                  <div className="grid grid-cols-1 md:grid-cols-3 gap-6 my-auto">
                    <div className="bg-white border border-slate-100/80 p-5 rounded-2xl space-y-3 shadow-sm hover:shadow-md transition-all duration-200">
                      <p className="text-[10px] text-slate-400 font-bold uppercase tracking-wider">Tiket Masuk</p>
                      <div className="text-3xl font-extrabold text-slate-800">1,482</div>
                      <div className="w-full h-2 bg-slate-100 rounded-full overflow-hidden">
                        <div className="h-full bg-blue-600 rounded-full w-[75%]" />
                      </div>
                      <p className="text-[10px] text-emerald-600 font-bold flex items-center gap-1">↑ 12% <span className="text-slate-400 font-normal">dari minggu lalu</span></p>
                    </div>

                    <div className="bg-white border border-slate-100/80 p-5 rounded-2xl space-y-3 shadow-sm hover:shadow-md transition-all duration-200">
                      <p className="text-[10px] text-slate-400 font-bold uppercase tracking-wider">Tingkat Resolusi</p>
                      <div className="text-3xl font-extrabold text-slate-800">94.2%</div>
                      <div className="w-full h-2 bg-slate-100 rounded-full overflow-hidden">
                        <div className="h-full bg-blue-500 rounded-full w-[94%]" />
                      </div>
                      <p className="text-[10px] text-slate-500 font-bold">Sesuai target SLA 90%</p>
                    </div>

                    <div className="bg-white border border-slate-100/80 p-5 rounded-2xl space-y-3 shadow-sm hover:shadow-md transition-all duration-200">
                      <p className="text-[10px] text-slate-400 font-bold uppercase tracking-wider">Rata-rata Respon</p>
                      <div className="text-3xl font-extrabold text-slate-800">1m 48s</div>
                      <div className="w-full h-2 bg-slate-100 rounded-full overflow-hidden">
                        <div className="h-full bg-emerald-500 rounded-full w-[85%]" />
                      </div>
                      <p className="text-[10px] text-emerald-600 font-bold">Sangat Cepat (Optimal)</p>
                    </div>
                  </div>

                  <div className="text-center text-[11px] text-slate-400 pt-4 border-t border-slate-100 select-none">
                    *Tampilan grafik diperbarui secara otomatis menggunakan database real-time.
                  </div>
                </div>
              )}

              {/* SLIDE 1: SLA Control Panel Mock */}
              {activeSlide === 1 && (
                <div className="w-full h-full flex flex-col justify-between animate-fade-in">
                  <div className="flex justify-between items-center border-b border-slate-100 pb-4 select-none">
                    <div className="space-y-1">
                      <h3 className="text-lg font-bold text-slate-900 flex items-center gap-2">
                        <Clock className="w-5 h-5 text-rose-600" />
                        SLA Breach Control Room
                      </h3>
                      <p className="text-xs text-slate-400 font-medium">Sistem peringatan otomatis saat tiket terancam melanggar batas SLA.</p>
                    </div>
                    <span className="text-[10px] px-3 py-1 rounded-full bg-rose-50 text-rose-600 border border-rose-100 font-bold font-mono shadow-sm animate-pulse">sla_engine_breach_check</span>
                  </div>

                  {/* SLA Alert List Visual */}
                  <div className="space-y-3.5 my-auto max-w-xl mx-auto w-full">
                    <div className="p-4 bg-white border border-slate-100 rounded-2xl flex items-center justify-between shadow-sm hover:shadow hover:-translate-y-0.5 transition-all duration-200">
                      <div className="flex items-center gap-3">
                        <div className="p-2.5 rounded-xl bg-rose-50 text-rose-600">
                          <AlertCircle className="w-5 h-5" />
                        </div>
                        <div>
                          <h4 className="text-sm font-bold text-slate-800">SLA Breach Warning: #VD-4821</h4>
                          <p className="text-xs text-slate-400 mt-0.5">Kendala: Gagal bayar payment gateway • Admin VibeDesk</p>
                        </div>
                      </div>
                      <span className="text-[10px] px-3 py-1.5 rounded-lg bg-rose-50 border border-rose-100 text-rose-600 font-bold font-mono shadow-sm">12 mnt tersisa</span>
                    </div>

                    <div className="p-4 bg-white border border-slate-100 rounded-2xl flex items-center justify-between shadow-sm hover:shadow hover:-translate-y-0.5 transition-all duration-200">
                      <div className="flex items-center gap-3">
                        <div className="p-2.5 rounded-xl bg-amber-50 text-amber-600">
                          <Clock className="w-5 h-5" />
                        </div>
                        <div>
                          <h4 className="text-sm font-bold text-slate-800">SLA Warning: #VD-4819</h4>
                          <p className="text-xs text-slate-400 mt-0.5">Dukungan: Menunggu kelengkapan bukti screenshot dari user</p>
                        </div>
                      </div>
                      <span className="text-[10px] px-3 py-1.5 rounded-lg bg-amber-50 border border-amber-100 text-amber-600 font-bold font-mono shadow-sm">Awaiting Customer</span>
                    </div>
                  </div>

                  <div className="text-center text-[11px] text-slate-400 pt-4 border-t border-slate-100 select-none">
                    Sistem notifikasi dapat diintegrasikan dengan Slack, Discord, dan WhatsApp API.
                  </div>
                </div>
              )}

              {/* SLIDE 2: Team Collaboration Mock */}
              {activeSlide === 2 && (
                <div className="w-full h-full flex flex-col justify-between animate-fade-in">
                  <div className="flex justify-between items-center border-b border-slate-100 pb-4 select-none">
                    <div className="space-y-1">
                      <h3 className="text-lg font-bold text-slate-900 flex items-center gap-2">
                        <MessageSquare className="w-5 h-5 text-blue-600" />
                        Collaboration & Team Workroom
                      </h3>
                      <p className="text-xs text-slate-400 font-medium">Berbagi catatan internal antar agen, membagi tim, dan melampirkan berkas penunjang.</p>
                    </div>
                    <span className="text-[10px] px-3 py-1 rounded-full bg-blue-50 text-blue-600 border border-blue-100 font-bold font-mono shadow-sm">collab_online</span>
                  </div>

                  {/* Chat / Comments Visual representation */}
                  <div className="space-y-4 my-auto max-w-lg mx-auto w-full">
                    <div className="flex gap-3 items-start">
                      <div className="w-8 h-8 rounded-xl bg-blue-600 flex items-center justify-center text-xs font-bold text-white shrink-0 shadow-md shadow-blue-500/10">
                        A
                      </div>
                      <div className="flex-1 bg-white border border-slate-100 rounded-2xl rounded-tl-none p-4 shadow-sm space-y-1">
                        <div className="flex justify-between items-center">
                          <span className="text-xs font-bold text-slate-800">Admin User</span>
                          <span className="text-[9px] text-slate-400">10:45 AM</span>
                        </div>
                        <p className="text-xs text-slate-500 leading-relaxed">Saya telah melakukan reset API key di sisi staging. Tolong bantu verifikasi dari klien.</p>
                      </div>
                    </div>

                    <div className="flex gap-3 items-start pl-8">
                      <div className="w-8 h-8 rounded-xl bg-blue-500 flex items-center justify-center text-xs font-bold text-white shrink-0 shadow-md shadow-blue-500/10">
                        T
                      </div>
                      <div className="flex-1 bg-blue-50/50 border border-blue-100/50 rounded-2xl rounded-tl-none p-4 shadow-sm space-y-1">
                        <div className="flex justify-between items-center">
                          <span className="text-xs font-bold text-blue-700">Tim Contractor</span>
                          <span className="text-[9px] text-blue-400 font-mono">Internal</span>
                        </div>
                        <p className="text-xs text-slate-500 leading-relaxed">Sudah aman di sisi staging, log DB menunjukkan status sukses.</p>
                      </div>
                    </div>
                  </div>

                  <div className="text-center text-[11px] text-slate-400 pt-4 border-t border-slate-100 select-none">
                    Membedakan percakapan Publik (ke Pelanggan) dan Catatan Internal (khusus Agen).
                  </div>
                </div>
              )}

            </div>

            {/* Slider Controls (Arrow Buttons) */}
            <button 
              onClick={prevSlide}
              className="absolute left-4 top-1/2 -translate-y-1/2 p-2 rounded-full border border-slate-200 bg-white/80 hover:bg-slate-100 text-slate-600 hover:scale-105 active:scale-95 cursor-pointer opacity-0 group-hover:opacity-100 transition-all duration-200 shadow-md"
              aria-label="Previous Slide"
            >
              <ChevronLeft className="w-5 h-5" />
            </button>
            
            <button 
              onClick={nextSlide}
              className="absolute right-4 top-1/2 -translate-y-1/2 p-2 rounded-full border border-slate-200 bg-white/80 hover:bg-slate-100 text-slate-600 hover:scale-105 active:scale-95 cursor-pointer opacity-0 group-hover:opacity-100 transition-all duration-200 shadow-md"
              aria-label="Next Slide"
            >
              <ChevronRight className="w-5 h-5" />
            </button>

            {/* Slide Indicators / Dots */}
            <div className="absolute bottom-4 left-1/2 -translate-x-1/2 flex gap-2.5 select-none">
              {[0, 1, 2].map((idx) => (
                <button
                  key={idx}
                  onClick={() => setActiveSlide(idx)}
                  className={`w-2.5 h-2.5 rounded-full border-0 transition-all cursor-pointer ${
                    activeSlide === idx ? 'bg-blue-600 w-6' : 'bg-slate-200 hover:bg-slate-300'
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
                    <p className="text-slate-500 text-xs mt-1">{c.about.mission}</p>
                  </div>
                </div>
                <div className="flex gap-4">
                  <div className="h-6 w-6 rounded-full bg-emerald-100 text-emerald-600 flex items-center justify-center font-bold text-xs shrink-0 mt-1">✓</div>
                  <div>
                    <h4 className="font-bold text-slate-900 text-sm">Visi Kami</h4>
                    <p className="text-slate-500 text-xs mt-1">{c.about.vision}</p>
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
          {isLoggedIn ? (
            <Link href="/dashboard">
              <Button size="lg" className="bg-white hover:bg-slate-50 text-blue-700 font-semibold shadow-xl active:scale-[0.98] transition px-8 py-6 rounded-lg cursor-pointer border-0">
                Masuk Dashboard Admin
              </Button>
            </Link>
          ) : (
            <div className="flex justify-center gap-4 flex-wrap">
              <Link href="/demo-login">
                <Button size="lg" variant="outline" className="bg-transparent border-white text-white hover:bg-white/10 font-semibold shadow-xl active:scale-[0.98] transition px-8 py-6 rounded-lg cursor-pointer">
                  Login Demo
                </Button>
              </Link>
              <Link href="/login">
                <Button size="lg" className="bg-white hover:bg-slate-50 text-blue-700 font-semibold shadow-xl active:scale-[0.98] transition px-8 py-6 rounded-lg cursor-pointer border-0">
                  Login (Real)
                </Button>
              </Link>
            </div>
          )}
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
