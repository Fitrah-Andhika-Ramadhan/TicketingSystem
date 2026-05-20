# Media Management System - Complete Guide

## Overview
Sistem media management memungkinkan admin untuk menambah, mengedit, menghapus, dan menampilkan gambar atau video di landing page secara dinamis.

## Features

### 1. Media CRUD Operations (API)
**Endpoint:** `/api/landing/media`

- **GET** - Retrieve all media (public access)
- **POST** - Create new media (admin only)
- **PUT** - Update media (admin only)
- **DELETE** - Delete media (admin only)

### 2. Admin Media Manager Panel
**URL:** `/admin/media-manager`
**Access:** SUPER_ADMIN & ADMIN only

#### Features:
- View all uploaded media in grid format
- Add new images/videos with form
- Edit existing media (title, description, URL, featured status)
- Delete media with confirmation
- Drag-to-reorder positions
- Mark media as featured
- Thumbnail preview for images
- Media type indicator (Image/Video)

#### Form Fields:
- **Media Type:** Image atau Video dropdown
- **Title:** Judul media
- **Description:** Deskripsi detail
- **Media URL:** Link ke gambar atau YouTube embed URL
- **Thumbnail URL:** (Opsional untuk images)
- **Featured:** Checkbox untuk featured status

### 3. Public Landing Page Gallery
**URL:** `/landing` (Accessible without login)

#### Gallery Display:
- Shows all uploaded media in responsive grid
- 1 column on mobile, 2 on tablet, 3 on desktop
- Hover effects on images
- Featured badge on featured media
- Direct video embed untuk YouTube videos
- Image optimization dan lazy loading

#### Gallery Updates:
- Real-time updates when admin uploads/edits/deletes media
- Automatic sorting by position

## How to Use

### For Admin - Adding Media

1. **Login** dengan credentials admin
2. **Navigate** ke Dashboard
3. **Sidebar** → "Media Manager" (under Admin section)
4. **Click** "Add Media" button
5. **Fill Form:**
   - Select type: Image atau Video
   - Enter title
   - Add description
   - Paste image URL atau YouTube embed URL
   - (Optional) Add thumbnail URL untuk images
   - Check "Featured" jika ingin di-highlight
6. **Click** "Add Media"
7. **Verify** di landing page (/landing)

### For Admin - Editing Media

1. **Go to** Media Manager
2. **Find** media to edit
3. **Click** "Edit" button pada media card
4. **Modify** fields yang ingin diubah
5. **Click** "Update Media"

### For Admin - Deleting Media

1. **Go to** Media Manager
2. **Find** media to delete
3. **Click** "Delete" button
4. **Confirm** deletion
5. **Media** removed dan gallery updated

### For Public - Viewing Gallery

1. **Visit** http://localhost:3000
2. **Auto-redirect** ke /landing
3. **Scroll down** ke "Project Showcase" section
4. **View** all images dan videos
5. **Click** images untuk zoom atau videos untuk play

## Database Schema

```typescript
interface Media {
  id: string;           // Unique identifier
  type: 'image' | 'video';
  title: string;        // Media title
  description: string;  // Media description
  url: string;         // Image URL atau YouTube embed URL
  thumbnail: string;   // Thumbnail URL (untuk preview)
  position: number;    // Display order
  featured: boolean;   // Show featured badge
  uploadedAt: Date;    // Upload timestamp
}
```

## Supported Media Types

### Images
- **Formats:** JPG, PNG, GIF, WebP
- **Recommended Size:** 800x600 atau lebih besar
- **Max Size:** Unlimited (gunakan compression untuk optimal)
- **Sources:** Direct URL, cloud storage (Cloudinary, AWS S3, etc)

### Videos
- **Platform:** YouTube recommended
- **Format:** YouTube Embed URL
- **Example:** `https://www.youtube.com/embed/dQw4w9WgXcQ`
- **Alternative:** Direct video URLs (MP4, WebM)

## URL Examples

### Image URL
```
https://images.unsplash.com/photo-123456789?w=800&q=80
```

### YouTube Embed URL
```
https://www.youtube.com/embed/dQw4w9WgXcQ
```

## Best Practices

1. **Image Optimization:**
   - Use compressed images
   - Provide both full-size dan thumbnail URLs
   - Include query params untuk sizing: `?w=800&q=80`

2. **Video Management:**
   - Use YouTube embed URLs untuk best compatibility
   - Ensure videos are publicly accessible
   - Test embedded URL sebelum save

3. **Featured Media:**
   - Limit featured media ke 2-3 items
   - Update featured media regularly
   - Use untuk highlight latest projects

4. **Organization:**
   - Use descriptive titles
   - Add detailed descriptions
   - Order media logically (newest first recommended)

5. **Content Quality:**
   - High-resolution images recommended
   - Professional quality videos
   - Relevant to project/company

## API Response Examples

### GET /api/landing/media (Success)
```json
{
  "success": true,
  "data": [
    {
      "id": "1",
      "type": "image",
      "title": "Metro Paragon Main Tower",
      "description": "Stunning view of our main residential tower",
      "url": "https://images.unsplash.com/...",
      "thumbnail": "https://images.unsplash.com/...",
      "position": 1,
      "featured": true,
      "uploadedAt": "2026-04-09T02:54:44.619Z"
    }
  ]
}
```

### POST /api/landing/media (Create)
```json
{
  "type": "image",
  "title": "New Project",
  "description": "New construction phase",
  "url": "https://...",
  "thumbnail": "https://...",
  "featured": false
}
```

## Troubleshooting

### Images tidak muncul
- Check image URL accessibility (buka di browser)
- Verify CORS settings jika dari domain lain
- Ensure image URL adalah direct link (bukan page URL)

### Video tidak embed
- Verify YouTube URL adalah embed format (`/embed/VIDEO_ID`)
- Test embed URL di iframe tester
- Check YouTube privacy settings (public)

### Changes tidak reflect di landing page
- Hard refresh landing page (Ctrl+F5)
- Check browser cache
- Verify API call successful (check Network tab)

### Permission denied
- Ensure logged in sebagai SUPER_ADMIN atau ADMIN
- Check token validity
- Clear localStorage dan login ulang

## Files Affected

1. **API:**
   - `/app/api/landing/media/route.ts` (NEW)

2. **Admin Pages:**
   - `/app/admin/media-manager/page.tsx` (NEW)

3. **Public Pages:**
   - `/app/landing/page.tsx` (UPDATED - added gallery section)

4. **Components:**
   - `/components/Sidebar.tsx` (UPDATED - added Media Manager menu)

## Summary

Sistem media management yang lengkap dengan:
✓ CRUD operations penuh
✓ Admin panel yang user-friendly
✓ Real-time updates ke landing page public
✓ Support untuk images dan videos
✓ Featured media highlighting
✓ Responsive gallery display
✓ Permission-based access control

Admin dapat dengan mudah manage konten visual landing page tanpa coding!
