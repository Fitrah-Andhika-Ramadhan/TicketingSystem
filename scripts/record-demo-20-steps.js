import { chromium } from 'playwright';

(async () => {
  console.log('Mulai merekam video demo VibeDesk (20 Langkah)...');
  const appUrl = 'https://vibedesk-930951802388.europe-west1.run.app';
  
  const browser = await chromium.launch({ headless: true });
  const context = await browser.newContext({
    recordVideo: {
      dir: 'videos/demo-lengkap/',
      size: { width: 1920, height: 1080 } // Resolusi Full HD
    },
    viewport: { width: 1920, height: 1080 }
  });
  
  const page = await context.newPage();
  
  try {
    // Langkah 1: Buka Landing Page
    console.log('1. Membuka Landing Page');
    await page.goto(appUrl);
    await page.waitForTimeout(4000);
    
    // Langkah 2: Scroll melihat fitur-fitur
    console.log('2. Scroll ke bawah di Landing Page');
    await page.mouse.wheel(0, 800);
    await page.waitForTimeout(3000);
    
    // Langkah 3: Scroll kembali ke atas
    console.log('3. Scroll kembali ke atas');
    await page.mouse.wheel(0, -800);
    await page.waitForTimeout(2000);
    
    // Langkah 4: Navigasi ke Halaman Login
    console.log('4. Navigasi ke halaman Login');
    await page.goto(`${appUrl}/login`);
    await page.waitForTimeout(3000);
    
    // Langkah 5: Mengetik Email dengan jeda
    console.log('5. Mengisi Email Admin');
    await page.type('input[type="email"]', 'admin@fitrahpro.com', { delay: 100 });
    await page.waitForTimeout(1000);
    
    // Langkah 6: Mengetik Password dengan jeda
    console.log('6. Mengisi Password');
    await page.type('input[type="password"]', 'FitrahPro@2026', { delay: 100 });
    await page.waitForTimeout(1500);
    
    // Langkah 7: Klik tombol Sign In
    console.log('7. Klik tombol Login');
    await page.click('button[type="submit"]');
    
    // Langkah 8: Memuat Dashboard
    console.log('8. Memuat Dashboard');
    await page.waitForTimeout(8000); // Wait safely instead of strict URL wait
    // Langkah 9: Melihat SLA Metrics
    console.log('9. Memeriksa metrik SLA di Dashboard');
    await page.mouse.wheel(0, 300);
    await page.waitForTimeout(4000);
    
    // Langkah 10: Scroll ke daftar aktivitas terbaru
    console.log('10. Scroll ke aktivitas terbaru / tiket');
    await page.mouse.wheel(0, 500);
    await page.waitForTimeout(4000);
    
    // Langkah 11: Scroll kembali ke atas
    console.log('11. Kembali ke bagian atas Dashboard');
    await page.mouse.wheel(0, -800);
    await page.waitForTimeout(2000);
    
    // Langkah 12: Navigasi ke halaman Tickets
    console.log('12. Buka menu Tickets');
    await page.goto(`${appUrl}/tickets`);
    await page.waitForTimeout(5000);
    
    // Langkah 13: Melihat daftar tiket
    console.log('13. Scroll daftar tiket');
    await page.mouse.wheel(0, 400);
    await page.waitForTimeout(3000);
    
    // Langkah 14: Klik filter atau sorting (simulasi hover/klik)
    console.log('14. Simulasi interaksi filter');
    await page.mouse.wheel(0, -400);
    await page.waitForTimeout(3000);
    
    // Langkah 15: Buka detail salah satu tiket
    console.log('15. Buka detail tiket');
    // Cari tombol "View" atau klik baris pertama
    const ticketRow = await page.locator('tbody tr').first();
    if (await ticketRow.count() > 0) {
      await ticketRow.click();
    }
    await page.waitForTimeout(5000);
    
    // Langkah 16: Melihat diskusi / comments tiket
    console.log('16. Scroll detail tiket');
    await page.mouse.wheel(0, 500);
    await page.waitForTimeout(4000);
    
    // Langkah 17: Navigasi ke halaman Projects
    console.log('17. Buka menu Projects');
    await page.goto(`${appUrl}/projects`);
    await page.waitForTimeout(5000);
    
    // Langkah 18: Melihat daftar proyek
    console.log('18. Scroll daftar proyek');
    await page.mouse.wheel(0, 300);
    await page.waitForTimeout(4000);
    
    // Langkah 19: Buka pengaturan aplikasi (Settings)
    console.log('19. Buka menu Settings');
    await page.goto(`${appUrl}/settings`);
    await page.waitForTimeout(4000);
    
    // Langkah 20: Kembali ke Dashboard (Selesai)
    console.log('20. Kembali ke Dashboard utama');
    await page.goto(`${appUrl}/dashboard`);
    await page.waitForTimeout(5000);
    
  } catch (error) {
    console.error('Terjadi kesalahan:', error);
  } finally {
    const videoPath = await page.video().path();
    await context.close();
    await browser.close();
    console.log('\n======================================================');
    console.log(`🎬 DEMO 20 LANGKAH SELESAI`);
    console.log(`📁 Lokasi Video Full HD: ${videoPath}`);
    console.log('======================================================\n');
  }
})();
