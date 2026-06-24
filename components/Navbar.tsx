'use client';

import { useState } from 'react';
import { Bell, LogOut, User, ExternalLink, Info, ChevronRight } from 'lucide-react';
import { Button } from '@/components/ui/button';
import Link from 'next/link';
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from '@/components/ui/dropdown-menu';
import { useRouter } from 'next/navigation';

interface NavbarProps {
  user: any;
  onLogout?: () => void;
}

const ROLE_GUIDE: Record<string, { color: string; desc: string; perms: string[] }> = {
  ADMIN: {
    color: 'bg-blue-600',
    desc: 'Akses penuh ke seluruh sistem.',
    perms: ['Approve/reject tiket', 'Kelola pengguna & tim', 'Ubah status & prioritas bebas', 'Hapus komentar & tiket', 'Akses semua menu'],
  },
  FUNCTIONAL_TEAM: {
    color: 'bg-indigo-500',
    desc: 'Analisis kebutuhan & triage tiket.',
    perms: ['Analisis & validasi tiket', 'Tugaskan tiket ke Developer', 'Lihat semua tiket', 'Tambah komentar'],
  },
  DEVELOPER: {
    color: 'bg-green-600',
    desc: 'Mengerjakan tiket yang telah di-assign.',
    perms: ['Update progress pengerjaan', 'Ubah status ke IN_PROGRESS', 'Kirim ke QA untuk review', 'Tambah komentar'],
  },
  QA: {
    color: 'bg-amber-500',
    desc: 'Menguji hasil pekerjaan Developer.',
    perms: ['Approve (Resolve) tiket', 'Reject & kembalikan ke Developer', 'Tambah komentar pengujian'],
  },
  VIEWER: {
    color: 'bg-slate-500',
    desc: 'Pengguna/Klien — akses terbatas.',
    perms: ['Buat tiket baru', 'Lihat tiket milik sendiri', 'Tambah komentar di tiket sendiri'],
  },
};

export default function Navbar({ user, onLogout }: NavbarProps) {
  const router = useRouter();
  const [showGuide, setShowGuide] = useState(false);

  const handleLogout = () => {
    if (onLogout) {
      onLogout();
    } else {
      const isDemo = user?.email === 'demo@fitrahpro.com';
      localStorage.removeItem('token');
      localStorage.removeItem('user');
      router.push(isDemo ? '/demo-login' : '/login');
    }
  };

  const switchRole = async (role: string) => {
    try {
      const token = localStorage.getItem('token');
      const res = await fetch('/api/auth/dev-switch-role', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json', Authorization: `Bearer ${token}` },
        body: JSON.stringify({ role }),
      });
      const data = await res.json();
      if (data.success) {
        localStorage.setItem('token', data.data.token);
        localStorage.setItem('user', JSON.stringify(data.data.user));
        window.location.reload();
      }
    } catch (e) {
      console.error('Failed to switch role', e);
    }
  };

  // Normalize SUPER_ADMIN to ADMIN for display
  const displayRole = user?.role === 'SUPER_ADMIN' ? 'ADMIN' : user?.role;
  const guide = ROLE_GUIDE[displayRole] || null;

  return (
    <nav className="bg-white border-b border-gray-200 px-6 py-4 flex items-center justify-between relative">
      <div className="flex-1">
        <h2 className="text-lg font-semibold text-gray-900">Welcome, {user?.name}</h2>
      </div>

      <div className="flex items-center gap-3">

        {/* Role Switcher + Guide */}
        <div className="flex items-center gap-1">
          {user?.role === 'ADMIN' || user?.role === 'SUPER_ADMIN' ? (
            <DropdownMenu>
              <DropdownMenuTrigger asChild>
                <Button variant="outline" className="flex items-center gap-2 border-dashed border-blue-400 bg-blue-50 text-blue-700 hover:bg-blue-100 hover:text-blue-800 h-9 px-3">
                  <User className="w-4 h-4" />
                  <span className="hidden sm:inline text-xs font-bold">Role: {displayRole || 'Switch'}</span>
                </Button>
              </DropdownMenuTrigger>
              <DropdownMenuContent align="end" className="w-52">
                <DropdownMenuLabel className="text-[10px] text-slate-400 uppercase tracking-wider font-bold">Simulasi Role (Admin Only)</DropdownMenuLabel>
                <DropdownMenuSeparator />
                {[
                  { label: 'ADMIN', value: 'ADMIN', color: 'text-blue-700 bg-blue-50' },
                  { label: 'FUNCTIONAL_TEAM', value: 'FUNCTIONAL_TEAM', color: 'text-indigo-700 bg-indigo-50' },
                  { label: 'DEVELOPER', value: 'DEVELOPER', color: 'text-green-700 bg-green-50' },
                  { label: 'QA', value: 'QA', color: 'text-amber-700 bg-amber-50' },
                  { label: 'VIEWER', value: 'VIEWER', color: 'text-slate-700 bg-slate-50' },
                ].map(r => (
                  <DropdownMenuItem
                    key={r.value}
                    className={`cursor-pointer font-semibold text-xs flex items-center justify-between rounded-md mx-1 my-0.5 ${displayRole === r.label ? r.color + ' font-bold' : ''}`}
                    onClick={() => switchRole(r.value)}
                  >
                    <span>{r.label}</span>
                    {displayRole === r.label && <span className="text-[10px] text-slate-400">● Aktif</span>}
                  </DropdownMenuItem>
                ))}
              </DropdownMenuContent>
            </DropdownMenu>
          ) : (
            <div className="flex items-center gap-2 border border-slate-200 bg-slate-50 text-slate-700 h-9 px-3 rounded-md">
              <User className="w-4 h-4 text-slate-500" />
              <span className="hidden sm:inline text-xs font-bold">Role: {displayRole}</span>
            </div>
          )}

          {/* Role Guide Button */}
          <Button
            variant="ghost"
            size="icon"
            className="w-8 h-8 text-slate-400 hover:text-blue-600 hover:bg-blue-50 relative"
            onClick={() => setShowGuide(!showGuide)}
            title="Panduan akses setiap role"
          >
            <Info className="w-4 h-4" />
          </Button>
        </div>

        {/* Preview Landing Page */}
        {(user?.role === 'ADMIN' || user?.role === 'SUPER_ADMIN') && (
          <Link href="/landing" target="_blank">
            <Button variant="outline" className="flex items-center gap-2 h-9 px-3 text-xs">
              <ExternalLink className="w-4 h-4" />
              <span className="hidden sm:inline">Preview Landing</span>
            </Button>
          </Link>
        )}

        {/* Notifications */}
        <Button variant="ghost" size="icon">
          <Bell className="w-5 h-5 text-gray-600" />
        </Button>

        {/* User Menu */}
        <DropdownMenu>
          <DropdownMenuTrigger asChild>
            <Button variant="ghost" size="icon">
              <div className="w-8 h-8 rounded-full bg-blue-600 text-white flex items-center justify-center font-semibold text-sm">
                {user?.name?.charAt(0).toUpperCase()}
              </div>
            </Button>
          </DropdownMenuTrigger>
          <DropdownMenuContent align="end">
            <DropdownMenuLabel>My Account</DropdownMenuLabel>
            <DropdownMenuSeparator />
            <DropdownMenuItem className="cursor-pointer">
              <User className="w-4 h-4 mr-2" />
              <span>Profile</span>
            </DropdownMenuItem>
            <DropdownMenuSeparator />
            <DropdownMenuItem onClick={handleLogout} className="cursor-pointer text-red-600">
              <LogOut className="w-4 h-4 mr-2" />
              <span>Logout</span>
            </DropdownMenuItem>
          </DropdownMenuContent>
        </DropdownMenu>
      </div>

      {/* Role Guide Panel */}
      {showGuide && guide && (
        <div className="absolute top-full right-4 mt-2 w-80 bg-white border border-slate-200 rounded-2xl shadow-2xl shadow-slate-200/60 z-50 overflow-hidden animate-in fade-in slide-in-from-top-2 duration-200">
          <div className={`${guide.color} text-white px-5 py-3`}>
            <div className="flex items-center justify-between">
              <span className="font-extrabold text-sm tracking-wide uppercase">{displayRole}</span>
              <button onClick={() => setShowGuide(false)} className="text-white/70 hover:text-white text-lg leading-none">✕</button>
            </div>
            <p className="text-white/80 text-xs mt-1">{guide.desc}</p>
          </div>
          <div className="px-5 py-4">
            <p className="text-[10px] uppercase font-bold tracking-wider text-slate-400 mb-3">Yang Bisa Dilakukan:</p>
            <ul className="space-y-2">
              {guide.perms.map((p, i) => (
                <li key={i} className="flex items-center gap-2 text-sm text-slate-700">
                  <ChevronRight className="w-3.5 h-3.5 text-green-500 flex-shrink-0" />
                  {p}
                </li>
              ))}
            </ul>
          </div>
        </div>
      )}
    </nav>
  );
}
