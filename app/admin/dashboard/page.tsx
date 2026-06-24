'use client';

import { useState, useEffect } from 'react';
import { useRouter } from 'next/navigation';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import Navbar from '@/components/Navbar';
import Sidebar from '@/components/Sidebar';
import Link from 'next/link';
import {
  Users, Ticket, Settings, BarChart3, ShieldCheck, UserCog,
  ListTodo, Image as ImageIcon, Activity, TrendingUp, AlertTriangle,
  CheckCircle2, Clock, XCircle, ChevronRight,
} from 'lucide-react';
import { useRealtime } from '@/hooks/useRealtime';

export default function AdminDashboard() {
  const router = useRouter();
  const [user, setUser] = useState<any>(null);
  const [stats, setStats] = useState({ total: 0, pending: 0, open: 0, resolved: 0, closed: 0, inProgress: 0, inReview: 0 });
  const [recentTickets, setRecentTickets] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const storedUser = localStorage.getItem('user');
    const token = localStorage.getItem('token');
    if (!token || !storedUser) { router.push('/login'); return; }
    const parsedUser = JSON.parse(storedUser);
    if (parsedUser.role !== 'ADMIN' && parsedUser.role !== 'SUPER_ADMIN') {
      router.push('/dashboard'); return;
    }
    setUser(parsedUser);
    fetchStats(token);
  }, [router]);

  useRealtime('Ticket', () => {
    const token = localStorage.getItem('token');
    if (token) fetchStats(token);
  });

  const fetchStats = async (token: string) => {
    try {
      const res = await fetch('/api/tickets', { headers: { Authorization: `Bearer ${token}` } });
      const data = await res.json();
      if (data.success) {
        const all: any[] = data.data;
        setStats({
          total: all.length,
          pending: all.filter(t => t.status === 'PENDING_APPROVAL').length,
          open: all.filter(t => t.status === 'OPEN' || t.status === 'APPROVED').length,
          inProgress: all.filter(t => t.status === 'IN_PROGRESS').length,
          inReview: all.filter(t => t.status === 'IN_REVIEW').length,
          resolved: all.filter(t => t.status === 'RESOLVED').length,
          closed: all.filter(t => t.status === 'CLOSED').length,
        });
        setRecentTickets(all.slice(0, 6));
      }
    } catch (e) { console.error(e); }
    finally { setLoading(false); }
  };

  if (!user) return null;

  const adminTools = [
    { label: 'User Management', desc: 'Kelola akun & peran pengguna', icon: UserCog, href: '/admin/users', color: 'from-blue-500 to-blue-600', badge: null },
    { label: 'Queue Management', desc: 'Pantau antrian tiket masuk', icon: ListTodo, href: '/admin/queue', color: 'from-indigo-500 to-indigo-600', badge: stats.pending > 0 ? stats.pending : null },
    { label: 'Landing Manager', desc: 'Edit konten halaman publik', icon: ImageIcon, href: '/admin/landing-manager', color: 'from-purple-500 to-purple-600', badge: null },
    { label: 'Pengaturan Sistem', desc: 'Konfigurasi aplikasi & notifikasi', icon: Settings, href: '/admin/settings', color: 'from-slate-500 to-slate-700', badge: null },
    { label: 'Analytics', desc: 'Laporan & metrik sistem', icon: BarChart3, href: '/analytics', color: 'from-cyan-500 to-cyan-600', badge: null },
    { label: 'Manajemen Tim', desc: 'Kelola anggota & departemen', icon: Users, href: '/team', color: 'from-emerald-500 to-emerald-600', badge: null },
  ];

  const pipeline = [
    { label: 'Pending Approval', value: stats.pending, color: 'bg-orange-500', icon: <AlertTriangle className="w-4 h-4 text-orange-500" /> },
    { label: 'In Progress', value: stats.inProgress, color: 'bg-blue-500', icon: <Clock className="w-4 h-4 text-blue-500" /> },
    { label: 'In Review (QA)', value: stats.inReview, color: 'bg-amber-500', icon: <ShieldCheck className="w-4 h-4 text-amber-500" /> },
    { label: 'Resolved', value: stats.resolved, color: 'bg-green-500', icon: <CheckCircle2 className="w-4 h-4 text-green-500" /> },
    { label: 'Closed', value: stats.closed, color: 'bg-slate-400', icon: <XCircle className="w-4 h-4 text-slate-400" /> },
  ];

  const total = pipeline.reduce((a, b) => a + b.value, 0) || 1;

  const statusColor: Record<string, string> = {
    PENDING_APPROVAL: 'bg-orange-100 text-orange-700',
    APPROVED: 'bg-indigo-100 text-indigo-700',
    OPEN: 'bg-indigo-100 text-indigo-700',
    IN_PROGRESS: 'bg-blue-100 text-blue-700',
    IN_REVIEW: 'bg-amber-100 text-amber-700',
    RESOLVED: 'bg-green-100 text-green-700',
    CLOSED: 'bg-slate-100 text-slate-600',
  };

  return (
    <div className="flex h-screen bg-slate-50">
      <Sidebar user={user} />
      <div className="flex-1 flex flex-col overflow-hidden">
        <Navbar user={user} />
        <main className="flex-1 overflow-auto">
          <div className="p-8 max-w-7xl mx-auto w-full">

            {/* Header */}
            <div className="mb-8 rounded-2xl overflow-hidden shadow-xl bg-gradient-to-r from-blue-700 via-blue-600 to-indigo-600 p-8 text-white relative">
              <div className="absolute inset-0 opacity-10" style={{ backgroundImage: "url(\"data:image/svg+xml,%3Csvg width='60' height='60' viewBox='0 0 60 60' xmlns='http://www.w3.org/2000/svg'%3E%3Cg fill='none' fill-rule='evenodd'%3E%3Cg fill='%23ffffff' fill-opacity='0.4'%3E%3Cpath d='M36 34v-4h-2v4h-4v2h4v4h2v-4h4v-2h-4zm0-30V0h-2v4h-4v2h4v4h2V6h4V4h-4zM6 34v-4H4v4H0v2h4v4h2v-4h4v-2H6zM6 4V0H4v4H0v2h4v4h2V6h4V4H6z'/%3E%3C/g%3E%3C/g%3E%3C/svg%3E\")" }} />
              <div className="relative">
                <div className="flex items-center gap-2 mb-2">
                  <ShieldCheck className="w-5 h-5 text-blue-200" />
                  <span className="text-blue-200 text-xs font-bold uppercase tracking-widest">Admin Control Panel</span>
                </div>
                <h1 className="text-3xl font-extrabold">Selamat datang, {user.name}</h1>
                <p className="text-blue-200 text-sm mt-1">Kelola sistem, pengguna, dan pantau seluruh pipeline tiket dari sini.</p>
              </div>
              <div className="absolute top-6 right-8 hidden md:flex gap-4">
                {[{ label: 'Total Tiket', value: stats.total }, { label: 'Perlu Persetujuan', value: stats.pending }].map(s => (
                  <div key={s.label} className="bg-white/15 backdrop-blur border border-white/20 rounded-xl px-5 py-3 text-center">
                    <p className="text-2xl font-black">{s.value}</p>
                    <p className="text-xs text-blue-200 mt-0.5">{s.label}</p>
                  </div>
                ))}
              </div>
            </div>

            {/* Ticket Pipeline Funnel */}
            <Card className="mb-8 border-slate-100 shadow-sm">
              <CardHeader className="pb-2 border-b border-slate-100">
                <CardTitle className="text-sm font-bold text-slate-600 flex items-center gap-2">
                  <Activity className="w-4 h-4" /> Pipeline Tiket (Overview Sistem)
                </CardTitle>
              </CardHeader>
              <CardContent className="pt-5">
                <div className="space-y-3">
                  {pipeline.map(p => (
                    <div key={p.label} className="flex items-center gap-3">
                      {p.icon}
                      <span className="text-sm font-semibold text-slate-600 w-40 flex-shrink-0">{p.label}</span>
                      <div className="flex-1 bg-slate-100 rounded-full h-3 overflow-hidden">
                        <div className={`h-3 rounded-full ${p.color} transition-all duration-700`} style={{ width: `${(p.value / total) * 100}%` }} />
                      </div>
                      <span className="text-sm font-black text-slate-800 w-8 text-right">{p.value}</span>
                    </div>
                  ))}
                </div>
              </CardContent>
            </Card>

            {/* Admin Quick Tools */}
            <div className="mb-8">
              <h2 className="text-base font-bold text-slate-700 mb-4 flex items-center gap-2">
                <UserCog className="w-4 h-4 text-blue-500" /> Alat Administrasi
              </h2>
              <div className="grid grid-cols-2 md:grid-cols-3 gap-4">
                {adminTools.map(tool => {
                  const Icon = tool.icon;
                  return (
                    <Link href={tool.href} key={tool.label}>
                      <div className="group relative bg-white border border-slate-100 rounded-2xl p-5 hover:shadow-lg hover:border-blue-100 transition-all duration-200 cursor-pointer overflow-hidden">
                        <div className={`absolute -top-4 -right-4 w-20 h-20 rounded-full bg-gradient-to-br ${tool.color} opacity-10 group-hover:opacity-20 transition-opacity`} />
                        <div className={`w-10 h-10 rounded-xl bg-gradient-to-br ${tool.color} flex items-center justify-center mb-3 shadow-sm`}>
                          <Icon className="w-5 h-5 text-white" />
                        </div>
                        <div className="flex items-start justify-between">
                          <div>
                            <p className="font-bold text-slate-800 text-sm">{tool.label}</p>
                            <p className="text-xs text-slate-400 mt-0.5 leading-relaxed">{tool.desc}</p>
                          </div>
                          {tool.badge && (
                            <span className="bg-red-500 text-white text-[10px] font-black px-1.5 py-0.5 rounded-full min-w-5 text-center">{tool.badge}</span>
                          )}
                        </div>
                        <ChevronRight className="w-4 h-4 text-slate-300 group-hover:text-blue-400 group-hover:translate-x-1 transition-all absolute bottom-4 right-4" />
                      </div>
                    </Link>
                  );
                })}
              </div>
            </div>

            {/* Recent Tickets Monitor */}
            <Card className="shadow-sm border-slate-100">
              <CardHeader className="pb-3 border-b border-slate-100 flex flex-row items-center justify-between">
                <CardTitle className="text-sm font-bold text-slate-600 flex items-center gap-2">
                  <Ticket className="w-4 h-4" /> Monitor Tiket Terbaru
                </CardTitle>
                <Link href="/tickets">
                  <Button variant="ghost" size="sm" className="text-xs text-blue-600 hover:text-blue-700 h-7 px-2">
                    Lihat Semua <ChevronRight className="w-3 h-3 ml-1" />
                  </Button>
                </Link>
              </CardHeader>
              <CardContent className="p-0">
                {loading ? (
                  <p className="text-slate-400 text-sm text-center py-8">Memuat data...</p>
                ) : recentTickets.length === 0 ? (
                  <p className="text-slate-400 text-sm text-center py-8">Belum ada tiket.</p>
                ) : (
                  <table className="w-full text-sm">
                    <thead>
                      <tr className="bg-slate-50 border-b border-slate-100">
                        <th className="text-left px-5 py-3 text-xs font-bold text-slate-400 uppercase tracking-wider">Tiket</th>
                        <th className="text-left px-5 py-3 text-xs font-bold text-slate-400 uppercase tracking-wider">Judul</th>
                        <th className="text-left px-5 py-3 text-xs font-bold text-slate-400 uppercase tracking-wider">Status</th>
                        <th className="text-left px-5 py-3 text-xs font-bold text-slate-400 uppercase tracking-wider">Prioritas</th>
                        <th className="text-left px-5 py-3 text-xs font-bold text-slate-400 uppercase tracking-wider">Tanggal</th>
                      </tr>
                    </thead>
                    <tbody>
                      {recentTickets.map((t, i) => (
                        <tr key={t.id} onClick={() => router.push(`/tickets/${t.id}`)} className="border-b border-slate-50 hover:bg-blue-50/40 cursor-pointer transition-colors">
                          <td className="px-5 py-3 font-mono text-xs font-bold text-blue-600">{t.ticketNumber}</td>
                          <td className="px-5 py-3 font-medium text-slate-800 max-w-xs truncate">{t.title}</td>
                          <td className="px-5 py-3">
                            <span className={`text-[10px] font-bold px-2 py-0.5 rounded-full ${statusColor[t.status] || 'bg-slate-100 text-slate-600'}`}>
                              {t.status.replace(/_/g, ' ')}
                            </span>
                          </td>
                          <td className="px-5 py-3 text-xs font-semibold text-slate-500">{t.priority}</td>
                          <td className="px-5 py-3 text-xs text-slate-400">{new Date(t.createdAt).toLocaleDateString('id-ID', { day: 'numeric', month: 'short', year: 'numeric' })}</td>
                        </tr>
                      ))}
                    </tbody>
                  </table>
                )}
              </CardContent>
            </Card>

          </div>
        </main>
      </div>
    </div>
  );
}
