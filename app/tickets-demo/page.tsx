'use client';

import { useState, useEffect } from 'react';
import { useRouter } from 'next/navigation';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import Navbar from '@/components/Navbar';
import Sidebar from '@/components/Sidebar';
import { Plus, Filter, Search, Trash2, Eye, X, Calendar, AlertTriangle } from 'lucide-react';
import { toast } from 'sonner';
import { useRealtime } from '@/hooks/useRealtime';

interface Ticket {
  id: string;
  ticketNumber: string;
  title: string;
  description: string;
  category: string;
  priority: string;
  status: string;
  createdBy: string;
  createdByName: string;
  assignedTo: string | null;
  assignedName: string | null;
  progress: number;
  createdAt: string;
  updatedAt: string;
}

export default function TicketsPage() {
  const router = useRouter();
  const [user, setUser] = useState<any>(null);
  const [tickets, setTickets] = useState<Ticket[]>([]);
  const [loading, setLoading] = useState(true);
  const [statusFilter, setStatusFilter] = useState('');
  const [priorityFilter, setPriorityFilter] = useState('');
  const [searchQuery, setSearchQuery] = useState('');

  // Create Ticket Modal States
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [newTitle, setNewTitle] = useState('');
  const [newDesc, setNewDesc] = useState('');
  const [newCategory, setNewCategory] = useState('BUG');
  const [newPriority, setNewPriority] = useState('MEDIUM');
  const [newDueDate, setNewDueDate] = useState('');
  const [submitting, setSubmitting] = useState(false);

  // Custom Delete Confirm Modal States
  const [isDeleteConfirmOpen, setIsDeleteConfirmOpen] = useState(false);
  const [ticketToDelete, setTicketToDelete] = useState<string | null>(null);

  useEffect(() => {
    const checkAuth = () => {
      const storedUser = localStorage.getItem('user');
      const token = localStorage.getItem('token');

      if (!token || !storedUser) {
        router.push('/demo-login');
        return;
      }

      setUser(JSON.parse(storedUser));
      fetchTickets(token);
    };

    checkAuth();
  }, [router]);

  const fetchTickets = async (token: string) => {
    try {
      setLoading(true);
      let url = '/api/tickets';
      const params = new URLSearchParams();
      if (statusFilter) params.append('status', statusFilter);
      if (priorityFilter) params.append('priority', priorityFilter);
      
      if (params.toString()) {
        url += '?' + params.toString();
      }

      const response = await fetch(url, {
        headers: {
          Authorization: `Bearer ${token}`,
        },
      });

      const data = await response.json();
      if (data.success) {
        let filtered = data.data;
        if (searchQuery) {
          filtered = filtered.filter((t: Ticket) =>
            t.title.toLowerCase().includes(searchQuery.toLowerCase()) ||
            t.ticketNumber.toLowerCase().includes(searchQuery.toLowerCase())
          );
        }
        setTickets(filtered);
      }
    } catch (error) {
      console.error('Failed to fetch tickets:', error);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    const token = localStorage.getItem('token');
    if (token) {
      fetchTickets(token);
    }
  }, [statusFilter, priorityFilter, searchQuery]);

  useRealtime('Ticket', () => {
    const token = localStorage.getItem('token');
    if (token) {
      fetchTickets(token);
    }
  });

  const handleCreateTicket = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!newTitle.trim() || !newDesc.trim()) return;

    setSubmitting(true);
    try {
      const token = localStorage.getItem('token');
      const response = await fetch('/api/tickets', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          Authorization: `Bearer ${token}`,
        },
        body: JSON.stringify({
          title: newTitle,
          description: newDesc,
          category: newCategory,
          priority: newPriority,
          dueDate: newDueDate || undefined,
        }),
      });

      const data = await response.json();
      if (data.success) {
        setIsModalOpen(false);
        setNewTitle('');
        setNewDesc('');
        setNewCategory('BUG');
        setNewPriority('MEDIUM');
        setNewDueDate('');
        toast.success('Tiket baru berhasil dibuat!');
        fetchTickets(token!);
      } else {
        toast.error(data.error || 'Gagal membuat tiket.');
      }
    } catch (error) {
      console.error('Create ticket failed:', error);
      toast.error('Terjadi kesalahan koneksi saat membuat tiket.');
    } finally {
      setSubmitting(false);
    }
  };

  const confirmDeleteTicket = async () => {
    if (!ticketToDelete) return;

    try {
      const token = localStorage.getItem('token');
      const response = await fetch(`/api/tickets/${ticketToDelete}`, {
        method: 'DELETE',
        headers: {
          Authorization: `Bearer ${token}`,
        },
      });

      const data = await response.json();
      if (data.success) {
        toast.success('Tiket berhasil dihapus secara permanen.');
        fetchTickets(token!);
      } else {
        toast.error(data.error || 'Gagal menghapus tiket.');
      }
    } catch (error) {
      console.error('Delete ticket failed:', error);
      toast.error('Terjadi kesalahan saat menghapus tiket.');
    } finally {
      setIsDeleteConfirmOpen(false);
      setTicketToDelete(null);
    }
  };

  const getStatusColor = (status: string) => {
    switch (status) {
      case 'PENDING_APPROVAL':
        return 'bg-orange-100 text-orange-800 border border-orange-200';
      case 'APPROVED':
        return 'bg-emerald-100 text-emerald-800 border border-emerald-200';
      case 'IN_REVIEW':
        return 'bg-purple-100 text-purple-800 border border-purple-200';
      case 'OPEN':
        return 'bg-blue-100 text-blue-800 border border-blue-200';
      case 'IN_PROGRESS':
        return 'bg-yellow-100 text-yellow-800 border border-yellow-200';
      case 'RESOLVED':
        return 'bg-green-100 text-green-800 border border-green-200';
      case 'CLOSED':
        return 'bg-gray-100 text-gray-800 border border-gray-200';
      default:
        return 'bg-gray-100 text-gray-800';
    }
  };

  const getPriorityColor = (priority: string) => {
    switch (priority) {
      case 'CRITICAL':
        return 'text-red-600 font-bold';
      case 'HIGH':
        return 'text-orange-600 font-semibold';
      case 'MEDIUM':
        return 'text-blue-600';
      case 'LOW':
        return 'text-green-600';
      default:
        return 'text-gray-600';
    }
  };

  if (!user) {
    return null;
  }

  return (
    <div className="flex h-screen bg-slate-55">
      <Sidebar user={user} />

      <div className="flex-1 flex flex-col overflow-hidden">
        <Navbar user={user} />

        <main className="flex-1 overflow-auto bg-slate-50">
          <div className="p-8 max-w-7xl mx-auto w-full">
            
            {/* Header */}
            <div className="mb-8 flex justify-between items-start">
              <div>
                <h1 className="text-3xl font-bold text-gray-900">Support Tickets</h1>
                <p className="text-gray-600 mt-1">Manage and track all support tickets</p>
              </div>
              <Button 
                onClick={() => setIsModalOpen(true)}
                className="bg-blue-600 hover:bg-blue-700 flex items-center gap-2"
              >
                <Plus className="w-4 h-4" />
                New Ticket
              </Button>
            </div>

            {/* Filters */}
            <Card className="mb-8">
              <CardContent className="pt-6">
                <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-2">
                      Search
                    </label>
                    <div className="relative">
                      <input
                        type="text"
                        placeholder="Search tickets..."
                        value={searchQuery}
                        onChange={(e) => setSearchQuery(e.target.value)}
                        className="w-full pl-9 pr-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 text-sm"
                      />
                      <Search className="w-4 h-4 text-gray-400 absolute left-3 top-3" />
                    </div>
                  </div>

                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-2">
                      Status
                    </label>
                    <select
                      value={statusFilter}
                      onChange={(e) => setStatusFilter(e.target.value)}
                      className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 text-sm bg-white"
                    >
                      <option value="">All Status</option>
                      <option value="PENDING_APPROVAL">Pending Approval</option>
                      <option value="APPROVED">Approved</option>
                      <option value="OPEN">Open</option>
                      <option value="IN_PROGRESS">In Progress</option>
                      <option value="IN_REVIEW">In Review</option>
                      <option value="RESOLVED">Resolved</option>
                      <option value="CLOSED">Closed</option>
                    </select>
                  </div>

                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-2">
                      Priority
                    </label>
                    <select
                      value={priorityFilter}
                      onChange={(e) => setPriorityFilter(e.target.value)}
                      className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 text-sm bg-white"
                    >
                      <option value="">All Priority</option>
                      <option value="LOW">Low</option>
                      <option value="MEDIUM">Medium</option>
                      <option value="HIGH">High</option>
                      <option value="CRITICAL">Critical</option>
                    </select>
                  </div>

                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-2">
                      &nbsp;
                    </label>
                    <Button
                      variant="outline"
                      className="w-full flex items-center justify-center gap-2 text-sm"
                      onClick={() => {
                        setStatusFilter('');
                        setPriorityFilter('');
                        setSearchQuery('');
                      }}
                    >
                      <Filter className="w-4 h-4" />
                      Reset Filters
                    </Button>
                  </div>
                </div>
              </CardContent>
            </Card>

            {/* Tickets Table */}
            <Card>
              <CardContent className="pt-6">
                {loading ? (
                  <div className="text-center py-8">
                    <p className="text-gray-500 text-sm">Loading tickets...</p>
                  </div>
                ) : tickets.length === 0 ? (
                  <div className="text-center py-8">
                    <p className="text-gray-500 text-sm">No tickets found</p>
                  </div>
                ) : (
                  <div className="overflow-x-auto">
                    <table className="w-full text-sm">
                      <thead>
                        <tr className="border-b text-gray-500">
                          <th className="text-left py-3 px-4 font-semibold">Ticket #</th>
                          <th className="text-left py-3 px-4 font-semibold">Title</th>
                          <th className="text-left py-3 px-4 font-semibold">Category</th>
                          <th className="text-left py-3 px-4 font-semibold">Priority</th>
                          <th className="text-left py-3 px-4 font-semibold">Status</th>
                          <th className="text-left py-3 px-4 font-semibold">Assigned To</th>
                          <th className="text-left py-3 px-4 font-semibold">Created</th>
                          <th className="text-center py-3 px-4 font-semibold">Action</th>
                        </tr>
                      </thead>
                      <tbody>
                        {tickets.map((ticket) => (
                          <tr key={ticket.id} className="border-b hover:bg-gray-50/50 transition">
                            <td className="py-3.5 px-4 font-medium">
                              <a href={`/tickets-demo/${ticket.id}`} className="text-blue-600 hover:underline">
                                {ticket.ticketNumber}
                              </a>
                            </td>
                            <td className="py-3.5 px-4 text-gray-900 font-medium">
                              <a href={`/tickets-demo/${ticket.id}`} className="hover:underline">
                                {ticket.title}
                              </a>
                            </td>
                            <td className="py-3.5 px-4 text-gray-600">{ticket.category}</td>
                            <td className={`py-3.5 px-4 ${getPriorityColor(ticket.priority)}`}>
                              {ticket.priority}
                            </td>
                            <td className="py-3.5 px-4">
                              <div className="flex flex-col gap-1.5">
                                <span className={`px-2.5 py-0.5 rounded-full text-xs font-semibold w-fit ${getStatusColor(ticket.status)}`}>
                                  {ticket.status.replace('_', ' ')}
                                </span>
                                {ticket.status === 'IN_PROGRESS' && ticket.progress !== undefined && (
                                  <div className="w-full max-w-[100px] h-1.5 bg-slate-200 rounded-full overflow-hidden">
                                    <div className="h-full bg-blue-600 rounded-full" style={{ width: `${ticket.progress}%` }}></div>
                                  </div>
                                )}
                              </div>
                            </td>
                            <td className="py-3.5 px-4 text-gray-600">{ticket.assignedName || '-'}</td>
                            <td className="py-3.5 px-4 text-gray-500">
                              {new Date(ticket.createdAt).toLocaleDateString()}
                            </td>
                            <td className="py-3.5 px-4 text-center">
                              <div className="flex justify-center items-center gap-2">
                                <Button
                                  variant="outline"
                                  size="sm"
                                  className="h-8 flex items-center gap-1.5"
                                  onClick={() => router.push(`/tickets-demo/${ticket.id}`)}
                                >
                                  <Eye className="w-3.5 h-3.5" />
                                  View
                                </Button>
                                <Button
                                  variant="ghost"
                                  size="sm"
                                  className="h-8 text-rose-600 hover:text-rose-700 hover:bg-rose-50 flex items-center gap-1.5"
                                  onClick={() => {
                                    setTicketToDelete(ticket.id);
                                    setIsDeleteConfirmOpen(true);
                                  }}
                                >
                                  <Trash2 className="w-3.5 h-3.5" />
                                  Delete
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

            {/* Stats */}
            <div className="grid grid-cols-1 md:grid-cols-4 gap-4 mt-8">
              <Card>
                <CardHeader className="pb-2">
                  <CardTitle className="text-sm font-medium text-slate-500">Total Tickets</CardTitle>
                </CardHeader>
                <CardContent>
                  <p className="text-3xl font-extrabold text-blue-600">{tickets.length}</p>
                </CardContent>
              </Card>

              <Card>
                <CardHeader className="pb-2">
                  <CardTitle className="text-sm font-medium text-slate-500">Open</CardTitle>
                </CardHeader>
                <CardContent>
                  <p className="text-3xl font-extrabold text-yellow-600">
                    {tickets.filter((t) => t.status === 'OPEN').length}
                  </p>
                </CardContent>
              </Card>

              <Card>
                <CardHeader className="pb-2">
                  <CardTitle className="text-sm font-medium text-slate-500">In Progress</CardTitle>
                </CardHeader>
                <CardContent>
                  <p className="text-3xl font-extrabold text-blue-600">
                    {tickets.filter((t) => t.status === 'IN_PROGRESS').length}
                  </p>
                </CardContent>
              </Card>

              <Card>
                <CardHeader className="pb-2">
                  <CardTitle className="text-sm font-medium text-slate-500">Resolved</CardTitle>
                </CardHeader>
                <CardContent>
                  <p className="text-3xl font-extrabold text-green-600">
                    {tickets.filter((t) => t.status === 'RESOLVED').length}
                  </p>
                </CardContent>
              </Card>
            </div>

          </div>
        </main>
      </div>

      {/* Create Ticket Modal Overlay */}
      {isModalOpen && (
        <div className="fixed inset-0 bg-black/50 backdrop-blur-sm z-50 flex items-center justify-center p-4">
          <div className="bg-white rounded-xl max-w-lg w-full overflow-hidden shadow-2xl border border-slate-100 flex flex-col">
            
            {/* Modal Header */}
            <div className="px-6 py-4 border-b border-slate-100 flex justify-between items-center bg-slate-50/50">
              <h3 className="text-lg font-bold text-slate-900">Buat Tiket Baru</h3>
              <button 
                onClick={() => setIsModalOpen(false)}
                className="text-slate-400 hover:text-slate-600 transition"
              >
                <X className="w-5 h-5" />
              </button>
            </div>

            {/* Modal Form */}
            <form onSubmit={handleCreateTicket} className="p-6 space-y-4 flex-1">
              <div>
                <label className="block text-sm font-semibold text-slate-700 mb-1.5">
                  Judul Kendala <span className="text-rose-500">*</span>
                </label>
                <input
                  type="text"
                  placeholder="Contoh: Pembayaran gateway error"
                  value={newTitle}
                  onChange={(e) => setNewTitle(e.target.value)}
                  className="w-full px-3 py-2 border border-slate-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 text-sm"
                  required
                />
              </div>

              <div>
                <label className="block text-sm font-semibold text-slate-700 mb-1.5">
                  Deskripsi Masalah <span className="text-rose-500">*</span>
                </label>
                <textarea
                  placeholder="Detail kendala yang dialami..."
                  value={newDesc}
                  onChange={(e) => setNewDesc(e.target.value)}
                  className="w-full px-3 py-2 border border-slate-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 text-sm resize-none"
                  rows={4}
                  required
                />
              </div>

              <div className="grid grid-cols-2 gap-4">
                <div>
                  <label className="block text-sm font-semibold text-slate-700 mb-1.5">
                    Kategori
                  </label>
                  <select
                    value={newCategory}
                    onChange={(e) => setNewCategory(e.target.value)}
                    className="w-full px-3 py-2 border border-slate-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 text-sm bg-white"
                  >
                    <option value="BUG">Bug</option>
                    <option value="FEATURE_REQUEST">Feature Request</option>
                    <option value="GENERAL_INQUIRY">General Inquiry</option>
                    <option value="CUSTOMER_ISSUE">Customer Issue</option>
                  </select>
                </div>

                <div>
                  <label className="block text-sm font-semibold text-slate-700 mb-1.5">
                    Prioritas
                  </label>
                  <select
                    value={newPriority}
                    onChange={(e) => setNewPriority(e.target.value)}
                    className="w-full px-3 py-2 border border-slate-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 text-sm bg-white"
                  >
                    <option value="LOW">Low</option>
                    <option value="MEDIUM">Medium</option>
                    <option value="HIGH">High</option>
                    <option value="CRITICAL">Critical</option>
                  </select>
                </div>
              </div>

              <div>
                <label className="block text-sm font-semibold text-slate-700 mb-1.5">
                  Due Date
                </label>
                <div className="relative">
                  <input
                    type="date"
                    value={newDueDate}
                    onChange={(e) => setNewDueDate(e.target.value)}
                    className="w-full px-3 py-2 border border-slate-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 text-sm bg-white"
                  />
                </div>
              </div>

              {/* Modal Footer */}
              <div className="pt-4 border-t border-slate-100 flex justify-end gap-2.5">
                <Button 
                  type="button" 
                  variant="outline" 
                  onClick={() => setIsModalOpen(false)}
                  className="text-sm px-4 py-2"
                >
                  Batal
                </Button>
                <Button 
                  type="submit"
                  disabled={submitting}
                  className="bg-blue-600 hover:bg-blue-700 text-white text-sm px-5 py-2 font-medium"
                >
                  {submitting ? 'Menyimpan...' : 'Simpan Tiket'}
                </Button>
              </div>
            </form>

          </div>
        </div>
      )}

      {/* Custom Delete Confirmation Modal */}
      {isDeleteConfirmOpen && (
        <div className="fixed inset-0 bg-black/60 backdrop-blur-sm z-50 flex items-center justify-center p-4">
          <div className="bg-white rounded-2xl max-w-md w-full overflow-hidden shadow-2xl border border-slate-100 flex flex-col p-6 animate-in fade-in zoom-in-95 duration-200">
            <div className="flex items-center gap-4 text-rose-600 mb-4">
              <div className="p-3 bg-rose-50 rounded-full">
                <AlertTriangle className="w-6 h-6" />
              </div>
              <h3 className="text-lg font-bold text-slate-900">Hapus Tiket Permanen?</h3>
            </div>
            
            <p className="text-sm text-slate-600 mb-6 leading-relaxed">
              Tindakan ini tidak dapat dibatalkan. Tiket dukungan ini akan dihapus secara permanen dari basis data sistem VibeDesk.
            </p>

            <div className="flex justify-end gap-3">
              <Button
                variant="outline"
                className="text-sm font-semibold h-10 px-4"
                onClick={() => {
                  setIsDeleteConfirmOpen(false);
                  setTicketToDelete(null);
                }}
              >
                Batal
              </Button>
              <Button
                className="bg-rose-600 hover:bg-rose-700 text-white text-sm font-semibold h-10 px-5"
                onClick={confirmDeleteTicket}
              >
                Ya, Hapus
              </Button>
            </div>
          </div>
        </div>
      )}

    </div>
  );
}
