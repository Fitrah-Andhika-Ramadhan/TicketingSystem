'use client';

import { useEffect, useState } from 'react';
import { useRouter } from 'next/navigation';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Users, Mail, Phone, MapPin, Edit, Trash2, Plus } from 'lucide-react';
import Sidebar from '@/components/Sidebar';
import Navbar from '@/components/Navbar';
import swal from '@/lib/swal';
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";

interface TeamMember {
  id: string;
  name: string;
  role: string;
  position: string;
  email: string;
  phone: string;
  department: string;
  status: string;
  joinDate: Date;
  avatar: string;
}

export default function TeamPage() {
  const router = useRouter();
  const [user, setUser] = useState<any>(null);
  const [teamMembers, setTeamMembers] = useState<TeamMember[]>([]);
  const [loading, setLoading] = useState(true);

  // Modal States
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [isEditing, setIsEditing] = useState(false);
  const [currentMember, setCurrentMember] = useState<TeamMember | null>(null);
  const [formData, setFormData] = useState({
    name: '',
    position: '',
    email: '',
    department: 'IT Support'
  });

  useEffect(() => {
    const checkAuth = () => {
      const storedUser = localStorage.getItem('user');
      const token = localStorage.getItem('token');

      if (!token || !storedUser) {
        router.push('/login');
        return;
      }

      const parsedUser = JSON.parse(storedUser);
      // Team page is for admin only
      if (parsedUser.role !== 'SUPER_ADMIN' && parsedUser.role !== 'ADMIN') {
        router.push('/dashboard');
        return;
      }

      setUser(parsedUser);
      fetchTeamMembers(token);
    };

    checkAuth();
  }, [router]);

  const fetchTeamMembers = async (token: string) => {
    try {
      setLoading(true);
      // Mock team members data
      const mockTeam = [
        {
          id: '1',
          name: 'Admin User',
          role: 'SUPER_ADMIN',
          position: 'Project Director',
          email: 'fitrahramdhan31@gmail.com',
          phone: '+62812345678',
          department: 'Management',
          status: 'Active',
          joinDate: new Date('2023-01-15'),
          avatar: 'A',
        },
        {
          id: '2',
          name: 'Budi Santoso',
          role: 'MANAGER',
          position: 'IT Support Manager',
          email: 'budi@fitrahpro.com',
          phone: '+62812345679',
          department: 'IT Support',
          status: 'Active',
          joinDate: new Date('2023-02-01'),
          avatar: 'B',
        },
        {
          id: '3',
          name: 'Siti Nurhaliza',
          role: 'MANAGER',
          position: 'SLA QA Lead',
          email: 'siti@fitrahpro.com',
          phone: '+62812345680',
          department: 'Quality Assurance',
          status: 'Active',
          joinDate: new Date('2023-02-15'),
          avatar: 'S',
        },
        {
          id: '4',
          name: 'Roni Wijaya',
          role: 'CONTRACTOR',
          position: 'Senior Support Agent',
          email: 'roni@fitrahpro.com',
          phone: '+62812345681',
          department: 'IT Support',
          status: 'Active',
          joinDate: new Date('2023-03-01'),
          avatar: 'R',
        },
        {
          id: '5',
          name: 'Dewi Lestari',
          role: 'CONTRACTOR',
          position: 'Security Analyst',
          email: 'dewi@fitrahpro.com',
          phone: '+62812345682',
          department: 'IT Security',
          status: 'Active',
          joinDate: new Date('2023-03-10'),
          avatar: 'D',
        },
        {
          id: '6',
          name: 'Andi Gunawan',
          role: 'VIEWER',
          position: 'System Administrator',
          email: 'andi@fitrahpro.com',
          phone: '+62812345683',
          department: 'Administration',
          status: 'Active',
          joinDate: new Date('2023-04-01'),
          avatar: 'A',
        },
      ];

      setTeamMembers(mockTeam);
    } catch (error) {
      console.error('Failed to fetch team members:', error);
    } finally {
      setLoading(false);
    }
  };

  const handleAddMemberClick = () => {
    setIsEditing(false);
    setCurrentMember(null);
    setFormData({ name: '', position: '', email: '', department: 'IT Support' });
    setIsModalOpen(true);
  };

  const handleEditMember = (member: TeamMember) => {
    setIsEditing(true);
    setCurrentMember(member);
    setFormData({
      name: member.name,
      position: member.position,
      email: member.email,
      department: member.department,
    });
    setIsModalOpen(true);
  };

  const handleSaveMember = () => {
    if (!formData.name || !formData.position || !formData.email) {
      swal.fire({ icon: 'error', title: 'Error', text: 'Semua kolom harus diisi!' });
      return;
    }

    if (isEditing && currentMember) {
      setTeamMembers(teamMembers.map(m =>
        m.id === currentMember.id 
          ? { ...m, ...formData, avatar: formData.name.charAt(0).toUpperCase() } 
          : m
      ));
      swal.fire({ icon: 'success', title: 'Berhasil!', text: 'Data anggota tim berhasil diperbarui.', timer: 1500, showConfirmButton: false });
    } else {
      const newMember: TeamMember = {
        id: String(Date.now()),
        ...formData,
        role: 'CONTRACTOR',
        phone: '+62812' + Math.floor(10000000 + Math.random() * 90000000),
        status: 'Active',
        joinDate: new Date(),
        avatar: formData.name.charAt(0).toUpperCase(),
      };
      setTeamMembers([...teamMembers, newMember]);
      swal.fire({ icon: 'success', title: 'Berhasil!', text: 'Anggota tim baru berhasil ditambahkan.', timer: 1500, showConfirmButton: false });
    }
    setIsModalOpen(false);
  };

  const handleDeleteMember = (id: string, name: string) => {
    swal.fire({
      title: 'Apakah Anda yakin?',
      text: `Anggota tim "${name}" akan dihapus secara permanen!`,
      icon: 'warning',
      showCancelButton: true,
      confirmButtonText: 'Ya, Hapus!',
      cancelButtonText: 'Batal',
    }).then((result) => {
      if (result.isConfirmed) {
        setTeamMembers(teamMembers.filter(m => m.id !== id));
        swal.fire({
          icon: 'success',
          title: 'Berhasil!',
          text: 'Anggota tim berhasil dihapus.',
        });
      }
    });
  };

  if (!user) {
    return <div className="min-h-screen bg-slate-50 flex items-center justify-center">Loading...</div>;
  }

  const getRoleColor = (role: string) => {
    switch (role) {
      case 'SUPER_ADMIN':
        return 'bg-red-100 text-red-800';
      case 'ADMIN':
        return 'bg-orange-100 text-orange-800';
      case 'MANAGER':
        return 'bg-blue-100 text-blue-800';
      case 'CONTRACTOR':
        return 'bg-green-100 text-green-800';
      case 'VIEWER':
        return 'bg-gray-100 text-gray-800';
      default:
        return 'bg-gray-100 text-gray-800';
    }
  };

  const getDepartmentColor = (dept: string) => {
    switch (dept) {
      case 'Management':
        return 'bg-purple-50';
      case 'IT Support':
        return 'bg-yellow-50';
      case 'Quality Assurance':
        return 'bg-blue-50';
      case 'IT Security':
        return 'bg-red-50';
      case 'Administration':
        return 'bg-gray-50';
      default:
        return 'bg-white';
    }
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
                <h1 className="text-3xl font-bold text-gray-900">Team Management</h1>
                <p className="text-gray-600 mt-1">Manage project team members and roles</p>
              </div>
              <Button 
                onClick={handleAddMemberClick}
                className="bg-blue-600 hover:bg-blue-700"
              >
                <Plus className="w-4 h-4 mr-2" />
                Add Team Member
              </Button>
            </div>

            {/* Team Stats */}
            <div className="grid grid-cols-1 md:grid-cols-4 gap-4 mb-8">
              <Card>
                <CardHeader className="pb-2">
                  <CardTitle className="text-sm font-medium text-gray-600">Total Members</CardTitle>
                </CardHeader>
                <CardContent>
                  <div className="text-3xl font-bold text-blue-600">{teamMembers.length}</div>
                </CardContent>
              </Card>

              <Card>
                <CardHeader className="pb-2">
                  <CardTitle className="text-sm font-medium text-gray-600">Active Users</CardTitle>
                </CardHeader>
                <CardContent>
                  <div className="text-3xl font-bold text-green-600">
                    {teamMembers.filter(m => m.status === 'Active').length}
                  </div>
                </CardContent>
              </Card>

              <Card>
                <CardHeader className="pb-2">
                  <CardTitle className="text-sm font-medium text-gray-600">Departments</CardTitle>
                </CardHeader>
                <CardContent>
                  <div className="text-3xl font-bold text-purple-600">
                    {new Set(teamMembers.map(m => m.department)).size}
                  </div>
                </CardContent>
              </Card>

              <Card>
                <CardHeader className="pb-2">
                  <CardTitle className="text-sm font-medium text-gray-600">Managers</CardTitle>
                </CardHeader>
                <CardContent>
                  <div className="text-3xl font-bold text-orange-600">
                    {teamMembers.filter(m => m.role === 'MANAGER').length}
                  </div>
                </CardContent>
              </Card>
            </div>

            {/* Team Members Grid */}
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6 mb-8">
              {teamMembers.map((member) => (
                <Card key={member.id} className={`${getDepartmentColor(member.department)} hover:shadow-md transition-shadow`}>
                  <CardContent className="p-6">
                    <div className="flex items-start justify-between mb-4">
                      <div className="flex items-center gap-4">
                        <div className="w-12 h-12 rounded-full bg-blue-600 text-white flex items-center justify-center font-bold text-lg">
                          {member.avatar}
                        </div>
                        <div>
                          <h3 className="font-semibold text-gray-900">{member.name}</h3>
                          <p className="text-sm text-gray-600">{member.position}</p>
                        </div>
                      </div>
                      <span className={`px-2 py-1 rounded-full text-xs font-semibold ${getRoleColor(member.role)}`}>
                        {member.role}
                      </span>
                    </div>

                    <div className="space-y-2 mb-4 text-sm text-gray-600">
                      <div className="flex items-center gap-2">
                        <Mail className="w-4 h-4 text-gray-400" />
                        <a href={`mailto:${member.email}`} className="text-blue-600 hover:underline">
                          {member.email}
                        </a>
                      </div>
                      <div className="flex items-center gap-2">
                        <Phone className="w-4 h-4 text-gray-400" />
                        <a href={`tel:${member.phone}`} className="hover:text-blue-600">
                          {member.phone}
                        </a>
                      </div>
                      <div className="flex items-center gap-2">
                        <Users className="w-4 h-4 text-gray-400" />
                        {member.department}
                      </div>
                    </div>

                    <div className="pt-4 border-t border-gray-200 flex justify-between">
                      <span className="text-xs text-gray-500">
                        Joined: {member.joinDate.toLocaleDateString()}
                      </span>
                      <div className="flex gap-2">
                        <Button 
                          variant="ghost" 
                          size="sm"
                          onClick={() => handleEditMember(member)}
                        >
                          <Edit className="w-4 h-4" />
                        </Button>
                        <Button 
                          variant="ghost" 
                          size="sm"
                          onClick={() => handleDeleteMember(member.id, member.name)}
                          className="text-red-600 hover:text-red-700 hover:bg-red-50"
                        >
                          <Trash2 className="w-4 h-4" />
                        </Button>
                      </div>
                    </div>
                  </CardContent>
                </Card>
              ))}
            </div>

            {/* Department Breakdown */}
            <Card>
              <CardHeader>
                <CardTitle>Department Breakdown</CardTitle>
                <CardDescription>Team members by department</CardDescription>
              </CardHeader>
              <CardContent>
                <div className="space-y-4">
                  {Array.from(new Set(teamMembers.map(m => m.department))).map((dept) => (
                    <div key={dept} className="flex items-center justify-between py-2">
                      <span className="font-medium text-gray-900">{dept}</span>
                      <span className="px-3 py-1 rounded-full bg-gray-100 text-gray-800 text-sm font-semibold">
                        {teamMembers.filter(m => m.department === dept).length} members
                      </span>
                    </div>
                  ))}
                </div>
              </CardContent>
            </Card>
          </div>
        </main>
      </div>

      {/* Member Dialog */}
      <Dialog open={isModalOpen} onOpenChange={setIsModalOpen}>
        <DialogContent className="sm:max-w-[425px] p-0 overflow-hidden bg-white rounded-2xl border-0 shadow-2xl">
          <div className="bg-gradient-to-br from-blue-600 to-blue-800 p-6 text-white relative overflow-hidden">
            <div className="absolute top-0 right-0 w-32 h-32 bg-white/10 rounded-full blur-2xl -mr-10 -mt-10"></div>
            <DialogHeader>
              <DialogTitle className="text-2xl font-bold tracking-tight text-white">
                {isEditing ? 'Edit Anggota Tim' : 'Tambah Anggota Tim'}
              </DialogTitle>
              <DialogDescription className="text-blue-100/80 mt-1.5">
                {isEditing 
                  ? 'Perbarui informasi anggota tim ini.' 
                  : 'Masukkan detail anggota tim baru untuk ditambahkan ke proyek.'}
              </DialogDescription>
            </DialogHeader>
          </div>
          <div className="p-6 space-y-5">
            <div className="space-y-2">
              <Label htmlFor="name" className="text-sm font-semibold text-slate-700">Nama Lengkap</Label>
              <Input
                id="name"
                value={formData.name}
                onChange={(e) => setFormData({ ...formData, name: e.target.value })}
                placeholder="John Doe"
                className="focus-visible:ring-blue-500/50 bg-slate-50/50 border-slate-200"
              />
            </div>
            <div className="space-y-2">
              <Label htmlFor="position" className="text-sm font-semibold text-slate-700">Jabatan</Label>
              <Input
                id="position"
                value={formData.position}
                onChange={(e) => setFormData({ ...formData, position: e.target.value })}
                placeholder="Senior IT Support"
                className="focus-visible:ring-blue-500/50 bg-slate-50/50 border-slate-200"
              />
            </div>
            <div className="space-y-2">
              <Label htmlFor="email" className="text-sm font-semibold text-slate-700">Email</Label>
              <Input
                id="email"
                type="email"
                value={formData.email}
                onChange={(e) => setFormData({ ...formData, email: e.target.value })}
                placeholder="john@fitrahpro.com"
                className="focus-visible:ring-blue-500/50 bg-slate-50/50 border-slate-200"
              />
            </div>
            <div className="space-y-2">
              <Label htmlFor="department" className="text-sm font-semibold text-slate-700">Departemen</Label>
              <select
                id="department"
                value={formData.department}
                onChange={(e) => setFormData({ ...formData, department: e.target.value })}
                className="flex h-10 w-full rounded-md border border-slate-200 bg-slate-50/50 px-3 py-2 text-sm ring-offset-background file:border-0 file:bg-transparent file:text-sm file:font-medium placeholder:text-muted-foreground focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-blue-500/50 disabled:cursor-not-allowed disabled:opacity-50"
              >
                <option value="IT Support">IT Support</option>
                <option value="Quality Assurance">Quality Assurance</option>
                <option value="IT Security">IT Security</option>
                <option value="Management">Management</option>
                <option value="Administration">Administration</option>
              </select>
            </div>
          </div>
          <DialogFooter className="p-6 bg-slate-50 border-t border-slate-100 sm:justify-end gap-2">
            <Button variant="outline" onClick={() => setIsModalOpen(false)} className="border-slate-200 text-slate-600 hover:bg-slate-100 w-full sm:w-auto">
              Batal
            </Button>
            <Button onClick={handleSaveMember} className="bg-blue-600 hover:bg-blue-700 shadow-sm shadow-blue-500/20 w-full sm:w-auto">
              {isEditing ? 'Simpan Perubahan' : 'Tambahkan'}
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
    </div>
  );
}
