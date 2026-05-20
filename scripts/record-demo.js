import { chromium } from 'playwright';

(async () => {
  console.log('Mulai merekam video demo VibeDesk...');
  const appUrl = 'https://vibedesk-930951802388.europe-west1.run.app';
  
  // Launch browser with video recording enabled
  const browser = await chromium.launch({ headless: true });
  const context = await browser.newContext({
    recordVideo: {
      dir: 'videos/', // Video will be saved here
      size: { width: 1280, height: 720 }
    },
    viewport: { width: 1280, height: 720 }
  });
  
  const page = await context.newPage();
  
  try {
    // 1. Landing Page
    console.log('1. Membuka Landing Page...');
    await page.goto(appUrl);
    await page.waitForTimeout(3000);
    await page.mouse.wheel(0, 600); // Scroll down to show features
    await page.waitForTimeout(2000);
    await page.mouse.wheel(0, -600); // Scroll back up
    await page.waitForTimeout(1000);
    
    // 2. Login
    console.log('2. Menuju Login Page...');
    await page.goto(`${appUrl}/login`);
    await page.waitForTimeout(2000);
    
    console.log('3. Mengisi kredensial login...');
    await page.fill('input[type="email"]', 'admin@fitrahpro.com');
    await page.fill('input[type="password"]', 'FitrahPro@2026');
    await page.waitForTimeout(1000);
    
    await page.click('button[type="submit"]');
    console.log('4. Login berhasil, menunggu dashboard...');
    await page.waitForURL('**/dashboard', { timeout: 15000 });
    await page.waitForTimeout(4000); // Lihat dashboard sebentar
    await page.mouse.wheel(0, 400); // scroll down dashboard
    await page.waitForTimeout(2000);
    
    // 5. Navigasi ke Tiket
    console.log('5. Membuka halaman Manajemen Tiket...');
    await page.goto(`${appUrl}/tickets`);
    await page.waitForTimeout(4000);
    
    // 6. Navigasi ke Projects
    console.log('6. Membuka halaman Projects...');
    await page.goto(`${appUrl}/projects`);
    await page.waitForTimeout(4000);
    
    // 7. Kembali ke Dashboard
    console.log('7. Kembali ke Dashboard...');
    await page.goto(`${appUrl}/dashboard`);
    await page.waitForTimeout(3000);
    
    console.log('Perekaman selesai!');
  } catch (error) {
    console.error('Terjadi kesalahan selama perekaman:', error);
  } finally {
    // Save video path before closing context
    const videoPath = await page.video().path();
    
    await context.close();
    await browser.close();
    console.log('\n======================================================');
    console.log(`✅ Video demo berhasil direkam!`);
    console.log(`📁 Lokasi file: ${videoPath}`);
    console.log('======================================================\n');
  }
})();
