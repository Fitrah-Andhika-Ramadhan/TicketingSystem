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

  useEffect(() => {
    const savedKey = localStorage.getItem('career_api_key');
    if (savedKey) setApiKey(savedKey);
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

  const handleSaveApiKey = () => {
    localStorage.setItem('career_api_key', apiKey);
    swal.fire({
      icon: 'success',
      title: 'Terhubung!',
      text: 'API Key Career Web berhasil disimpan. Sekarang semua perubahan di web karir akan ter-tracking otomatis di Kanban ini.',
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
              <Button 
                onClick={() => setIsApiKeyModalOpen(true)}
                className="bg-indigo-600 hover:bg-indigo-700 shadow-sm"
              >
                <Webhook className="w-4 h-4 mr-2" />
                Integration Settings
              </Button>
            </div>

            <div className="flex-1 overflow-x-auto pb-4">
              <DragDropContext onDragEnd={onDragEnd}>
                <div className="flex gap-6 h-full min-w-max">
                  {columns.map(column => {
                    const columnTickets = tickets.filter(t => t.status === column.id);
                    
                    return (
                      <div key={column.id} className="w-80 flex flex-col bg-slate-100/50 rounded-xl border border-slate-200">
                        <div className="p-4 border-b border-slate-200 bg-slate-100 rounded-t-xl flex justify-between items-center">
                          <h3 className="font-bold text-slate-700">{column.title}</h3>
                          <span className="bg-white text-slate-500 text-xs font-bold px-2 py-1 rounded-full shadow-sm">
                            {columnTickets.length}
                          </span>
                        </div>
                        
                        <Droppable droppableId={column.id}>
                          {(provided, snapshot) => (
                            <div 
                              ref={provided.innerRef}
                              {...provided.droppableProps}
                              className={`flex-1 p-3 overflow-y-auto min-h-[150px] transition-colors ${snapshot.isDraggingOver ? 'bg-blue-50/50' : ''}`}
                            >
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
              <Label htmlFor="apiKey">Career API Key</Label>
              <Input
                id="apiKey"
                value={apiKey}
                onChange={(e) => setApiKey(e.target.value)}
                placeholder="sk_career_..."
                className="font-mono text-sm"
              />
            </div>
            <div className="bg-blue-50 text-blue-800 p-3 rounded-md text-xs">
              <strong>Info:</strong> Setelah terhubung, webhook dari Career Web akan otomatis membuat atau memperbarui status tracking di Kanban Board ini.
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
