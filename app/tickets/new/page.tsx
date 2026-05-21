'use client';

import { useState, useEffect } from 'react';
import { useRouter } from 'next/navigation';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import Navbar from '@/components/Navbar';
import Sidebar from '@/components/Sidebar';
import { ArrowLeft, Image as ImageIcon, X } from 'lucide-react';
import { toast } from 'sonner';

export default function NewTicketPage() {
  const router = useRouter();
  const [user, setUser] = useState<any>(null);
  const [loading, setLoading] = useState(true);

  const [title, setTitle] = useState('');
  const [description, setDescription] = useState('');
  const [category, setCategory] = useState('SUPPORT');
  const [priority, setPriority] = useState('MEDIUM');
  const [submitting, setSubmitting] = useState(false);
  const [attachment, setAttachment] = useState<string | null>(null);

  useEffect(() => {
    const storedUser = localStorage.getItem('user');
    const token = localStorage.getItem('token');

    if (!token || !storedUser) {
      router.push('/login');
      return;
    }

    setUser(JSON.parse(storedUser));
    setLoading(false);
  }, [router]);

  const handleImageUpload = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;

    if (file.size > 2 * 1024 * 1024) {
      toast.error('Ukuran gambar maksimal 2MB');
      return;
    }

    const reader = new FileReader();
    reader.onloadend = () => {
      setAttachment(reader.result as string);
    };
    reader.readAsDataURL(file);
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!title.trim() || !description.trim()) return;

    setSubmitting(true);
    try {
      const token = localStorage.getItem('token');
      const response = await fetch('/api/tickets', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          Authorization: `Bearer ${token}`,
        },
        body: JSON.stringify({
          title,
          description,
          category,
          priority,
          attachments: attachment ? [attachment] : []
        }),
      });

      const data = await response.json();
      if (data.success) {
        toast.success('Tiket baru berhasil dibuat!');
        router.push('/tickets');
      } else {
        toast.error(data.error || 'Gagal membuat tiket.');
      }
    } catch (error) {
      console.error('Create ticket failed:', error);
      toast.error('Terjadi kesalahan koneksi saat membuat tiket.');
    } finally {
      setSubmitting(false);
    }
  };

  if (loading || !user) return null;

  return (
    <div className="flex h-screen bg-slate-50">
      <Sidebar user={user} />
      <div className="flex-1 flex flex-col overflow-hidden">
        <Navbar user={user} />
        <main className="flex-1 overflow-auto p-4 md:p-8">
          <div className="max-w-3xl mx-auto">
            <div className="mb-6 flex items-center gap-4">
              <Button variant="outline" onClick={() => router.push(user.role === 'USER' ? '/dashboard' : '/tickets')} className="h-9 px-3">
                <ArrowLeft className="w-4 h-4 mr-1.5" /> Kembali
              </Button>
              <h1 className="text-2xl font-bold text-slate-800">Buat Tiket Baru</h1>
            </div>

            <Card className="shadow-sm">
              <CardContent className="p-6">
                <form onSubmit={handleSubmit} className="space-y-6">
                  <div>
                    <label className="block text-sm font-semibold text-slate-700 mb-1.5">Judul Kendala <span className="text-rose-500">*</span></label>
                    <input
                      type="text"
                      placeholder="Contoh: Aplikasi tidak bisa dibuka"
                      value={title}
                      onChange={(e) => setTitle(e.target.value)}
                      className="w-full px-4 py-2 border border-slate-200 rounded-lg focus:ring-2 focus:ring-blue-500 text-sm"
                      required
                    />
                  </div>

                  <div>
                    <label className="block text-sm font-semibold text-slate-700 mb-1.5">Deskripsi Lengkap <span className="text-rose-500">*</span></label>
                    <textarea
                      placeholder="Jelaskan kendala Anda sedetail mungkin..."
                      value={description}
                      onChange={(e) => setDescription(e.target.value)}
                      className="w-full px-4 py-2 border border-slate-200 rounded-lg focus:ring-2 focus:ring-blue-500 text-sm min-h-[120px] resize-y"
                      required
                    />
                  </div>

                  <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                    <div>
                      <label className="block text-sm font-semibold text-slate-700 mb-1.5">Kategori</label>
                      <select
                        value={category}
                        onChange={(e) => setCategory(e.target.value)}
                        className="w-full px-4 py-2 border border-slate-200 rounded-lg focus:ring-2 focus:ring-blue-500 text-sm bg-white"
                      >
                        <option value="BUG">Bug / Error Aplikasi</option>
                        <option value="SUPPORT">Bantuan Teknis</option>
                        <option value="GENERAL_INQUIRY">Pertanyaan Umum</option>
                        <option value="FEATURE_REQUEST">Permintaan Fitur</option>
                      </select>
                    </div>
                    {user.role !== 'USER' && (
                      <div>
                        <label className="block text-sm font-semibold text-slate-700 mb-1.5">Prioritas</label>
                        <select
                          value={priority}
                          onChange={(e) => setPriority(e.target.value)}
                          className="w-full px-4 py-2 border border-slate-200 rounded-lg focus:ring-2 focus:ring-blue-500 text-sm bg-white"
                        >
                          <option value="LOW">Low</option>
                          <option value="MEDIUM">Medium</option>
                          <option value="HIGH">High</option>
                          <option value="CRITICAL">Critical</option>
                        </select>
                      </div>
                    )}
                  </div>

                  <div>
                    <label className="block text-sm font-semibold text-slate-700 mb-1.5">Lampiran Screenshot / Foto (Opsional)</label>
                    {attachment ? (
                      <div className="relative inline-block border rounded-lg p-2 bg-slate-50">
                        <img src={attachment} alt="Preview" className="h-32 object-contain rounded" />
                        <button
                          type="button"
                          onClick={() => setAttachment(null)}
                          className="absolute -top-2 -right-2 bg-rose-500 text-white rounded-full p-1 shadow hover:bg-rose-600 transition"
                        >
                          <X className="w-3.5 h-3.5" />
                        </button>
                      </div>
                    ) : (
                      <label className="border-2 border-dashed border-slate-300 rounded-lg p-6 flex flex-col items-center justify-center cursor-pointer hover:bg-slate-50 hover:border-blue-400 transition group">
                        <ImageIcon className="w-8 h-8 text-slate-400 group-hover:text-blue-500 mb-2 transition" />
                        <span className="text-sm text-slate-600 font-medium group-hover:text-blue-600 transition">Klik untuk unggah gambar</span>
                        <span className="text-xs text-slate-400 mt-1">Maksimal 2MB (JPG, PNG)</span>
                        <input
                          type="file"
                          accept="image/jpeg, image/png, image/jpg, image/webp"
                          className="hidden"
                          onChange={handleImageUpload}
                        />
                      </label>
                    )}
                  </div>

                  <div className="pt-4 border-t border-slate-100 flex justify-end">
                    <Button 
                      type="submit" 
                      disabled={submitting || !title.trim() || !description.trim()}
                      className="bg-blue-600 hover:bg-blue-700 min-w-[150px] shadow-lg shadow-blue-500/20"
                    >
                      {submitting ? 'Memproses...' : 'Kirim Tiket'}
                    </Button>
                  </div>
                </form>
              </CardContent>
            </Card>
          </div>
        </main>
      </div>
    </div>
  );
}
