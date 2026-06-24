'use client';

import { useState, useEffect } from 'react';
import { useRouter } from 'next/navigation';
import Link from 'next/link';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import Navbar from '@/components/Navbar';
import Sidebar from '@/components/Sidebar';
import { Save, Edit2, ExternalLink, Eye } from 'lucide-react';
import swal from '@/lib/swal';

interface LandingContent {
  hero: {
    title: string;
    subtitle: string;
    description: string;
    ctaText: string;
  };
  stats: {
    projects: number;
    units: number;
    yearsExperience: number;
    satisfaction: number;
  };
  about: {
    title: string;
    description: string;
    mission: string;
    vision: string;
  };
}

export default function LandingManager() {
  const router = useRouter();
  const [user, setUser] = useState(null);
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);
  const [content, setContent] = useState<LandingContent | null>(null);
  const [editingSection, setEditingSection] = useState<string | null>(null);

  useEffect(() => {
    const checkAuth = () => {
      const storedUser = localStorage.getItem('user');
      const token = localStorage.getItem('token');

      if (!token || !storedUser) {
        router.push('/login');
        return;
      }

      const parsedUser = JSON.parse(storedUser);
      if (parsedUser.role !== 'SUPER_ADMIN' && parsedUser.role !== 'ADMIN') {
        router.push('/dashboard');
        return;
      }

      setUser(parsedUser);
      fetchContent(token);
    };

    checkAuth();
  }, [router]);

  const fetchContent = async (token: string) => {
    try {
      const response = await fetch('/api/landing/content', {
        headers: {
          Authorization: `Bearer ${token}`,
        },
      });
      const data = await response.json();
      if (data.success) {
        setContent(data.data);
      }
    } catch (error) {
      console.error('Failed to fetch content:', error);
    } finally {
      setLoading(false);
    }
  };

  const handleSave = async () => {
    if (!content) return;
    
    setSaving(true);
    try {
      const token = localStorage.getItem('token');
      const response = await fetch('/api/landing/content', {
        method: 'PUT',
        headers: {
          'Content-Type': 'application/json',
          Authorization: `Bearer ${token}`,
        },
        body: JSON.stringify(content),
      });

      const data = await response.json();
      if (data.success) {
        setEditingSection(null);
        swal.fire({
          icon: 'success',
          title: 'Berhasil!',
          text: 'Konten landing page berhasil disimpan.',
        });
      } else {
        swal.fire({
          icon: 'error',
          title: 'Gagal',
          text: data.error || 'Gagal menyimpan perubahan.',
        });
      }
    } catch (error) {
      console.error('Failed to save:', error);
      swal.fire({
        icon: 'error',
        title: 'Gagal',
        text: 'Gagal menyimpan perubahan.',
      });
    } finally {
      setSaving(false);
    }
  };

  if (loading) {
    return (
      <div className="flex h-screen bg-slate-50">
        <Sidebar user={user} />
        <div className="flex-1 flex flex-col">
          <Navbar user={user} />
          <div className="flex items-center justify-center flex-1">
            <p>Loading...</p>
          </div>
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

            {/* Page Header */}
            <div className="mb-8">
              <h1 className="text-3xl font-bold text-gray-900">Manage Landing Page</h1>
              <p className="text-gray-600 mt-2">Edit hero section, statistics, and about content</p>
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
                  <CardDescription>See how your landing page looks</CardDescription>
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


              {/* Statistics */}
              <Card className="bg-green-50 border-green-200">
                <CardHeader>
                  <CardTitle className="flex items-center gap-2">
                    <Eye className="w-5 h-5" />
                    Landing Info
                  </CardTitle>
                  <CardDescription>Public access details</CardDescription>
                </CardHeader>
                <CardContent>
                  <div className="text-sm text-gray-600 mb-3">
                    <p>Public URL: <code className="bg-gray-100 px-2 py-1 rounded text-xs">/landing</code></p>
                  </div>
                  <p className="text-xs text-gray-500">Anyone can view the landing page without login</p>
                </CardContent>
              </Card>
            </div>

            {/* Hero Section */}
            <Card className="mb-6">
              <CardHeader className="flex flex-row items-center justify-between">
                <div>
                  <CardTitle>Hero Section</CardTitle>
                  <CardDescription>Main headline and description</CardDescription>
                </div>
                <Button
                  variant={editingSection === 'hero' ? 'default' : 'outline'}
                  size="sm"
                  onClick={() => setEditingSection(editingSection === 'hero' ? null : 'hero')}
                >
                  <Edit2 className="w-4 h-4" />
                </Button>
              </CardHeader>

              <CardContent className="space-y-4">
                <div>
                  <label className="text-sm font-medium">Title</label>
                  <input
                    type="text"
                    value={content?.hero.title || ''}
                    onChange={(e) => setContent({
                      ...content!,
                      hero: { ...content!.hero, title: e.target.value }
                    })}
                    disabled={editingSection !== 'hero'}
                    className="w-full p-2 border rounded-lg disabled:bg-gray-100"
                  />
                </div>

                <div>
                  <label className="text-sm font-medium">Subtitle</label>
                  <input
                    type="text"
                    value={content?.hero.subtitle || ''}
                    onChange={(e) => setContent({
                      ...content!,
                      hero: { ...content!.hero, subtitle: e.target.value }
                    })}
                    disabled={editingSection !== 'hero'}
                    className="w-full p-2 border rounded-lg disabled:bg-gray-100"
                  />
                </div>

                <div>
                  <label className="text-sm font-medium">Description</label>
                  <textarea
                    value={content?.hero.description || ''}
                    onChange={(e) => setContent({
                      ...content!,
                      hero: { ...content!.hero, description: e.target.value }
                    })}
                    disabled={editingSection !== 'hero'}
                    className="w-full p-2 border rounded-lg h-24 disabled:bg-gray-100"
                  />
                </div>

                {editingSection === 'hero' && (
                  <Button onClick={handleSave} disabled={saving} className="w-full">
                    <Save className="w-4 h-4 mr-2" />
                    Save Changes
                  </Button>
                )}
              </CardContent>
            </Card>

            {/* Statistics Section */}
            <Card className="mb-6">
              <CardHeader className="flex flex-row items-center justify-between">
                <div>
                  <CardTitle>Company Statistics</CardTitle>
                  <CardDescription>Key metrics displayed on landing page</CardDescription>
                </div>
                <Button
                  variant={editingSection === 'stats' ? 'default' : 'outline'}
                  size="sm"
                  onClick={() => setEditingSection(editingSection === 'stats' ? null : 'stats')}
                >
                  <Edit2 className="w-4 h-4" />
                </Button>
              </CardHeader>

              <CardContent className="space-y-4">
                <div className="grid grid-cols-4 gap-4">
                  <div>
                    <label className="text-sm font-medium">Projects</label>
                    <input
                      type="number"
                      value={content?.stats.projects || 0}
                      onChange={(e) => setContent({
                        ...content!,
                        stats: { ...content!.stats, projects: parseInt(e.target.value) }
                      })}
                      disabled={editingSection !== 'stats'}
                      className="w-full p-2 border rounded-lg disabled:bg-gray-100"
                    />
                  </div>

                  <div>
                    <label className="text-sm font-medium">Units</label>
                    <input
                      type="number"
                      value={content?.stats.units || 0}
                      onChange={(e) => setContent({
                        ...content!,
                        stats: { ...content!.stats, units: parseInt(e.target.value) }
                      })}
                      disabled={editingSection !== 'stats'}
                      className="w-full p-2 border rounded-lg disabled:bg-gray-100"
                    />
                  </div>

                  <div>
                    <label className="text-sm font-medium">Years Experience</label>
                    <input
                      type="number"
                      value={content?.stats.yearsExperience || 0}
                      onChange={(e) => setContent({
                        ...content!,
                        stats: { ...content!.stats, yearsExperience: parseInt(e.target.value) }
                      })}
                      disabled={editingSection !== 'stats'}
                      className="w-full p-2 border rounded-lg disabled:bg-gray-100"
                    />
                  </div>

                  <div>
                    <label className="text-sm font-medium">Satisfaction %</label>
                    <input
                      type="number"
                      value={content?.stats.satisfaction || 0}
                      onChange={(e) => setContent({
                        ...content!,
                        stats: { ...content!.stats, satisfaction: parseInt(e.target.value) }
                      })}
                      disabled={editingSection !== 'stats'}
                      className="w-full p-2 border rounded-lg disabled:bg-gray-100"
                    />
                  </div>
                </div>

                {editingSection === 'stats' && (
                  <Button onClick={handleSave} disabled={saving} className="w-full">
                    <Save className="w-4 h-4 mr-2" />
                    Save Changes
                  </Button>
                )}
              </CardContent>
            </Card>

            {/* About Section */}
            <Card>
              <CardHeader className="flex flex-row items-center justify-between">
                <div>
                  <CardTitle>About Company</CardTitle>
                  <CardDescription>Company description, mission, and vision</CardDescription>
                </div>
                <Button
                  variant={editingSection === 'about' ? 'default' : 'outline'}
                  size="sm"
                  onClick={() => setEditingSection(editingSection === 'about' ? null : 'about')}
                >
                  <Edit2 className="w-4 h-4" />
                </Button>
              </CardHeader>

              <CardContent className="space-y-4">
                <div>
                  <label className="text-sm font-medium">Company Title</label>
                  <input
                    type="text"
                    value={content?.about.title || ''}
                    onChange={(e) => setContent({
                      ...content!,
                      about: { ...content!.about, title: e.target.value }
                    })}
                    disabled={editingSection !== 'about'}
                    className="w-full p-2 border rounded-lg disabled:bg-gray-100"
                  />
                </div>

                <div>
                  <label className="text-sm font-medium">Description</label>
                  <textarea
                    value={content?.about.description || ''}
                    onChange={(e) => setContent({
                      ...content!,
                      about: { ...content!.about, description: e.target.value }
                    })}
                    disabled={editingSection !== 'about'}
                    className="w-full p-2 border rounded-lg h-20 disabled:bg-gray-100"
                  />
                </div>

                <div>
                  <label className="text-sm font-medium">Mission</label>
                  <input
                    type="text"
                    value={content?.about.mission || ''}
                    onChange={(e) => setContent({
                      ...content!,
                      about: { ...content!.about, mission: e.target.value }
                    })}
                    disabled={editingSection !== 'about'}
                    className="w-full p-2 border rounded-lg disabled:bg-gray-100"
                  />
                </div>

                <div>
                  <label className="text-sm font-medium">Vision</label>
                  <input
                    type="text"
                    value={content?.about.vision || ''}
                    onChange={(e) => setContent({
                      ...content!,
                      about: { ...content!.about, vision: e.target.value }
                    })}
                    disabled={editingSection !== 'about'}
                    className="w-full p-2 border rounded-lg disabled:bg-gray-100"
                  />
                </div>

                {editingSection === 'about' && (
                  <Button onClick={handleSave} disabled={saving} className="w-full">
                    <Save className="w-4 h-4 mr-2" />
                    Save Changes
                  </Button>
                )}
              </CardContent>
            </Card>
          </div>
        </main>
      </div>
    </div>
  );
}
