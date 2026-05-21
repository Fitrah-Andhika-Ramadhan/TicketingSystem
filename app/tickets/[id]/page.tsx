'use client';

import { useState, useEffect } from 'react';
import { useRouter, useParams } from 'next/navigation';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import Navbar from '@/components/Navbar';
import Sidebar from '@/components/Sidebar';
import { ArrowLeft, Send, Clock, User, Calendar, History, MessageSquare, ShieldAlert, CheckCircle2, Trash2 } from 'lucide-react';
import { toast } from 'sonner';

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

  // New local states for workflow
  const [localProgress, setLocalProgress] = useState(0);
  const [deletingCommentId, setDeletingCommentId] = useState<string | null>(null);

  useEffect(() => {
    if (ticket) {
      setLocalProgress(ticket.progress || 0);
    }
  }, [ticket]);

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
        cache: 'no-store',
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
        toast.success('Detail tiket berhasil diperbarui!');
      } else {
        toast.error(data.error || 'Gagal memperbarui tiket.');
      }
    } catch (error) {
      console.error('Field update failed:', error);
      toast.error('Terjadi kesalahan koneksi saat memperbarui tiket.');
    } finally {
      setUpdatingField(false);
    }
  };

  const handleDeleteComment = async (commentId: string) => {
    if (!confirm('Hapus komentar ini?')) return;
    setDeletingCommentId(commentId);
    try {
      const token = localStorage.getItem('token');
      const res = await fetch(`/api/comments/${commentId}`, {
        method: 'DELETE',
        headers: { Authorization: `Bearer ${token}` },
      });
      const data = await res.json();
      if (data.success) {
        toast.success('Komentar berhasil dihapus.');
        fetchTicket(token!);
      } else {
        toast.error(data.error || 'Gagal menghapus komentar.');
      }
    } catch (e) {
      toast.error('Terjadi kesalahan saat menghapus komentar.');
    } finally {
      setDeletingCommentId(null);
    }
  };

  const handleAddComment = async (resolveTicket: boolean = false) => {
    if (!comment.trim()) return;

    setSubmitting(true);
    try {
      const token = localStorage.getItem('token');
      const bodyPayload: any = {
        comment: {
          content: comment,
          isInternal: isInternalComment,
        }
      };
      
      if (resolveTicket) {
        bodyPayload.status = 'RESOLVED';
        bodyPayload.progress = 100;
      }

      const response = await fetch(`/api/tickets/${ticketId}`, {
        method: 'PATCH',
        headers: {
          'Content-Type': 'application/json',
          Authorization: `Bearer ${token}`,
        },
        body: JSON.stringify(bodyPayload),
      });

      const data = await response.json();
      if (data.success) {
        setTicket(data.data);
        setComment('');
        setIsInternalComment(false);
        if (resolveTicket) {
          toast.success('Komentar ditambahkan dan tiket berhasil diselesaikan!');
        } else {
          toast.success(isInternalComment ? 'Catatan internal berhasil disimpan.' : 'Respon/komentar berhasil dikirim.');
        }
      } else {
        toast.error(data.error || 'Gagal mengirim komentar.');
      }
    } catch (error) {
      console.error('Comment failed:', error);
      toast.error('Terjadi kesalahan koneksi saat mengirim komentar.');
    } finally {
      setSubmitting(false);
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

            {/* Status Timeline Stepper */}
            <div className="mb-8 p-6 bg-white rounded-xl shadow-sm border border-slate-200 overflow-x-auto">
              <div className="flex items-center justify-between relative min-w-[600px]">
                <div className="absolute left-0 top-1/2 -translate-y-1/2 w-full h-1.5 bg-slate-100 -z-10 rounded-full"></div>
                <div className="absolute left-0 top-1/2 -translate-y-1/2 h-1.5 bg-blue-500 transition-all duration-500 -z-10 rounded-full" 
                     style={{ width: ticket.status === 'PENDING_APPROVAL' ? '0%' : ticket.status === 'APPROVED' ? '25%' : ticket.status === 'IN_PROGRESS' ? '50%' : ticket.status === 'IN_REVIEW' ? '75%' : '100%' }}></div>
                
                {['PENDING_APPROVAL', 'APPROVED', 'IN_PROGRESS', 'IN_REVIEW', 'RESOLVED/CLOSED'].map((step, idx) => {
                  let isActive = false;
                  let isPast = false;
                  const currentIndex = ['PENDING_APPROVAL', 'APPROVED', 'IN_PROGRESS', 'IN_REVIEW', 'RESOLVED', 'CLOSED'].indexOf(ticket.status);
                  const stepIndex = step === 'RESOLVED/CLOSED' ? 4 : idx;
                  
                  if (currentIndex === stepIndex || (currentIndex === 5 && stepIndex === 4)) isActive = true;
                  else if (currentIndex > stepIndex) isPast = true;

                  return (
                    <div key={step} className="flex flex-col items-center gap-2 bg-white px-4">
                      <div className={`w-10 h-10 rounded-full flex items-center justify-center font-bold text-sm border-[3px] transition-all duration-300 ${
                        isActive ? 'border-blue-500 bg-blue-500 text-white shadow-lg shadow-blue-500/30 scale-110' : 
                        isPast ? 'border-blue-500 bg-blue-50 text-blue-600' : 'border-slate-200 bg-slate-50 text-slate-400'
                      }`}>
                        {idx + 1}
                      </div>
                      <span className={`text-[11px] font-bold uppercase tracking-wider ${isActive ? 'text-blue-700' : isPast ? 'text-slate-700' : 'text-slate-400'}`}>
                        {step.replace('_', ' ')}
                      </span>
                    </div>
                  );
                })}
              </div>
            </div>

            <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
              
              {/* Main Content */}
              <div className="lg:col-span-2 space-y-8">

                {/* === ROLE-BASED ACTION PANELS === */}

                {/* ADMIN/SUPER_ADMIN: Approve pending ticket */}
                {ticket.status === 'PENDING_APPROVAL' && (user?.role === 'ADMIN' || user?.role === 'SUPER_ADMIN') && (
                  <Card className="border-orange-200 shadow-sm shadow-orange-100 overflow-hidden">
                    <CardHeader className="pb-3 border-b border-orange-100 bg-orange-50/80">
                      <CardTitle className="text-base font-bold text-orange-800 flex items-center gap-2">
                        <ShieldAlert className="w-5 h-5" /> Tindakan Admin: Persetujuan Tiket
                      </CardTitle>
                    </CardHeader>
                    <CardContent className="pt-5 flex flex-col sm:flex-row items-center justify-between bg-white gap-4">
                      <p className="text-sm text-orange-800/80 font-medium text-center sm:text-left">Tiket ini menunggu validasi Anda sebelum dapat dikerjakan.</p>
                      <Button onClick={() => handleUpdateTicketField({ status: 'APPROVED' })} className="bg-orange-600 hover:bg-orange-700 shadow-sm shadow-orange-600/20 whitespace-nowrap">
                        Approve Ticket
                      </Button>
                    </CardContent>
                  </Card>
                )}

                {/* FUNCTIONAL_TEAM: Analyze & assign ticket */}
                {user?.role === 'FUNCTIONAL_TEAM' && (ticket.status === 'APPROVED' || ticket.status === 'OPEN' || ticket.status === 'PENDING_APPROVAL') && (
                  <Card className="border-indigo-200 shadow-sm shadow-indigo-100 overflow-hidden">
                    <CardHeader className="pb-3 border-b border-indigo-100 bg-indigo-50/80">
                      <CardTitle className="text-base font-bold text-indigo-800 flex items-center gap-2">
                        <User className="w-5 h-5" /> Analisis & Penugasan (Functional Team)
                      </CardTitle>
                    </CardHeader>
                    <CardContent className="pt-5 space-y-3 bg-white">
                      <p className="text-sm text-indigo-700/80">Sebagai Functional Team, Anda hanya dapat mengubah status ke <b>In Progress</b> untuk ditugaskan ke Developer.</p>
                      <div className="flex flex-col sm:flex-row gap-3">
                        <Button onClick={() => handleUpdateTicketField({ status: 'IN_PROGRESS' })} className="bg-indigo-600 hover:bg-indigo-700">
                          Tugaskan ke Developer (In Progress)
                        </Button>
                      </div>
                    </CardContent>
                  </Card>
                )}

                {/* DEVELOPER: Work on ticket */}
                {user?.role === 'DEVELOPER' && (ticket.status === 'APPROVED' || ticket.status === 'IN_PROGRESS') && (
                  <Card className="border-green-200 shadow-sm shadow-green-100 overflow-hidden">
                    <CardHeader className="pb-3 border-b border-green-100 bg-green-50/80">
                      <CardTitle className="text-base font-bold text-green-800 flex items-center gap-2">
                        <History className="w-5 h-5" /> Panel Developer: Progress Pengerjaan
                      </CardTitle>
                    </CardHeader>
                    <CardContent className="pt-5 space-y-4 bg-white">
                      <div>
                        <div className="flex justify-between text-sm font-bold mb-2 text-green-900">
                          <span>Progres Pengerjaan</span>
                          <span className="bg-green-100 text-green-800 px-2.5 py-0.5 rounded-full text-xs">{localProgress}%</span>
                        </div>
                        <input
                          type="range" min="0" max="100" step="5"
                          value={localProgress}
                          onChange={(e) => setLocalProgress(parseInt(e.target.value))}
                          className="w-full h-2.5 bg-slate-200 rounded-lg appearance-none cursor-pointer accent-green-600"
                        />
                      </div>
                      <div className="flex flex-col sm:flex-row gap-3 pt-2">
                        <Button
                          onClick={() => handleUpdateTicketField({ progress: localProgress })}
                          variant="outline" className="border-green-300 text-green-700 hover:bg-green-50 font-semibold"
                        >
                          Update Progress Saja
                        </Button>
                        <Button
                          onClick={() => handleUpdateTicketField({ status: 'IN_REVIEW', progress: 100 })}
                          className="bg-green-600 hover:bg-green-700 font-semibold"
                        >
                          <CheckCircle2 className="w-4 h-4 mr-1.5" /> Selesai, Ubah ke In Review
                        </Button>
                      </div>
                    </CardContent>
                  </Card>
                )}

                {/* QA: Review & close ticket */}
                {user?.role === 'QA' && ticket.status === 'IN_REVIEW' && (
                  <Card className="border-amber-200 shadow-sm shadow-amber-100 overflow-hidden">
                    <CardHeader className="pb-3 border-b border-amber-100 bg-amber-50/80">
                      <CardTitle className="text-base font-bold text-amber-800 flex items-center gap-2">
                        <ShieldAlert className="w-5 h-5" /> Panel QA: Pengujian & Verifikasi
                      </CardTitle>
                    </CardHeader>
                    <CardContent className="pt-5 space-y-3 bg-white">
                      <p className="text-sm text-amber-700/80">Sebagai QA, Anda hanya dapat mengubah status ke <b>Resolved</b> atau <b>Closed</b>.</p>
                      <div className="flex flex-col sm:flex-row gap-3">
                        <Button
                          onClick={() => handleUpdateTicketField({ status: 'RESOLVED', progress: 100 })}
                          className="bg-amber-600 hover:bg-amber-700 font-semibold text-white"
                        >
                          <CheckCircle2 className="w-4 h-4 mr-1.5" /> Lulus QA — Resolve
                        </Button>
                        <Button
                          onClick={() => handleUpdateTicketField({ status: 'CLOSED' })}
                          variant="outline" className="border-slate-300 text-slate-700 hover:bg-slate-100 font-semibold"
                        >
                          Tutup Tiket (Closed)
                        </Button>
                      </div>
                    </CardContent>
                  </Card>
                )}

                {/* General ADMIN/SUPER_ADMIN progress tracker (non-pending) */}
                {(user?.role === 'ADMIN' || user?.role === 'SUPER_ADMIN') && (ticket.status === 'IN_PROGRESS' || ticket.status === 'APPROVED') && (
                  <Card className="border-blue-200 shadow-sm shadow-blue-100 overflow-hidden">
                    <CardHeader className="pb-3 border-b border-blue-100 bg-blue-50/80">
                      <CardTitle className="text-base font-bold text-blue-800 flex items-center gap-2">
                        <History className="w-5 h-5" /> Progress Pengerjaan (Admin View)
                      </CardTitle>
                    </CardHeader>
                    <CardContent className="pt-5 space-y-4 bg-white">
                      <div>
                        <div className="flex justify-between text-sm font-bold mb-2 text-blue-900">
                          <span>Status Progress</span>
                          <span className="bg-blue-100 text-blue-800 px-2.5 py-0.5 rounded-full text-xs">{localProgress}%</span>
                        </div>
                        <input
                          type="range" min="0" max="100" step="5"
                          value={localProgress}
                          onChange={(e) => setLocalProgress(parseInt(e.target.value))}
                          className="w-full h-2.5 bg-slate-200 rounded-lg appearance-none cursor-pointer accent-blue-600"
                        />
                      </div>
                      <div className="flex justify-end pt-2">
                        <Button
                          onClick={() => {
                            if (ticket.status !== 'IN_PROGRESS') handleUpdateTicketField({ status: 'IN_PROGRESS', progress: localProgress });
                            else handleUpdateTicketField({ progress: localProgress });
                          }}
                          disabled={localProgress === ticket.progress && ticket.status === 'IN_PROGRESS'}
                          variant="outline" className="border-blue-300 text-blue-700 hover:bg-blue-50 font-semibold"
                        >
                          Update Progress
                        </Button>
                      </div>
                    </CardContent>
                  </Card>
                )}

                {/* Attachments Card (if any) */}
                {ticket.attachments && ticket.attachments.length > 0 && (
                  <Card>
                    <CardHeader className="pb-3 border-b border-slate-100">
                      <CardTitle className="text-base font-bold text-slate-800 flex items-center gap-2">
                        <ImageIcon className="w-5 h-5 text-blue-500" /> Lampiran
                      </CardTitle>
                    </CardHeader>
                    <CardContent className="pt-5 space-y-4">
                      <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
                        {ticket.attachments.map((att: any) => (
                          <div key={att.id} className="relative group rounded-lg overflow-hidden border border-slate-200">
                            <img src={att.fileUrl} alt={att.fileName} className="w-full h-32 object-cover" />
                            <div className="absolute inset-0 bg-black/50 opacity-0 group-hover:opacity-100 transition-opacity flex items-center justify-center">
                              <a href={att.fileUrl} target="_blank" rel="noreferrer" className="bg-white text-slate-900 text-xs font-bold py-1 px-3 rounded-full">Buka</a>
                            </div>
                          </div>
                        ))}
                      </div>
                    </CardContent>
                  </Card>
                )}


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

                      <div className="flex gap-2 flex-wrap justify-end mt-4 sm:mt-0">
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
                          onClick={() => handleAddComment(false)}
                          disabled={!comment.trim() || submitting}
                          className="bg-blue-600 hover:bg-blue-700 flex items-center gap-1.5 text-xs font-medium h-9 px-4"
                        >
                          <Send className="w-3.5 h-3.5" />
                          {submitting ? 'Mengirim...' : 'Kirim Komentar'}
                        </Button>
                        {/* Resolve button: admin or developer only */}
                        {(user?.role === 'ADMIN' || user?.role === 'SUPER_ADMIN' || user?.role === 'DEVELOPER') && ticket.status !== 'RESOLVED' && ticket.status !== 'CLOSED' && (
                          <Button
                            onClick={() => handleAddComment(true)}
                            disabled={!comment.trim() || submitting}
                            className="bg-emerald-600 hover:bg-emerald-700 flex items-center gap-1.5 text-xs font-medium h-9 px-4 shadow-sm shadow-emerald-500/20"
                          >
                            <CheckCircle2 className="w-4 h-4" />
                            {submitting ? 'Menyelesaikan...' : 'Kirim & Selesaikan Tiket'}
                          </Button>
                        )}
                      </div>
                    </div>
                  </CardContent>
                </Card>

                {/* Feed (Comments and History) */}
                <div className="space-y-6 pt-4">
                  <h3 className="text-lg font-bold text-slate-800 flex items-center gap-2 border-b border-slate-100 pb-2">
                    <History className="w-5 h-5 text-slate-400" /> Log Aktivitas & Percakapan
                  </h3>
                  
                  <div className="space-y-6">
                    {ticket.comments && ticket.comments.map((comment: any) => {
                      const isMe = user?.id === comment.userId;
                      const canDelete = user?.role === 'ADMIN' || user?.role === 'SUPER_ADMIN' || isMe;
                      return (
                        <div key={comment.id} className={`flex flex-col ${isMe ? 'items-end' : 'items-start'} group`}>
                          <div className={`max-w-[85%] md:max-w-[70%] rounded-2xl p-4 shadow-sm relative ${
                            comment.isInternal 
                              ? 'bg-rose-50 border border-rose-100 rounded-tl-none' 
                              : isMe 
                                ? 'bg-blue-600 text-white rounded-tr-none shadow-blue-500/20' 
                                : 'bg-white border border-slate-100 rounded-tl-none'
                          }`}>
                            {/* Delete button - appears on hover */}
                            {canDelete && (
                              <button
                                onClick={() => handleDeleteComment(comment.id)}
                                disabled={deletingCommentId === comment.id}
                                className={`absolute -top-2 ${isMe ? '-left-2' : '-right-2'} w-6 h-6 rounded-full bg-rose-500 text-white opacity-0 group-hover:opacity-100 transition-opacity duration-200 flex items-center justify-center shadow-md hover:bg-rose-600`}
                                title="Hapus komentar"
                              >
                                {deletingCommentId === comment.id ? (
                                  <span className="text-[8px]">...</span>
                                ) : (
                                  <Trash2 className="w-3 h-3" />
                                )}
                              </button>
                            )}
                            <div className="flex items-center gap-2 mb-2">
                              <span className={`font-bold text-sm ${isMe ? 'text-blue-100' : 'text-slate-900'}`}>
                                {comment.userName}
                              </span>
                              {comment.isInternal && (
                                <span className="bg-rose-100 text-rose-700 text-[10px] font-bold px-2 py-0.5 rounded-full flex items-center gap-1 uppercase tracking-wider">
                                  <ShieldAlert className="w-3 h-3" /> Internal
                                </span>
                              )}
                            </div>
                            <p className={`text-sm whitespace-pre-wrap leading-relaxed ${isMe ? 'text-white' : 'text-slate-700'}`}>
                              {comment.content}
                            </p>
                          </div>
                          <span className="text-[10px] text-slate-400 font-medium mt-1.5 px-1">
                            {new Date(comment.createdAt).toLocaleString('id-ID', {
                              day: 'numeric', month: 'short', year: 'numeric', hour: '2-digit', minute: '2-digit'
                            })}
                          </span>
                        </div>
                      );
                    })}
                    
                    {ticket.history && ticket.history.map((hist: any) => (
                      <div key={hist.id} className="flex justify-center my-4">
                        <div className="bg-slate-100 text-slate-500 text-xs font-medium px-4 py-1.5 rounded-full flex items-center gap-2 border border-slate-200">
                          <Clock className="w-3.5 h-3.5" />
                          <span>Aksi: {hist.action}</span>
                          {hist.newValue && <span className="font-bold text-slate-700">{hist.newValue}</span>}
                          <span className="opacity-70 ml-2">
                            {new Date(hist.changedAt).toLocaleString('id-ID', {
                              day: 'numeric', month: 'short', hour: '2-digit', minute: '2-digit'
                            })}
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
                    {/* Status selector: restricted by role */}
                    {user?.role === 'VIEWER' ? (
                      <div className="px-3 py-2 bg-slate-50 border border-slate-200 rounded-lg text-sm font-semibold text-slate-700">
                        {ticket.status.replace(/_/g, ' ')}
                      </div>
                    ) : (
                      <select
                        value={ticket.status}
                        disabled={updatingField}
                        onChange={(e) => handleUpdateTicketField({ status: e.target.value })}
                        className="w-full px-3 py-2 border border-slate-200 rounded-lg text-sm bg-white focus:outline-none focus:ring-2 focus:ring-blue-500 font-semibold"
                      >
                        {/* Selalu tampilkan status saat ini sebagai opsi agar tidak error/blank */}
                        <option value={ticket.status}>{ticket.status.replace(/_/g, ' ')}</option>
                        
                        {(user?.role === 'ADMIN' || user?.role === 'SUPER_ADMIN') && (
                          <>
                            {ticket.status !== 'PENDING_APPROVAL' && <option value="PENDING_APPROVAL">Pending Approval</option>}
                            {ticket.status !== 'APPROVED' && <option value="APPROVED">Approved</option>}
                            {ticket.status !== 'OPEN' && <option value="OPEN">Open</option>}
                            {ticket.status !== 'IN_PROGRESS' && <option value="IN_PROGRESS">In Progress</option>}
                            {ticket.status !== 'IN_REVIEW' && <option value="IN_REVIEW">In Review</option>}
                            {ticket.status !== 'RESOLVED' && <option value="RESOLVED">Resolved</option>}
                            {ticket.status !== 'CLOSED' && <option value="CLOSED">Closed</option>}
                          </>
                        )}
                        {user?.role === 'FUNCTIONAL_TEAM' && ticket.status !== 'IN_PROGRESS' && (
                          <option value="IN_PROGRESS">In Progress</option>
                        )}
                        {user?.role === 'DEVELOPER' && ticket.status !== 'IN_REVIEW' && (
                          <option value="IN_REVIEW">In Review (Submit ke QA)</option>
                        )}
                        {user?.role === 'QA' && (
                          <>
                            {ticket.status !== 'RESOLVED' && <option value="RESOLVED">Resolved (Lulus QA)</option>}
                            {ticket.status !== 'CLOSED' && <option value="CLOSED">Closed</option>}
                            {/* Tambahan opsional: QA biasanya bisa reject ke IN_PROGRESS, tapi instruksi bilang hanya RESOLVED/CLOSED */}
                          </>
                        )}
                      </select>
                    )}
                  </CardContent>
                </Card>

                {/* Interactive Priority Selector */}
                <Card>
                  <CardHeader className="pb-2 border-b border-slate-100">
                    <CardTitle className="text-xs font-bold text-slate-500 uppercase tracking-wider">Prioritas</CardTitle>
                  </CardHeader>
                  <CardContent className="pt-4">
                    {user?.role === 'ADMIN' || user?.role === 'SUPER_ADMIN' || user?.role === 'FUNCTIONAL_TEAM' ? (
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
                    ) : (
                      <div className="px-3 py-2 bg-slate-50 border border-slate-200 rounded-lg text-sm font-semibold text-slate-700">
                        {ticket.priority}
                      </div>
                    )}
                  </CardContent>
                </Card>

                {/* Interactive Assignment Selector */}
                <Card>
                  <CardHeader className="pb-2 border-b border-slate-100">
                    <CardTitle className="text-xs font-bold text-slate-500 uppercase tracking-wider">Petugas Ditugaskan</CardTitle>
                  </CardHeader>
                  <CardContent className="pt-4">
                    {user?.role === 'ADMIN' || user?.role === 'SUPER_ADMIN' || user?.role === 'FUNCTIONAL_TEAM' ? (
                      <select
                        value={ticket.assignedTo || ''}
                        disabled={updatingField}
                        onChange={(e) => handleUpdateTicketField({ assignedTo: e.target.value || null })}
                        className="w-full px-3 py-2 border border-slate-200 rounded-lg text-sm bg-white focus:outline-none focus:ring-2 focus:ring-blue-500"
                      >
                        <option value="">Belum Ditugaskan (Unassigned)</option>
                        {/* Di sistem aslinya harusnya fetch user list, ini hardcode sebagai contoh */}
                        <option value="1">Admin User</option>
                        <option value="2">Support Agent</option>
                      </select>
                    ) : (
                      <div className="px-3 py-2 bg-slate-50 border border-slate-200 rounded-lg text-sm font-semibold text-slate-700">
                        {ticket.assignedUser?.name || 'Belum Ditugaskan'}
                      </div>
                    )}
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
