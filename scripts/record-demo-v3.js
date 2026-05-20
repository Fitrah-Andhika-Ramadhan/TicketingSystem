import { chromium } from 'playwright';

(async () => {
  console.log('Mulai merekam video demo V3 (Tanpa Ketik Login)...');
  const appUrl = 'https://vibedesk-930951802388.europe-west1.run.app';
  
  const browser = await chromium.launch({ headless: true });
  const context = await browser.newContext({
    recordVideo: {
      dir: 'videos/demo-v3/',
      size: { width: 1920, height: 1080 }
    },
    viewport: { width: 1920, height: 1080 }
  });
  
  const page = await context.newPage();

  const safeClick = async (selector, description) => {
    try {
      console.log(`-> Klik: ${description}`);
      await page.waitForTimeout(1000);
      const loc = page.locator(selector).first();
      if (await loc.count() > 0) {
        await loc.click({ force: true });
        await page.waitForTimeout(1500);
      } else {
        console.log(`   (Lewat: ${description} tidak ditemukan)`);
      }
    } catch (e) {
      console.log(`   (Gagal klik: ${description})`);
    }
  };

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
    console.log('2. Menuju Halaman Login');
    await page.goto(`${appUrl}/login`);
    await page.waitForTimeout(3000);
    
    // LANGSUNG KLIK TOMBOL (TANPA INPUT EMAIL/PASSWORD)
    console.log('3. Langsung klik tombol Login (Auto-fill)');
    await page.click('button[type="submit"]');
    
    // 4. Dashboard
    console.log('4. Memuat Dashboard');
    await page.waitForTimeout(8000);
    await page.mouse.wheel(0, 500);
    await page.waitForTimeout(2000);
    await page.mouse.wheel(0, -500);
    
    // 5. Tiket
    console.log('5. Navigasi ke Halaman Tickets');
    await page.goto(`${appUrl}/tickets`);
    await page.waitForTimeout(4000);
    await safeFill('input[placeholder*="Search"], input[placeholder*="Cari"]', 'TICKET', 'Pencarian Tiket');
    await page.keyboard.press('Enter');
    await page.waitForTimeout(2000);
    await safeFill('input[placeholder*="Search"], input[placeholder*="Cari"]', '', 'Clear Pencarian');
    await page.keyboard.press('Enter');
    await page.waitForTimeout(1000);
    
    // 6. Buat Tiket
    console.log('6. Form Buat Tiket');
    await safeClick('text="New Ticket", text="Create Ticket", text="Buat Tiket", button:has-text("New")', 'Tombol Buat Tiket');
    await page.waitForTimeout(2000);
    await safeFill('input[name="title"]', 'Masalah Jaringan Kantor', 'Judul');
    await safeClick('button[type="submit"], button:has-text("Submit")', 'Submit Tiket');
    await page.waitForTimeout(3000);
    
    // 7. Projects
    console.log('7. Halaman Projects');
    await page.goto(`${appUrl}/projects`);
    await page.waitForTimeout(4000);
    await safeClick('tbody tr', 'Baris Project Pertama');
    await page.waitForTimeout(3000);
    
    // 8. Settings
    console.log('8. Halaman Settings');
    await page.goto(`${appUrl}/settings`);
    await page.waitForTimeout(4000);
    
    // 9. Dashboard Utama Lagi
    console.log('9. Kembali ke Dashboard');
    await page.goto(`${appUrl}/dashboard`);
    await page.waitForTimeout(4000);
    
    console.log('Perekaman selesai!');
    
  } catch (error) {
    console.error('Terjadi kesalahan:', error);
  } finally {
    const videoPath = await page.video().path();
    await context.close();
    await browser.close();
    console.log('\n======================================================');
    console.log(`🎬 DEMO V3 (TANPA KETIK LOGIN) SELESAI`);
    console.log(`📁 Lokasi Video Full HD: ${videoPath}`);
    console.log('======================================================\n');
  }
})();
