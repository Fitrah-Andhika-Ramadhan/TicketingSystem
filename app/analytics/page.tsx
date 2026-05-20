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
  const [analyticsData, setAnalyticsData] = useState<any[]>([]);
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
      const response = await fetch('/api/projects/1/analytics?days=90', {
        headers: {
          Authorization: `Bearer ${token}`,
        },
      });

      const data = await response.json();
      if (data.success) {
        setAnalyticsData(data.data.analytics);
      }
    } catch (error) {
      console.error('Failed to fetch analytics:', error);
    } finally {
      setLoading(false);
    }
  };

  if (!user) {
    return <div className="min-h-screen bg-slate-50 flex items-center justify-center">Loading...</div>;
  }

  const COLORS = ['#3b82f6', '#ef4444', '#10b981', '#f59e0b'];

  // Calculate metrics
  const avgWorkers = Math.round(analyticsData.reduce((sum, d) => sum + d.workersOnSite, 0) / analyticsData.length || 0);
  const totalIncidents = analyticsData.reduce((sum, d) => sum + d.safetyIncidents, 0);
  const avgQuality = (analyticsData.reduce((sum, d) => sum + d.qualityScore, 0) / analyticsData.length || 0).toFixed(1);
  const avgBudget = (analyticsData.reduce((sum, d) => sum + d.budgetUtilization, 0) / analyticsData.length || 0).toFixed(1);

  return (
    <div className="flex h-screen bg-slate-50">
      <Sidebar user={user} />
      
      <div className="flex-1 flex flex-col overflow-hidden">
        <Navbar user={user} />
        
        <main className="flex-1 overflow-auto">
          <div className="p-8 max-w-7xl mx-auto">
            <div className="mb-8">
              <h1 className="text-3xl font-bold text-gray-900">Analytics</h1>
              <p className="text-gray-600 mt-1">Metro Paragon Residence - 90 Day Analysis</p>
            </div>

            {/* KPI Cards */}
            <div className="grid grid-cols-1 md:grid-cols-4 gap-4 mb-8">
              <Card>
                <CardHeader className="pb-2">
                  <CardTitle className="text-sm font-medium text-gray-600">Avg Workers On-site</CardTitle>
                </CardHeader>
                <CardContent>
                  <div className="text-3xl font-bold text-blue-600">{avgWorkers}</div>
                  <p className="text-xs text-gray-500 mt-1">people per day</p>
                </CardContent>
              </Card>

              <Card>
                <CardHeader className="pb-2">
                  <CardTitle className="text-sm font-medium text-gray-600">Safety Incidents</CardTitle>
                </CardHeader>
                <CardContent>
                  <div className="text-3xl font-bold text-red-600">{totalIncidents}</div>
                  <p className="text-xs text-gray-500 mt-1">total incidents</p>
                </CardContent>
              </Card>

              <Card>
                <CardHeader className="pb-2">
                  <CardTitle className="text-sm font-medium text-gray-600">Avg Quality Score</CardTitle>
                </CardHeader>
                <CardContent>
                  <div className="text-3xl font-bold text-green-600">{avgQuality}%</div>
                  <p className="text-xs text-gray-500 mt-1">quality rating</p>
                </CardContent>
              </Card>

              <Card>
                <CardHeader className="pb-2">
                  <CardTitle className="text-sm font-medium text-gray-600">Budget Utilization</CardTitle>
                </CardHeader>
                <CardContent>
                  <div className="text-3xl font-bold text-orange-600">{avgBudget}%</div>
                  <p className="text-xs text-gray-500 mt-1">average usage</p>
                </CardContent>
              </Card>
            </div>

            {/* Charts */}
            <div className="grid grid-cols-1 lg:grid-cols-2 gap-8 mb-8">
              {/* Workers Trend */}
              <Card>
                <CardHeader>
                  <CardTitle>Workers On-Site Trend</CardTitle>
                  <CardDescription>90-day historical data</CardDescription>
                </CardHeader>
                <CardContent>
                  <ResponsiveContainer width="100%" height={300}>
                    <LineChart data={analyticsData}>
                      <CartesianGrid strokeDasharray="3 3" />
                      <XAxis dataKey="date" stroke="#9ca3af" />
                      <YAxis stroke="#9ca3af" />
                      <Tooltip />
                      <Legend />
                      <Line type="monotone" dataKey="workersOnSite" stroke="#3b82f6" name="Workers" strokeWidth={2} />
                    </LineChart>
                  </ResponsiveContainer>
                </CardContent>
              </Card>

              {/* Quality Score Trend */}
              <Card>
                <CardHeader>
                  <CardTitle>Quality Score Trend</CardTitle>
                  <CardDescription>90-day historical data</CardDescription>
                </CardHeader>
                <CardContent>
                  <ResponsiveContainer width="100%" height={300}>
                    <LineChart data={analyticsData}>
                      <CartesianGrid strokeDasharray="3 3" />
                      <XAxis dataKey="date" stroke="#9ca3af" />
                      <YAxis stroke="#9ca3af" />
                      <Tooltip />
                      <Legend />
                      <Line type="monotone" dataKey="qualityScore" stroke="#10b981" name="Quality %" strokeWidth={2} />
                    </LineChart>
                  </ResponsiveContainer>
                </CardContent>
              </Card>

              {/* Budget vs Progress */}
              <Card>
                <CardHeader>
                  <CardTitle>Budget vs Progress</CardTitle>
                  <CardDescription>Monthly comparison</CardDescription>
                </CardHeader>
                <CardContent>
                  <ResponsiveContainer width="100%" height={300}>
                    <BarChart data={analyticsData.slice(-30)}>
                      <CartesianGrid strokeDasharray="3 3" />
                      <XAxis dataKey="date" stroke="#9ca3af" />
                      <YAxis stroke="#9ca3af" />
                      <Tooltip />
                      <Legend />
                      <Bar dataKey="budgetUtilization" fill="#f59e0b" name="Budget %" />
                      <Bar dataKey="progressPercentage" fill="#3b82f6" name="Progress %" />
                    </BarChart>
                  </ResponsiveContainer>
                </CardContent>
              </Card>

              {/* Safety Incidents Pie */}
              <Card>
                <CardHeader>
                  <CardTitle>Safety Status</CardTitle>
                  <CardDescription>Last 30 days</CardDescription>
                </CardHeader>
                <CardContent className="flex items-center justify-center">
                  <div className="text-center">
                    <div className="text-4xl font-bold text-green-600 mb-2">
                      {30 - (analyticsData.slice(-30).reduce((sum, d) => sum + d.safetyIncidents, 0))}
                    </div>
                    <p className="text-gray-600">Incident-Free Days</p>
                  </div>
                </CardContent>
              </Card>
            </div>

            {/* Detailed Table */}
            <Card>
              <CardHeader>
                <CardTitle>Daily Analytics Detail</CardTitle>
                <CardDescription>Last 30 days of detailed metrics</CardDescription>
              </CardHeader>
              <CardContent>
                <div className="overflow-x-auto">
                  <table className="w-full text-sm">
                    <thead className="border-b">
                      <tr>
                        <th className="text-left py-3 px-4">Date</th>
                        <th className="text-center py-3 px-4">Workers</th>
                        <th className="text-center py-3 px-4">Quality</th>
                        <th className="text-center py-3 px-4">Progress</th>
                        <th className="text-center py-3 px-4">Budget</th>
                        <th className="text-center py-3 px-4">Incidents</th>
                      </tr>
                    </thead>
                    <tbody>
                      {analyticsData.slice(-30).reverse().map((item, idx) => (
                        <tr key={idx} className="border-b hover:bg-gray-50">
                          <td className="py-3 px-4">{new Date(item.date).toLocaleDateString()}</td>
                          <td className="text-center py-3 px-4 font-semibold">{item.workersOnSite}</td>
                          <td className="text-center py-3 px-4">
                            <span className={`px-2 py-1 rounded text-xs font-semibold ${item.qualityScore >= 80 ? 'bg-green-100 text-green-800' : 'bg-yellow-100 text-yellow-800'}`}>
                              {item.qualityScore}%
                            </span>
                          </td>
                          <td className="text-center py-3 px-4">{item.progressPercentage}%</td>
                          <td className="text-center py-3 px-4">{item.budgetUtilization}%</td>
                          <td className="text-center py-3 px-4">
                            <span className={`px-2 py-1 rounded text-xs font-semibold ${item.safetyIncidents === 0 ? 'bg-green-100 text-green-800' : 'bg-red-100 text-red-800'}`}>
                              {item.safetyIncidents}
                            </span>
                          </td>
                        </tr>
                      ))}
                    </tbody>
                  </table>
                </div>
              </CardContent>
            </Card>
          </div>
        </main>
      </div>
    </div>
  );
}
