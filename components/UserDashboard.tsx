import { useRouter } from 'next/navigation';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Dialog, DialogContent, DialogDescription, DialogHeader, DialogTitle, DialogTrigger } from '@/components/ui/dialog';
import { TicketIcon, PlusCircle, Search, HelpCircle, History, AlertCircle } from 'lucide-react';

export default function UserDashboard({ user, tickets }: { user: any, tickets: any[] }) {
  const router = useRouter();

  const openTickets = tickets.filter(t => t.status !== 'RESOLVED' && t.status !== 'CLOSED').length;
  const recentTickets = tickets.slice(0, 5);

  return (
    <div className="p-8 max-w-5xl mx-auto w-full">
      {/* Welcome Banner */}
      <div className="mb-8 bg-gradient-to-r from-blue-600 to-blue-400 rounded-2xl p-8 text-white shadow-lg flex flex-col md:flex-row items-center justify-between gap-6">
        <div>
          <h1 className="text-3xl font-bold mb-2">Halo, {user.name}! 👋</h1>
          <p className="text-blue-50 opacity-90 text-lg">Ada yang bisa kami bantu hari ini? Pusat bantuan kami siap melayani Anda.</p>
        </div>
        <Button 
          size="lg" 
          onClick={() => router.push('/tickets/new')}
          className="bg-white text-blue-700 hover:bg-slate-50 border-0 shadow-xl font-bold whitespace-nowrap"
        >
          <PlusCircle className="w-5 h-5 mr-2" /> Buat Tiket Baru
        </Button>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
        {/* Left Column: Stats & Quick Links */}
        <div className="space-y-8">
          {/* Status Card */}
          <Card className="border-slate-200 shadow-sm">
            <CardHeader className="pb-3 bg-slate-50/50 border-b border-slate-100">
              <CardTitle className="text-sm font-bold text-slate-700 uppercase tracking-wider flex items-center gap-2">
                <TicketIcon className="w-4 h-4 text-blue-500" /> Tiket Aktif Anda
              </CardTitle>
            </CardHeader>
            <CardContent className="pt-6">
              <div className="flex items-center justify-center">
                <div className="text-center">
                  <span className="text-5xl font-extrabold text-blue-600">{openTickets}</span>
                  <p className="text-sm text-slate-500 mt-2 font-medium">Tiket Menunggu Penanganan</p>
                </div>
              </div>
            </CardContent>
          </Card>

          {/* Help Center Links */}
          <Card className="border-slate-200 shadow-sm">
            <CardHeader className="pb-3 bg-slate-50/50 border-b border-slate-100">
              <CardTitle className="text-sm font-bold text-slate-700 uppercase tracking-wider flex items-center gap-2">
                <HelpCircle className="w-4 h-4 text-emerald-500" /> Pusat Bantuan
              </CardTitle>
            </CardHeader>
            <CardContent className="pt-4 p-0">
              <div className="divide-y divide-slate-100">
                <Dialog>
                  <DialogTrigger asChild>
                    <button className="w-full text-left px-6 py-4 hover:bg-slate-50 transition-colors flex items-center justify-between text-sm font-medium text-slate-700">
                      Cara membaca status tiket
                    </button>
                  </DialogTrigger>
                  <DialogContent className="sm:max-w-md">
                    <DialogHeader>
                      <DialogTitle>Status Tiket VibeDesk</DialogTitle>
                      <DialogDescription>Panduan membaca indikator status pada tiket Anda.</DialogDescription>
                    </DialogHeader>
                    <div className="space-y-4 py-2">
                      <div className="flex items-start gap-3">
                        <span className="px-2.5 py-0.5 rounded-full text-[10px] font-bold uppercase tracking-wider bg-yellow-100 text-yellow-800 mt-0.5">OPEN</span>
                        <p className="text-sm text-slate-600">Tiket baru dibuat dan sedang menunggu untuk ditugaskan ke tim teknis.</p>
                      </div>
                      <div className="flex items-start gap-3">
                        <span className="px-2.5 py-0.5 rounded-full text-[10px] font-bold uppercase tracking-wider bg-blue-100 text-blue-800 mt-0.5">IN_PROGRESS</span>
                        <p className="text-sm text-slate-600">Tiket sudah ditugaskan dan saat ini sedang ditangani oleh tim teknis kami.</p>
                      </div>
                      <div className="flex items-start gap-3">
                        <span className="px-2.5 py-0.5 rounded-full text-[10px] font-bold uppercase tracking-wider bg-green-100 text-green-800 mt-0.5">RESOLVED</span>
                        <p className="text-sm text-slate-600">Kendala pada tiket telah berhasil diatasi. Silakan periksa hasilnya.</p>
                      </div>
                      <div className="flex items-start gap-3">
                        <span className="px-2.5 py-0.5 rounded-full text-[10px] font-bold uppercase tracking-wider bg-slate-100 text-slate-800 mt-0.5">CLOSED</span>
                        <p className="text-sm text-slate-600">Tiket telah ditutup secara permanen dan tidak bisa dibalas lagi.</p>
                      </div>
                    </div>
                  </DialogContent>
                </Dialog>

                <Dialog>
                  <DialogTrigger asChild>
                    <button className="w-full text-left px-6 py-4 hover:bg-slate-50 transition-colors flex items-center justify-between text-sm font-medium text-slate-700">
                      SLA & Waktu Respon
                    </button>
                  </DialogTrigger>
                  <DialogContent className="sm:max-w-md">
                    <DialogHeader>
                      <DialogTitle>Service Level Agreement (SLA)</DialogTitle>
                      <DialogDescription>Target waktu penyelesaian tiket berdasarkan prioritas.</DialogDescription>
                    </DialogHeader>
                    <div className="space-y-4 py-2">
                      <div className="flex justify-between items-center border-b border-slate-100 pb-2">
                        <span className="font-bold text-red-600 text-sm">CRITICAL</span>
                        <span className="text-sm font-medium text-slate-600">&lt; 1 Jam</span>
                      </div>
                      <div className="flex justify-between items-center border-b border-slate-100 pb-2">
                        <span className="font-bold text-orange-600 text-sm">HIGH</span>
                        <span className="text-sm font-medium text-slate-600">&lt; 4 Jam</span>
                      </div>
                      <div className="flex justify-between items-center border-b border-slate-100 pb-2">
                        <span className="font-bold text-blue-600 text-sm">MEDIUM</span>
                        <span className="text-sm font-medium text-slate-600">&lt; 24 Jam</span>
                      </div>
                      <div className="flex justify-between items-center pb-2">
                        <span className="font-bold text-slate-600 text-sm">LOW</span>
                        <span className="text-sm font-medium text-slate-600">&lt; 3 Hari</span>
                      </div>
                    </div>
                  </DialogContent>
                </Dialog>

                <Dialog>
                  <DialogTrigger asChild>
                    <button className="w-full text-left px-6 py-4 hover:bg-slate-50 transition-colors flex items-center justify-between text-sm font-medium text-slate-700">
                      Hubungi Call Center
                    </button>
                  </DialogTrigger>
                  <DialogContent className="sm:max-w-md">
                    <DialogHeader>
                      <DialogTitle>Call Center VibeDesk</DialogTitle>
                      <DialogDescription>Hubungi kami jika keadaan sangat darurat atau tiket CRITICAL tidak segera ditangani.</DialogDescription>
                    </DialogHeader>
                    <div className="py-4 text-center">
                      <p className="text-3xl font-bold text-slate-800 tracking-wider mb-2">0812-8988-6013</p>
                      <p className="text-sm text-slate-500 mb-6">Senin - Jumat, 08:00 - 17:00 WIB</p>
                      
                      <div className="flex gap-3 justify-center">
                        <Button onClick={() => window.open('tel:081289886013', '_blank')} className="bg-blue-600 hover:bg-blue-700 text-white shadow-lg">
                          Telepon Sekarang
                        </Button>
                        <Button onClick={() => window.open('https://wa.me/6281289886013', '_blank')} variant="outline" className="text-emerald-600 border-emerald-200 bg-emerald-50 hover:bg-emerald-100">
                          WhatsApp CS
                        </Button>
                      </div>
                    </div>
                  </DialogContent>
                </Dialog>
              </div>
            </CardContent>
          </Card>
        </div>

        {/* Right Column: Recent Activity */}
        <div className="lg:col-span-2">
          <Card className="border-slate-200 shadow-sm h-full">
            <CardHeader className="pb-3 border-b border-slate-100 flex flex-row items-center justify-between">
              <div>
                <CardTitle className="text-lg font-bold text-slate-800 flex items-center gap-2">
                  <History className="w-5 h-5 text-slate-400" /> Aktivitas Terakhir
                </CardTitle>
                <CardDescription className="text-xs mt-1">Status tiket terbaru Anda</CardDescription>
              </div>
              <Button variant="outline" size="sm" onClick={() => router.push('/tickets')} className="text-xs">
                Lihat Semua
              </Button>
            </CardHeader>
            <CardContent className="pt-0 p-0">
              {recentTickets.length === 0 ? (
                <div className="py-16 text-center">
                  <div className="w-16 h-16 bg-slate-100 rounded-full flex items-center justify-center mx-auto mb-4">
                    <TicketIcon className="w-8 h-8 text-slate-300" />
                  </div>
                  <p className="text-slate-500 font-medium">Belum ada tiket yang dibuat.</p>
                  <p className="text-xs text-slate-400 mt-1">Buat tiket baru jika Anda membutuhkan bantuan.</p>
                </div>
              ) : (
                <div className="divide-y divide-slate-100">
                  {recentTickets.map(ticket => (
                    <div key={ticket.id} className="p-4 sm:p-6 hover:bg-slate-50 transition-colors cursor-pointer" onClick={() => router.push(`/tickets/${ticket.id}`)}>
                      <div className="flex items-start justify-between gap-4">
                        <div className="space-y-1">
                          <div className="flex items-center gap-2">
                            <span className="font-bold text-slate-900 text-sm">{ticket.ticketNumber}</span>
                            <span className={`px-2.5 py-0.5 rounded-full text-[10px] font-bold uppercase tracking-wider ${
                              ticket.status === 'OPEN' ? 'bg-yellow-100 text-yellow-800' :
                              ticket.status === 'IN_PROGRESS' ? 'bg-blue-100 text-blue-800' :
                              ticket.status === 'RESOLVED' ? 'bg-green-100 text-green-800' :
                              ticket.status === 'CLOSED' ? 'bg-slate-100 text-slate-800' :
                              'bg-purple-100 text-purple-800'
                            }`}>
                              {ticket.status}
                            </span>
                          </div>
                          <p className="text-slate-600 font-medium line-clamp-1">{ticket.title}</p>
                          <p className="text-xs text-slate-400 flex items-center gap-1.5 mt-2">
                            <AlertCircle className="w-3.5 h-3.5" /> 
                            {ticket.category} • Dibuat pada {new Date(ticket.createdAt).toLocaleDateString('id-ID', { day: 'numeric', month: 'long', year: 'numeric' })}
                          </p>
                        </div>
                      </div>
                    </div>
                  ))}
                </div>
              )}
            </CardContent>
          </Card>
        </div>
      </div>
    </div>
  );
}
