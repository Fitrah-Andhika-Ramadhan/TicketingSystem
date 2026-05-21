'use client';

import { useEffect, useState } from 'react';
import { useRouter } from 'next/navigation';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import Navbar from '@/components/Navbar';
import Sidebar from '@/components/Sidebar';
import { BarChart, Bar, LineChart, Line, XAxis, YAxis, CartesianGrid, Tooltip, Legend, ResponsiveContainer, PieChart, Pie, Cell } from 'recharts';
import { AlertCircle, Clock, CheckCircle2, TrendingUp, Users } from 'lucide-react';
import UserDashboard from '@/components/UserDashboard';

interface Ticket {
  id: string;
  ticketNumber: string;
  title: string;
  category: string;
  status: string;
  priority: string;
  createdAt: Date;
}

export default function DashboardPage() {
  const router = useRouter();
  const [user, setUser] = useState<any>(null);
  const [tickets, setTickets] = useState<Ticket[]>([]);
  const [loading, setLoading] = useState(true);

  const priorityDistribution = [
    { name: 'Critical', value: tickets.filter(t => t.priority === 'CRITICAL').length, color: '#dc2626' },
    { name: 'High', value: tickets.filter(t => t.priority === 'HIGH').length, color: '#f97316' },
    { name: 'Medium', value: tickets.filter(t => t.priority === 'MEDIUM').length, color: '#3b82f6' },
    { name: 'Low', value: tickets.filter(t => t.priority === 'LOW').length, color: '#10b981' },
  ].filter(item => item.value > 0);

  const categoryDistributionMap = tickets.reduce((acc, ticket) => {
    acc[ticket.category] = (acc[ticket.category] || 0) + 1;
    return acc;
  }, {} as Record<string, number>);

  const categoryColors: Record<string, string> = {
    BUG: '#ef4444',
    FEATURE_REQUEST: '#3b82f6',
    MAINTENANCE: '#f59e0b',
    ACCESS_ISSUE: '#8b5cf6',
    OTHER: '#10b981'
  };

  const categoryDistribution = Object.keys(categoryDistributionMap).map(key => ({
    name: key,
    value: categoryDistributionMap[key],
    color: categoryColors[key] || '#64748b'
  }));

  const ticketsOverTime = [];
  for (let i = 6; i >= 0; i--) {
    const d = new Date();
    d.setDate(d.getDate() - i);
    const dateStr = d.toLocaleDateString('en-US', { weekday: 'short' });
    
    const createdOnDate = tickets.filter(t => {
      const tDate = new Date(t.createdAt);
      return tDate.getDate() === d.getDate() && tDate.getMonth() === d.getMonth() && tDate.getFullYear() === d.getFullYear();
    }).length;
    
    const resolvedOnDate = tickets.filter(t => {
      const tDate = new Date(t.createdAt);
      return (t.status === 'RESOLVED' || t.status === 'CLOSED') && tDate.getDate() === d.getDate() && tDate.getMonth() === d.getMonth();
    }).length;

    ticketsOverTime.push({
      date: dateStr,
      tickets: createdOnDate,
      resolved: resolvedOnDate
    });
  }

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

  if (!user) {
    return null;
  }

  const totalTickets = tickets.length;
  const openTickets = tickets.filter(t => t.status === 'OPEN').length;
  const inProgressTickets = tickets.filter(t => t.status === 'IN_PROGRESS').length;
  const resolvedTickets = tickets.filter(t => t.status === 'RESOLVED').length;
  const criticalTickets = tickets.filter(t => t.priority === 'CRITICAL').length;

  return (
    <div className="flex h-screen bg-slate-50">
      <Sidebar user={user} />

      <div className="flex-1 flex flex-col overflow-hidden">
        <Navbar user={user} />

        <main className="flex-1 overflow-auto">
          <div className="p-8 max-w-7xl mx-auto w-full">
            {user.role === 'USER' ? (
              <UserDashboard user={user} tickets={tickets} />
            ) : (
              <>
                {/* Header */}
                <div className="mb-8">
                  <h1 className="text-3xl font-bold text-gray-900">Ticketing System Dashboard</h1>
                  <p className="text-gray-600 mt-2">Welcome back, {user.name}. Here's your ticket overview.</p>
                </div>

                {/* KPI Cards */}
                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-5 gap-4 mb-8">
              <Card className="bg-gradient-to-br from-blue-50 to-blue-100 border-blue-200">
                <CardContent className="pt-6">
                  <div className="flex items-start justify-between">
                    <div>
                      <p className="text-sm text-gray-600 font-medium">Total Tickets</p>
                      <p className="text-3xl font-bold text-blue-900 mt-2">{totalTickets}</p>
                    </div>
                    <TrendingUp className="w-8 h-8 text-blue-400 opacity-20" />
                  </div>
                </CardContent>
              </Card>

              <Card className="bg-gradient-to-br from-yellow-50 to-yellow-100 border-yellow-200">
                <CardContent className="pt-6">
                  <div className="flex items-start justify-between">
                    <div>
                      <p className="text-sm text-gray-600 font-medium">Open Tickets</p>
                      <p className="text-3xl font-bold text-yellow-900 mt-2">{openTickets}</p>
                    </div>
                    <AlertCircle className="w-8 h-8 text-yellow-400 opacity-20" />
                  </div>
                </CardContent>
              </Card>

              <Card className="bg-gradient-to-br from-purple-50 to-purple-100 border-purple-200">
                <CardContent className="pt-6">
                  <div className="flex items-start justify-between">
                    <div>
                      <p className="text-sm text-gray-600 font-medium">In Progress</p>
                      <p className="text-3xl font-bold text-purple-900 mt-2">{inProgressTickets}</p>
                    </div>
                    <Clock className="w-8 h-8 text-purple-400 opacity-20" />
                  </div>
                </CardContent>
              </Card>

              <Card className="bg-gradient-to-br from-green-50 to-green-100 border-green-200">
                <CardContent className="pt-6">
                  <div className="flex items-start justify-between">
                    <div>
                      <p className="text-sm text-gray-600 font-medium">Resolved</p>
                      <p className="text-3xl font-bold text-green-900 mt-2">{resolvedTickets}</p>
                    </div>
                    <CheckCircle2 className="w-8 h-8 text-green-400 opacity-20" />
                  </div>
                </CardContent>
              </Card>

              <Card className="bg-gradient-to-br from-red-50 to-red-100 border-red-200">
                <CardContent className="pt-6">
                  <div className="flex items-start justify-between">
                    <div>
                      <p className="text-sm text-gray-600 font-medium">Critical</p>
                      <p className="text-3xl font-bold text-red-900 mt-2">{criticalTickets}</p>
                    </div>
                    <AlertCircle className="w-8 h-8 text-red-400 opacity-20" />
                  </div>
                </CardContent>
              </Card>
            </div>

            {/* Charts */}
            <div className="grid grid-cols-1 lg:grid-cols-2 gap-8 mb-8">
              {/* Tickets Over Time */}
              <Card>
                <CardHeader>
                  <CardTitle>Tickets Over Time</CardTitle>
                  <CardDescription>Last 7 days activity</CardDescription>
                </CardHeader>
                <CardContent>
                  <ResponsiveContainer width="100%" height={300}>
                    <LineChart data={ticketsOverTime}>
                      <CartesianGrid strokeDasharray="3 3" />
                      <XAxis dataKey="date" />
                      <YAxis />
                      <Tooltip />
                      <Legend />
                      <Line type="monotone" dataKey="tickets" stroke="#3b82f6" strokeWidth={2} />
                      <Line type="monotone" dataKey="resolved" stroke="#10b981" strokeWidth={2} />
                    </LineChart>
                  </ResponsiveContainer>
                </CardContent>
              </Card>

              {/* Priority Distribution */}
              <Card>
                <CardHeader>
                  <CardTitle>Priority Distribution</CardTitle>
                  <CardDescription>Current ticket priorities</CardDescription>
                </CardHeader>
                <CardContent>
                  <ResponsiveContainer width="100%" height={300}>
                    <PieChart>
                      <Pie
                        data={priorityDistribution}
                        cx="50%"
                        cy="50%"
                        labelLine={false}
                        label={({ name, value }) => `${name}: ${value}`}
                        outerRadius={100}
                        fill="#8884d8"
                        dataKey="value"
                      >
                        {priorityDistribution.map((entry, index) => (
                          <Cell key={`cell-${index}`} fill={entry.color} />
                        ))}
                      </Pie>
                      <Tooltip />
                    </PieChart>
                  </ResponsiveContainer>
                </CardContent>
              </Card>
            </div>

            {/* Category Distribution */}
            <Card className="mb-8">
              <CardHeader>
                <CardTitle>Tickets by Category</CardTitle>
                <CardDescription>Distribution of ticket types</CardDescription>
              </CardHeader>
              <CardContent>
                <ResponsiveContainer width="100%" height={300}>
                  <BarChart data={categoryDistribution}>
                    <CartesianGrid strokeDasharray="3 3" />
                    <XAxis dataKey="name" />
                    <YAxis />
                    <Tooltip />
                    <Bar dataKey="value" fill="#3b82f6" />
                  </BarChart>
                </ResponsiveContainer>
              </CardContent>
            </Card>

            {/* Recent Tickets */}
            <Card>
              <CardHeader>
                <CardTitle>Recent Tickets</CardTitle>
                <CardDescription>Your latest support tickets</CardDescription>
              </CardHeader>
              <CardContent>
                {tickets.length === 0 ? (
                  <p className="text-gray-500 text-center py-8">No tickets found</p>
                ) : (
                  <div className="space-y-3">
                    {tickets.slice(0, 5).map((ticket) => (
                      <div
                        key={ticket.id}
                        className="flex items-center justify-between p-4 bg-gray-50 rounded-lg hover:bg-gray-100 transition"
                      >
                        <div className="flex-1">
                          <p className="font-semibold text-gray-900">{ticket.ticketNumber}</p>
                          <p className="text-sm text-gray-600">{ticket.title}</p>
                        </div>
                        <div className="flex items-center gap-4">
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
                          <Button
                            variant="ghost"
                            size="sm"
                            onClick={() => router.push(`/tickets/${ticket.id}`)}
                          >
                            View
                          </Button>
                        </div>
                      </div>
                    ))}
                  </div>
                )}
              </CardContent>
            </Card>
            </>
            )}
          </div>
        </main>
      </div>
    </div>
  );
}
