'use client';

import { useEffect, useState } from 'react';
import { useRouter } from 'next/navigation';
import { useRealtime } from '@/hooks/useRealtime';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import Sidebar from '@/components/Sidebar';
import Navbar from '@/components/Navbar';
import {
  Code2,
  Hammer,
  CheckCircle2,
  Clock,
  GitPullRequest,
  Loader2,
  ChevronRight,
  AlertCircle,
  Play,
} from 'lucide-react';
import { toast } from 'sonner';

interface Ticket {
  id: string;
  ticketNumber: string;
  title: string;
  priority: string;
  status: string;
  progress?: number;
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

export default function DeveloperPage() {
  const router = useRouter();
  const [user, setUser] = useState<any>(null);
  const [tickets, setTickets] = useState<Ticket[]>([]);
  const [loading, setLoading] = useState(true);
  const [actionLoading, setActionLoading] = useState<string | null>(null);
  const [progressEdit, setProgressEdit] = useState<Record<string, number>>({});
  const [editingId, setEditingId] = useState<string | null>(null);

  useEffect(() => {
    const storedUser = localStorage.getItem('user');
    const token = localStorage.getItem('token');
    if (!token || !storedUser) {
      router.push('/login');
      return;
    }
    const parsedUser = JSON.parse(storedUser);
    if (
      parsedUser.role !== 'DEVELOPER' &&
      parsedUser.role !== 'ADMIN' &&
      parsedUser.role !== 'SUPER_ADMIN'
    ) {
      router.push('/dashboard');
      return;
    }
    setUser(parsedUser);
    fetchTickets(token, parsedUser);
  }, [router]);

  useRealtime('Ticket', () => {
    const storedUser = localStorage.getItem('user');
    const token = localStorage.getItem('token');
    if (token && storedUser) fetchTickets(token, JSON.parse(storedUser));
  });

  const fetchTickets = async (token: string, parsedUser: any) => {
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

  const sendToQA = async (ticketId: string) => {
    const token = localStorage.getItem('token');
    if (!token) return;
    setActionLoading(ticketId + 'QA');
    try {
      const res = await fetch(`/api/tickets/${ticketId}`, {
        method: 'PATCH',
        headers: {
          'Content-Type': 'application/json',
          Authorization: `Bearer ${token}`,
        },
        body: JSON.stringify({ status: 'IN_REVIEW' }),
      });
      const data = await res.json();
      if (data.success) {
        toast.success('Tiket berhasil dikirim ke QA untuk review!');
        fetchTickets(token, user);
      } else {
        toast.error(data.message || 'Gagal mengirim tiket ke QA.');
      }
    } catch (err) {
      toast.error('Terjadi kesalahan. Coba lagi.');
    } finally {
      setActionLoading(null);
    }
  };

  const saveProgress = async (ticketId: string) => {
    const token = localStorage.getItem('token');
    if (!token) return;
    const newProgress = progressEdit[ticketId] ?? 0;
    setActionLoading(ticketId + 'PROGRESS');
    try {
      const res = await fetch(`/api/tickets/${ticketId}`, {
        method: 'PATCH',
        headers: {
          'Content-Type': 'application/json',
          Authorization: `Bearer ${token}`,
        },
        body: JSON.stringify({ progress: newProgress }),
      });
      const data = await res.json();
      if (data.success) {
        toast.success(`Progress diperbarui ke ${newProgress}%`);
        setEditingId(null);
        fetchTickets(token, user);
      } else {
        toast.error(data.message || 'Gagal memperbarui progress.');
      }
    } catch (err) {
      toast.error('Terjadi kesalahan. Coba lagi.');
    } finally {
      setActionLoading(null);
    }
  };

  if (!user) return null;

  // Filter tickets assigned to current user
  const myTickets = tickets.filter(
    (t) =>
      (t.status === 'IN_PROGRESS' || t.status === 'APPROVED') &&
      (t.assignedTo === user.id || user.role === 'ADMIN' || user.role === 'SUPER_ADMIN')
  );
  const inReviewTickets = tickets.filter(
    (t) =>
      t.status === 'IN_REVIEW' &&
      (t.assignedTo === user.id || user.role === 'ADMIN' || user.role === 'SUPER_ADMIN')
  );
  const thisMonth = new Date().getMonth();
  const thisYear = new Date().getFullYear();
  const resolvedThisMonth = tickets.filter((t) => {
    const d = new Date(t.createdAt);
    return (
      t.status === 'RESOLVED' &&
      d.getMonth() === thisMonth &&
      d.getFullYear() === thisYear &&
      (t.assignedTo === user.id || user.role === 'ADMIN' || user.role === 'SUPER_ADMIN')
    );
  }).length;

  const getProgress = (ticket: Ticket) => {
    if (editingId === ticket.id) return progressEdit[ticket.id] ?? ticket.progress ?? 0;
    return ticket.progress ?? 0;
  };

  const getProgressColor = (pct: number) => {
    if (pct >= 80) return 'bg-gradient-to-r from-green-400 to-emerald-500';
    if (pct >= 50) return 'bg-gradient-to-r from-blue-400 to-cyan-500';
    if (pct >= 25) return 'bg-gradient-to-r from-amber-400 to-orange-400';
    return 'bg-gradient-to-r from-red-400 to-rose-400';
  };

  return (
    <div className="flex h-screen bg-slate-50">
      <Sidebar user={user} />

      <div className="flex-1 flex flex-col overflow-hidden">
        <Navbar user={user} />

        <main className="flex-1 overflow-auto">
          <div className="p-8 max-w-7xl mx-auto w-full">

            {/* Page Header */}
            <div className="mb-8 flex items-center gap-4">
              <div className="w-14 h-14 rounded-2xl bg-gradient-to-br from-green-400 to-emerald-600 flex items-center justify-center shadow-lg shadow-green-200">
                <Code2 className="w-7 h-7 text-white" />
              </div>
              <div>
                <h1 className="text-3xl font-bold text-gray-900">Developer Workspace</h1>
                <p className="text-gray-500 mt-0.5 text-sm">Tugas & Pengerjaan Tiket</p>
              </div>
            </div>

            {/* Gradient Banner */}
            <div className="relative mb-8 rounded-2xl overflow-hidden shadow-xl">
              <div className="absolute inset-0 bg-gradient-to-r from-green-600 via-emerald-500 to-teal-400" />
              <div
                className="absolute inset-0 opacity-10"
                style={{
                  backgroundImage: "url(\"data:image/svg+xml,%3Csvg width='40' height='40' viewBox='0 0 40 40' xmlns='http://www.w3.org/2000/svg'%3E%3Cg fill='%23ffffff' fill-opacity='0.8' fill-rule='evenodd'%3E%3Cpath d='M0 40L40 0H20L0 20M40 40V20L20 40'/%3E%3C/g%3E%3C/svg%3E\")",
                }}
              />
              <div className="relative px-8 py-7 flex items-center justify-between">
                <div>
                  <div className="flex items-center gap-2 mb-1">
                    <Hammer className="w-5 h-5 text-white/80" />
                    <span className="text-white/80 text-sm font-semibold uppercase tracking-widest">Panel Developer</span>
                  </div>
                  <h2 className="text-2xl font-extrabold text-white drop-shadow">
                    Tugas & Pengerjaan
                  </h2>
                  <p className="text-white/75 text-sm mt-1">
                    Kerjakan tiket yang telah di-assign, update progress, dan kirim ke QA.
                  </p>
                </div>
                <div className="hidden md:flex items-center gap-3">
                  <div className="bg-white/20 backdrop-blur-sm rounded-xl px-5 py-3 text-white text-center border border-white/30">
                    <p className="text-2xl font-bold">{myTickets.length}</p>
                    <p className="text-xs font-medium opacity-80">Aktif</p>
                  </div>
                  <div className="bg-white/20 backdrop-blur-sm rounded-xl px-5 py-3 text-white text-center border border-white/30">
                    <p className="text-2xl font-bold">{inReviewTickets.length}</p>
                    <p className="text-xs font-medium opacity-80">Review</p>
                  </div>
                </div>
              </div>
            </div>

            {/* Stat Cards */}
            <div className="grid grid-cols-1 md:grid-cols-3 gap-5 mb-8">
              <Card className="bg-gradient-to-br from-green-50 to-emerald-50 border-green-200 shadow-sm hover:shadow-md transition-shadow">
                <CardContent className="pt-6">
                  <div className="flex items-start justify-between">
                    <div>
                      <p className="text-sm text-green-700 font-semibold">Tugas Aktif</p>
                      <p className="text-4xl font-bold text-green-900 mt-2">{myTickets.length}</p>
                      <p className="text-xs text-green-600 mt-1">IN_PROGRESS diassign ke saya</p>
                    </div>
                    <div className="w-12 h-12 rounded-xl bg-green-100 flex items-center justify-center">
                      <Hammer className="w-6 h-6 text-green-500" />
                    </div>
                  </div>
                </CardContent>
              </Card>

              <Card className="bg-gradient-to-br from-blue-50 to-cyan-50 border-blue-200 shadow-sm hover:shadow-md transition-shadow">
                <CardContent className="pt-6">
                  <div className="flex items-start justify-between">
                    <div>
                      <p className="text-sm text-blue-700 font-semibold">Menunggu Review</p>
                      <p className="text-4xl font-bold text-blue-900 mt-2">{inReviewTickets.length}</p>
                      <p className="text-xs text-blue-600 mt-1">Tiket IN_REVIEW</p>
                    </div>
                    <div className="w-12 h-12 rounded-xl bg-blue-100 flex items-center justify-center">
                      <Clock className="w-6 h-6 text-blue-500" />
                    </div>
                  </div>
                </CardContent>
              </Card>

              <Card className="bg-gradient-to-br from-purple-50 to-violet-50 border-purple-200 shadow-sm hover:shadow-md transition-shadow">
                <CardContent className="pt-6">
                  <div className="flex items-start justify-between">
                    <div>
                      <p className="text-sm text-purple-700 font-semibold">Selesai Bulan Ini</p>
                      <p className="text-4xl font-bold text-purple-900 mt-2">{resolvedThisMonth}</p>
                      <p className="text-xs text-purple-600 mt-1">Tiket RESOLVED bulan ini</p>
                    </div>
                    <div className="w-12 h-12 rounded-xl bg-purple-100 flex items-center justify-center">
                      <CheckCircle2 className="w-6 h-6 text-purple-500" />
                    </div>
                  </div>
                </CardContent>
              </Card>
            </div>

            {/* My Active Tasks */}
            <Card className="mb-8 shadow-sm border-green-100">
              <CardHeader className="border-b border-green-100 bg-gradient-to-r from-green-50 to-emerald-50 rounded-t-xl">
                <div className="flex items-center gap-3">
                  <div className="w-8 h-8 rounded-lg bg-green-100 flex items-center justify-center">
                    <Hammer className="w-4 h-4 text-green-600" />
                  </div>
                  <div>
                    <CardTitle className="text-green-900 text-lg">Tugas Saya</CardTitle>
                    <p className="text-xs text-green-600 mt-0.5">Tiket aktif yang sedang dikerjakan</p>
                  </div>
                </div>
              </CardHeader>
              <CardContent className="p-0">
                {loading ? (
                  <div className="flex items-center justify-center py-16">
                    <Loader2 className="w-8 h-8 animate-spin text-green-400" />
                  </div>
                ) : myTickets.length === 0 ? (
                  <div className="flex flex-col items-center justify-center py-16 text-gray-400">
                    <CheckCircle2 className="w-12 h-12 mb-3 opacity-30" />
                    <p className="font-semibold">Tidak ada tugas aktif saat ini</p>
                    <p className="text-sm mt-1 opacity-70">Tunggu penugasan dari tim Functional 🧑‍💻</p>
                  </div>
                ) : (
                  <div className="overflow-x-auto">
                    <table className="w-full">
                      <thead>
                        <tr className="bg-green-50/60 border-b border-green-100">
                          <th className="text-left px-6 py-3 text-xs font-bold text-green-700 uppercase tracking-wider">Tiket #</th>
                          <th className="text-left px-6 py-3 text-xs font-bold text-green-700 uppercase tracking-wider">Judul</th>
                          <th className="text-left px-6 py-3 text-xs font-bold text-green-700 uppercase tracking-wider">Prioritas</th>
                          <th className="text-left px-6 py-3 text-xs font-bold text-green-700 uppercase tracking-wider min-w-[200px]">Progress</th>
                          <th className="text-left px-6 py-3 text-xs font-bold text-green-700 uppercase tracking-wider">Aksi</th>
                        </tr>
                      </thead>
                      <tbody className="divide-y divide-green-50">
                        {myTickets.map((ticket, idx) => {
                          const progress = getProgress(ticket);
                          return (
                            <tr
                              key={ticket.id}
                              className={`hover:bg-green-50/40 transition-colors ${idx % 2 === 0 ? 'bg-white' : 'bg-green-50/20'}`}
                            >
                              <td className="px-6 py-4">
                                <span className="font-mono text-xs font-bold text-green-700 bg-green-50 px-2 py-1 rounded-md border border-green-200">
                                  {ticket.ticketNumber}
                                </span>
                              </td>
                              <td className="px-6 py-4">
                                <p className="font-semibold text-gray-800 text-sm truncate max-w-[220px]">{ticket.title}</p>
                                <p className="text-xs text-gray-400 mt-0.5">
                                  {new Date(ticket.createdAt).toLocaleDateString('id-ID', { day: 'numeric', month: 'short', year: 'numeric' })}
                                </p>
                              </td>
                              <td className="px-6 py-4">
                                <span className={`text-xs font-bold px-2.5 py-1 rounded-full ${PRIORITY_STYLES[ticket.priority] || 'bg-gray-100 text-gray-600'}`}>
                                  {ticket.priority}
                                </span>
                              </td>
                              <td className="px-6 py-4">
                                {editingId === ticket.id ? (
                                  <div className="space-y-2">
                                    <div className="flex items-center gap-2">
                                      <input
                                        type="range"
                                        min={0}
                                        max={100}
                                        value={progressEdit[ticket.id] ?? ticket.progress ?? 0}
                                        onChange={(e) =>
                                          setProgressEdit((prev) => ({ ...prev, [ticket.id]: Number(e.target.value) }))
                                        }
                                        className="flex-1 accent-green-500 cursor-pointer"
                                      />
                                      <span className="text-sm font-bold text-green-700 w-10 text-right">
                                        {progressEdit[ticket.id] ?? ticket.progress ?? 0}%
                                      </span>
                                    </div>
                                    <div className="w-full bg-gray-100 rounded-full h-2 overflow-hidden">
                                      <div
                                        className={`h-2 rounded-full transition-all ${getProgressColor(progressEdit[ticket.id] ?? ticket.progress ?? 0)}`}
                                        style={{ width: `${progressEdit[ticket.id] ?? ticket.progress ?? 0}%` }}
                                      />
                                    </div>
                                  </div>
                                ) : (
                                  <div className="space-y-1">
                                    <div className="flex items-center justify-between">
                                      <span className="text-xs font-semibold text-gray-600">{progress}%</span>
                                    </div>
                                    <div className="w-full bg-gray-100 rounded-full h-2.5 overflow-hidden">
                                      <div
                                        className={`h-2.5 rounded-full transition-all duration-500 ${getProgressColor(progress)}`}
                                        style={{ width: `${progress}%` }}
                                      />
                                    </div>
                                  </div>
                                )}
                              </td>
                              <td className="px-6 py-4">
                                <div className="flex items-center gap-2 flex-wrap">
                                  {editingId === ticket.id ? (
                                    <>
                                      <Button
                                        size="sm"
                                        className="bg-gradient-to-r from-green-500 to-emerald-500 hover:from-green-600 hover:to-emerald-600 text-white shadow-sm text-xs font-bold"
                                        onClick={() => saveProgress(ticket.id)}
                                        disabled={actionLoading === ticket.id + 'PROGRESS'}
                                      >
                                        {actionLoading === ticket.id + 'PROGRESS' ? (
                                          <Loader2 className="w-3 h-3 animate-spin" />
                                        ) : (
                                          'Simpan'
                                        )}
                                      </Button>
                                      <Button
                                        size="sm"
                                        variant="ghost"
                                        className="text-xs"
                                        onClick={() => setEditingId(null)}
                                      >
                                        Batal
                                      </Button>
                                    </>
                                  ) : (
                                    <>
                                      <Button
                                        size="sm"
                                        variant="outline"
                                        className="border-green-200 text-green-700 hover:bg-green-50 text-xs font-bold gap-1"
                                        onClick={() => {
                                          setEditingId(ticket.id);
                                          setProgressEdit((prev) => ({
                                            ...prev,
                                            [ticket.id]: ticket.progress ?? 0,
                                          }));
                                        }}
                                      >
                                        <Play className="w-3 h-3" />
                                        Update Progress
                                      </Button>
                                      <Button
                                        size="sm"
                                        className="bg-gradient-to-r from-blue-500 to-cyan-500 hover:from-blue-600 hover:to-cyan-600 text-white shadow-sm shadow-blue-200 text-xs font-bold gap-1.5"
                                        onClick={() => sendToQA(ticket.id)}
                                        disabled={actionLoading === ticket.id + 'QA'}
                                      >
                                        {actionLoading === ticket.id + 'QA' ? (
                                          <Loader2 className="w-3 h-3 animate-spin" />
                                        ) : (
                                          <GitPullRequest className="w-3.5 h-3.5" />
                                        )}
                                        Selesai → QA
                                      </Button>
                                    </>
                                  )}
                                </div>
                              </td>
                            </tr>
                          );
                        })}
                      </tbody>
                    </table>
                  </div>
                )}
              </CardContent>
            </Card>

            {/* Waiting for QA Review */}
            <Card className="shadow-sm border-gray-100">
              <CardHeader className="border-b border-gray-100 bg-gray-50/80 rounded-t-xl">
                <div className="flex items-center gap-3">
                  <div className="w-8 h-8 rounded-lg bg-blue-50 flex items-center justify-center">
                    <GitPullRequest className="w-4 h-4 text-blue-400" />
                  </div>
                  <div>
                    <CardTitle className="text-gray-500 text-lg">Menunggu Review QA</CardTitle>
                    <p className="text-xs text-gray-400 mt-0.5">Tiket yang sudah dikirim dan sedang diuji oleh tim QA</p>
                  </div>
                </div>
              </CardHeader>
              <CardContent className="p-0">
                {inReviewTickets.length === 0 ? (
                  <div className="flex flex-col items-center justify-center py-12 text-gray-300">
                    <AlertCircle className="w-10 h-10 mb-2" />
                    <p className="text-sm font-medium">Belum ada tiket yang menunggu review QA</p>
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
                        {inReviewTickets.map((ticket, idx) => (
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
                              <span className="text-xs font-bold px-2.5 py-1 rounded-full bg-blue-50 text-blue-500 border border-blue-100 flex items-center gap-1 w-fit">
                                <Clock className="w-3 h-3" />
                                IN REVIEW
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
