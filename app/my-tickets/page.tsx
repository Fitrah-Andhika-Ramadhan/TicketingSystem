'use client';

import { useState, useEffect } from 'react';
import { useRouter } from 'next/navigation';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import Navbar from '@/components/Navbar';
import Sidebar from '@/components/Sidebar';
import { Plus } from 'lucide-react';

interface Ticket {
  id: string;
  ticketNumber: string;
  title: string;
  status: string;
  priority: string;
  createdBy: string;
  createdAt: Date;
}

export default function MyTicketsPage() {
  const router = useRouter();
  const [user, setUser] = useState<any>(null);
  const [tickets, setTickets] = useState<Ticket[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const checkAuth = () => {
      const storedUser = localStorage.getItem('user');
      const token = localStorage.getItem('token');

      if (!token || !storedUser) {
        router.push('/login');
        return;
      }

      setUser(JSON.parse(storedUser));
      fetchMyTickets(token);
    };

    checkAuth();
  }, [router]);

  const fetchMyTickets = async (token: string) => {
    try {
      setLoading(true);
      const response = await fetch('/api/tickets', {
        headers: {
          Authorization: `Bearer ${token}`,
        },
      });

      const data = await response.json();
      if (data.success) {
        // Filter to show only tickets created by current user
        const myTickets = data.data.filter((t: Ticket) => t.createdBy === user?.id);
        setTickets(myTickets);
      }
    } catch (error) {
      console.error('Failed to fetch tickets:', error);
    } finally {
      setLoading(false);
    }
  };

  if (!user) {
    return null;
  }

  return (
    <div className="flex h-screen bg-slate-50">
      <Sidebar user={user} />

      <div className="flex-1 flex flex-col overflow-hidden">
        <Navbar user={user} />

        <main className="flex-1 overflow-auto">
          <div className="p-8 max-w-7xl mx-auto w-full">
            {/* Header */}
            <div className="mb-8 flex justify-between items-start">
              <div>
                <h1 className="text-3xl font-bold text-gray-900">My Support Tickets</h1>
                <p className="text-gray-600 mt-1">Tickets you have created and submitted</p>
              </div>
              <Button 
                className="bg-blue-600 hover:bg-blue-700 flex items-center gap-2"
                onClick={() => router.push('/tickets')}
              >
                <Plus className="w-4 h-4" />
                Submit New Ticket
              </Button>
            </div>

            {/* Tickets Grid */}
            <div className="space-y-4">
              {loading ? (
                <Card>
                  <CardContent className="pt-6 text-center">
                    <p className="text-gray-500">Loading tickets...</p>
                  </CardContent>
                </Card>
              ) : tickets.length === 0 ? (
                <Card>
                  <CardContent className="pt-6">
                    <div className="text-center py-12">
                      <p className="text-gray-500 mb-4">You haven't submitted any tickets yet</p>
                      <Button 
                        className="bg-blue-600 hover:bg-blue-700"
                        onClick={() => router.push('/tickets')}
                      >
                        Submit Your First Ticket
                      </Button>
                    </div>
                  </CardContent>
                </Card>
              ) : (
                tickets.map((ticket) => (
                  <Card key={ticket.id} className="hover:shadow-md transition">
                    <CardContent className="pt-6">
                      <div className="flex items-start justify-between mb-4">
                        <div>
                          <a 
                            href={`/tickets/${ticket.id}`}
                            className="text-lg font-semibold text-blue-600 hover:underline"
                          >
                            {ticket.ticketNumber}
                          </a>
                          <p className="text-gray-900 mt-1">{ticket.title}</p>
                        </div>
                        <div className="flex gap-2">
                          <span className={`px-3 py-1 rounded-full text-xs font-medium ${
                            ticket.priority === 'CRITICAL' ? 'bg-red-100 text-red-800' :
                            ticket.priority === 'HIGH' ? 'bg-orange-100 text-orange-800' :
                            ticket.priority === 'MEDIUM' ? 'bg-blue-100 text-blue-800' :
                            'bg-green-100 text-green-800'
                          }`}>
                            {ticket.priority}
                          </span>
                          <span className={`px-3 py-1 rounded-full text-xs font-medium ${
                            ticket.status === 'OPEN' ? 'bg-yellow-100 text-yellow-800' :
                            ticket.status === 'IN_PROGRESS' ? 'bg-blue-100 text-blue-800' :
                            ticket.status === 'RESOLVED' ? 'bg-green-100 text-green-800' :
                            'bg-gray-100 text-gray-800'
                          }`}>
                            {ticket.status}
                          </span>
                        </div>
                      </div>

                      <div className="flex items-center justify-between pt-4 border-t">
                        <p className="text-sm text-gray-600">
                          Created {new Date(ticket.createdAt).toLocaleDateString()}
                        </p>
                        <Button
                          variant="outline"
                          size="sm"
                          onClick={() => router.push(`/tickets/${ticket.id}`)}
                        >
                          View Details
                        </Button>
                      </div>
                    </CardContent>
                  </Card>
                ))
              )}
            </div>

            {/* Stats */}
            {tickets.length > 0 && (
              <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mt-8">
                <Card>
                  <CardHeader className="pb-3">
                    <CardTitle className="text-sm">Total Submitted</CardTitle>
                  </CardHeader>
                  <CardContent>
                    <p className="text-2xl font-bold text-blue-600">{tickets.length}</p>
                  </CardContent>
                </Card>

                <Card>
                  <CardHeader className="pb-3">
                    <CardTitle className="text-sm">Resolved</CardTitle>
                  </CardHeader>
                  <CardContent>
                    <p className="text-2xl font-bold text-green-600">
                      {tickets.filter(t => t.status === 'RESOLVED').length}
                    </p>
                  </CardContent>
                </Card>

                <Card>
                  <CardHeader className="pb-3">
                    <CardTitle className="text-sm">Pending</CardTitle>
                  </CardHeader>
                  <CardContent>
                    <p className="text-2xl font-bold text-yellow-600">
                      {tickets.filter(t => t.status !== 'RESOLVED' && t.status !== 'CLOSED').length}
                    </p>
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
