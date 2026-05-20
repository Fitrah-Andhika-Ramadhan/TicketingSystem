'use client';

import { useEffect, useState } from 'react';
import { useRouter } from 'next/navigation';
import Link from 'next/link';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import Sidebar from '@/components/Sidebar';
import Navbar from '@/components/Navbar';
import { Upload, Trash2, Edit2, Plus, Image as ImageIcon, Video, ExternalLink, Eye } from 'lucide-react';
import swal from '@/lib/swal';

interface Media {
  id: string;
  type: 'image' | 'video';
  title: string;
  description: string;
  url: string;
  thumbnail: string;
  position: number;
  featured: boolean;
  uploadedAt: string;
}

export default function MediaManager() {
  const router = useRouter();
  const [user, setUser] = useState<any>(null);
  const [media, setMedia] = useState<Media[]>([]);
  const [loading, setLoading] = useState(true);
  const [showForm, setShowForm] = useState(false);
  const [editingId, setEditingId] = useState<string | null>(null);

  const [formData, setFormData] = useState({
    type: 'image',
    title: '',
    description: '',
    url: '',
    thumbnail: '',
    featured: false,
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
      if (!['SUPER_ADMIN', 'ADMIN'].includes(parsedUser.role)) {
        router.push('/dashboard');
        return;
      }

      setUser(parsedUser);
      fetchMedia(token);
    };

    checkAuth();
  }, [router]);

  const fetchMedia = async (token: string) => {
    try {
      setLoading(true);
      const response = await fetch('/api/landing/media', {
        headers: { Authorization: `Bearer ${token}` },
      });
      const data = await response.json();
      if (data.success) {
        setMedia(data.data);
      }
    } catch (error) {
      console.error('Failed to fetch media:', error);
    } finally {
      setLoading(false);
    }
  };

  const handleAddClick = () => {
    setEditingId(null);
    setFormData({
      type: 'image',
      title: '',
      description: '',
      url: '',
      thumbnail: '',
      featured: false,
    });
    setShowForm(true);
  };

  const handleEditClick = (item: Media) => {
    setEditingId(item.id);
    setFormData({
      type: item.type,
      title: item.title,
      description: item.description,
      url: item.url,
      thumbnail: item.thumbnail,
      featured: item.featured,
    });
    setShowForm(true);
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    const token = localStorage.getItem('token');

    if (!token) {
      swal.fire({
        icon: 'error',
        title: 'Sesi Berakhir',
        text: 'Silakan login kembali.',
      });
      return;
    }

    try {
      const method = editingId ? 'PUT' : 'POST';
      const url = '/api/landing/media';
      const body = editingId ? { id: editingId, ...formData } : formData;

      const response = await fetch(url, {
        method,
        headers: {
          'Content-Type': 'application/json',
          Authorization: `Bearer ${token}`,
        },
        body: JSON.stringify(body),
      });

      const data = await response.json();

      if (data.success) {
        setShowForm(false);
        fetchMedia(token);
        swal.fire({
          icon: 'success',
          title: 'Berhasil!',
          text: editingId ? 'Media berhasil diperbarui.' : 'Media berhasil ditambahkan.',
        });
      } else {
        swal.fire({
          icon: 'error',
          title: 'Gagal',
          text: data.error || 'Gagal menyimpan media.',
        });
      }
    } catch (error) {
      console.error('Error saving media:', error);
      swal.fire({
        icon: 'error',
        title: 'Gagal',
        text: 'Gagal menyimpan media.',
      });
    }
  };

  const handleDelete = async (id: string) => {
    const result = await swal.fire({
      title: 'Apakah Anda yakin?',
      text: 'Media ini akan dihapus secara permanen!',
      icon: 'warning',
      showCancelButton: true,
      confirmButtonText: 'Ya, Hapus!',
      cancelButtonText: 'Batal',
    });

    if (!result.isConfirmed) return;

    const token = localStorage.getItem('token');
    if (!token) return;

    try {
      const response = await fetch(`/api/landing/media?id=${id}`, {
        method: 'DELETE',
        headers: { Authorization: `Bearer ${token}` },
      });

      const data = await response.json();

      if (data.success) {
        fetchMedia(token);
        swal.fire({
          icon: 'success',
          title: 'Berhasil!',
          text: 'Media berhasil dihapus.',
        });
      } else {
        swal.fire({
          icon: 'error',
          title: 'Gagal',
          text: data.error || 'Gagal menghapus media.',
        });
      }
    } catch (error) {
      console.error('Error deleting media:', error);
      swal.fire({
        icon: 'error',
        title: 'Gagal',
        text: 'Gagal menghapus media.',
      });
    }
  };

  if (!user) {
    return (
      <div className="flex items-center justify-center min-h-screen">
        <div className="text-center">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-600 mx-auto"></div>
          <p className="mt-4 text-gray-600">Loading...</p>
        </div>
      </div>
    );
  }

  return (
    <div className="flex h-screen bg-slate-50">
      <Sidebar user={user} />
      
      <div className="flex-1 flex flex-col overflow-hidden">
        <Navbar user={user} />

        <main className="flex-1 overflow-auto">
          <div className="p-8 max-w-6xl mx-auto">
            <div className="mb-8 flex justify-between items-start">
              <div>
                <h1 className="text-3xl font-bold text-gray-900">Media Manager</h1>
                <p className="text-gray-600 mt-1">Add, edit, and manage images and videos on the landing page</p>
              </div>
              <Button 
                onClick={handleAddClick}
                className="bg-blue-600 hover:bg-blue-700 flex items-center gap-2"
              >
                <Plus className="w-4 h-4" />
                Add Media
              </Button>
            </div>

            {/* Quick Access Section */}
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mb-8">
              {/* Preview Landing */}
              <Card className="bg-blue-50 border-blue-200">
                <CardHeader>
                  <CardTitle className="flex items-center gap-2">
                    <Eye className="w-5 h-5" />
                    Preview Landing
                  </CardTitle>
                  <CardDescription>See how media appears on landing page</CardDescription>
                </CardHeader>
                <CardContent>
                  <Link href="/landing" target="_blank">
                    <Button className="w-full bg-blue-600 hover:bg-blue-700 flex items-center justify-center gap-2">
                      <ExternalLink className="w-4 h-4" />
                      Open Landing Page
                    </Button>
                  </Link>
                </CardContent>
              </Card>

              {/* Manage Content */}
              <Card className="bg-green-50 border-green-200">
                <CardHeader>
                  <CardTitle className="flex items-center gap-2">
                    <Eye className="w-5 h-5" />
                    Manage Content
                  </CardTitle>
                  <CardDescription>Edit hero, stats, and about section</CardDescription>
                </CardHeader>
                <CardContent>
                  <Link href="/admin/landing-manager">
                    <Button className="w-full bg-green-600 hover:bg-green-700 flex items-center justify-center gap-2">
                      <ExternalLink className="w-4 h-4" />
                      Go to Landing Manager
                    </Button>
                  </Link>
                </CardContent>
              </Card>
            </div>

            {/* Add/Edit Form */}
            {showForm && (
              <Card className="mb-8">
                <CardHeader>
                  <CardTitle>{editingId ? 'Edit Media' : 'Add New Media'}</CardTitle>
                </CardHeader>
                <CardContent>
                  <form onSubmit={handleSubmit} className="space-y-4">
                    <div className="grid grid-cols-2 gap-4">
                      <div>
                        <label className="block text-sm font-medium text-gray-700 mb-1">
                          Media Type
                        </label>
                        <select
                          value={formData.type}
                          onChange={(e) => setFormData({ ...formData, type: e.target.value as 'image' | 'video' })}
                          className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
                        >
                          <option value="image">Image</option>
                          <option value="video">Video</option>
                        </select>
                      </div>

                      <div>
                        <label className="block text-sm font-medium text-gray-700 mb-1">
                          Title
                        </label>
                        <Input
                          type="text"
                          value={formData.title}
                          onChange={(e) => setFormData({ ...formData, title: e.target.value })}
                          placeholder="Media title"
                          required
                        />
                      </div>
                    </div>

                    <div>
                      <label className="block text-sm font-medium text-gray-700 mb-1">
                        Description
                      </label>
                      <textarea
                        value={formData.description}
                        onChange={(e) => setFormData({ ...formData, description: e.target.value })}
                        placeholder="Media description"
                        className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
                        rows={3}
                      />
                    </div>

                    <div>
                      <label className="block text-sm font-medium text-gray-700 mb-1">
                        Media URL {formData.type === 'video' && '(YouTube embed URL)'}
                      </label>
                      <Input
                        type="text"
                        value={formData.url}
                        onChange={(e) => setFormData({ ...formData, url: e.target.value })}
                        placeholder={formData.type === 'video' ? 'https://www.youtube.com/embed/...' : 'https://...'}
                        required
                      />
                    </div>

                    {formData.type === 'image' && (
                      <div>
                        <label className="block text-sm font-medium text-gray-700 mb-1">
                          Thumbnail URL (optional)
                        </label>
                        <Input
                          type="text"
                          value={formData.thumbnail}
                          onChange={(e) => setFormData({ ...formData, thumbnail: e.target.value })}
                          placeholder="https://..."
                        />
                      </div>
                    )}

                    <div className="flex items-center gap-2">
                      <input
                        type="checkbox"
                        id="featured"
                        checked={formData.featured}
                        onChange={(e) => setFormData({ ...formData, featured: e.target.checked })}
                        className="w-4 h-4"
                      />
                      <label htmlFor="featured" className="text-sm font-medium text-gray-700">
                        Mark as featured on landing page
                      </label>
                    </div>

                    <div className="flex gap-2 pt-4">
                      <Button type="submit" className="bg-blue-600 hover:bg-blue-700">
                        {editingId ? 'Update Media' : 'Add Media'}
                      </Button>
                      <Button 
                        type="button" 
                        onClick={() => setShowForm(false)}
                        variant="outline"
                      >
                        Cancel
                      </Button>
                    </div>
                  </form>
                </CardContent>
              </Card>
            )}

            {/* Media List */}
            <div className="space-y-4">
              <h2 className="text-xl font-semibold text-gray-900">All Media ({media.length})</h2>
              
              {loading ? (
                <div className="text-center py-8 text-gray-500">Loading media...</div>
              ) : media.length === 0 ? (
                <Card>
                  <CardContent className="p-8 text-center">
                    <p className="text-gray-500">No media uploaded yet. Add your first image or video!</p>
                  </CardContent>
                </Card>
              ) : (
                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
                  {media.map((item) => (
                    <Card key={item.id} className="hover:shadow-lg transition">
                      <CardContent className="p-4">
                        {/* Thumbnail Preview */}
                        <div className="mb-4 bg-gray-100 rounded-lg overflow-hidden h-40">
                          {item.type === 'image' ? (
                            <img 
                              src={item.thumbnail || item.url} 
                              alt={item.title}
                              className="w-full h-full object-cover"
                            />
                          ) : (
                            <div className="w-full h-full flex items-center justify-center bg-gray-200">
                              <Video className="w-12 h-12 text-gray-400" />
                            </div>
                          )}
                        </div>

                        {/* Media Info */}
                        <div className="space-y-2 mb-4">
                          <div className="flex items-center gap-2">
                            {item.type === 'image' ? (
                              <ImageIcon className="w-4 h-4 text-blue-600" />
                            ) : (
                              <Video className="w-4 h-4 text-red-600" />
                            )}
                            <span className="text-xs font-semibold text-gray-600 uppercase">
                              {item.type}
                            </span>
                            {item.featured && (
                              <span className="text-xs font-semibold text-amber-600 bg-amber-50 px-2 py-1 rounded">
                                Featured
                              </span>
                            )}
                          </div>
                          
                          <h3 className="font-semibold text-gray-900 line-clamp-2">{item.title}</h3>
                          <p className="text-sm text-gray-600 line-clamp-2">{item.description}</p>
                          
                          <div className="text-xs text-gray-500 pt-2 border-t">
                            Position: {item.position}
                          </div>
                        </div>

                        {/* Actions */}
                        <div className="flex gap-2">
                          <Button
                            onClick={() => handleEditClick(item)}
                            size="sm"
                            variant="outline"
                            className="flex-1 flex items-center justify-center gap-2"
                          >
                            <Edit2 className="w-4 h-4" />
                            Edit
                          </Button>
                          <Button
                            onClick={() => handleDelete(item.id)}
                            size="sm"
                            variant="outline"
                            className="flex-1 flex items-center justify-center gap-2 text-red-600 hover:text-red-700"
                          >
                            <Trash2 className="w-4 h-4" />
                            Delete
                          </Button>
                        </div>
                      </CardContent>
                    </Card>
                  ))}
                </div>
              )}
            </div>
          </div>
        </main>
      </div>
    </div>
  );
}
