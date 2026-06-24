'use client';

import { useState, useEffect } from 'react';
import { useRouter } from 'next/navigation';
import { useRealtime } from '@/hooks/useRealtime';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import Navbar from '@/components/Navbar';
import Sidebar from '@/components/Sidebar';
import { ClipboardList, ArrowRight, CheckCircle2, Clock, Search, Filter, LayoutList, Inbox } from 'lucide-react';
import { toast } from 'sonner';

export default function FunctionalPage() {
  const router = useRouter();
  const [user, setUser] = useState<any>(null);
  const [tickets, setTickets] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);
  const [searchQuery, setSearchQuery] = useState('');

  useEffect(() => {
    const storedUser = localStorage.getItem('user');
    const token = localStorage.getItem('token');
    if (!token || !storedUser) { router.push('/demo-login'); return; }
    const parsedUser = JSON.parse(storedUser);
    if (!['FUNCTIONAL_TEAM', 'ADMIN', 'SUPER_ADMIN'].includes(parsedUser.role)) {
      router.push('/dashboard-demo'); return;
    }
    setUser(parsedUser);
    fetchTickets(token);
  }, [router]);

  useRealtime('Ticket', () => {
    const token = localStorage.getItem('token');
    if (token) fetchTickets(token);
  });

  const fetchTickets = async (token: string) => {
    setLoading(true);
    try {
      const res = await fetch('/api/tickets', { headers: { Authorization: `Bearer ${token}` } });
      const data = await res.json();
      if (data.success) setTickets(data.data);
    } catch (e) { toast.error('Gagal memuat data tiket'); }
    finally { setLoading(false); }
  };

  const handleAssign = async (ticketId: string, status: string) => {
    const token = localStorage.getItem('token');
    try {
      const res = await fetch(`/api/tickets/${ticketId}`, {
        method: 'PATCH',
        headers: { 'Content-Type': 'application/json', Authorization: `Bearer ${token}` },
        body: JSON.stringify({ status }),
      });
      const data = await res.json();
      if (data.success) {
        toast.success('Status tiket berhasil diperbarui!');
        fetchTickets(token!);
      } else { toast.error(data.error || 'Gagal memperbarui.'); }
    } catch (e) { toast.error('Terjadi kesalahan koneksi.'); }
  };

  if (!user) return null;

  const pendingTickets = tickets.filter(t => t.status === 'PENDING_APPROVAL');
  const approvedTickets = tickets.filter(t => t.status === 'APPROVED' || t.status === 'OPEN');
  const inProgressTickets = tickets.filter(t => t.status === 'IN_PROGRESS');

  const getPriorityStyle = (p: string) => ({
    CRITICAL: 'bg-red-100 text-red-700 border-red-200',
    HIGH: 'bg-orange-100 text-orange-700 border-orange-200',
    MEDIUM: 'bg-yellow-100 text-yellow-700 border-yellow-200',
    LOW: 'bg-green-100 text-green-700 border-green-200',
  }[p] || 'bg-slate-100 text-slate-600 border-slate-200');

  return (
    <div className="flex h-screen bg-slate-50">
      <Sidebar user={user} />
      <div className="flex-1 flex flex-col overflow-hidden">
        <Navbar user={user} />
        <main className="flex-1 overflow-auto">
          <div className="p-8 max-w-7xl mx-auto w-full">

            {/* Header */}
            <div className="mb-8">
              <div className="rounded-2xl p-6 bg-gradient-to-r from-indigo-600 to-indigo-400 text-white shadow-lg shadow-indigo-500/20">
                <div className="flex items-center gap-3 mb-1">
                  <ClipboardList className="w-7 h-7" />
                  <h1 className="text-2xl font-extrabold tracking-tight">Panel Functional Team</h1>
                </div>
                <p className="text-indigo-100 text-sm">Analisis kebutuhan, validasi, dan koordinasi penugasan tiket ke tim Developer.</p>
              </div>
            </div>

            {/* Stats */}
            <div className="grid grid-cols-1 sm:grid-cols-3 gap-4 mb-8">
              {[
                { label: 'Menunggu Triage', value: pendingTickets.length, color: 'text-orange-600', bg: 'bg-orange-50 border-orange-100', icon: <Inbox className="w-5 h-5 text-orange-400" /> },
                { label: 'Siap Dikerjakan', value: approvedTickets.length, color: 'text-indigo-600', bg: 'bg-indigo-50 border-indigo-100', icon: <CheckCircle2 className="w-5 h-5 text-indigo-400" /> },
                { label: 'Sedang Dikerjakan', value: inProgressTickets.length, color: 'text-blue-600', bg: 'bg-blue-50 border-blue-100', icon: <Clock className="w-5 h-5 text-blue-400" /> },
              ].map(s => (
                <Card key={s.label} className={`border ${s.bg}`}>
                  <CardContent className="pt-5 pb-4 flex items-center justify-between">
                    <div>
                      <p className="text-xs text-slate-500 font-semibold uppercase tracking-wide">{s.label}</p>
                      <p className={`text-4xl font-black mt-1 ${s.color}`}>{s.value}</p>
                    </div>
                    {s.icon}
                  </CardContent>
                </Card>
              ))}
            </div>

            {/* Triage Section */}
            <Card className="mb-6 border-orange-100">
              <CardHeader className="pb-3 border-b border-orange-50 bg-orange-50/60 rounded-t-xl">
                <CardTitle className="text-sm font-bold text-orange-800 flex items-center gap-2">
                  <Inbox className="w-4 h-4" /> Triage \u2014 Menunggu Analisis
                </CardTitle>
              </CardHeader>
              <CardContent className="pt-4">
                {pendingTickets.length === 0 ? (
                  <p className="text-slate-400 text-sm text-center py-6">Tidak ada tiket yang perlu dianalisis.</p>
                ) : (
                  <div className="space-y-3">
                    {pendingTickets.map(t => (
                      <div key={t.id} className="flex items-center justify-between p-3 rounded-xl border border-slate-100 bg-white hover:border-indigo-200 hover:shadow-sm transition-all">
                        <div>
                          <p className="text-xs font-bold text-indigo-600">{t.ticketNumber}</p>
                          <p className="text-sm font-semibold text-slate-800 mt-0.5">{t.title}</p>
                          <span className={`text-[10px] font-bold px-2 py-0.5 rounded-full border mt-1 inline-block ${getPriorityStyle(t.priority)}`}>{t.priority}</span>
                        </div>
                        <div className="flex gap-2 ml-4 flex-shrink-0">
                          <Button size="sm" variant="outline" className="border-indigo-200 text-indigo-700 hover:bg-indigo-50 text-xs h-8"
                            onClick={() => handleAssign(t.id, 'APPROVED')}>
                            <CheckCircle2 className="w-3.5 h-3.5 mr-1" /> Validasi
                          </Button>
                          <Button size="sm" className="bg-indigo-600 hover:bg-indigo-700 text-xs h-8"
                            onClick={() => handleAssign(t.id, 'IN_PROGRESS')}>
                            <ArrowRight className="w-3.5 h-3.5 mr-1" /> Tugaskan
                          </Button>
                        </div>
                      </div>
                    ))}
                  </div>
                )}
              </CardContent>
            </Card>

            {/* Approved / In Progress */}
            <Card className="border-blue-100">
              <CardHeader className="pb-3 border-b border-blue-50 bg-blue-50/60 rounded-t-xl">
                <CardTitle className="text-sm font-bold text-blue-800 flex items-center gap-2">
                  <LayoutList className="w-4 h-4" /> Semua Tiket Aktif
                </CardTitle>
              </CardHeader>
              <CardContent className="pt-4 overflow-x-auto">
                {loading ? (
                  <p className="text-slate-400 text-sm text-center py-6">Memuat data...</p>
                ) : (
                  <table className="w-full text-sm">
                    <thead>
                      <tr className="text-slate-400 text-xs uppercase border-b">
                        <th className="text-left py-2 px-3 font-bold">Tiket</th>
                        <th className="text-left py-2 px-3 font-bold">Judul</th>
                        <th className="text-left py-2 px-3 font-bold">Prioritas</th>
                        <th className="text-left py-2 px-3 font-bold">Status</th>
                        <th className="text-center py-2 px-3 font-bold">Aksi</th>
                      </tr>
                    </thead>
                    <tbody>
                      {[...approvedTickets, ...inProgressTickets].map(t => (
                        <tr key={t.id} className="border-b hover:bg-slate-50">
                          <td className="py-2.5 px-3 font-mono text-xs text-indigo-600 font-bold">{t.ticketNumber}</td>
                          <td className="py-2.5 px-3 font-medium text-slate-800">{t.title}</td>
                          <td className="py-2.5 px-3">
                            <span className={`text-[10px] font-bold px-2 py-0.5 rounded-full border ${getPriorityStyle(t.priority)}`}>{t.priority}</span>
                          </td>
                          <td className="py-2.5 px-3 text-xs font-semibold text-slate-600">{t.status.replace(/_/g, ' ')}</td>
                          <td className="py-2.5 px-3 text-center">
                            <Button size="sm" variant="outline" className="text-xs h-7 px-3" onClick={() => router.push(`/tickets/${t.id}`)}>
                              Detail
                            </Button>
                          </td>
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
