import { chromium } from 'playwright';

(async () => {
  console.log('Mulai merekam video demo V4 (Semua Sidebar Menu & Alur Bisnis Lengkap)...');
  const appUrl = 'https://vibedesk-930951802388.europe-west1.run.app';
  
  const browser = await chromium.launch({ headless: true });
  const context = await browser.newContext({
    recordVideo: {
      dir: 'videos/demo-v4/',
      size: { width: 1920, height: 1080 } // Resolusi Full HD
    },
    viewport: { width: 1920, height: 1080 }
  });
  
  const page = await context.newPage();

  // Helper untuk melakukan klik secara aman (mengabaikan error jika elemen tidak ada agar rekaman terus berjalan)
  const safeClick = async (selector, description) => {
    try {
      console.log(`-> Klik: ${description}`);
      await page.waitForTimeout(1000); // Jeda manusiawi sebelum klik
      const loc = page.locator(selector).first();
      if (await loc.count() > 0) {
        await loc.click({ force: true });
        await page.waitForTimeout(2000); // Jeda tunggu transisi halaman
      } else {
        console.log(`   (Lewat: ${description} tidak ditemukan, lanjut ke aksi berikutnya)`);
      }
    } catch (e) {
      console.log(`   (Gagal klik: ${description})`);
    }
  };

  // Helper untuk mengetik secara aman
  const safeFill = async (selector, text, description) => {
    try {
      console.log(`-> Ketik: ${description}`);
      const loc = page.locator(selector).first();
      if (await loc.count() > 0) {
        await loc.fill(text);
        await page.waitForTimeout(1000);
      }
    } catch (e) {
       console.log(`   (Gagal ketik: ${description})`);
    }
  };

  try {
    // ============================================
    // 1. LANDING PAGE
    // ============================================
    console.log('--- 1. LANDING PAGE ---');
    await page.goto(appUrl);
    await page.waitForTimeout(3000); // Biarkan hero section terlihat
    await page.mouse.wheel(0, 1500); // Scroll pelan ke bawah
    await page.waitForTimeout(2000);
    await page.mouse.wheel(0, -1500); // Scroll kembali ke atas
    await page.waitForTimeout(1500);
    
    // ============================================
    // 2. LOGIN (AUTO-FILL)
    // ============================================
    console.log('--- 2. LOGIN (TANPA KETIK) ---');
    await page.goto(`${appUrl}/login`);
    await page.waitForTimeout(3000);
    // Langsung klik tombol Sign In (mengandalkan interceptor / autofill browser)
    await page.click('button[type="submit"]');
    
    // ============================================
    // 3. DASHBOARD
    // ============================================
    console.log('--- 3. DASHBOARD ---');
    await page.waitForTimeout(8000); // Tunggu rendering grafik yang berat
    await page.mouse.wheel(0, 600); // Lihat data tiket di bawah grafik
    await page.waitForTimeout(2000);
    await page.mouse.wheel(0, -600);
    await page.waitForTimeout(1500);
    
    // ============================================
    // 4. TICKETS
    // ============================================
    console.log('--- 4. TICKETS (Manajemen Semua Tiket) ---');
    await safeClick('nav a:has-text("Tickets"), a:has-text("Tickets")', 'Menu Tickets di Sidebar');
    await page.waitForTimeout(4000);
    
    // Simulasi Fitur Search Tiket
    await safeFill('input[placeholder*="Search"], input[placeholder*="Cari"]', 'Error', 'Cari tiket dengan kata kunci Error');
    await page.keyboard.press('Enter');
    await page.waitForTimeout(2000);
    await safeFill('input[placeholder*="Search"], input[placeholder*="Cari"]', '', 'Hapus pencarian');
    await page.keyboard.press('Enter');
    await page.waitForTimeout(1500);
    
    // Simulasi Fitur Buat Tiket
    await safeClick('text="New Ticket", text="Create Ticket", button:has-text("New")', 'Tombol Buat Tiket');
    await page.waitForTimeout(2000);
    await safeFill('input[name="title"], input[placeholder*="Title"]', 'Aplikasi Mobile Crash', 'Judul Tiket');
    await safeFill('textarea[name="description"], textarea', 'Aplikasi mobile selalu menutup sendiri (force close) saat tim sales mencoba upload dokumen.', 'Isi Kendala Tiket');
    await safeClick('button[type="submit"], button:has-text("Submit"), button:has-text("Create")', 'Simpan Tiket Baru');
    await page.waitForTimeout(4000);
    
    // Interaksi Detail Tiket & Balasan
    await safeClick('tbody tr', 'Baris Tiket Pertama (Buka Detail)');
    await page.waitForTimeout(3000);
    await page.mouse.wheel(0, 400); // Scroll ke bagian komentar
    await page.waitForTimeout(2000);
    await safeFill('textarea[placeholder*="comment"], textarea[placeholder*="tanggapan"]', 'Laporan sudah diterima dengan baik, tim IT Support sedang melakukan debugging saat ini juga.', 'Isi Balasan Komentar');
    await safeClick('button:has-text("Send"), button:has-text("Comment")', 'Kirim Balasan');
    await page.waitForTimeout(3000);
    await page.mouse.wheel(0, -400);
    
    // ============================================
    // 5. MY TICKETS
    // ============================================
    console.log('--- 5. MY TICKETS ---');
    await safeClick('nav a:has-text("My Tickets"), a:has-text("My Tickets")', 'Menu My Tickets di Sidebar');
    await page.waitForTimeout(4000);
    await page.mouse.wheel(0, 400);
    await page.waitForTimeout(2000);
    await page.mouse.wheel(0, -400);
    
    // ============================================
    // 6. ANALYTICS
    // ============================================
    console.log('--- 6. ANALYTICS ---');
    await safeClick('nav a:has-text("Analytics"), a:has-text("Analytics")', 'Menu Analytics di Sidebar');
    await page.waitForTimeout(6000); // Chart JS / Recharts biasanya butuh animasi
    await page.mouse.wheel(0, 600);
    await page.waitForTimeout(3000);
    await page.mouse.wheel(0, -600);
    
    // ============================================
    // 7. TEAM
    // ============================================
    console.log('--- 7. TEAM ---');
    await safeClick('nav a:has-text("Team"), a:has-text("Team")', 'Menu Team di Sidebar');
    await page.waitForTimeout(4000);
    await page.mouse.wheel(0, 400);
    await page.waitForTimeout(2000);
    await page.mouse.wheel(0, -400);
    await safeClick('tbody tr', 'Klik Baris Anggota Tim Pertama'); // Coba buka profil agen
    await page.waitForTimeout(3000);
    
    // ============================================
    // 8. QUEUE MANAGEMENT
    // ============================================
    console.log('--- 8. QUEUE MANAGEMENT ---');
    await safeClick('nav a:has-text("Queue Management"), a:has-text("Queue Management")', 'Menu Queue Management');
    await page.waitForTimeout(4000);
    await page.mouse.wheel(0, 400);
    await page.waitForTimeout(2000);
    await page.mouse.wheel(0, -400);
    
    // ============================================
    // 9. USER MANAGEMENT
    // ============================================
    console.log('--- 9. USER MANAGEMENT ---');
    await safeClick('nav a:has-text("User Management"), a:has-text("User Management")', 'Menu User Management');
    await page.waitForTimeout(4000);
    await safeClick('button:has-text("Add User"), button:has-text("New User")', 'Coba klik Add User');
    await page.waitForTimeout(3000);
    await page.mouse.wheel(0, 400);
    await page.waitForTimeout(2000);
    await page.mouse.wheel(0, -400);
    
    // ============================================
    // 10. LANDING MANAGER
    // ============================================
    console.log('--- 10. LANDING MANAGER ---');
    await safeClick('nav a:has-text("Landing Manager"), a:has-text("Landing Manager")', 'Menu Landing Manager');
    await page.waitForTimeout(4000);
    await page.mouse.wheel(0, 500);
    await page.waitForTimeout(2000);
    await safeClick('button:has-text("Save"), button:has-text("Update")', 'Coba tombol Save di Landing Manager');
    await page.waitForTimeout(3000);
    
    // ============================================
    // 11. SETTINGS
    // ============================================
    console.log('--- 11. SETTINGS ---');
    await safeClick('nav a:has-text("Settings"), a:has-text("Settings")', 'Menu Settings');
    await page.waitForTimeout(4000);
    await safeClick('text="Appearance", text="Tampilan"', 'Tab Appearance (Pengaturan Tampilan)');
    await page.waitForTimeout(2000);
    await safeClick('text="Notifications", text="Notifikasi"', 'Tab Notifications (Pengaturan Notifikasi)');
    await page.waitForTimeout(3000);
    
    // ============================================
    // 12. LOGOUT
    // ============================================
    console.log('--- 12. LOGOUT ---');
    // Mencoba berbagai jenis selektor avatar profil
    await safeClick('button[aria-label="User menu"], button[aria-label="User"], .rounded-full', 'Buka Menu Avatar/Profil (Kanan Atas)');
    await page.waitForTimeout(1000);
    await safeClick('text="Log out", text="Logout", text="Keluar"', 'Klik tombol Logout');
    await page.waitForTimeout(6000); // Beri waktu redirect panjang hingga ke halaman login / landing page
    
    console.log('Seluruh Alur Bisnis V4 Selesai Direkam!');
    
  } catch (error) {
    console.error('Terjadi kesalahan fatal saat perekaman:', error);
  } finally {
    const videoPath = await page.video().path();
    await context.close();
    await browser.close();
    console.log('\n======================================================');
    console.log(`🎬 DEMO V4 (ALL MENU & ALUR LENGKAP) SELESAI`);
    console.log(`📁 Lokasi Video Full HD: ${videoPath}`);
    console.log('======================================================\n');
  }
})();
