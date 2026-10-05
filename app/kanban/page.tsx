'use client';

import { useEffect, useState } from 'react';
import { useRouter } from 'next/navigation';
import { DragDropContext, Droppable, Draggable } from 'react-beautiful-dnd';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import Sidebar from '@/components/Sidebar';
import Navbar from '@/components/Navbar';
import { Clock, MessageSquare, AlertCircle, Calendar, Key, Webhook } from 'lucide-react';
import swal from '@/lib/swal';
import { Dialog, DialogContent, DialogDescription, DialogFooter, DialogHeader, DialogTitle } from '@/components/ui/dialog';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Button } from '@/components/ui/button';

// Helper to determine badge color by priority
const getPriorityColor = (priority: string) => {
  switch (priority) {
    case 'CRITICAL': return 'bg-red-100 text-red-800 border-red-200';
    case 'HIGH': return 'bg-orange-100 text-orange-800 border-orange-200';
    case 'MEDIUM': return 'bg-blue-100 text-blue-800 border-blue-200';
    case 'LOW': return 'bg-slate-100 text-slate-800 border-slate-200';
    default: return 'bg-slate-100 text-slate-800 border-slate-200';
  }
};

export default function KanbanPage() {
  const router = useRouter();
  const [user, setUser] = useState<any>(null);
  const [tickets, setTickets] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);
  const [isApiKeyModalOpen, setIsApiKeyModalOpen] = useState(false);
  const [apiKey, setApiKey] = useState('');
  const [careerActivities, setCareerActivities] = useState<any[]>([]);
  const [careerLoading, setCareerLoading] = useState(false);
  const [careerError, setCareerError] = useState<string | null>(null);
  const [isConnected, setIsConnected] = useState(false);

  useEffect(() => {
    const savedKey = localStorage.getItem('career_api_key');
    if (savedKey) {
      setApiKey(savedKey);
      setIsConnected(true);
      fetchCareerActivities(savedKey);
    }
  }, []);

  const columns = [
    { id: 'OPEN', title: 'Open' },
    { id: 'IN_PROGRESS', title: 'In Progress' },
    { id: 'IN_REVIEW', title: 'Review' },
    { id: 'RESOLVED', title: 'Resolved' },
    { id: 'CLOSED', title: 'Closed' }
  ];

  useEffect(() => {
    const checkAuth = () => {
      const storedUser = localStorage.getItem('user');
      const token = localStorage.getItem('token');
      if (!token || !storedUser) {
        router.push('/login');
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
      const response = await fetch('/api/tickets', {
        headers: { Authorization: `Bearer ${token}` }
      });
      const data = await response.json();
      if (data.success) {
        setTickets(data.data);
      }
    } catch (error) {
      console.error('Failed to fetch tickets:', error);
    } finally {
      setLoading(false);
    }
  };

  const updateTicketStatus = async (ticketId: string, newStatus: string) => {
    const token = localStorage.getItem('token');
    try {
      const response = await fetch(`/api/tickets/${ticketId}`, {
        method: 'PUT',
        headers: {
          'Content-Type': 'application/json',
          Authorization: `Bearer ${token}`
        },
        body: JSON.stringify({ status: newStatus })
      });
      if (!response.ok) throw new Error('Update failed');
    } catch (error) {
      swal.fire('Error', 'Gagal memindahkan tiket. Coba lagi.', 'error');
      // Revert state if failed
      fetchTickets(token || '');
    }
  };

  const onDragEnd = (result: any) => {
    if (!result.destination) return;

    const { source, destination, draggableId } = result;

    if (source.droppableId !== destination.droppableId) {
      // Find the dragged ticket
      const draggedTicket = tickets.find(t => t.id === draggableId);
      if (!draggedTicket) return;

      // Optimistically update the UI
      const updatedTickets = tickets.map(t => {
        if (t.id === draggableId) {
          return { ...t, status: destination.droppableId };
        }
        return t;
      });
      setTickets(updatedTickets);

      // Call API
      updateTicketStatus(draggableId, destination.droppableId);
    }
  };

  const fetchCareerActivities = async (token: string) => {
    try {
      setCareerLoading(true);
      setCareerError(null);
      const response = await fetch('/api/career-activities', {
        headers: { Authorization: `Bearer ${token}` }
      });
      const data = await response.json();
      if (data.success) {
        const activities = Array.isArray(data.data) ? data.data : (data.data?.data || data.data?.activities || []);
        setCareerActivities(activities);
        setIsConnected(true);
      } else {
        console.error('Career API error:', data.error);
        if (data.error.includes('401')) {
           setCareerError('Token API Salah atau Kadaluarsa (401 Unauthorized)');
        } else {
           setCareerError(data.error);
        }
        setIsConnected(true); // Still connected so we show the error state
      }
    } catch (error: any) {
      console.error('Failed to fetch career activities:', error);
      setCareerError(error.message || 'Gagal menyambung ke server');
    } finally {
      setCareerLoading(false);
    }
  };

  const handleSaveApiKey = () => {
    localStorage.setItem('career_api_key', apiKey);
    fetchCareerActivities(apiKey);
    swal.fire({
      icon: 'success',
      title: 'Terhubung!',
      text: 'API Key Career Web berhasil disimpan. Data pelamar akan tampil di Kanban secara otomatis.',
    });
    setIsApiKeyModalOpen(false);
  };

  if (!user) {
    return <div className="min-h-screen bg-slate-50 flex items-center justify-center">Loading...</div>;
  }

  return (
    <div className="flex h-screen bg-slate-50">
      <Sidebar user={user} />
      
      <div className="flex-1 flex flex-col overflow-hidden">
        <Navbar user={user} />
        
        <main className="flex-1 overflow-auto p-8">
          <div className="max-w-7xl mx-auto h-full flex flex-col">
            <div className="mb-6 flex justify-between items-start">
              <div>
                <h1 className="text-3xl font-bold text-gray-900">Kanban Board</h1>
                <p className="text-gray-600 mt-1">Track and manage ticket pipeline</p>
              </div>
              <div className="flex items-center gap-3">
                {isConnected && (
                  <div className="flex items-center gap-2 text-xs bg-green-50 text-green-700 border border-green-200 px-3 py-2 rounded-lg">
                    <div className="w-2 h-2 rounded-full bg-green-500 animate-pulse"></div>
                    <span>Career Web Terhubung</span>
                    {careerLoading && <span className="text-green-500">(Memuat...)</span>}
                  </div>
                )}
                <Button 
                  onClick={() => setIsApiKeyModalOpen(true)}
                  className="bg-indigo-600 hover:bg-indigo-700 shadow-sm"
                >
                  <Webhook className="w-4 h-4 mr-2" />
                  Integration Settings
                </Button>
              </div>
            </div>



            <div className="flex-1 overflow-x-auto pb-4">
              <DragDropContext onDragEnd={onDragEnd}>
                <div className="flex gap-6 h-full min-w-max">
                  {columns.map(column => {
                    const columnTickets = tickets.filter(t => t.status === column.id);
                    // Merge career activities into OPEN column as special cards
                    const careerCards = column.id === 'OPEN' && Array.isArray(careerActivities) ? careerActivities
                      .filter(a => a !== null && typeof a === 'object')
                      .map((a: any, i: number) => {
                      // Detect activity type
                      const rawType = String(a.type || a.action || a.category || '').toLowerCase();
                      let typeLabel = 'UPDATE';
                      let typeColor = 'bg-blue-100 text-blue-700';
                      if (rawType.includes('bug') || rawType.includes('fix') || rawType.includes('error')) {
                        typeLabel = '🐛 BUG FIX';
                        typeColor = 'bg-red-100 text-red-700';
                      } else if (rawType.includes('feature') || rawType.includes('fitur') || rawType.includes('new') || rawType.includes('baru')) {
                        typeLabel = '✨ FITUR BARU';
                        typeColor = 'bg-green-100 text-green-700';
                      } else if (rawType.includes('update') || rawType.includes('change') || rawType.includes('perubahan')) {
                        typeLabel = '🔄 UPDATE';
                        typeColor = 'bg-blue-100 text-blue-700';
                      } else if (rawType.includes('deploy') || rawType.includes('release')) {
                        typeLabel = '🚀 DEPLOY';
                        typeColor = 'bg-purple-100 text-purple-700';
                      }
                      
                      let safeDate = new Date().toISOString();
                      try {
                        const parsed = new Date(a.created_at || a.date || a.timestamp);
                        if (!isNaN(parsed.getTime())) safeDate = parsed.toISOString();
                      } catch (e) {}

                      return {
                        id: `career-${i}`,
                        isCareer: true,
                        ticketNumber: `FITRU-${String(i + 1).padStart(3, '0')}`,
                        typeLabel,
                        typeColor,
                        title: a.title || a.description || a.message || a.action || a.name || 'Aktivitas Career Web',
                        detail: a.detail || a.notes || a.body || a.content || '',
                        author: a.author || a.user || a.changed_by || a.created_by || '',
                        module: a.module || a.feature || a.component || a.page || '',
                        createdAt: safeDate,
                      };
                    }) : [];
                    
                    return (
                      <div key={column.id} className="w-80 flex flex-col bg-slate-100/50 rounded-xl border border-slate-200">
                        <div className="p-4 border-b border-slate-200 bg-slate-100 rounded-t-xl flex justify-between items-center">
                          <h3 className="font-bold text-slate-700">{column.title}</h3>
                          <span className="bg-white text-slate-500 text-xs font-bold px-2 py-1 rounded-full shadow-sm">
                            {columnTickets.length + (column.id === 'OPEN' ? careerCards.length : 0)}
                          </span>
                        </div>
                        
                        <Droppable droppableId={column.id}>
                          {(provided, snapshot) => (
                            <div 
                              ref={provided.innerRef}
                              {...provided.droppableProps}
                              className={`flex-1 p-3 overflow-y-auto min-h-[150px] transition-colors ${snapshot.isDraggingOver ? 'bg-blue-50/50' : ''}`}
                            >
                              {/* Career activity cards in OPEN column */}
                              {careerCards.map((card, index) => (
                                <div key={card.id} className="mb-3">
                                  <Card className="shadow-sm hover:shadow-md transition-shadow border-indigo-200 bg-gradient-to-br from-white to-indigo-50/40">
                                    <CardContent className="p-4 space-y-2">
                                      <div className="flex justify-between items-center">
                                        <span className="text-xs font-mono font-bold text-indigo-400">{card.ticketNumber}</span>
                                        <span className={`text-[10px] px-2 py-0.5 rounded-full font-bold ${card.typeColor}`}>{card.typeLabel}</span>
                                      </div>
                                      <h4 className="font-bold text-slate-800 text-sm leading-snug line-clamp-2">{card.title}</h4>
                                      {card.detail && (
                                        <p className="text-xs text-slate-500 line-clamp-2">{card.detail}</p>
                                      )}
                                      <div className="flex items-center gap-2 pt-1 border-t border-indigo-100">
                                        {card.module && (
                                          <span className="text-[10px] bg-slate-100 text-slate-600 px-2 py-0.5 rounded font-medium">📦 {card.module}</span>
                                        )}
                                        {card.author && (
                                          <span className="text-[10px] text-slate-400 ml-auto">👤 {card.author}</span>
                                        )}
                                      </div>
                                      <div className="flex items-center gap-1 text-xs text-slate-400">
                                        <Calendar className="w-3 h-3" />
                                        {new Date(card.createdAt).toLocaleDateString('id-ID', { day: 'numeric', month: 'short', year: 'numeric' })}
                                      </div>
                                    </CardContent>
                                  </Card>
                                </div>
                              ))}

                              {columnTickets.map((ticket, index) => (
                                <Draggable key={ticket.id} draggableId={ticket.id} index={index}>
                                  {(provided, snapshot) => (
                                    <div
                                      ref={provided.innerRef}
                                      {...provided.draggableProps}
                                      {...provided.dragHandleProps}
                                      className="mb-3"
                                    >
                                      <Card className={`shadow-sm hover:shadow-md transition-shadow cursor-grab active:cursor-grabbing border-slate-200 ${snapshot.isDragging ? 'shadow-xl ring-2 ring-blue-500/20 rotate-2' : ''}`}>
                                        <CardContent className="p-4 space-y-3">
                                          <div className="flex justify-between items-start">
                                            <span className="text-xs font-mono font-bold text-slate-400">
                                              {ticket.ticketNumber}
                                            </span>
                                            <Badge variant="outline" className={`text-[10px] px-2 uppercase ${getPriorityColor(ticket.priority)}`}>
                                              {ticket.priority}
                                            </Badge>
                                          </div>
                                          
                                          <h4 className="font-bold text-slate-800 text-sm leading-snug line-clamp-2">
                                            {ticket.title}
                                          </h4>
                                          
                                          <div className="flex items-center gap-4 text-xs font-medium text-slate-500 pt-2 border-t border-slate-100">
                                            <div className="flex items-center gap-1" title="Created At">
                                              <Calendar className="w-3.5 h-3.5 text-slate-400" />
                                              {new Date(ticket.createdAt).toLocaleDateString()}
                                            </div>
                                            {ticket.assignedUser && (
                                              <div className="flex items-center gap-1.5 ml-auto bg-slate-100 px-2 py-1 rounded-md" title={ticket.assignedUser.name}>
                                                <div className="w-4 h-4 rounded-full bg-blue-600 text-white flex items-center justify-center text-[8px] font-bold">
                                                  {ticket.assignedUser.name.charAt(0)}
                                                </div>
                                                <span className="truncate max-w-[80px] text-[10px]">{ticket.assignedUser.name.split(' ')[0]}</span>
                                              </div>
                                            )}
                                          </div>
                                        </CardContent>
                                      </Card>
                                    </div>
                                  )}
                                </Draggable>
                              ))}
                              {provided.placeholder}
                            </div>
                          )}
                        </Droppable>
                      </div>
                    );
                  })}
                </div>
              </DragDropContext>
            </div>
          </div>
        </main>
      </div>

      <Dialog open={isApiKeyModalOpen} onOpenChange={setIsApiKeyModalOpen}>
        <DialogContent className="sm:max-w-[425px]">
          <DialogHeader>
            <DialogTitle className="flex items-center gap-2">
              <Key className="w-5 h-5 text-indigo-600" />
              Career Web Integration
            </DialogTitle>
            <DialogDescription>
              Masukkan API Key dari Career Web untuk menghubungkan sistem. Segala perubahan dan aktivitas pelamar akan otomatis tercatat di Kanban ini.
            </DialogDescription>
          </DialogHeader>
          <div className="py-4 space-y-4">
            <div className="space-y-2">
              <Label htmlFor="apiKey">Career API Token</Label>
              <Input
                id="apiKey"
                value={apiKey}
                onChange={(e) => setApiKey(e.target.value)}
                placeholder="Tempel token dari career-rc3id.id/public/admin/api-integration"
                className="font-mono text-sm"
              />
              <p className="text-xs text-slate-500">Salin token dari halaman <strong>API & Integrations</strong> di web Career Anda, bukan URL-nya.</p>
            </div>
            <div className="bg-blue-50 text-blue-800 p-3 rounded-md text-xs">
              <strong>Cara mendapatkan token:</strong><br/>
              1. Buka <strong>career-rc3id.id/public/admin/api-integration</strong><br/>
              2. Salin teks panjang di bagian <strong>"API Token Aktif"</strong><br/>
              3. Tempel di sini dan klik Simpan Koneksi
            </div>
          </div>
          <DialogFooter>
            <Button variant="outline" onClick={() => setIsApiKeyModalOpen(false)}>Batal</Button>
            <Button onClick={handleSaveApiKey} className="bg-indigo-600 hover:bg-indigo-700">Simpan Koneksi</Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
    </div>
  );
}
