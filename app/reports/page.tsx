'use client';

import { useEffect, useState } from 'react';
import { useRouter } from 'next/navigation';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Download, FileText, Calendar } from 'lucide-react';
import Sidebar from '@/components/Sidebar';
import Navbar from '@/components/Navbar';

export default function ReportsPage() {
  const router = useRouter();
  const [user, setUser] = useState<any>(null);
  const [reports, setReports] = useState<any[]>([]);
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
      fetchReports(token);
    };

    checkAuth();
  }, [router]);

  const fetchReports = async (token: string) => {
    try {
      setLoading(true);
      // Mock reports data
      const mockReports = [
        {
          id: '1',
          title: 'Monthly Progress Report - March 2026',
          description: 'Comprehensive overview of construction progress, budget status, and upcoming milestones',
          date: new Date('2026-03-31'),
          type: 'Monthly',
          status: 'Completed',
          pages: 24,
        },
        {
          id: '2',
          title: 'Safety & Compliance Report - Q1 2026',
          description: 'Quarterly safety incidents, compliance audits, and corrective actions',
          date: new Date('2026-03-30'),
          type: 'Quarterly',
          status: 'Completed',
          pages: 18,
        },
        {
          id: '3',
          title: 'Budget Analysis & Forecast',
          description: 'Detailed breakdown of expenditures, budget variance analysis, and financial projections',
          date: new Date('2026-03-28'),
          type: 'Financial',
          status: 'Completed',
          pages: 32,
        },
        {
          id: '4',
          title: 'Project Timeline & Milestones',
          description: 'Scheduled completion dates for each phase, current delays, and recovery plans',
          date: new Date('2026-03-25'),
          type: 'Schedule',
          status: 'In Progress',
          pages: 15,
        },
        {
          id: '5',
          title: 'Quality Assurance Report',
          description: 'Inspection results, defect log, and quality improvement initiatives',
          date: new Date('2026-03-20'),
          type: 'Quality',
          status: 'Completed',
          pages: 22,
        },
        {
          id: '6',
          title: 'Resource & Team Performance',
          description: 'Workforce metrics, productivity analysis, and team capacity planning',
          date: new Date('2026-03-15'),
          type: 'HR',
          status: 'Completed',
          pages: 20,
        },
      ];

      setReports(mockReports);
    } catch (error) {
      console.error('Failed to fetch reports:', error);
    } finally {
      setLoading(false);
    }
  };

  if (!user) {
    return <div className="min-h-screen bg-slate-50 flex items-center justify-center">Loading...</div>;
  }

  const getTypeColor = (type: string) => {
    switch (type) {
      case 'Monthly':
        return 'bg-blue-100 text-blue-800';
      case 'Quarterly':
        return 'bg-purple-100 text-purple-800';
      case 'Financial':
        return 'bg-green-100 text-green-800';
      case 'Schedule':
        return 'bg-orange-100 text-orange-800';
      case 'Quality':
        return 'bg-red-100 text-red-800';
      case 'HR':
        return 'bg-indigo-100 text-indigo-800';
      default:
        return 'bg-gray-100 text-gray-800';
    }
  };

  const getStatusColor = (status: string) => {
    return status === 'Completed' ? 'bg-green-100 text-green-800' : 'bg-yellow-100 text-yellow-800';
  };

  return (
    <div className="flex h-screen bg-slate-50">
      <Sidebar user={user} />
      
      <div className="flex-1 flex flex-col overflow-hidden">
        <Navbar user={user} />
        
        <main className="flex-1 overflow-auto">
          <div className="p-8 max-w-7xl mx-auto">
            <div className="mb-8 flex justify-between items-start">
              <div>
                <h1 className="text-3xl font-bold text-gray-900">Reports</h1>
                <p className="text-gray-600 mt-1">Generate and manage project reports</p>
              </div>
              <Button className="bg-blue-600 hover:bg-blue-700">
                <FileText className="w-4 h-4 mr-2" />
                Generate New Report
              </Button>
            </div>

            {/* Report List */}
            <div className="space-y-4">
              {reports.map((report) => (
                <Card key={report.id} className="hover:shadow-md transition-shadow">
                  <CardContent className="p-6">
                    <div className="flex items-start justify-between">
                      <div className="flex-1">
                        <div className="flex items-center gap-3 mb-2">
                          <FileText className="w-5 h-5 text-blue-600" />
                          <h3 className="text-lg font-semibold text-gray-900">{report.title}</h3>
                        </div>
                        <p className="text-gray-600 text-sm mb-3">{report.description}</p>
                        <div className="flex items-center gap-4 text-sm text-gray-500">
                          <span className="flex items-center gap-1">
                            <Calendar className="w-4 h-4" />
                            {report.date.toLocaleDateString()}
                          </span>
                          <span>{report.pages} pages</span>
                        </div>
                      </div>
                      
                      <div className="flex items-center gap-3 ml-4">
                        <div className="flex flex-col gap-2">
                          <span className={`px-3 py-1 rounded-full text-xs font-semibold ${getTypeColor(report.type)}`}>
                            {report.type}
                          </span>
                          <span className={`px-3 py-1 rounded-full text-xs font-semibold ${getStatusColor(report.status)}`}>
                            {report.status}
                          </span>
                        </div>
                        <Button variant="outline" size="sm">
                          <Download className="w-4 h-4" />
                        </Button>
                      </div>
                    </div>
                  </CardContent>
                </Card>
              ))}
            </div>

            {/* Report Stats */}
            <div className="grid grid-cols-1 md:grid-cols-4 gap-4 mt-8">
              <Card>
                <CardHeader className="pb-2">
                  <CardTitle className="text-sm font-medium text-gray-600">Total Reports</CardTitle>
                </CardHeader>
                <CardContent>
                  <div className="text-3xl font-bold text-blue-600">{reports.length}</div>
                </CardContent>
              </Card>

              <Card>
                <CardHeader className="pb-2">
                  <CardTitle className="text-sm font-medium text-gray-600">Completed</CardTitle>
                </CardHeader>
                <CardContent>
                  <div className="text-3xl font-bold text-green-600">
                    {reports.filter(r => r.status === 'Completed').length}
                  </div>
                </CardContent>
              </Card>

              <Card>
                <CardHeader className="pb-2">
                  <CardTitle className="text-sm font-medium text-gray-600">In Progress</CardTitle>
                </CardHeader>
                <CardContent>
                  <div className="text-3xl font-bold text-orange-600">
                    {reports.filter(r => r.status === 'In Progress').length}
                  </div>
                </CardContent>
              </Card>

              <Card>
                <CardHeader className="pb-2">
                  <CardTitle className="text-sm font-medium text-gray-600">Avg Pages</CardTitle>
                </CardHeader>
                <CardContent>
                  <div className="text-3xl font-bold text-purple-600">
                    {Math.round(reports.reduce((sum, r) => sum + r.pages, 0) / reports.length)}
                  </div>
                </CardContent>
              </Card>
            </div>
          </div>
        </main>
      </div>
    </div>
  );
}
