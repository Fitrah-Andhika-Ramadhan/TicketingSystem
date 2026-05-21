'use client';

import { Bell, LogOut, User, ExternalLink } from 'lucide-react';
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

export default function Navbar({ user, onLogout }: NavbarProps) {
  const router = useRouter();

  const handleLogout = () => {
    if (onLogout) {
      onLogout();
    } else {
      localStorage.removeItem('token');
      localStorage.removeItem('user');
      router.push('/login');
    }
  };
  return (
    <nav className="bg-white border-b border-gray-200 px-6 py-4 flex items-center justify-between">
      <div className="flex-1">
        <h2 className="text-lg font-semibold text-gray-900">
          Welcome, {user?.name}
        </h2>
      </div>

      <div className="flex items-center gap-4">
        {/* Dev Role Switcher */}
        <DropdownMenu>
          <DropdownMenuTrigger asChild>
            <Button variant="outline" className="flex items-center gap-2 border-dashed border-blue-400 bg-blue-50 text-blue-700 hover:bg-blue-100 hover:text-blue-800">
              <User className="w-4 h-4" />
              <span className="hidden sm:inline">Role: {user?.role || 'Switch'}</span>
            </Button>
          </DropdownMenuTrigger>
          <DropdownMenuContent align="end" className="w-48">
            <DropdownMenuLabel className="text-xs text-slate-500 uppercase">Dev Switch Role</DropdownMenuLabel>
            <DropdownMenuSeparator />
            {['SUPER_ADMIN', 'ADMIN', 'VIEWER'].map(role => (
              <DropdownMenuItem 
                key={role} 
                className="cursor-pointer font-medium"
                onClick={async () => {
                  try {
                    const token = localStorage.getItem('token');
                    const res = await fetch('/api/auth/dev-switch-role', {
                      method: 'POST',
                      headers: {
                        'Content-Type': 'application/json',
                        Authorization: `Bearer ${token}`
                      },
                      body: JSON.stringify({ role })
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
                }}
              >
                Switch to {role}
              </DropdownMenuItem>
            ))}
          </DropdownMenuContent>
        </DropdownMenu>

        {/* Preview Landing Page - For Admin */}
        <Link href="/landing" target="_blank">
          <Button variant="outline" className="flex items-center gap-2">
            <ExternalLink className="w-4 h-4" />
            <span className="hidden sm:inline">Preview Landing</span>
          </Button>
        </Link>

        {/* Notifications */}
        <Button variant="ghost" size="icon">
          <Bell className="w-5 h-5 text-gray-600" />
        </Button>

        {/* User Menu */}
        <DropdownMenu>
          <DropdownMenuTrigger asChild>
            <Button variant="ghost" size="icon">
              <div className="w-8 h-8 rounded-full bg-blue-600 text-white flex items-center justify-center font-semibold">
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
            <DropdownMenuItem className="cursor-pointer">
              <span>Settings</span>
            </DropdownMenuItem>
            <DropdownMenuSeparator />
            <DropdownMenuItem onClick={handleLogout} className="cursor-pointer text-red-600">
              <LogOut className="w-4 h-4 mr-2" />
              <span>Logout</span>
            </DropdownMenuItem>
          </DropdownMenuContent>
        </DropdownMenu>
      </div>
    </nav>
  );
}
