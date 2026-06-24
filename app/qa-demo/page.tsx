'use client';

import { useEffect, useState } from 'react';
import { useRouter } from 'next/navigation';
import { useRealtime } from '@/hooks/useRealtime';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import Sidebar from '@/components/Sidebar';
import Navbar from '@/components/Navbar';
import {
  TestTube2,
  CheckCircle2,
  XCircle,
  ClipboardList,
  ShieldCheck,
  Loader2,
  AlertCircle,
} from 'lucide-react';
import { toast } from 'sonner';

interface Ticket {
  id: string;
  ticketNumber: string;
  title: string;
  priority: string;
  status: string;
  createdAt: string;
  assignedTo: string | null;
  assignedName?: string | null;
  createdBy?: { name: string } | null;
}

const PRIORITY_STYLES: Record<string, string> = {
  CRITICAL: 'bg-red-100 text-red-700 border border-red-200',
  HIGH: 'bg-orange-100 text-orange-700 border border-orange-200',
  MEDIUM: 'bg-blue-100 text-blue-700 border border-blue-200',
  LOW: 'bg-green-100 text-green-700 border border-green-200',
};

export default function QAPage() {
  const router = useRouter();
  const [user, setUser] = useState<any>(null);
  const [tickets, setTickets] = useState<Ticket[]>([]);
  const [loading, setLoading] = useState(true);
  const [actionLoading, setActionLoading] = useState<string | null>(null);

  useEffect(() => {
    const storedUser = localStorage.getItem('user');
    const token = localStorage.getItem('token');
    if (!token || !storedUser) {
      router.push('/demo-login');
      return;
    }
    const parsedUser = JSON.parse(storedUser);
    if (
      parsedUser.role !== 'QA' &&
      parsedUser.role !== 'ADMIN' &&
      parsedUser.role !== 'SUPER_ADMIN'
    ) {
      router.push('/dashboard-demo');
      return;
    }
    setUser(parsedUser);
    fetchTickets(token);
  }, [router]);

  useRealtime('Ticket', () => {
    const token = localStorage.getItem('token');
    if (token) fetchTickets(token);
  });

  const fetchTickets = async (token: string) => {
    try {
      setLoading(true);
      const res = await fetch('/api/tickets', {
        headers: { Authorization: `Bearer ${token}` },
      });
      const data = await res.json();
      if (data.success) {
        setTickets(data.data);
      }
    } catch (err) {
      console.error('Failed to fetch tickets:', err);
    } finally {
      setLoading(false);
    }
  };

  const updateTicketStatus = async (ticketId: string, newStatus: 'RESOLVED' | 'IN_PROGRESS') => {
    const token = localStorage.getItem('token');
    if (!token) return;

    setActionLoading(ticketId + newStatus);
    try {
      const res = await fetch(`/api/tickets/${ticketId}`, {
        method: 'PATCH',
        headers: {
          'Content-Type': 'application/json',
          Authorization: `Bearer ${token}`,
        },
        body: JSON.stringify({ status: newStatus }),
      });
      const data = await res.json();
      if (data.success) {
        if (newStatus === 'RESOLVED') {
          toast.success('Tiket lulus QA! Status diubah ke Resolved.');
        } else {
          toast.error('Tiket ditolak dan dikembalikan ke Developer.');
        }
        fetchTickets(token);
      } else {
        toast.error(data.message || 'Gagal mengubah status tiket.');
      }
    } catch (err) {
      toast.error('Terjadi kesalahan. Coba lagi.');
    } finally {
      setActionLoading(null);
    }
  };

  if (!user) return null;

  const inReviewTickets = tickets.filter((t) => t.status === 'IN_REVIEW');
  const resolvedTickets = tickets.filter((t) => t.status === 'RESOLVED');
  const todayStr = new Date().toDateString();
  const resolvedToday = resolvedTickets.filter(
    (t) => new Date(t.createdAt).toDateString() === todayStr
  ).length;

  // Count tickets that were rejected (sent back to IN_PROGRESS) — we approximate using IN_PROGRESS count
  const rejectedTickets = tickets.filter((t) => t.status === 'IN_PROGRESS').length;

  return (
    <div className="flex h-screen bg-slate-50">
      <Sidebar user={user} />

      <div className="flex-1 flex flex-col overflow-hidden">
        <Navbar user={user} />

        <main className="flex-1 overflow-auto">
          <div className="p-8 max-w-7xl mx-auto w-full">

            {/* Page Header */}
            <div className="mb-8 flex items-center gap-4">
              <div className="w-14 h-14 rounded-2xl bg-gradient-to-br from-amber-400 to-orange-500 flex items-center justify-center shadow-lg shadow-amber-200">
                <TestTube2 className="w-7 h-7 text-white" />
              </div>
              <div>
                <h1 className="text-3xl font-bold text-gray-900">QA Workspace</h1>
                <p className="text-gray-500 mt-0.5 text-sm">Pengujian & Verifikasi Tiket</p>
              </div>
            </div>

            {/* Gradient Banner */}
            <div className="relative mb-8 rounded-2xl overflow-hidden shadow-xl">
              <div className="absolute inset-0 bg-gradient-to-r from-amber-500 via-orange-500 to-yellow-400" />
              <div className="absolute inset-0 opacity-20"
                style={{ backgroundImage: "url(\"data:image/svg+xml,%3Csvg width='60' height='60' viewBox='0 0 60 60' xmlns='http://www.w3.org/2000/svg'%3E%3Cg fill='none' fill-rule='evenodd'%3E%3Cg fill='%23ffffff' fill-opacity='0.4'%3E%3Cpath d='M36 34v-4h-2v4h-4v2h4v4h2v-4h4v-2h-4zm0-30V0h-2v4h-4v2h4v4h2V6h4V4h-4zM6 34v-4H4v4H0v2h4v4h2v-4h4v-2H6zM6 4V0H4v4H0v2h4v4h2V6h4V4H6z'/%3E%3C/g%3E%3C/g%3E%3C/svg%3E\")" }}
              />
              <div className="relative px-8 py-7 flex items-center justify-between">
                <div>
                  <div className="flex items-center gap-2 mb-1">
                    <ShieldCheck className="w-5 h-5 text-white/80" />
                    <span className="text-white/80 text-sm font-semibold uppercase tracking-widest">Panel QA</span>
                  </div>
                  <h2 className="text-2xl font-extrabold text-white drop-shadow">
                    Pengujian & Verifikasi
                  </h2>
                  <p className="text-white/75 text-sm mt-1">
                    Review dan validasi hasil pengerjaan Developer sebelum tiket di-resolve.
                  </p>
                </div>
                <div className="hidden md:flex items-center gap-3">
                  <div className="bg-white/20 backdrop-blur-sm rounded-xl px-5 py-3 text-white text-center border border-white/30">
                    <p className="text-2xl font-bold">{inReviewTickets.length}</p>
                    <p className="text-xs font-medium opacity-80">Antrian</p>
                  </div>
                </div>
              </div>
            </div>

            {/* Stat Cards */}
            <div className="grid grid-cols-1 md:grid-cols-3 gap-5 mb-8">
              <Card className="bg-gradient-to-br from-amber-50 to-orange-50 border-amber-200 shadow-sm hover:shadow-md transition-shadow">
                <CardContent className="pt-6">
                  <div className="flex items-start justify-between">
                    <div>
                      <p className="text-sm text-amber-700 font-semibold">Antrian Pengujian</p>
                      <p className="text-4xl font-bold text-amber-900 mt-2">{inReviewTickets.length}</p>
                      <p className="text-xs text-amber-600 mt-1">Tiket IN_REVIEW</p>
                    </div>
                    <div className="w-12 h-12 rounded-xl bg-amber-100 flex items-center justify-center">
                      <ClipboardList className="w-6 h-6 text-amber-500" />
                    </div>
                  </div>
                </CardContent>
              </Card>

              <Card className="bg-gradient-to-br from-green-50 to-emerald-50 border-green-200 shadow-sm hover:shadow-md transition-shadow">
                <CardContent className="pt-6">
                  <div className="flex items-start justify-between">
                    <div>
                      <p className="text-sm text-green-700 font-semibold">Lulus QA Hari Ini</p>
                      <p className="text-4xl font-bold text-green-900 mt-2">{resolvedToday}</p>
                      <p className="text-xs text-green-600 mt-1">Tiket RESOLVED hari ini</p>
                    </div>
                    <div className="w-12 h-12 rounded-xl bg-green-100 flex items-center justify-center">
                      <CheckCircle2 className="w-6 h-6 text-green-500" />
                    </div>
                  </div>
                </CardContent>
              </Card>

              <Card className="bg-gradient-to-br from-red-50 to-rose-50 border-red-200 shadow-sm hover:shadow-md transition-shadow">
                <CardContent className="pt-6">
                  <div className="flex items-start justify-between">
                    <div>
                      <p className="text-sm text-red-700 font-semibold">Tiket Ditolak</p>
                      <p className="text-4xl font-bold text-red-900 mt-2">{rejectedTickets}</p>
                      <p className="text-xs text-red-600 mt-1">Kembali ke IN_PROGRESS</p>
                    </div>
                    <div className="w-12 h-12 rounded-xl bg-red-100 flex items-center justify-center">
                      <XCircle className="w-6 h-6 text-red-500" />
                    </div>
                  </div>
                </CardContent>
              </Card>
            </div>

            {/* IN_REVIEW Tickets Table */}
            <Card className="mb-8 shadow-sm border-amber-100">
              <CardHeader className="border-b border-amber-100 bg-gradient-to-r from-amber-50 to-orange-50 rounded-t-xl">
                <div className="flex items-center gap-3">
                  <div className="w-8 h-8 rounded-lg bg-amber-100 flex items-center justify-center">
                    <TestTube2 className="w-4 h-4 text-amber-600" />
                  </div>
                  <div>
                    <CardTitle className="text-amber-900 text-lg">Antrian Pengujian</CardTitle>
                    <p className="text-xs text-amber-600 mt-0.5">Tiket yang siap diuji oleh tim QA</p>
                  </div>
                </div>
              </CardHeader>
              <CardContent className="p-0">
                {loading ? (
                  <div className="flex items-center justify-center py-16">
                    <Loader2 className="w-8 h-8 animate-spin text-amber-400" />
                  </div>
                ) : inReviewTickets.length === 0 ? (
                  <div className="flex flex-col items-center justify-center py-16 text-gray-400">
                    <ShieldCheck className="w-12 h-12 mb-3 opacity-30" />
                    <p className="font-semibold">Tidak ada tiket dalam antrian pengujian</p>
                    <p className="text-sm mt-1 opacity-70">Semua tiket sudah diproses 🎉</p>
                  </div>
                ) : (
                  <div className="overflow-x-auto">
                    <table className="w-full">
                      <thead>
                        <tr className="bg-amber-50/60 border-b border-amber-100">
                          <th className="text-left px-6 py-3 text-xs font-bold text-amber-700 uppercase tracking-wider">Tiket #</th>
                          <th className="text-left px-6 py-3 text-xs font-bold text-amber-700 uppercase tracking-wider">Judul</th>
                          <th className="text-left px-6 py-3 text-xs font-bold text-amber-700 uppercase tracking-wider">Prioritas</th>
                          <th className="text-left px-6 py-3 text-xs font-bold text-amber-700 uppercase tracking-wider">Tanggal Dibuat</th>
                          <th className="text-left px-6 py-3 text-xs font-bold text-amber-700 uppercase tracking-wider">Aksi</th>
                        </tr>
                      </thead>
                      <tbody className="divide-y divide-amber-50">
                        {inReviewTickets.map((ticket, idx) => (
                          <tr
                            key={ticket.id}
                            className={`hover:bg-amber-50/40 transition-colors ${idx % 2 === 0 ? 'bg-white' : 'bg-amber-50/20'}`}
                          >
                            <td className="px-6 py-4">
                              <span className="font-mono text-xs font-bold text-amber-700 bg-amber-50 px-2 py-1 rounded-md border border-amber-200">
                                {ticket.ticketNumber}
                              </span>
                            </td>
                            <td className="px-6 py-4">
                              <p className="font-semibold text-gray-800 text-sm truncate max-w-xs">{ticket.title}</p>
                              {ticket.assignedName && (
                                <p className="text-xs text-gray-400 mt-0.5">Dikerjakan oleh: {ticket.assignedName}</p>
                              )}
                            </td>
                            <td className="px-6 py-4">
                              <span className={`text-xs font-bold px-2.5 py-1 rounded-full ${PRIORITY_STYLES[ticket.priority] || 'bg-gray-100 text-gray-600'}`}>
                                {ticket.priority}
                              </span>
                            </td>
                            <td className="px-6 py-4 text-sm text-gray-500">
                              {new Date(ticket.createdAt).toLocaleDateString('id-ID', {
                                day: 'numeric',
                                month: 'short',
                                year: 'numeric',
                              })}
                            </td>
                            <td className="px-6 py-4">
                              <div className="flex items-center gap-2">
                                <Button
                                  size="sm"
                                  className="bg-gradient-to-r from-green-500 to-emerald-500 hover:from-green-600 hover:to-emerald-600 text-white shadow-sm shadow-green-200 text-xs font-bold gap-1.5"
                                  onClick={() => updateTicketStatus(ticket.id, 'RESOLVED')}
                                  disabled={actionLoading === ticket.id + 'RESOLVED'}
                                >
                                  {actionLoading === ticket.id + 'RESOLVED' ? (
                                    <Loader2 className="w-3 h-3 animate-spin" />
                                  ) : (
                                    <CheckCircle2 className="w-3.5 h-3.5" />
                                  )}
                                  Lulus QA
                                </Button>
                                <Button
                                  size="sm"
                                  variant="outline"
                                  className="border-red-200 text-red-600 hover:bg-red-50 hover:border-red-300 text-xs font-bold gap-1.5"
                                  onClick={() => updateTicketStatus(ticket.id, 'IN_PROGRESS')}
                                  disabled={actionLoading === ticket.id + 'IN_PROGRESS'}
                                >
                                  {actionLoading === ticket.id + 'IN_PROGRESS' ? (
                                    <Loader2 className="w-3 h-3 animate-spin" />
                                  ) : (
                                    <XCircle className="w-3.5 h-3.5" />
                                  )}
                                  Reject
                                </Button>
                              </div>
                            </td>
                          </tr>
                        ))}
                      </tbody>
                    </table>
                  </div>
                )}
              </CardContent>
            </Card>

            {/* Already Resolved Section */}
            <Card className="shadow-sm border-gray-100">
              <CardHeader className="border-b border-gray-100 bg-gray-50/80 rounded-t-xl">
                <div className="flex items-center gap-3">
                  <div className="w-8 h-8 rounded-lg bg-gray-100 flex items-center justify-center">
                    <CheckCircle2 className="w-4 h-4 text-gray-400" />
                  </div>
                  <div>
                    <CardTitle className="text-gray-500 text-lg">Sudah Diuji</CardTitle>
                    <p className="text-xs text-gray-400 mt-0.5">Tiket yang telah lulus verifikasi QA</p>
                  </div>
                </div>
              </CardHeader>
              <CardContent className="p-0">
                {resolvedTickets.length === 0 ? (
                  <div className="flex flex-col items-center justify-center py-12 text-gray-300">
                    <AlertCircle className="w-10 h-10 mb-2" />
                    <p className="text-sm font-medium">Belum ada tiket yang diselesaikan</p>
                  </div>
                ) : (
                  <div className="overflow-x-auto">
                    <table className="w-full">
                      <thead>
                        <tr className="bg-gray-50 border-b border-gray-100">
                          <th className="text-left px-6 py-3 text-xs font-bold text-gray-400 uppercase tracking-wider">Tiket #</th>
                          <th className="text-left px-6 py-3 text-xs font-bold text-gray-400 uppercase tracking-wider">Judul</th>
                          <th className="text-left px-6 py-3 text-xs font-bold text-gray-400 uppercase tracking-wider">Prioritas</th>
                          <th className="text-left px-6 py-3 text-xs font-bold text-gray-400 uppercase tracking-wider">Tanggal</th>
                          <th className="text-left px-6 py-3 text-xs font-bold text-gray-400 uppercase tracking-wider">Status</th>
                        </tr>
                      </thead>
                      <tbody className="divide-y divide-gray-50">
                        {resolvedTickets.slice(0, 10).map((ticket, idx) => (
                          <tr key={ticket.id} className={`opacity-60 hover:opacity-80 transition-opacity ${idx % 2 === 0 ? 'bg-white' : 'bg-gray-50/50'}`}>
                            <td className="px-6 py-3">
                              <span className="font-mono text-xs font-bold text-gray-400 bg-gray-100 px-2 py-1 rounded-md">
                                {ticket.ticketNumber}
                              </span>
                            </td>
                            <td className="px-6 py-3">
                              <p className="text-sm text-gray-500 truncate max-w-xs">{ticket.title}</p>
                            </td>
                            <td className="px-6 py-3">
                              <span className="text-xs font-medium px-2 py-0.5 rounded-full bg-gray-100 text-gray-500">
                                {ticket.priority}
                              </span>
                            </td>
                            <td className="px-6 py-3 text-xs text-gray-400">
                              {new Date(ticket.createdAt).toLocaleDateString('id-ID', {
                                day: 'numeric',
                                month: 'short',
                                year: 'numeric',
                              })}
                            </td>
                            <td className="px-6 py-3">
                              <span className="text-xs font-bold px-2.5 py-1 rounded-full bg-green-50 text-green-500 border border-green-100">
                                ✓ RESOLVED
                              </span>
                            </td>
                          </tr>
                        ))}
                      </tbody>
                    </table>
                  </div>
                )}
              </CardContent>
            </Card>

          </div>
        </main>
      </div>
    </div>
  );
}
