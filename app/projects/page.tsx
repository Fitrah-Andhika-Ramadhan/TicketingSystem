'use client';

import { useEffect, useState } from 'react';
import { useRouter } from 'next/navigation';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Progress } from '@/components/ui/progress';
import { Badge } from '@/components/ui/badge';
import Navbar from '@/components/Navbar';
import Sidebar from '@/components/Sidebar';
import { MapPin, Calendar, DollarSign, Plus, Trash2, Edit, X, FileText } from 'lucide-react';

export default function ProjectsPage() {
  const router = useRouter();
  const [user, setUser] = useState<any>(null);
  const [projects, setProjects] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);

  // Modal States
  const [isCreateModalOpen, setIsCreateModalOpen] = useState(false);
  const [isEditModalOpen, setIsEditModalOpen] = useState(false);
  const [selectedProject, setSelectedProject] = useState<any>(null);

  // Form Fields - Create
  const [name, setName] = useState('');
  const [location, setLocation] = useState('');
  const [description, setDescription] = useState('');
  const [startDate, setStartDate] = useState('');
  const [endDate, setEndDate] = useState('');
  const [budgetAmount, setBudgetAmount] = useState('');
  const [submitting, setSubmitting] = useState(false);

  // Form Fields - Edit
  const [editStatus, setEditStatus] = useState('');
  const [editProgress, setEditProgress] = useState(0);
  const [editBudget, setEditBudget] = useState('');
  const [editSpent, setEditSpent] = useState('');

  useEffect(() => {
    const checkAuth = () => {
      const storedUser = localStorage.getItem('user');
      const token = localStorage.getItem('token');

      if (!token || !storedUser) {
        router.push('/login');
        return;
      }

      setUser(JSON.parse(storedUser));
      fetchProjects(token);
    };

    checkAuth();
  }, [router]);

  const fetchProjects = async (token: string) => {
    try {
      setLoading(true);
      const response = await fetch('/api/projects', {
        headers: {
          Authorization: `Bearer ${token}`,
        },
      });

      const data = await response.json();

      if (data.success) {
        setProjects(data.data);
      }
    } catch (error) {
      console.error('Failed to fetch projects:', error);
    } finally {
      setLoading(false);
    }
  };

  const handleCreateProject = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!name || !location || !startDate || !endDate || !budgetAmount) return;

    setSubmitting(true);
    try {
      const token = localStorage.getItem('token');
      const response = await fetch('/api/projects', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          Authorization: `Bearer ${token}`,
        },
        body: JSON.stringify({
          name,
          location,
          description,
          startDate,
          endDate,
          budgetAmount: Number(budgetAmount),
        }),
      });

      const data = await response.json();
      if (data.success) {
        setIsCreateModalOpen(false);
        // Reset form
        setName('');
        setLocation('');
        setDescription('');
        setStartDate('');
        setEndDate('');
        setBudgetAmount('');
        fetchProjects(token!);
      }
    } catch (error) {
      console.error('Failed to create project:', error);
    } finally {
      setSubmitting(false);
    }
  };

  const handleEditOpen = (project: any) => {
    setSelectedProject(project);
    setEditStatus(project.status || 'Planning');
    setEditProgress(project.progress || 0);
    setEditBudget(String(project.budgetAmount || 0));
    setEditSpent(String(project.spentAmount || 0));
    setIsEditModalOpen(true);
  };

  const handleUpdateProject = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!selectedProject) return;

    setSubmitting(true);
    try {
      const token = localStorage.getItem('token');
      const response = await fetch(`/api/projects/${selectedProject.id}`, {
        method: 'PATCH',
        headers: {
          'Content-Type': 'application/json',
          Authorization: `Bearer ${token}`,
        },
        body: JSON.stringify({
          status: editStatus,
          progress: Number(editProgress),
          budgetAmount: Number(editBudget),
          spentAmount: Number(editSpent),
        }),
      });

      const data = await response.json();
      if (data.success) {
        setIsEditModalOpen(false);
        fetchProjects(token!);
      }
    } catch (error) {
      console.error('Failed to update project:', error);
    } finally {
      setSubmitting(false);
    }
  };

  const handleDeleteProject = async (projectId: string) => {
    if (!confirm('Apakah Anda yakin ingin menghapus proyek ini?')) return;

    try {
      const token = localStorage.getItem('token');
      const response = await fetch(`/api/projects/${projectId}`, {
        method: 'DELETE',
        headers: {
          Authorization: `Bearer ${token}`,
        },
      });

      const data = await response.json();
      if (data.success) {
        fetchProjects(token!);
      }
    } catch (error) {
      console.error('Failed to delete project:', error);
    }
  };

  const handleLogout = () => {
    localStorage.removeItem('token');
    localStorage.removeItem('user');
    router.push('/login');
  };

  if (!user) return null;

  return (
    <div className="flex h-screen bg-slate-55">
      <Sidebar user={user} />
      
      <div className="flex-1 flex flex-col overflow-hidden">
        <Navbar user={user} onLogout={handleLogout} />

        <main className="flex-1 overflow-auto bg-slate-50 p-8">
          <div className="max-w-7xl mx-auto w-full">
            
            {/* Header */}
            <div className="mb-8 flex justify-between items-center">
              <div>
                <h1 className="text-3xl font-bold text-gray-900 font-sans tracking-tight">Projects</h1>
                <p className="text-gray-600 mt-1 text-sm">Manage and monitor all construction projects</p>
              </div>
              <Button 
                onClick={() => setIsCreateModalOpen(true)}
                className="bg-blue-600 hover:bg-blue-700 flex items-center gap-2 text-sm font-semibold"
              >
                <Plus className="w-4 h-4" />
                New Project
              </Button>
            </div>

            {loading ? (
              <div className="text-center py-12">
                <p className="text-gray-500 text-sm">Loading projects...</p>
              </div>
            ) : projects.length === 0 ? (
              <div className="text-center py-12">
                <p className="text-gray-500 text-sm">No projects found. Create a new one above!</p>
              </div>
            ) : (
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                {projects.map((project) => (
                  <Card key={project.id} className="hover:shadow-lg transition duration-200 border border-slate-200">
                    <CardHeader className="pb-3">
                      <div className="flex items-start justify-between gap-3">
                        <div>
                          <CardTitle className="text-lg font-bold text-slate-900 leading-tight">{project.name}</CardTitle>
                          <div className="flex items-center gap-2 text-xs text-slate-500 mt-2 font-medium">
                            <MapPin className="w-3.5 h-3.5" />
                            {project.location}
                          </div>
                        </div>
                        <Badge 
                          variant="secondary"
                          className={
                            project.status === 'In Progress' ? 'bg-blue-100 text-blue-800' :
                            project.status === 'Completed' ? 'bg-green-100 text-green-800' :
                            'bg-amber-100 text-amber-800'
                          }
                        >
                          {project.status}
                        </Badge>
                      </div>
                    </CardHeader>
                    <CardContent className="space-y-4">
                      {project.description && (
                        <p className="text-xs text-slate-500 leading-relaxed line-clamp-2">
                          {project.description}
                        </p>
                      )}

                      <div>
                        <div className="flex justify-between items-center mb-2">
                          <span className="text-xs font-semibold text-slate-500">Progress</span>
                          <span className="text-xs font-bold text-slate-900">
                            {project.progress}%
                          </span>
                        </div>
                        <Progress value={project.progress} className="h-1.5" />
                      </div>

                      <div className="grid grid-cols-2 gap-4 text-xs pt-2 border-t border-slate-100">
                        <div className="flex items-center gap-2">
                          <Calendar className="w-4 h-4 text-gray-400" />
                          <div>
                            <p className="text-[10px] text-gray-500 uppercase tracking-wider">Mulai</p>
                            <p className="font-semibold text-slate-800">
                              {new Date(project.startDate).toLocaleDateString('id-ID')}
                            </p>
                          </div>
                        </div>
                        <div className="flex items-center gap-2">
                          <DollarSign className="w-4 h-4 text-gray-400" />
                          <div>
                            <p className="text-[10px] text-gray-500 uppercase tracking-wider">Budget / Spent</p>
                            <p className="font-semibold text-slate-800">
                              Rp{(project.budgetAmount / 1000000).toFixed(0)}jt / Rp{(project.spentAmount / 1000000).toFixed(0)}jt
                            </p>
                          </div>
                        </div>
                      </div>

                      <div className="flex justify-between items-center gap-2.5 pt-2">
                        <Button 
                          className="flex-1 flex items-center justify-center gap-1.5 text-xs font-semibold h-8.5" 
                          variant="outline"
                          onClick={() => handleEditOpen(project)}
                        >
                          <Edit className="w-3.5 h-3.5" />
                          Edit / View Details
                        </Button>
                        <Button 
                          className="text-rose-600 hover:text-rose-700 hover:bg-rose-50 h-8.5 px-3 border border-transparent hover:border-rose-100 bg-transparent"
                          onClick={() => handleDeleteProject(project.id)}
                        >
                          <Trash2 className="w-3.5 h-3.5" />
                        </Button>
                      </div>
                    </CardContent>
                  </Card>
                ))}
              </div>
            )}
          </div>
        </main>
      </div>

      {/* Create Project Modal */}
      {isCreateModalOpen && (
        <div className="fixed inset-0 bg-black/50 backdrop-blur-sm z-50 flex items-center justify-center p-4">
          <div className="bg-white rounded-xl max-w-lg w-full overflow-hidden shadow-2xl border border-slate-100 flex flex-col">
            <div className="px-6 py-4 border-b border-slate-100 flex justify-between items-center bg-slate-50/50">
              <h3 className="text-lg font-bold text-slate-900">Buat Proyek Baru</h3>
              <button onClick={() => setIsCreateModalOpen(false)} className="text-slate-400 hover:text-slate-600 transition">
                <X className="w-5 h-5" />
              </button>
            </div>

            <form onSubmit={handleCreateProject} className="p-6 space-y-4 flex-1">
              <div>
                <label className="block text-sm font-semibold text-slate-700 mb-1">
                  Nama Proyek <span className="text-rose-500">*</span>
                </label>
                <input
                  type="text"
                  placeholder="Contoh: Gedung Olahraga Kemayoran"
                  value={name}
                  onChange={(e) => setName(e.target.value)}
                  className="w-full px-3 py-2 border border-slate-200 rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-blue-500"
                  required
                />
              </div>

              <div>
                <label className="block text-sm font-semibold text-slate-700 mb-1">
                  Lokasi Proyek <span className="text-rose-500">*</span>
                </label>
                <input
                  type="text"
                  placeholder="Contoh: Jakarta Pusat, Indonesia"
                  value={location}
                  onChange={(e) => setLocation(e.target.value)}
                  className="w-full px-3 py-2 border border-slate-200 rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-blue-500"
                  required
                />
              </div>

              <div>
                <label className="block text-sm font-semibold text-slate-700 mb-1">
                  Deskripsi Singkat
                </label>
                <textarea
                  placeholder="Detail rencana pembangunan..."
                  value={description}
                  onChange={(e) => setDescription(e.target.value)}
                  className="w-full px-3 py-2 border border-slate-200 rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-blue-500 resize-none"
                  rows={3}
                />
              </div>

              <div className="grid grid-cols-2 gap-4">
                <div>
                  <label className="block text-sm font-semibold text-slate-700 mb-1">
                    Tanggal Mulai <span className="text-rose-500">*</span>
                  </label>
                  <input
                    type="date"
                    value={startDate}
                    onChange={(e) => setStartDate(e.target.value)}
                    className="w-full px-3 py-2 border border-slate-200 rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-blue-500 bg-white"
                    required
                  />
                </div>
                <div>
                  <label className="block text-sm font-semibold text-slate-700 mb-1">
                    Estimasi Selesai <span className="text-rose-500">*</span>
                  </label>
                  <input
                    type="date"
                    value={endDate}
                    onChange={(e) => setEndDate(e.target.value)}
                    className="w-full px-3 py-2 border border-slate-200 rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-blue-500 bg-white"
                    required
                  />
                </div>
              </div>

              <div>
                <label className="block text-sm font-semibold text-slate-700 mb-1">
                  Budget (Rupiah) <span className="text-rose-500">*</span>
                </label>
                <input
                  type="number"
                  placeholder="Contoh: 1500000000 (1.5 Milyar)"
                  value={budgetAmount}
                  onChange={(e) => setBudgetAmount(e.target.value)}
                  className="w-full px-3 py-2 border border-slate-200 rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-blue-500"
                  required
                />
              </div>

              <div className="pt-4 border-t border-slate-100 flex justify-end gap-2.5">
                <Button type="button" variant="outline" onClick={() => setIsCreateModalOpen(false)}>
                  Batal
                </Button>
                <Button type="submit" disabled={submitting} className="bg-blue-600 hover:bg-blue-700 text-white font-medium px-5">
                  {submitting ? 'Menyimpan...' : 'Simpan Proyek'}
                </Button>
              </div>
            </form>
          </div>
        </div>
      )}

      {/* Edit / Details Project Modal */}
      {isEditModalOpen && selectedProject && (
        <div className="fixed inset-0 bg-black/50 backdrop-blur-sm z-50 flex items-center justify-center p-4">
          <div className="bg-white rounded-xl max-w-lg w-full overflow-hidden shadow-2xl border border-slate-100 flex flex-col">
            <div className="px-6 py-4 border-b border-slate-100 flex justify-between items-center bg-slate-50/50">
              <div>
                <h3 className="text-lg font-bold text-slate-900">Ubah Detail Proyek</h3>
                <p className="text-xs text-slate-500 mt-0.5">{selectedProject.name}</p>
              </div>
              <button onClick={() => setIsEditModalOpen(false)} className="text-slate-400 hover:text-slate-600 transition">
                <X className="w-5 h-5" />
              </button>
            </div>

            <form onSubmit={handleUpdateProject} className="p-6 space-y-4 flex-1">
              <div>
                <label className="block text-sm font-semibold text-slate-700 mb-1.5">
                  Status
                </label>
                <select
                  value={editStatus}
                  onChange={(e) => setEditStatus(e.target.value)}
                  className="w-full px-3 py-2 border border-slate-200 rounded-lg text-sm bg-white focus:outline-none"
                >
                  <option value="Planning">Planning</option>
                  <option value="In Progress">In Progress</option>
                  <option value="Completed">Completed</option>
                  <option value="On Hold">On Hold</option>
                </select>
              </div>

              <div>
                <div className="flex justify-between items-center mb-1">
                  <label className="text-sm font-semibold text-slate-700">
                    Progress Pembangunan (%)
                  </label>
                  <span className="text-sm font-bold text-blue-600">{editProgress}%</span>
                </div>
                <input
                  type="range"
                  min="0"
                  max="100"
                  value={editProgress}
                  onChange={(e) => setEditProgress(Number(e.target.value))}
                  className="w-full h-2 bg-slate-200 rounded-lg appearance-none cursor-pointer"
                />
              </div>

              <div className="grid grid-cols-2 gap-4">
                <div>
                  <label className="block text-sm font-semibold text-slate-700 mb-1">
                    Anggaran Budget (Rp)
                  </label>
                  <input
                    type="number"
                    value={editBudget}
                    onChange={(e) => setEditBudget(e.target.value)}
                    className="w-full px-3 py-2 border border-slate-200 rounded-lg text-sm focus:outline-none"
                  />
                </div>
                <div>
                  <label className="block text-sm font-semibold text-slate-700 mb-1">
                    Terpakai Spent (Rp)
                  </label>
                  <input
                    type="number"
                    value={editSpent}
                    onChange={(e) => setEditSpent(e.target.value)}
                    className="w-full px-3 py-2 border border-slate-200 rounded-lg text-sm focus:outline-none"
                  />
                </div>
              </div>

              <div className="pt-4 border-t border-slate-100 flex justify-end gap-2.5">
                <Button type="button" variant="outline" onClick={() => setIsEditModalOpen(false)}>
                  Batal
                </Button>
                <Button type="submit" disabled={submitting} className="bg-blue-600 hover:bg-blue-700 text-white font-medium px-5">
                  {submitting ? 'Menyimpan...' : 'Perbarui Proyek'}
                </Button>
              </div>
            </form>
          </div>
        </div>
      )}

    </div>
  );
}
