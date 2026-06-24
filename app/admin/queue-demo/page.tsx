'use client';

import { useState, useEffect } from 'react';
import { useRouter } from 'next/navigation';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import Navbar from '@/components/Navbar';
import Sidebar from '@/components/Sidebar';
import { Filter, Download } from 'lucide-react';
import { useRealtime } from '@/hooks/useRealtime';

interface Ticket {
  id: string;
  ticketNumber: string;
  title: string;
  category: string;
  priority: string;
  status: string;
  createdByName: string;
  assignedTo: string | null;
  assignedName: string | null;
  createdAt: Date;
}

export default function AdminQueuePage() {
  const router = useRouter();
  const [user, setUser] = useState<any>(null);
  const [tickets, setTickets] = useState<Ticket[]>([]);
  const [loading, setLoading] = useState(true);
  const [filterStatus, setFilterStatus] = useState('');
  const [filterPriority, setFilterPriority] = useState('');
  const [selectedTicket, setSelectedTicket] = useState<Ticket | null>(null);
  const [showAssignModal, setShowAssignModal] = useState(false);
  const [newAssignee, setNewAssignee] = useState('');
  const [newStatus, setNewStatus] = useState('');

  const agents = [
    { id: '1', name: 'Admin User' },
    { id: '2', name: 'Support Agent 1' },
    { id: '3', name: 'Support Agent 2' },
  ];

  useEffect(() => {
    const checkAuth = () => {
      const storedUser = localStorage.getItem('user');
      const token = localStorage.getItem('token');

      if (!token || !storedUser) {
        router.push('/demo-login');
        return;
      }

      const parsedUser = JSON.parse(storedUser);
      if (parsedUser.role !== 'SUPER_ADMIN' && parsedUser.role !== 'ADMIN') {
        router.push('/dashboard-demo');
        return;
      }

      setUser(parsedUser);
      fetchTickets(token);
    };

    checkAuth();
  }, [router]);

  const fetchTickets = async (token: string) => {
    try {
      setLoading(true);
      let url = '/api/tickets';
      const params = new URLSearchParams();

      if (filterStatus) params.append('status', filterStatus);
      if (filterPriority) params.append('priority', filterPriority);

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
        setTickets(data.data);
      }
    } catch (error) {
      console.error('Failed to fetch tickets:', error);
    } finally {
      setLoading(false);
    }
  };

  useRealtime('Ticket', () => {
    const token = localStorage.getItem('token');
    if (token) {
      fetchTickets(token);
    }
  });

  const handleAssignTicket = async () => {
    if (!selectedTicket || !newAssignee) return;

    try {
      const token = localStorage.getItem('token');
      const response = await fetch(`/api/tickets/${selectedTicket.id}`, {
        method: 'PATCH',
        headers: {
          Authorization: `Bearer ${token}`,
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          assignedTo: newAssignee,
          status: newStatus || selectedTicket.status,
        }),
      });

      if (response.ok) {
        const data = await response.json();
        // Update ticket in list
        setTickets(tickets.map(t => t.id === selectedTicket.id ? data.data : t));
        setShowAssignModal(false);
        setNewAssignee('');
        setNewStatus('');
        setSelectedTicket(null);
      }
    } catch (error) {
      console.error('Failed to assign ticket:', error);
    }
  };

  const handleQuickStatusUpdate = async (ticket: Ticket, newStatus: string) => {
    try {
      const token = localStorage.getItem('token');
      const response = await fetch(`/api/tickets/${ticket.id}`, {
        method: 'PATCH',
        headers: {
          Authorization: `Bearer ${token}`,
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          status: newStatus,
        }),
      });

      if (response.ok) {
        const data = await response.json();
        setTickets(tickets.map(t => t.id === ticket.id ? data.data : t));
      }
    } catch (error) {
      console.error('Failed to update status:', error);
    }
  };

  if (!user) {
    return null;
  }

  const unassignedCount = tickets.filter(t => !t.assignedTo).length;
  const inProgressCount = tickets.filter(t => t.status === 'IN_PROGRESS').length;
  const criticalCount = tickets.filter(t => t.priority === 'CRITICAL').length;

  return (
    <div className="flex h-screen bg-slate-50">
      <Sidebar user={user} />

      <div className="flex-1 flex flex-col overflow-hidden">
        <Navbar user={user} />

        <main className="flex-1 overflow-auto">
          <div className="p-8 max-w-7xl mx-auto w-full">
            {/* Header */}
            <div className="mb-8">
              <h1 className="text-3xl font-bold text-gray-900">Ticket Queue Management</h1>
              <p className="text-gray-600 mt-1">Assign and manage support tickets</p>
            </div>

            {/* Quick Stats */}
            <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mb-8">
              <Card>
                <CardContent className="pt-6">
                  <p className="text-sm text-gray-600 mb-2">Unassigned Tickets</p>
                  <p className="text-3xl font-bold text-red-600">{unassignedCount}</p>
                </CardContent>
              </Card>

              <Card>
                <CardContent className="pt-6">
                  <p className="text-sm text-gray-600 mb-2">In Progress</p>
                  <p className="text-3xl font-bold text-blue-600">{inProgressCount}</p>
                </CardContent>
              </Card>

              <Card>
                <CardContent className="pt-6">
                  <p className="text-sm text-gray-600 mb-2">Critical Priority</p>
                  <p className="text-3xl font-bold text-orange-600">{criticalCount}</p>
                </CardContent>
              </Card>
            </div>

            {/* Filters */}
            <Card className="mb-6">
              <CardContent className="pt-6">
                <div className="flex flex-wrap gap-4 items-end">
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-2">
                      Filter by Status
                    </label>
                    <select
                      value={filterStatus}
                      onChange={(e) => {
                        setFilterStatus(e.target.value);
                        const token = localStorage.getItem('token');
                        if (token) {
                          // Re-fetch with new filter
                          let url = '/api/tickets';
                          const params = new URLSearchParams();
                          if (e.target.value) params.append('status', e.target.value);
                          if (filterPriority) params.append('priority', filterPriority);
                          if (params.toString()) {
                            url += '?' + params.toString();
                          }
                          fetchTickets(token);
                        }
                      }}
                      className="px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
                    >
                      <option value="">All Status</option>
                      <option value="OPEN">Open</option>
                      <option value="IN_PROGRESS">In Progress</option>
                      <option value="RESOLVED">Resolved</option>
                      <option value="CLOSED">Closed</option>
                    </select>
                  </div>

                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-2">
                      Filter by Priority
                    </label>
                    <select
                      value={filterPriority}
                      onChange={(e) => {
                        setFilterPriority(e.target.value);
                        const token = localStorage.getItem('token');
                        if (token) {
                          let url = '/api/tickets';
                          const params = new URLSearchParams();
                          if (filterStatus) params.append('status', filterStatus);
                          if (e.target.value) params.append('priority', e.target.value);
                          if (params.toString()) {
                            url += '?' + params.toString();
                          }
                          fetchTickets(token);
                        }
                      }}
                      className="px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
                    >
                      <option value="">All Priority</option>
                      <option value="LOW">Low</option>
                      <option value="MEDIUM">Medium</option>
                      <option value="HIGH">High</option>
                      <option value="CRITICAL">Critical</option>
                    </select>
                  </div>

                  <Button 
                    variant="outline"
                    className="flex items-center gap-2"
                    onClick={() => {
                      setFilterStatus('');
                      setFilterPriority('');
                      const token = localStorage.getItem('token');
                      if (token) fetchTickets(token);
                    }}
                  >
                    <Filter className="w-4 h-4" />
                    Reset
                  </Button>

                  <Button variant="outline" className="ml-auto flex items-center gap-2">
                    <Download className="w-4 h-4" />
                    Export
                  </Button>
                </div>
              </CardContent>
            </Card>

            {/* Tickets Table */}
            <Card>
              <CardContent className="pt-6">
                {loading ? (
                  <div className="text-center py-8">
                    <p className="text-gray-500">Loading tickets...</p>
                  </div>
                ) : tickets.length === 0 ? (
                  <div className="text-center py-8">
                    <p className="text-gray-500">No tickets found</p>
                  </div>
                ) : (
                  <div className="overflow-x-auto">
                    <table className="w-full">
                      <thead>
                        <tr className="border-b">
                          <th className="text-left py-3 px-4 font-semibold text-gray-700">Ticket</th>
                          <th className="text-left py-3 px-4 font-semibold text-gray-700">Title</th>
                          <th className="text-left py-3 px-4 font-semibold text-gray-700">Category</th>
                          <th className="text-left py-3 px-4 font-semibold text-gray-700">Priority</th>
                          <th className="text-left py-3 px-4 font-semibold text-gray-700">Status</th>
                          <th className="text-left py-3 px-4 font-semibold text-gray-700">Assigned To</th>
                          <th className="text-center py-3 px-4 font-semibold text-gray-700">Actions</th>
                        </tr>
                      </thead>
                      <tbody>
                        {tickets.map((ticket) => (
                          <tr key={ticket.id} className="border-b hover:bg-gray-50">
                            <td className="py-3 px-4">
                              <a 
                                href={`/tickets-demo/${ticket.id}`}
                                className="text-blue-600 hover:underline font-semibold"
                              >
                                {ticket.ticketNumber}
                              </a>
                            </td>
                            <td className="py-3 px-4">{ticket.title}</td>
                            <td className="py-3 px-4">{ticket.category}</td>
                            <td className={`py-3 px-4 font-semibold ${
                              ticket.priority === 'CRITICAL' ? 'text-red-600' :
                              ticket.priority === 'HIGH' ? 'text-orange-600' :
                              ticket.priority === 'MEDIUM' ? 'text-blue-600' :
                              'text-green-600'
                            }`}>
                              {ticket.priority}
                            </td>
                            <td className="py-3 px-4">
                              <select
                                value={ticket.status}
                                onChange={(e) => handleQuickStatusUpdate(ticket, e.target.value)}
                                className="px-2 py-1 border border-gray-300 rounded text-sm focus:outline-none focus:ring-2 focus:ring-blue-500"
                              >
                                <option value="OPEN">Open</option>
                                <option value="IN_PROGRESS">In Progress</option>
                                <option value="RESOLVED">Resolved</option>
                                <option value="CLOSED">Closed</option>
                              </select>
                            </td>
                            <td className="py-3 px-4">{ticket.assignedName || 'Unassigned'}</td>
                            <td className="py-3 px-4 text-center space-x-2">
                              <Button
                                size="sm"
                                variant="outline"
                                onClick={() => {
                                  setSelectedTicket(ticket);
                                  setNewAssignee(ticket.assignedTo || '');
                                  setShowAssignModal(true);
                                }}
                              >
                                Assign
                              </Button>
                              <Button
                                size="sm"
                                variant="ghost"
                                onClick={() => router.push(`/tickets-demo/${ticket.id}`)}
                              >
                                View
                              </Button>
                            </td>
                          </tr>
                        ))}
                      </tbody>
                    </table>
                  </div>
                )}
              </CardContent>
            </Card>

            {/* Assign Modal */}
            {showAssignModal && selectedTicket && (
              <div className="fixed inset-0 bg-slate-900/60 backdrop-blur-sm flex items-center justify-center z-50 p-4 animate-in fade-in duration-200">
                <Card className="w-full max-w-md shadow-2xl border-slate-200 rounded-2xl overflow-hidden animate-in zoom-in-95 duration-200">
                  <div className="bg-gradient-to-r from-indigo-500 to-violet-600 h-2 w-full"></div>
                  <CardHeader className="pb-4 border-b border-slate-100 bg-slate-50/50">
                    <CardTitle className="text-xl font-bold text-slate-800 flex items-center gap-2">
                      <div className="p-2 bg-indigo-100 rounded-lg text-indigo-600">
                        <svg xmlns="http://www.w3.org/2000/svg" width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round"><path d="M16 21v-2a4 4 0 0 0-4-4H6a4 4 0 0 0-4 4v2"/><circle cx="9" cy="7" r="4"/><line x1="19" x2="19" y1="8" y2="14"/><line x1="22" x2="16" y1="11" y2="11"/></svg>
                      </div>
                      Assign Ticket
                    </CardTitle>
                  </CardHeader>
                  <CardContent className="p-6 space-y-6 bg-white">
                    <div className="bg-slate-50 p-4 rounded-xl border border-slate-100">
                      <p className="text-xs font-bold text-slate-500 uppercase tracking-wider mb-1">Selected Ticket</p>
                      <p className="text-sm font-semibold text-slate-900">{selectedTicket.ticketNumber} <span className="text-slate-400 font-normal mx-1">•</span> {selectedTicket.title}</p>
                    </div>

                    <div className="space-y-4">
                      <div>
                        <label className="block text-sm font-bold text-slate-700 mb-2">
                          Assign To
                        </label>
                        <select
                          value={newAssignee}
                          onChange={(e) => setNewAssignee(e.target.value)}
                          className="w-full px-4 py-3 bg-slate-50 border border-slate-200 rounded-xl text-sm font-medium text-slate-700 focus:outline-none focus:ring-2 focus:ring-indigo-500/50 focus:border-indigo-500 transition-all cursor-pointer appearance-none"
                          style={{ backgroundImage: 'url("data:image/svg+xml,%3csvg xmlns=\'http://www.w3.org/2000/svg\' fill=\'none\' viewBox=\'0 0 20 20\'%3e%3cpath stroke=\'%236b7280\' stroke-linecap=\'round\' stroke-linejoin=\'round\' stroke-width=\'1.5\' d=\'M6 8l4 4 4-4\'/%3e%3c/svg%3e")', backgroundPosition: 'right 0.5rem center', backgroundRepeat: 'no-repeat', backgroundSize: '1.5em 1.5em', paddingRight: '2.5rem' }}
                        >
                          <option value="">Select Agent</option>
                          {agents.map((agent) => (
                            <option key={agent.id} value={agent.id}>
                              {agent.name}
                            </option>
                          ))}
                        </select>
                      </div>

                      <div>
                        <label className="block text-sm font-bold text-slate-700 mb-2">
                          Update Status <span className="text-slate-400 font-normal text-xs ml-1">(Optional)</span>
                        </label>
                        <select
                          value={newStatus}
                          onChange={(e) => setNewStatus(e.target.value)}
                          className="w-full px-4 py-3 bg-slate-50 border border-slate-200 rounded-xl text-sm font-medium text-slate-700 focus:outline-none focus:ring-2 focus:ring-indigo-500/50 focus:border-indigo-500 transition-all cursor-pointer appearance-none"
                          style={{ backgroundImage: 'url("data:image/svg+xml,%3csvg xmlns=\'http://www.w3.org/2000/svg\' fill=\'none\' viewBox=\'0 0 20 20\'%3e%3cpath stroke=\'%236b7280\' stroke-linecap=\'round\' stroke-linejoin=\'round\' stroke-width=\'1.5\' d=\'M6 8l4 4 4-4\'/%3e%3c/svg%3e")', backgroundPosition: 'right 0.5rem center', backgroundRepeat: 'no-repeat', backgroundSize: '1.5em 1.5em', paddingRight: '2.5rem' }}
                        >
                          <option value="">Keep Current Status</option>
                          <option value="OPEN">Open</option>
                          <option value="IN_PROGRESS">In Progress</option>
                          <option value="RESOLVED">Resolved</option>
                          <option value="CLOSED">Closed</option>
                        </select>
                      </div>
                    </div>

                    <div className="flex gap-3 pt-2">
                      <Button
                        variant="outline"
                        className="flex-1 py-6 border-slate-200 text-slate-600 hover:bg-slate-50 hover:text-slate-900 font-semibold rounded-xl"
                        onClick={() => {
                          setShowAssignModal(false);
                          setSelectedTicket(null);
                          setNewAssignee('');
                          setNewStatus('');
                        }}
                      >
                        Cancel
                      </Button>
                      <Button
                        className="flex-1 py-6 bg-indigo-600 hover:bg-indigo-700 text-white font-semibold rounded-xl shadow-md shadow-indigo-200 transition-all"
                        onClick={handleAssignTicket}
                        disabled={!newAssignee}
                      >
                        Confirm Assignment
                      </Button>
                    </div>
                  </CardContent>
                </Card>
              </div>
            )}
          </div>
        </main>
      </div>
    </div>
  );
}
