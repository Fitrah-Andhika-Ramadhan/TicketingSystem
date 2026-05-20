'use client';

import { useEffect, useState } from 'react';
import { useRouter } from 'next/navigation';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import Navbar from '@/components/Navbar';
import Sidebar from '@/components/Sidebar';
import { FileText, Download, Upload, Filter } from 'lucide-react';

export default function DocumentsPage() {
  const router = useRouter();
  const [user, setUser] = useState<any>(null);
  const [documents, setDocuments] = useState<any[]>([]);
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
    };

    checkAuth();
  }, [router]);

  const handleLogout = () => {
    localStorage.removeItem('token');
    localStorage.removeItem('user');
    router.push('/login');
  };

  const docTypes = [
    { value: 'SPR', label: 'SPR (Surat Pernyataan Rencana)', icon: '📄' },
    { value: 'BLUEPRINT', label: 'Blueprint', icon: '🏗️' },
    { value: 'CONTRACT', label: 'Contract', icon: '📋' },
    { value: 'PERMIT', label: 'Permit', icon: '✅' },
    { value: 'REPORT', label: 'Report', icon: '📊' },
    { value: 'INSPECTION', label: 'Inspection', icon: '🔍' },
  ];

  if (!user) return null;

  return (
    <div className="flex h-screen bg-slate-50">
      <Sidebar user={user} />
      
      <div className="flex-1 flex flex-col overflow-hidden">
        <Navbar user={user} />

        <main className="flex-1 overflow-auto">
          <div className="p-8 max-w-7xl mx-auto">
            <div className="mb-8 flex justify-between items-start">
              <div>
                <h1 className="text-3xl font-bold text-gray-900">Documents</h1>
                <p className="text-gray-600 mt-1">SPR, blueprints, contracts, and project documents</p>
              </div>
              <Button className="bg-blue-600 hover:bg-blue-700 flex items-center gap-2">
                <Upload className="w-4 h-4" />
                Upload Document
              </Button>
            </div>

          {/* Document Types Grid */}
          <div className="mb-8">
            <h2 className="text-lg font-semibold text-gray-900 mb-4">Document Categories</h2>
            <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-6 gap-4">
              {docTypes.map((type) => (
                <Card key={type.value} className="cursor-pointer hover:shadow-lg transition-shadow">
                  <CardContent className="p-4 text-center">
                    <div className="text-4xl mb-2">{type.icon}</div>
                    <p className="text-sm font-medium text-gray-700">{type.label}</p>
                  </CardContent>
                </Card>
              ))}
            </div>
          </div>

          {/* Recent Documents */}
          <Card>
            <CardHeader>
              <div className="flex justify-between items-center">
                <CardTitle>Recent Documents</CardTitle>
                <Button variant="outline" size="sm" className="flex items-center gap-2">
                  <Filter className="w-4 h-4" />
                  Filter
                </Button>
              </div>
            </CardHeader>
            <CardContent>
              <div className="space-y-4">
                {[
                  { name: 'SPR Metro Paragon - Phase 2', type: 'SPR', date: '2024-04-08', size: '2.5 MB' },
                  { name: 'Architecture Blueprint - Block A', type: 'BLUEPRINT', date: '2024-04-07', size: '15.8 MB' },
                  { name: 'Construction Contract', type: 'CONTRACT', date: '2024-04-05', size: '5.2 MB' },
                  { name: 'Monthly Safety Inspection Report', type: 'INSPECTION', date: '2024-04-01', size: '3.1 MB' },
                  { name: 'Budget Report Q2 2024', type: 'REPORT', date: '2024-03-31', size: '1.8 MB' },
                ].map((doc, idx) => (
                  <div key={idx} className="flex items-center justify-between p-3 border rounded-lg hover:bg-gray-50">
                    <div className="flex items-center gap-3 flex-1">
                      <FileText className="w-10 h-10 text-blue-600" />
                      <div className="flex-1 min-w-0">
                        <p className="font-medium text-gray-900 truncate">{doc.name}</p>
                        <div className="flex items-center gap-2 text-xs text-gray-600 mt-1">
                          <Badge variant="secondary" className="text-xs">{doc.type}</Badge>
                          <span>{doc.date}</span>
                          <span>•</span>
                          <span>{doc.size}</span>
                        </div>
                      </div>
                    </div>
                    <Button variant="ghost" size="sm">
                      <Download className="w-4 h-4" />
                    </Button>
                  </div>
                ))}
              </div>
            </CardContent>
          </Card>
          </div>
        </main>
      </div>
    </div>
  );
}
