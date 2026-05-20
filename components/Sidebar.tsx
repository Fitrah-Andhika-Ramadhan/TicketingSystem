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
    {
      label: 'My Tickets',
      icon: FileText,
      href: '/my-tickets',
    },
    {
      label: 'Analytics',
      icon: BarChart3,
      href: '/analytics',
    },
    {
      label: 'Users',
      icon: Users,
      href: '/users',
    },
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
        className={`${
          isOpen ? 'translate-x-0' : '-translate-x-full'
        } lg:translate-x-0 fixed lg:relative w-64 h-screen bg-gradient-to-b from-blue-900 to-blue-800 text-white transition-transform duration-300 overflow-y-auto z-40`}
      >
        {/* Logo */}
        <div className="p-6 border-b border-blue-700/60">
          <div className="flex items-center gap-3">
            <img 
              src="/icon.svg" 
              alt="VibeDesk Logo" 
              className="w-9 h-9 rounded-xl shadow-lg border border-blue-400/40 object-cover" 
            />
            <div>
              <h1 className="text-lg font-extrabold tracking-wider bg-gradient-to-r from-white via-blue-100 to-blue-200 bg-clip-text text-transparent leading-none">
                VibeDesk
              </h1>
              <p className="text-[10px] text-blue-300 font-semibold tracking-wide uppercase mt-1">Ticket Desk</p>
            </div>
          </div>
        </div>

        {/* User Info */}
        <div className="p-4 border-b border-blue-700">
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 rounded-full bg-blue-300 text-blue-900 flex items-center justify-center font-bold">
              {user?.name?.charAt(0).toUpperCase()}
            </div>
            <div className="flex-1 min-w-0">
              <p className="text-sm font-semibold truncate">{user?.name}</p>
              <p className="text-xs text-blue-200 capitalize">{user?.role}</p>
            </div>
          </div>
        </div>

        {/* Main Menu */}
        <nav className="p-4 space-y-2">
          <p className="text-xs font-semibold text-blue-200 uppercase px-2 mb-4">Main</p>
          {menuItems.map((item) => {
            const Icon = item.icon;
            const active = isActive(item.href);
            return (
              <Link key={item.href} href={item.href}>
                <div
                  className={`flex items-center gap-3 px-4 py-2 rounded-lg transition-colors ${
                    active
                      ? 'bg-blue-700 text-white'
                      : 'text-blue-100 hover:bg-blue-700'
                  }`}
                >
                  <Icon className="w-5 h-5" />
                  <span className="text-sm font-medium">{item.label}</span>
                </div>
              </Link>
            );
          })}
        </nav>

        {/* Admin Menu */}
        {isAdmin && (
          <nav className="p-4 space-y-2 border-t border-blue-700">
            <p className="text-xs font-semibold text-blue-200 uppercase px-2 mb-4">
              Administration
            </p>
            {adminMenuItems.map((item) => {
              const Icon = item.icon;
              const active = isActive(item.href);
              return (
                <Link key={item.href} href={item.href}>
                  <div
                    className={`flex items-center gap-3 px-4 py-2 rounded-lg transition-colors ${
                      active
                        ? 'bg-blue-700 text-white'
                        : 'text-blue-100 hover:bg-blue-700'
                    }`}
                  >
                    <Icon className="w-5 h-5" />
                    <span className="text-sm font-medium">{item.label}</span>
                  </div>
                </Link>
              );
            })}
          </nav>
        )}

        {/* Footer */}
        <div className="absolute bottom-0 left-0 right-0 p-4 border-t border-blue-700 bg-blue-900">
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
