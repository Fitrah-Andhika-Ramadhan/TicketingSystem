'use client';

import { useState, useEffect } from 'react';
import { useRouter, useParams } from 'next/navigation';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import Navbar from '@/components/Navbar';
import Sidebar from '@/components/Sidebar';
import { ArrowLeft, Send, Clock, User, Calendar, History, MessageSquare, ShieldAlert } from 'lucide-react';

export default function TicketDetailPage() {
  const router = useRouter();
  const params = useParams();
  const ticketId = params.id as string;

  const [user, setUser] = useState<any>(null);
  const [ticket, setTicket] = useState<any>(null);
  const [loading, setLoading] = useState(true);
  const [comment, setComment] = useState('');
  const [isInternalComment, setIsInternalComment] = useState(false);
  const [submitting, setSubmitting] = useState(false);
  const [updatingField, setUpdatingField] = useState(false);

  useEffect(() => {
    const checkAuth = () => {
      const storedUser = localStorage.getItem('user');
      const token = localStorage.getItem('token');

      if (!token || !storedUser) {
        router.push('/login');
        return;
      }

      setUser(JSON.parse(storedUser));
      fetchTicket(token);
    };

    checkAuth();
  }, [router]);

  const fetchTicket = async (token: string) => {
    try {
      setLoading(true);
      const response = await fetch(`/api/tickets/${ticketId}`, {
        headers: {
          Authorization: `Bearer ${token}`,
        },
      });

      const data = await response.json();
      if (data.success) {
        setTicket(data.data);
      }
    } catch (error) {
      console.error('Failed to fetch ticket:', error);
    } finally {
      setLoading(false);
    }
  };

  const handleUpdateTicketField = async (fields: Record<string, any>) => {
    setUpdatingField(true);
    try {
      const token = localStorage.getItem('token');
      const response = await fetch(`/api/tickets/${ticketId}`, {
        method: 'PATCH',
        headers: {
          'Content-Type': 'application/json',
          Authorization: `Bearer ${token}`,
        },
        body: JSON.stringify(fields),
      });

      const data = await response.json();
      if (data.success) {
        setTicket(data.data);
      }
    } catch (error) {
      console.error('Field update failed:', error);
    } finally {
      setUpdatingField(false);
    }
  };

  const handleAddComment = async () => {
    if (!comment.trim()) return;

    setSubmitting(true);
    try {
      const token = localStorage.getItem('token');
      const response = await fetch(`/api/tickets/${ticketId}`, {
        method: 'PATCH',
        headers: {
          'Content-Type': 'application/json',
          Authorization: `Bearer ${token}`,
        },
        body: JSON.stringify({
          comment: {
            content: comment,
            isInternal: isInternalComment,
          }
        }),
      });

      const data = await response.json();
      if (data.success) {
        setTicket(data.data);
        setComment('');
        setIsInternalComment(false);
      }
    } catch (error) {
      console.error('Add comment failed:', error);
    } finally {
      setSubmitting(false);
    }
  };

  const getStatusColor = (status: string) => {
    switch (status) {
      case 'OPEN':
        return 'bg-blue-100 text-blue-800 border border-blue-200';
      case 'IN_PROGRESS':
        return 'bg-yellow-100 text-yellow-800 border border-yellow-200';
      case 'RESOLVED':
        return 'bg-green-100 text-green-800 border border-green-200';
      case 'CLOSED':
        return 'bg-gray-100 text-gray-800 border border-gray-200';
      default:
        return 'bg-gray-100 text-gray-800 border border-gray-200';
    }
  };

  if (!user) {
    return null;
  }

  if (loading) {
    return (
      <div className="flex h-screen bg-slate-50">
        <Sidebar user={user} />
        <div className="flex-1 flex flex-col overflow-hidden">
          <Navbar user={user} />
          <main className="flex-1 flex items-center justify-center">
            <p className="text-gray-500 text-sm">Loading ticket...</p>
          </main>
        </div>
      </div>
    );
  }

  if (!ticket) {
    return (
      <div className="flex h-screen bg-slate-50">
        <Sidebar user={user} />
        <div className="flex-1 flex flex-col overflow-hidden">
          <Navbar user={user} />
          <main className="flex-1 flex items-center justify-center">
            <p className="text-gray-500 text-sm">Ticket not found</p>
          </main>
        </div>
      </div>
    );
  }

  return (
    <div className="flex h-screen bg-slate-55">
      <Sidebar user={user} />

      <div className="flex-1 flex flex-col overflow-hidden">
        <Navbar user={user} />

        <main className="flex-1 overflow-auto bg-slate-50">
          <div className="p-8 max-w-6xl mx-auto w-full">
            
            {/* Header */}
            <div className="mb-8 flex items-center gap-4">
              <Button variant="outline" onClick={() => router.push('/tickets')} className="h-9 px-3">
                <ArrowLeft className="w-4 h-4 mr-1.5" /> Kembali
              </Button>
              <div>
                <div className="flex items-center gap-2">
                  <h1 className="text-3xl font-extrabold text-gray-900">{ticket.ticketNumber}</h1>
                  <span className={`px-2.5 py-0.5 rounded-full text-xs font-semibold ${getStatusColor(ticket.status)}`}>
                    {ticket.status}
                  </span>
                </div>
                <p className="text-gray-600 mt-1">{ticket.title}</p>
              </div>
            </div>

            <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
              
              {/* Main Content */}
              <div className="lg:col-span-2 space-y-8">
                
                {/* Description Details Card */}
                <Card>
                  <CardHeader className="pb-3 border-b border-slate-100">
                    <CardTitle className="text-base font-bold text-slate-800">Deskripsi Kendala</CardTitle>
                  </CardHeader>
                  <CardContent className="pt-5 space-y-4">
                    <p className="text-gray-800 text-sm leading-relaxed whitespace-pre-wrap">
                      {ticket.description}
                    </p>
                    <div className="pt-4 border-t border-slate-100 grid grid-cols-2 gap-4 text-xs text-gray-500">
                      <div>
                        <span className="font-semibold block text-gray-700">Kategori</span>
                        <span>{ticket.category}</span>
                      </div>
                      <div>
                        <span className="font-semibold block text-gray-700">Prioritas</span>
                        <span className={`font-semibold ${
                          ticket.priority === 'CRITICAL' ? 'text-red-600' :
                          ticket.priority === 'HIGH' ? 'text-orange-600' :
                          ticket.priority === 'MEDIUM' ? 'text-blue-600' :
                          'text-green-600'
                        }`}>{ticket.priority}</span>
                      </div>
                    </div>
                  </CardContent>
                </Card>

                {/* Add Comment Card */}
                <Card>
                  <CardHeader className="pb-3 border-b border-slate-100">
                    <CardTitle className="text-base font-bold text-slate-800">Beri Respon / Komentar</CardTitle>
                  </CardHeader>
                  <CardContent className="pt-5 space-y-4">
                    <textarea
                      placeholder="Tulis balasan atau catatan internal di sini..."
                      value={comment}
                      onChange={(e) => setComment(e.target.value)}
                      className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 text-sm resize-none"
                      rows={4}
                    />
                    
                    <div className="flex items-center justify-between">
                      <label className="flex items-center gap-2 text-xs font-semibold text-slate-600 cursor-pointer">
                        <input
                          type="checkbox"
                          checked={isInternalComment}
                          onChange={(e) => setIsInternalComment(e.target.checked)}
                          className="rounded border-slate-300 text-rose-600 focus:ring-rose-500"
                        />
                        <span className="flex items-center gap-1">
                          <ShieldAlert className="w-3.5 h-3.5 text-rose-500" /> Catatan Internal Agen (Rahasia)
                        </span>
                      </label>

                      <div className="flex gap-2">
                        <Button 
                          variant="outline" 
                          size="sm"
                          onClick={() => {
                            setComment('');
                            setIsInternalComment(false);
                          }}
                        >
                          Batal
                        </Button>
                        <Button
                          onClick={handleAddComment}
                          disabled={!comment.trim() || submitting}
                          className="bg-blue-600 hover:bg-blue-700 flex items-center gap-1.5 text-xs font-medium h-9 px-4"
                        >
                          <Send className="w-3.5 h-3.5" />
                          {submitting ? 'Mengirim...' : 'Kirim Komentar'}
                        </Button>
                      </div>
                    </div>
                  </CardContent>
                </Card>

                {/* Feed (Comments and History) */}
                <div className="space-y-4">
                  <h3 className="text-base font-bold text-slate-800 flex items-center gap-1.5">
                    <MessageSquare className="w-4 h-4 text-slate-500" /> Log Aktivitas & Percakapan
                  </h3>

                  {/* Combined Feed */}
                  <div className="space-y-4">
                    {/* Render comments */}
                    {ticket.comments && ticket.comments.map((comment: any) => (
                      <div 
                        key={comment.id} 
                        className={`rounded-xl p-4 border transition ${
                          comment.isInternal 
                            ? 'bg-rose-50/40 border-rose-100 text-rose-950 shadow-sm' 
                            : 'bg-white border-slate-100 shadow-sm'
                        }`}
                      >
                        <div className="flex justify-between items-start mb-2 text-xs">
                          <div className="flex items-center gap-2">
                            <span className="font-bold text-slate-900">{comment.userName}</span>
                            {comment.isInternal && (
                              <span className="px-2 py-0.5 rounded bg-rose-500/10 text-rose-600 font-extrabold uppercase text-[9px] tracking-wider border border-rose-200/50">
                                Internal Note
                              </span>
                            )}
                          </div>
                          <span className="text-slate-400">
                            {new Date(comment.createdAt).toLocaleString()}
                          </span>
                        </div>
                        <p className="text-sm text-slate-700 whitespace-pre-wrap">{comment.content}</p>
                      </div>
                    ))}

                    {/* Render history logs */}
                    {ticket.history && ticket.history.map((log: any) => (
                      <div key={log.id} className="bg-slate-50 rounded-xl p-3.5 border border-slate-200/40 flex items-start gap-2.5 text-xs">
                        <History className="w-4 h-4 text-slate-400 mt-0.5 flex-shrink-0" />
                        <div className="flex-1">
                          <p className="text-slate-600">
                            Aksi: <span className="font-bold text-slate-800 uppercase font-mono text-[10px]">{log.action}</span>
                          </p>
                          <p className="text-slate-700 mt-1 font-medium">{log.newValue}</p>
                          <span className="text-[10px] text-slate-400 block mt-1">
                            {new Date(log.changedAt).toLocaleString()}
                          </span>
                        </div>
                      </div>
                    ))}

                    {(!ticket.comments || ticket.comments.length === 0) && (!ticket.history || ticket.history.length === 0) && (
                      <p className="text-slate-400 text-center py-6 text-sm">Belum ada aktivitas terekam.</p>
                    )}
                  </div>
                </div>

              </div>

              {/* Sidebar Controls */}
              <div className="space-y-6">
                
                {/* Interactive Status Selector */}
                <Card>
                  <CardHeader className="pb-2 border-b border-slate-100">
                    <CardTitle className="text-xs font-bold text-slate-500 uppercase tracking-wider">Status Tiket</CardTitle>
                  </CardHeader>
                  <CardContent className="pt-4">
                    <select
                      value={ticket.status}
                      disabled={updatingField}
                      onChange={(e) => handleUpdateTicketField({ status: e.target.value })}
                      className="w-full px-3 py-2 border border-slate-200 rounded-lg text-sm bg-white focus:outline-none focus:ring-2 focus:ring-blue-500 font-semibold"
                    >
                      <option value="OPEN">Open</option>
                      <option value="IN_PROGRESS">In Progress</option>
                      <option value="RESOLVED">Resolved</option>
                      <option value="CLOSED">Closed</option>
                    </select>
                  </CardContent>
                </Card>

                {/* Interactive Priority Selector */}
                <Card>
                  <CardHeader className="pb-2 border-b border-slate-100">
                    <CardTitle className="text-xs font-bold text-slate-500 uppercase tracking-wider">Prioritas</CardTitle>
                  </CardHeader>
                  <CardContent className="pt-4">
                    <select
                      value={ticket.priority}
                      disabled={updatingField}
                      onChange={(e) => handleUpdateTicketField({ priority: e.target.value })}
                      className="w-full px-3 py-2 border border-slate-200 rounded-lg text-sm bg-white focus:outline-none focus:ring-2 focus:ring-blue-500 font-semibold"
                    >
                      <option value="LOW">Low</option>
                      <option value="MEDIUM">Medium</option>
                      <option value="HIGH">High</option>
                      <option value="CRITICAL">Critical</option>
                    </select>
                  </CardContent>
                </Card>

                {/* Interactive Assignment Selector */}
                <Card>
                  <CardHeader className="pb-2 border-b border-slate-100">
                    <CardTitle className="text-xs font-bold text-slate-500 uppercase tracking-wider">Petugas Ditugaskan</CardTitle>
                  </CardHeader>
                  <CardContent className="pt-4">
                    <select
                      value={ticket.assignedTo || ''}
                      disabled={updatingField}
                      onChange={(e) => handleUpdateTicketField({ assignedTo: e.target.value || null })}
                      className="w-full px-3 py-2 border border-slate-200 rounded-lg text-sm bg-white focus:outline-none focus:ring-2 focus:ring-blue-500"
                    >
                      <option value="">Belum Ditugaskan (Unassigned)</option>
                      <option value="1">Admin User</option>
                      <option value="2">Support Agent</option>
                    </select>
                  </CardContent>
                </Card>

                {/* Dates & Creator Info */}
                <Card>
                  <CardHeader className="pb-2 border-b border-slate-100">
                    <CardTitle className="text-xs font-bold text-slate-500 uppercase tracking-wider">Informasi Tambahan</CardTitle>
                  </CardHeader>
                  <CardContent className="pt-4 space-y-4 text-xs">
                    <div>
                      <span className="text-slate-500 block mb-1">Dibuat Oleh</span>
                      <div className="flex items-center gap-1.5 font-semibold text-slate-800">
                        <User className="w-3.5 h-3.5 text-slate-400" /> {ticket.createdByName}
                      </div>
                      <span className="text-[10px] text-slate-400 block mt-0.5">{ticket.createdByEmail}</span>
                    </div>

                    <div className="pt-3.5 border-t border-slate-100/60">
                      <span className="text-slate-500 block mb-1">Waktu Dibuat</span>
                      <div className="flex items-center gap-1.5 text-slate-700">
                        <Calendar className="w-3.5 h-3.5 text-slate-400" /> {new Date(ticket.createdAt).toLocaleString()}
                      </div>
                    </div>

                    {ticket.dueDate && (
                      <div className="pt-3.5 border-t border-slate-100/60">
                        <span className="text-slate-500 block mb-1">Tenggat Waktu (Due Date)</span>
                        <div className="flex items-center gap-1.5 text-slate-700 font-semibold">
                          <Clock className="w-3.5 h-3.5 text-slate-400" /> {new Date(ticket.dueDate).toLocaleDateString()}
                        </div>
                      </div>
                    )}
                  </CardContent>
                </Card>

              </div>

            </div>

          </div>
        </main>
      </div>
    </div>
  );
}
