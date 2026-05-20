import { chromium } from 'playwright';

(async () => {
  console.log('Mulai merekam video demo V2 (Semua Fitur Interaktif)...');
  const appUrl = 'https://vibedesk-930951802388.europe-west1.run.app';
  
  const browser = await chromium.launch({ headless: true });
  const context = await browser.newContext({
    recordVideo: {
      dir: 'videos/demo-v2/',
      size: { width: 1920, height: 1080 }
    },
    viewport: { width: 1920, height: 1080 }
  });
  
  const page = await context.newPage();

  // Helper untuk melakukan klik secara aman (tidak error jika elemen tidak ada)
  const safeClick = async (selector, description) => {
    try {
      console.log(`-> Klik: ${description}`);
      await page.waitForTimeout(1000);
      const loc = page.locator(selector).first();
      if (await loc.count() > 0) {
        await loc.click({ force: true });
        await page.waitForTimeout(1500);
      } else {
        console.log(`   (Lewat: ${description} tidak ditemukan di halaman ini)`);
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
    // 1. Landing Page
    console.log('1. Membuka Landing Page & Eksplorasi');
    await page.goto(appUrl);
    await page.waitForTimeout(3000);
    await page.mouse.wheel(0, 1000);
    await page.waitForTimeout(2000);
    await page.mouse.wheel(0, -1000);
    await page.waitForTimeout(1000);
    
    // 2. Login
    console.log('2. Proses Login');
    await page.goto(`${appUrl}/login`);
    await page.waitForTimeout(2000);
    await page.type('input[type="email"]', 'admin@fitrahpro.com', { delay: 50 });
    await page.type('input[type="password"]', 'FitrahPro@2026', { delay: 50 });
    await page.click('button[type="submit"]');
    
    // 3. Dashboard
    console.log('3. Dashboard & Quick Actions');
    await page.waitForTimeout(8000); // Tunggu Dashboard Load
    await page.mouse.wheel(0, 500); // Lihat Chart
    await page.waitForTimeout(2000);
    await page.mouse.wheel(0, -500);
    await safeClick('button:has-text("Refresh"), button[aria-label="Refresh"]', 'Tombol Refresh Dashboard');
    
    // 4. Tiket - Daftar & Filter
    console.log('4. Navigasi ke Halaman Tickets');
    await page.goto(`${appUrl}/tickets`);
    await page.waitForTimeout(4000);
    
    // Coba pencarian
    await safeFill('input[placeholder*="Search"], input[placeholder*="Cari"]', 'TICKET', 'Pencarian Tiket');
    await page.keyboard.press('Enter');
    await page.waitForTimeout(2000);
    
    // Hapus pencarian
    await safeFill('input[placeholder*="Search"], input[placeholder*="Cari"]', '', 'Clear Pencarian');
    await page.keyboard.press('Enter');
    await page.waitForTimeout(1000);
    
    // 5. Membuat Tiket Baru
    console.log('5. Membuat Tiket Baru');
    await safeClick('text="New Ticket", text="Create Ticket", text="Buat Tiket", button:has-text("New")', 'Tombol Buat Tiket');
    await page.waitForTimeout(2000);
    await safeFill('input[name="title"], input[placeholder*="Title"], input[placeholder*="Judul"]', 'Masalah Jaringan Kantor Cabang', 'Judul Tiket Baru');
    await safeFill('textarea[name="description"], textarea', 'Internet mati di lantai 3, mohon segera ditangani karena meeting penting akan dimulai.', 'Deskripsi Tiket Baru');
    await safeClick('button[type="submit"], button:has-text("Submit"), button:has-text("Create"), button:has-text("Save")', 'Simpan Tiket Baru');
    await page.waitForTimeout(4000);
    
    // 6. Detail Tiket & Komentar
    console.log('6. Interaksi Detail Tiket & Komentar');
    await safeClick('tbody tr', 'Baris Tiket Pertama'); // Buka detail tiket
    await page.waitForTimeout(3000);
    
    // Tambah komentar
    await page.mouse.wheel(0, 300);
    await safeFill('textarea[placeholder*="comment"], textarea[placeholder*="tanggapan"], input[placeholder*="comment"]', 'Saya sudah menerima laporan ini, tim teknisi akan segera menuju ke lokasi lantai 3.', 'Isi Komentar Tiket');
    await safeClick('button:has-text("Send"), button:has-text("Kirim"), button:has-text("Comment"), button:has-text("Reply")', 'Kirim Komentar');
    await page.waitForTimeout(3000);
    
    // Simulasi ganti status
    await safeClick('button[role="combobox"], select', 'Dropdown Status');
    await page.waitForTimeout(1000);
    await page.keyboard.press('ArrowDown');
    await page.keyboard.press('Enter');
    await page.waitForTimeout(2000);
    
    // 7. Projects
    console.log('7. Halaman Projects');
    await page.goto(`${appUrl}/projects`);
    await page.waitForTimeout(4000);
    await safeClick('tbody tr', 'Baris Project Pertama');
    await page.waitForTimeout(3000);
    
    // 8. Settings
    console.log('8. Halaman Settings');
    await page.goto(`${appUrl}/settings`);
    await page.waitForTimeout(3000);
    await safeClick('text="Appearance", text="Tampilan", [role="tab"]', 'Pindah ke tab Appearance');
    await page.waitForTimeout(2000);
    await safeClick('text="Notifications", text="Notifikasi"', 'Pindah ke tab Notifications');
    await page.waitForTimeout(2000);
    
    // 9. Logout
    console.log('9. Proses Logout');
    await page.goto(`${appUrl}/dashboard`); // Kembali ke dashboard dulu
    await page.waitForTimeout(3000);
    
    // Coba klik avatar lalu klik logout
    await safeClick('button[aria-label="User menu"], button[aria-label="User"], .rounded-full', 'Menu Profil User (Avatar)');
    await safeClick('text="Log out", text="Logout", text="Keluar"', 'Tombol Logout');
    await page.waitForTimeout(4000);
    
    console.log('Semua interaksi selesai direkam.');
    
  } catch (error) {
    console.error('Terjadi kesalahan:', error);
  } finally {
    const videoPath = await page.video().path();
    await context.close();
    await browser.close();
    console.log('\n======================================================');
    console.log(`🎬 DEMO V2 (FULL INTERAKTIF) SELESAI`);
    console.log(`📁 Lokasi Video: ${videoPath}`);
    console.log('======================================================\n');
  }
})();
