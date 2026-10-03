'use client';

import { useEffect, useState } from 'react';
import { useRouter } from 'next/navigation';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { LineChart, Line, BarChart, Bar, PieChart, Pie, Cell, XAxis, YAxis, CartesianGrid, Tooltip, Legend, ResponsiveContainer } from 'recharts';
import Sidebar from '@/components/Sidebar';
import Navbar from '@/components/Navbar';

export default function AnalyticsPage() {
  const router = useRouter();
  const [user, setUser] = useState<any>(null);
  const [metrics, setMetrics] = useState<any>(null);
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
      fetchAnalytics(token);
    };
    checkAuth();
  }, [router]);

  const fetchAnalytics = async (token: string) => {
    try {
      setLoading(true);
      const response = await fetch('/api/analytics', {
        headers: { Authorization: `Bearer ${token}` }
      });
      const data = await response.json();
      if (data.success) {
        setMetrics(data.data);
      }
    } catch (error) {
      console.error('Failed to fetch analytics:', error);
    } finally {
      setLoading(false);
    }
  };

  if (!user || loading || !metrics) {
    return <div className="min-h-screen bg-slate-50 flex items-center justify-center">Loading Real-Time Analytics...</div>;
  }

  // Pre-process Data for Charts
  const statusData = [
    { name: 'Open', value: metrics.tickets.filter((t: any) => t.status === 'OPEN').length },
    { name: 'In Progress', value: metrics.tickets.filter((t: any) => t.status === 'IN_PROGRESS' || t.status === 'IN_REVIEW').length },
    { name: 'Resolved/Closed', value: metrics.tickets.filter((t: any) => t.status === 'RESOLVED' || t.status === 'CLOSED').length },
  ];

  const priorityData = [
    { name: 'Low', count: metrics.tickets.filter((t: any) => t.priority === 'LOW').length },
    { name: 'Medium', count: metrics.tickets.filter((t: any) => t.priority === 'MEDIUM').length },
    { name: 'High', count: metrics.tickets.filter((t: any) => t.priority === 'HIGH').length },
    { name: 'Critical', count: metrics.tickets.filter((t: any) => t.priority === 'CRITICAL').length },
  ];

  const STATUS_COLORS = ['#3b82f6', '#f59e0b', '#10b981'];

  return (
    <div className="flex h-screen bg-slate-50">
      <Sidebar user={user} />
      
      <div className="flex-1 flex flex-col overflow-hidden">
        <Navbar user={user} />
        
        <main className="flex-1 overflow-auto">
          <div className="p-8 max-w-7xl mx-auto">
            <div className="mb-8">
              <h1 className="text-3xl font-bold text-gray-900">Real-Time Analytics</h1>
              <p className="text-gray-600 mt-1">Live tracking of your ticketing system performance.</p>
            </div>

            {/* KPI Cards */}
            <div className="grid grid-cols-1 md:grid-cols-4 gap-4 mb-8">
              <Card>
                <CardHeader className="pb-2">
                  <CardTitle className="text-sm font-medium text-gray-600">Total Tickets</CardTitle>
                </CardHeader>
                <CardContent>
                  <div className="text-3xl font-bold text-blue-600">{metrics.totalTickets}</div>
                  <p className="text-xs text-gray-500 mt-1">All time</p>
                </CardContent>
              </Card>

              <Card>
                <CardHeader className="pb-2">
                  <CardTitle className="text-sm font-medium text-gray-600">Active Pipeline</CardTitle>
                </CardHeader>
                <CardContent>
                  <div className="text-3xl font-bold text-orange-600">{metrics.openTickets}</div>
                  <p className="text-xs text-gray-500 mt-1">Open/In Progress</p>
                </CardContent>
              </Card>

              <Card>
                <CardHeader className="pb-2">
                  <CardTitle className="text-sm font-medium text-gray-600">Resolved</CardTitle>
                </CardHeader>
                <CardContent>
                  <div className="text-3xl font-bold text-green-600">{metrics.closedTickets}</div>
                  <p className="text-xs text-gray-500 mt-1">Closed/Resolved</p>
                </CardContent>
              </Card>

              <Card>
                <CardHeader className="pb-2">
                  <CardTitle className="text-sm font-medium text-gray-600">Critical Issues</CardTitle>
                </CardHeader>
                <CardContent>
                  <div className="text-3xl font-bold text-red-600">{metrics.criticalTickets}</div>
                  <p className="text-xs text-gray-500 mt-1">Requires immediate attention</p>
                </CardContent>
              </Card>
            </div>

            {/* Charts */}
            <div className="grid grid-cols-1 lg:grid-cols-2 gap-8 mb-8">
              {/* Trend Chart */}
              <Card className="lg:col-span-2">
                <CardHeader>
                  <CardTitle>Ticket Creation Trend (Last 30 Days)</CardTitle>
                  <CardDescription>Compare newly created vs resolved tickets</CardDescription>
                </CardHeader>
                <CardContent>
                  <ResponsiveContainer width="100%" height={300}>
                    <LineChart data={metrics.trendData}>
                      <CartesianGrid strokeDasharray="3 3" />
                      <XAxis dataKey="date" stroke="#9ca3af" tick={{ fontSize: 12 }} />
                      <YAxis stroke="#9ca3af" />
                      <Tooltip />
                      <Legend />
                      <Line type="monotone" dataKey="created" stroke="#3b82f6" name="Tickets Created" strokeWidth={2} />
                      <Line type="monotone" dataKey="resolved" stroke="#10b981" name="Tickets Resolved" strokeWidth={2} />
                    </LineChart>
                  </ResponsiveContainer>
                </CardContent>
              </Card>

              {/* Status Pie */}
              <Card>
                <CardHeader>
                  <CardTitle>Status Distribution</CardTitle>
                  <CardDescription>Overall ticket pipeline breakdown</CardDescription>
                </CardHeader>
                <CardContent className="flex items-center justify-center">
                  <ResponsiveContainer width="100%" height={300}>
                    <PieChart>
                      <Pie
                        data={statusData}
                        cx="50%"
                        cy="50%"
                        innerRadius={60}
                        outerRadius={100}
                        fill="#8884d8"
                        paddingAngle={5}
                        dataKey="value"
                        label
                      >
                        {statusData.map((entry, index) => (
                          <Cell key={`cell-${index}`} fill={STATUS_COLORS[index % STATUS_COLORS.length]} />
                        ))}
                      </Pie>
                      <Tooltip />
                      <Legend />
                    </PieChart>
                  </ResponsiveContainer>
                </CardContent>
              </Card>
              
              {/* Priority Bar Chart */}
              <Card>
                <CardHeader>
                  <CardTitle>Ticket Priorities</CardTitle>
                  <CardDescription>Volume of tickets by urgency</CardDescription>
                </CardHeader>
                <CardContent>
                  <ResponsiveContainer width="100%" height={300}>
                    <BarChart data={priorityData}>
                      <CartesianGrid strokeDasharray="3 3" />
                      <XAxis dataKey="name" stroke="#9ca3af" />
                      <YAxis stroke="#9ca3af" />
                      <Tooltip />
                      <Bar dataKey="count" fill="#6366f1" radius={[4, 4, 0, 0]}>
                        {
                          priorityData.map((entry, index) => {
                            const colors = ['#94a3b8', '#3b82f6', '#f59e0b', '#ef4444'];
                            return <Cell key={`cell-${index}`} fill={colors[index]} />;
                          })
                        }
                      </Bar>
                    </BarChart>
                  </ResponsiveContainer>
                </CardContent>
              </Card>
            </div>
          </div>
        </main>
      </div>
    </div>
  );
}
