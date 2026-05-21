'use client';

import { useState, useEffect } from 'react';
import Link from 'next/link';
import { usePathname } from 'next/navigation';
import {
  BarChart3, Ticket, Settings, Menu, X, Home, Users, Image,
  ClipboardList, Code2, TestTube2, Inbox, LayoutList, HelpCircle,
  PlusCircle, CheckCircle2, GitPullRequest, ShieldCheck, Hammer,
  LineChart, ListTodo, BookOpen, FlaskConical,
} from 'lucide-react';
import { Button } from '@/components/ui/button';

interface SidebarProps {
  user: any;
}

// ─── Role-specific menu definitions ───────────────────────────────────────────

const MENUS: Record<string, {
  label: string;
  icon: any;
  href: string;
  badge?: string;
}[][]> = {

  ADMIN: [
    // Main Admin
    [
      { label: 'Admin Dashboard', icon: Home, href: '/admin/dashboard' },
      { label: 'Monitor Tiket', icon: Ticket, href: '/tickets' },
      { label: 'Analytics', icon: BarChart3, href: '/analytics' },
      { label: 'Manajemen Tim', icon: Users, href: '/team' },
    ],
    // Administration Tools
    [
      { label: 'Queue Management', icon: ListTodo, href: '/admin/queue' },
      { label: 'User Management', icon: Users, href: '/admin/users' },
      { label: 'Landing Manager', icon: Image, href: '/admin/landing-manager' },
      { label: 'Pengaturan', icon: Settings, href: '/admin/settings' },
    ],
  ],

  FUNCTIONAL_TEAM: [
    [
      { label: 'Dashboard', icon: Home, href: '/dashboard' },
      { label: 'Panel Functional', icon: ClipboardList, href: '/functional' },
      { label: 'Semua Tiket', icon: Ticket, href: '/tickets' },
      { label: 'Buat Tiket', icon: PlusCircle, href: '/tickets/new' },
      { label: 'Laporan', icon: LineChart, href: '/analytics' },
    ],
  ],

  DEVELOPER: [
    [
      { label: 'Dashboard', icon: Home, href: '/dashboard' },
      { label: 'Developer Workspace', icon: Code2, href: '/developer' },
      { label: 'Tugas Saya', icon: Hammer, href: '/developer' },
      { label: 'Semua Tiket', icon: LayoutList, href: '/tickets' },
      { label: 'Buat Tiket', icon: PlusCircle, href: '/tickets/new' },
    ],
  ],

  QA: [
    [
      { label: 'Dashboard', icon: Home, href: '/dashboard' },
      { label: 'QA Workspace', icon: TestTube2, href: '/qa' },
      { label: 'Antrian Pengujian', icon: FlaskConical, href: '/qa' },
      { label: 'Semua Tiket', icon: LayoutList, href: '/tickets' },
      { label: 'Hasil QA', icon: ShieldCheck, href: '/qa' },
    ],
  ],

  VIEWER: [
    [
      { label: 'Help Center', icon: HelpCircle, href: '/dashboard' },
      { label: 'Tiket Saya', icon: Ticket, href: '/tickets' },
      { label: 'Buat Tiket Baru', icon: PlusCircle, href: '/tickets/new' },
      { label: 'Panduan', icon: BookOpen, href: '/dashboard' },
    ],
  ],
};

const ROLE_META: Record<string, {
  label: string;
  sectionLabels?: string[];
  gradient: string;
  accent: string;
  textAccent: string;
}> = {
  ADMIN: {
    label: 'Admin',
    sectionLabels: ['Menu Utama', 'Alat Administrasi'],
    gradient: 'from-blue-700 to-blue-900',
    accent: 'bg-blue-500/30',
    textAccent: 'text-blue-200',
  },
  FUNCTIONAL_TEAM: {
    label: 'Functional Team',
    sectionLabels: ['Functional Team'],
    gradient: 'from-indigo-600 to-indigo-800',
    accent: 'bg-indigo-500/30',
    textAccent: 'text-indigo-200',
  },
  DEVELOPER: {
    label: 'Developer',
    sectionLabels: ['Developer'],
    gradient: 'from-green-700 to-green-900',
    accent: 'bg-green-500/30',
    textAccent: 'text-green-200',
  },
  QA: {
    label: 'QA Engineer',
    sectionLabels: ['QA & Testing'],
    gradient: 'from-amber-600 to-amber-800',
    accent: 'bg-amber-500/30',
    textAccent: 'text-amber-200',
  },
  VIEWER: {
    label: 'Pengguna',
    sectionLabels: ['Bantuan'],
    gradient: 'from-slate-600 to-slate-800',
    accent: 'bg-slate-500/30',
    textAccent: 'text-slate-300',
  },
};

export default function Sidebar({ user }: SidebarProps) {
  const pathname = usePathname();
  const [isOpen, setIsOpen] = useState(true);
  const [projectName, setProjectName] = useState('VibeDesk');

  useEffect(() => {
    if (typeof window !== 'undefined') {
      const stored = localStorage.getItem('vibedesk_settings');
      if (stored) {
        try {
          const parsed = JSON.parse(stored);
          if (parsed.projectName) setProjectName(parsed.projectName);
        } catch (e) {}
      }
    }
  }, []);

  const role = user?.role === 'SUPER_ADMIN' ? 'ADMIN' : (user?.role || 'VIEWER');
  const sections = MENUS[role] || MENUS['VIEWER'];
  const meta = ROLE_META[role] || ROLE_META['VIEWER'];

  const isActive = (href: string) => pathname === href || pathname.startsWith(href + '/');

  const NavItem = ({ item }: { item: typeof sections[0][0] }) => {
    const Icon = item.icon;
    const active = isActive(item.href);
    return (
      <Link href={item.href} onClick={() => setIsOpen(false)}>
        <div className={`group/item relative flex items-center gap-3 px-3 py-2.5 rounded-xl transition-all duration-200 overflow-hidden w-60 cursor-pointer ${
          active
            ? 'bg-white/20 text-white shadow-sm'
            : 'text-white/60 hover:bg-white/10 hover:text-white'
        }`}>
          {active && (
            <div className="absolute left-0 top-1/2 -translate-y-1/2 w-1 h-6 bg-white rounded-r-full shadow-[0_0_8px_rgba(255,255,255,0.6)]" />
          )}
          <Icon className={`w-5 h-5 min-w-5 flex-shrink-0 transition-transform duration-200 ${active ? 'scale-110' : 'group-hover/item:scale-110'}`} />
          <span className="text-sm font-semibold tracking-wide opacity-0 group-hover:opacity-100 transition-opacity duration-300 whitespace-nowrap truncate">
            {item.label}
          </span>
          {item.badge && (
            <span className="ml-auto opacity-0 group-hover:opacity-100 transition-opacity bg-white/20 text-white text-[10px] font-bold px-1.5 py-0.5 rounded-full">
              {item.badge}
            </span>
          )}
        </div>
      </Link>
    );
  };

  return (
    <>
      {/* Mobile Toggle */}
      <Button
        variant="ghost"
        size="icon"
        className="lg:hidden fixed top-4 left-4 z-50 text-white bg-slate-800/80 hover:bg-slate-700"
        onClick={() => setIsOpen(!isOpen)}
      >
        {isOpen ? <X className="w-6 h-6" /> : <Menu className="w-6 h-6" />}
      </Button>

      {/* Sidebar */}
      <aside
        className={`group ${
          isOpen ? 'translate-x-0' : '-translate-x-full'
        } lg:translate-x-0 fixed lg:relative w-16 hover:w-72 h-screen bg-gradient-to-b ${meta.gradient} text-white transition-all duration-300 overflow-hidden z-40 border-r border-white/10 shadow-2xl flex flex-col`}
      >
        {/* Subtle overlay glow */}
        <div className="absolute inset-0 bg-[url('https://grainy-gradients.vercel.app/noise.svg')] opacity-30 pointer-events-none" />

        {/* Logo */}
        <div className="p-4 border-b border-white/10 flex-shrink-0 relative">
          <div className="flex items-center gap-3 w-60">
            <img
              src="/icon.svg"
              alt="Logo"
              className="w-9 h-9 min-w-9 rounded-xl border border-white/20 object-cover shadow-md"
            />
            <div className="opacity-0 group-hover:opacity-100 transition-opacity duration-300 overflow-hidden">
              <h1 className="text-base font-extrabold tracking-wider text-white leading-none whitespace-nowrap">VibeDesk</h1>
              <p className="text-[10px] font-semibold uppercase tracking-widest mt-0.5 whitespace-nowrap text-white/50">Ticketing System</p>
            </div>
          </div>
        </div>

        {/* Role Badge */}
        <div className="px-4 py-3 border-b border-white/10 flex-shrink-0 relative">
          <div className="flex items-center gap-3 w-60">
            <div className={`w-9 h-9 min-w-9 rounded-full ${meta.accent} border border-white/20 flex items-center justify-center font-bold text-white text-sm flex-shrink-0`}>
              {user?.name?.charAt(0).toUpperCase()}
            </div>
            <div className="opacity-0 group-hover:opacity-100 transition-opacity duration-300 overflow-hidden">
              <p className="text-sm font-bold text-white truncate whitespace-nowrap">{user?.name}</p>
              <span className={`text-[10px] font-bold uppercase tracking-wider ${meta.textAccent}`}>{meta.label}</span>
            </div>
          </div>
        </div>

        {/* Navigation Sections */}
        <nav className="flex-1 overflow-y-auto overflow-x-hidden py-4 space-y-6 relative">
          {sections.map((section, sIdx) => (
            <div key={sIdx} className="px-3">
              {meta.sectionLabels && meta.sectionLabels[sIdx] && (
                <p className={`text-[9px] font-extrabold uppercase tracking-[0.15em] ${meta.textAccent} opacity-0 group-hover:opacity-100 transition-opacity duration-300 px-3 mb-2 whitespace-nowrap`}>
                  {meta.sectionLabels[sIdx]}
                </p>
              )}
              <div className="space-y-1">
                {section.map(item => <NavItem key={item.href + item.label} item={item} />)}
              </div>
            </div>
          ))}
        </nav>

        {/* Footer */}
        <div className="p-4 border-t border-white/10 flex-shrink-0 relative">
          <div className="opacity-0 group-hover:opacity-100 transition-opacity duration-300 w-60">
            <p className="text-[10px] text-white/40 text-center font-semibold truncate">{projectName}</p>
            <p className="text-[10px] text-white/30 text-center mt-0.5">v1.0.0</p>
          </div>
        </div>
      </aside>

      {/* Mobile Overlay */}
      {isOpen && (
        <div
          className="fixed inset-0 bg-black/50 lg:hidden z-30"
          onClick={() => setIsOpen(false)}
        />
      )}
    </>
  );
}
