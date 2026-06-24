'use client';

import { useState, useEffect } from 'react';
import { useRouter } from 'next/navigation';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import Navbar from '@/components/Navbar';
import Sidebar from '@/components/Sidebar';
import { Plus, Trash2, Edit2 } from 'lucide-react';
import swal from '@/lib/swal';

interface User {
  id: string;
  email: string;
  name: string;
  role: string;
  department?: string;
  isActive: boolean;
  lastLogin?: string;
}

export default function AdminUsersPage() {
  const router = useRouter();
  const [user, setUser] = useState<any>(null);
  const [users, setUsers] = useState<User[]>([]);
  const [loading, setLoading] = useState(true);
  const [showForm, setShowForm] = useState(false);
  const [formData, setFormData] = useState({
    name: '',
    email: '',
    password: '',
    role: 'VIEWER',
    department: '',
  });

  const roles = ['SUPER_ADMIN', 'ADMIN', 'FUNCTIONAL_TEAM', 'DEVELOPER', 'QA', 'VIEWER'];

  // Mock users data
  const mockUsers: User[] = [
    {
      id: '1',
      email: 'fitrahramdhan31@gmail.com',
      name: 'Admin User',
      role: 'SUPER_ADMIN',
      department: 'Management',
      isActive: true,
      lastLogin: new Date().toISOString(),
    },
    {
      id: '2',
      email: 'agent1@vibedesk.com',
      name: 'Functional QA',
      role: 'QA',
      department: 'Testing',
      isActive: true,
      lastLogin: new Date(Date.now() - 3600000).toISOString(),
    },
    {
      id: '3',
      email: 'agent2@vibedesk.com',
      name: 'Backend Dev',
      role: 'DEVELOPER',
      department: 'Engineering',
      isActive: true,
      lastLogin: new Date(Date.now() - 7200000).toISOString(),
    },
    {
      id: '4',
      email: 'viewer@vibedesk.com',
      name: 'Viewer User',
      role: 'VIEWER',
      department: 'Management',
      isActive: true,
      lastLogin: new Date(Date.now() - 86400000).toISOString(),
    },
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
      setUsers(mockUsers);
      setLoading(false);
    };

    checkAuth();
  }, [router]);

  const handleAddUser = async () => {
    if (!formData.name || !formData.email) {
      swal.fire({
        icon: 'warning',
        title: 'Input Tidak Lengkap',
        text: 'Mohon isi semua bidang yang wajib diisi.',
      });
      return;
    }

    const newUser: User = {
      id: String(users.length + 1),
      email: formData.email,
      name: formData.name,
      role: formData.role,
      department: formData.department,
      isActive: true,
    };

    setUsers([...users, newUser]);
    setFormData({
      name: '',
      email: '',
      password: '',
      role: 'VIEWER',
      department: '',
    });
    setShowForm(false);
    swal.fire({
      icon: 'success',
      title: 'Berhasil!',
      text: 'Pengguna baru berhasil ditambahkan.',
    });
  };

  const handleDeleteUser = async (userId: string) => {
    if (userId === user.id) {
      swal.fire({
        icon: 'error',
        title: 'Gagal',
        text: 'Anda tidak dapat menghapus akun Anda sendiri.',
      });
      return;
    }

    const result = await swal.fire({
      title: 'Apakah Anda yakin?',
      text: 'Pengguna ini akan dihapus dari sistem!',
      icon: 'warning',
      showCancelButton: true,
      confirmButtonText: 'Ya, Hapus!',
      cancelButtonText: 'Batal',
    });

    if (result.isConfirmed) {
      setUsers(users.filter(u => u.id !== userId));
      swal.fire({
        icon: 'success',
        title: 'Berhasil!',
        text: 'Pengguna berhasil dihapus.',
      });
    }
  };

  const handleToggleActive = (userId: string) => {
    setUsers(users.map(u =>
      u.id === userId ? { ...u, isActive: !u.isActive } : u
    ));
  };

  if (!user) {
    return null;
  }

  const activeUsers = users.filter(u => u.isActive).length;
  const adminUsers = users.filter(u => u.role === 'SUPER_ADMIN' || u.role === 'ADMIN').length;

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
                <h1 className="text-3xl font-bold text-gray-900">User Management</h1>
                <p className="text-gray-600 mt-1">Manage admin users and support agents</p>
              </div>
              <Button
                className="bg-blue-600 hover:bg-blue-700 flex items-center gap-2"
                onClick={() => setShowForm(!showForm)}
              >
                <Plus className="w-4 h-4" />
                Add User
              </Button>
            </div>

            {/* Quick Stats */}
            <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mb-8">
              <Card>
                <CardContent className="pt-6">
                  <p className="text-sm text-gray-600 mb-2">Total Users</p>
                  <p className="text-3xl font-bold text-blue-600">{users.length}</p>
                </CardContent>
              </Card>

              <Card>
                <CardContent className="pt-6">
                  <p className="text-sm text-gray-600 mb-2">Active Users</p>
                  <p className="text-3xl font-bold text-green-600">{activeUsers}</p>
                </CardContent>
              </Card>

              <Card>
                <CardContent className="pt-6">
                  <p className="text-sm text-gray-600 mb-2">Admins</p>
                  <p className="text-3xl font-bold text-purple-600">{adminUsers}</p>
                </CardContent>
              </Card>
            </div>

            {/* Add User Form */}
            {showForm && (
              <Card className="mb-8 bg-blue-50 border-blue-200">
                <CardHeader>
                  <CardTitle>Add New User</CardTitle>
                </CardHeader>
                <CardContent>
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                    <div>
                      <label className="block text-sm font-medium text-gray-700 mb-2">
                        Full Name
                      </label>
                      <input
                        type="text"
                        value={formData.name}
                        onChange={(e) => setFormData({ ...formData, name: e.target.value })}
                        className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
                        placeholder="John Doe"
                      />
                    </div>

                    <div>
                      <label className="block text-sm font-medium text-gray-700 mb-2">
                        Email
                      </label>
                      <input
                        type="email"
                        value={formData.email}
                        onChange={(e) => setFormData({ ...formData, email: e.target.value })}
                        className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
                        placeholder="john@example.com"
                      />
                    </div>

                    <div>
                      <label className="block text-sm font-medium text-gray-700 mb-2">
                        Role
                      </label>
                      <select
                        value={formData.role}
                        onChange={(e) => setFormData({ ...formData, role: e.target.value })}
                        className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
                      >
                        {roles.map((role) => (
                          <option key={role} value={role}>
                            {role}
                          </option>
                        ))}
                      </select>
                    </div>

                    <div>
                      <label className="block text-sm font-medium text-gray-700 mb-2">
                        Department
                      </label>
                      <input
                        type="text"
                        value={formData.department}
                        onChange={(e) => setFormData({ ...formData, department: e.target.value })}
                        className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
                        placeholder="Support"
                      />
                    </div>
                  </div>

                  <div className="flex gap-3 mt-6">
                    <Button
                      className="bg-blue-600 hover:bg-blue-700"
                      onClick={handleAddUser}
                    >
                      Create User
                    </Button>
                    <Button
                      variant="outline"
                      onClick={() => {
                        setShowForm(false);
                        setFormData({
                          name: '',
                          email: '',
                          password: '',
                          role: 'VIEWER',
                          department: '',
                        });
                      }}
                    >
                      Cancel
                    </Button>
                  </div>
                </CardContent>
              </Card>
            )}

            {/* Users Table */}
            <Card>
              <CardContent className="pt-6">
                {loading ? (
                  <div className="text-center py-8">
                    <p className="text-gray-500">Loading users...</p>
                  </div>
                ) : users.length === 0 ? (
                  <div className="text-center py-8">
                    <p className="text-gray-500">No users found</p>
                  </div>
                ) : (
                  <div className="overflow-x-auto">
                    <table className="w-full">
                      <thead>
                        <tr className="border-b">
                          <th className="text-left py-3 px-4 font-semibold text-gray-700">Name</th>
                          <th className="text-left py-3 px-4 font-semibold text-gray-700">Email</th>
                          <th className="text-left py-3 px-4 font-semibold text-gray-700">Role</th>
                          <th className="text-left py-3 px-4 font-semibold text-gray-700">Department</th>
                          <th className="text-left py-3 px-4 font-semibold text-gray-700">Status</th>
                          <th className="text-left py-3 px-4 font-semibold text-gray-700">Last Login</th>
                          <th className="text-center py-3 px-4 font-semibold text-gray-700">Actions</th>
                        </tr>
                      </thead>
                      <tbody>
                        {users.map((u) => (
                          <tr key={u.id} className="border-b hover:bg-gray-50">
                            <td className="py-3 px-4 font-medium text-gray-900">{u.name}</td>
                            <td className="py-3 px-4 text-gray-600">{u.email}</td>
                            <td className="py-3 px-4">
                              <span className={`px-3 py-1 rounded-full text-xs font-medium ${
                                u.role === 'SUPER_ADMIN' ? 'bg-purple-100 text-purple-800' :
                                u.role === 'ADMIN' ? 'bg-blue-100 text-blue-800' :
                                u.role === 'FUNCTIONAL_TEAM' ? 'bg-indigo-100 text-indigo-800' :
                                u.role === 'DEVELOPER' ? 'bg-green-100 text-green-800' :
                                u.role === 'QA' ? 'bg-orange-100 text-orange-800' :
                                'bg-gray-100 text-gray-800'
                              }`}>
                                {u.role}
                              </span>
                            </td>
                            <td className="py-3 px-4 text-gray-600">{u.department || '-'}</td>
                            <td className="py-3 px-4">
                              <button
                                onClick={() => handleToggleActive(u.id)}
                                className={`px-3 py-1 rounded-full text-xs font-medium ${
                                  u.isActive ? 'bg-green-100 text-green-800' : 'bg-red-100 text-red-800'
                                }`}
                              >
                                {u.isActive ? 'Active' : 'Inactive'}
                              </button>
                            </td>
                            <td className="py-3 px-4 text-sm text-gray-600">
                              {u.lastLogin ? new Date(u.lastLogin).toLocaleDateString() : 'Never'}
                            </td>
                            <td className="py-3 px-4 text-center space-x-2">
                              <Button
                                size="sm"
                                variant="ghost"
                                onClick={() => swal.fire({
                                  icon: 'info',
                                  title: 'Informasi',
                                  text: 'Fitur edit pengguna akan segera hadir!',
                                })}
                              >
                                <Edit2 className="w-4 h-4" />
                              </Button>
                              <Button
                                size="sm"
                                variant="ghost"
                                className="text-red-600 hover:text-red-700"
                                onClick={() => handleDeleteUser(u.id)}
                              >
                                <Trash2 className="w-4 h-4" />
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
          </div>
        </main>
      </div>
    </div>
  );
}
