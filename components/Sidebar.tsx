'use client';

import { useState, useEffect } from 'react';
import Link from 'next/link';
import { usePathname } from 'next/navigation';
import {
  BarChart3,
  Ticket,
  FileText,
  Settings,
  ChevronDown,
  Menu,
  X,
  Home,
  TrendingUp,
  Users,
  Image,
} from 'lucide-react';
import { Button } from '@/components/ui/button';

interface SidebarProps {
  user: any;
}

export default function Sidebar({ user }: SidebarProps) {
  const pathname = usePathname();
  const [isOpen, setIsOpen] = useState(true);
  const [projectName, setProjectName] = useState('FitrahPro');

  useEffect(() => {
    if (typeof window !== 'undefined') {
      const stored = localStorage.getItem('vibedesk_settings');
      if (stored) {
        try {
          const parsed = JSON.parse(stored);
          if (parsed.projectName) {
            setProjectName(parsed.projectName);
          }
        } catch (e) {}
      }
    }
  }, []);

  const isViewer = user?.role === 'VIEWER';

  const menuItems = [
    {
      label: 'Dashboard',
      icon: Home,
      href: '/dashboard',
    },
    {
      label: 'Tickets',
      icon: Ticket,
      href: '/tickets',
    },
    ...(!isViewer ? [
      {
        label: 'Analytics',
        icon: BarChart3,
        href: '/analytics',
      },
      {
        label: 'Team',
        icon: Users,
        href: '/team',
      }
    ] : [])
  ];

  const adminMenuItems = [
    {
      label: 'Queue Management',
      icon: Ticket,
      href: '/admin/queue',
    },
    {
      label: 'User Management',
      icon: Users,
      href: '/admin/users',
    },
    {
      label: 'Landing Manager',
      icon: Image,
      href: '/admin/landing-manager',
    },
    {
      label: 'Settings',
      icon: Settings,
      href: '/admin/settings',
    },
  ];

  const isActive = (href: string) => pathname === href;
  const isAdmin = user?.role === 'SUPER_ADMIN' || user?.role === 'ADMIN';

  return (
    <>
      {/* Mobile Toggle */}
      <Button
        variant="ghost"
        size="icon"
        className="lg:hidden fixed top-4 left-4 z-50"
        onClick={() => setIsOpen(!isOpen)}
      >
        {isOpen ? <X className="w-6 h-6" /> : <Menu className="w-6 h-6" />}
      </Button>

      {/* Sidebar */}
      <aside
        className={`group ${
          isOpen ? 'translate-x-0' : '-translate-x-full'
        } lg:translate-x-0 fixed lg:relative w-20 hover:w-72 h-screen bg-slate-900 bg-[url('https://grainy-gradients.vercel.app/noise.svg')] text-white transition-all duration-300 overflow-hidden z-40 border-r border-slate-800 shadow-2xl flex flex-col`}
      >
        {/* Subtle Gradient Glow */}
        <div className="absolute top-0 left-0 w-full h-64 bg-blue-600/20 blur-[80px] -z-10 pointer-events-none" />
        
        {/* Logo */}
        <div className="p-6 border-b border-slate-800 flex-shrink-0">
          <div className="flex items-center gap-3 w-60">
            <img 
              src="/icon.svg" 
              alt="VibeDesk Logo" 
              className="w-9 h-9 min-w-9 rounded-xl shadow-lg border border-blue-400/40 object-cover" 
            />
            <div className="opacity-0 group-hover:opacity-100 transition-opacity duration-300 overflow-hidden">
              <h1 className="text-lg font-extrabold tracking-wider bg-gradient-to-r from-white via-blue-100 to-blue-200 bg-clip-text text-transparent leading-none whitespace-nowrap">
                VibeDesk
              </h1>
              <p className="text-[10px] text-blue-300 font-semibold tracking-wide uppercase mt-1 whitespace-nowrap">Ticket Desk</p>
            </div>
          </div>
        </div>

        {/* User Info */}
        <div className="p-4 border-b border-blue-700 flex-shrink-0">
          <div className="flex items-center gap-3 w-60 overflow-hidden">
            <div className="w-10 h-10 min-w-10 rounded-full bg-blue-300 text-blue-900 flex items-center justify-center font-bold">
              {user?.name?.charAt(0).toUpperCase()}
            </div>
            <div className="flex-1 min-w-0 opacity-0 group-hover:opacity-100 transition-opacity duration-300">
              <p className="text-sm font-semibold truncate whitespace-nowrap">{user?.name}</p>
              <p className="text-xs text-blue-200 capitalize whitespace-nowrap">{user?.role}</p>
            </div>
          </div>
        </div>

        {/* Main Menu */}
        <nav className="p-4 space-y-2 flex-1 overflow-y-auto overflow-x-hidden scrollbar-hide">
          <p className="text-xs font-semibold text-blue-200 uppercase px-2 mb-4 opacity-0 group-hover:opacity-100 transition-opacity duration-300 whitespace-nowrap w-48">Main</p>
          {menuItems.map((item) => {
            const Icon = item.icon;
            const active = isActive(item.href);
            return (
              <Link key={item.href} href={item.href}>
                <div
                  className={`group/item relative flex items-center gap-4 px-3 py-3 rounded-xl transition-all duration-300 overflow-hidden mb-1 w-60 ${
                    active
                      ? 'bg-gradient-to-r from-blue-600 to-blue-500 text-white shadow-md shadow-blue-900/50'
                      : 'text-blue-100 hover:bg-white/10 hover:text-white hover:translate-x-1'
                  }`}
                >
                  {active && (
                    <div className="absolute left-0 top-0 bottom-0 w-1 bg-white rounded-r-full shadow-[0_0_10px_rgba(255,255,255,0.5)]" />
                  )}
                  <Icon className={`w-6 h-6 min-w-6 transition-transform duration-300 ${active ? 'scale-110' : 'group-hover/item:scale-110 group-hover/item:rotate-3'}`} />
                  <span className="text-sm font-medium tracking-wide opacity-0 group-hover:opacity-100 transition-opacity duration-300 whitespace-nowrap">{item.label}</span>
                </div>
              </Link>
            );
          })}
        </nav>

        {/* Admin Menu */}
        {isAdmin && (
          <nav className="p-4 space-y-2 border-t border-blue-700 overflow-x-hidden flex-shrink-0">
            <p className="text-xs font-semibold text-blue-200 uppercase px-2 mb-4 opacity-0 group-hover:opacity-100 transition-opacity duration-300 whitespace-nowrap w-48">
              Administration
            </p>
            {adminMenuItems.map((item) => {
              const Icon = item.icon;
              const active = isActive(item.href);
              return (
                <Link key={item.href} href={item.href}>
                  <div
                    className={`group/item relative flex items-center gap-4 px-3 py-3 rounded-xl transition-all duration-300 overflow-hidden mb-1 w-60 ${
                      active
                        ? 'bg-gradient-to-r from-blue-600 to-blue-500 text-white shadow-md shadow-blue-900/50'
                        : 'text-blue-100 hover:bg-white/10 hover:text-white hover:translate-x-1'
                    }`}
                  >
                    {active && (
                      <div className="absolute left-0 top-0 bottom-0 w-1 bg-white rounded-r-full shadow-[0_0_10px_rgba(255,255,255,0.5)]" />
                    )}
                    <Icon className={`w-6 h-6 min-w-6 transition-transform duration-300 ${active ? 'scale-110' : 'group-hover/item:scale-110 group-hover/item:-rotate-3'}`} />
                    <span className="text-sm font-medium tracking-wide opacity-0 group-hover:opacity-100 transition-opacity duration-300 whitespace-nowrap">{item.label}</span>
                  </div>
                </Link>
              );
            })}
          </nav>
        )}

        {/* Footer */}
        <div className="p-4 border-t border-blue-700 bg-blue-900 opacity-0 group-hover:opacity-100 transition-opacity duration-300 flex-shrink-0 w-72">
          <p className="text-xs text-blue-300 text-center font-semibold truncate">
            {projectName}
          </p>
          <p className="text-xs text-blue-400 text-center mt-1">v1.0.0</p>
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
