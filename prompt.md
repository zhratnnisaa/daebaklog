# Daebaklog — Checkpoint Progress (Update)

Dokumen rekap lanjutan dari checkpoint sebelumnya. Fokus di sini: bug-bug yang ditemukan & diperbaiki setelah Step 14, plus rencana fitur pengembangan lanjutan. Dipakai sebagai acuan lanjutan, termasuk kalau pindah ke AI/tools lain.

---

## 1. Tech Stack (tetap sama, lihat checkpoint sebelumnya)

Next.js 16 (App Router, TypeScript, Turbopack) · PostgreSQL via Neon · Prisma 7 · NextAuth.js v5 (Auth.js) · UploadThing · Simulasi payment manual · Tailwind CSS + shadcn/ui (tema hijau neon `#39FF14` + dark mode) · pnpm · OS Windows.

---

## 2. Bug yang Ditemukan & Diperbaiki (setelah Step 14)

### 2.1 — Landing page tampil default Next.js, bukan homepage custom

**Gejala:** `localhost:3000` menampilkan halaman default "To get started, edit the page.tsx file" alih-alih homepage custom (hero, boygroup populer, jadwal konser, album terbaru).

**Penyebab:** File `src/app/page.tsx` bawaan `create-next-app` (dari Step 1) **tidak pernah dihapus**. Karena Next.js selalu memprioritaskan `app/page.tsx` di root dibanding `app/(public)/page.tsx` di dalam route group untuk resolve route `/`, homepage custom di `(public)/page.tsx` tidak pernah kepakai.

**Fix:** Pindahkan isi homepage custom ke `src/app/(public)/page.tsx`, lalu **hapus** `src/app/page.tsx` dari root.

**Catatan penting:** `(public)` adalah **route group** (nama dalam kurung tidak muncul di URL), bukan folder opsional. Fungsinya supaya semua halaman di dalamnya otomatis dapat `<Navbar />` dari `src/app/(public)/layout.tsx`. Kalau homepage dipindah keluar dari `(public)`, homepage akan kehilangan Navbar sementara halaman lain (`/boygroups`, `/concerts`, dll) tetap punya. **Jangan hapus folder `(public)` — pastikan file yang benar ada di dalamnya.**

---

### 2.2 — Foto/logo/poster/cover tidak tersimpan ke database (semua form: BoyGroup, Idol, Concert, Album)

**Gejala:** Upload lewat `UploadButton` terlihat sukses (status 200, file muncul di dashboard UploadThing), tapi kolom `logoUrl`/`photoUrl`/`posterUrl`/`coverUrl` tetap `null` di database setelah submit form.

**Penyebab:** UploadThing versi **7.x** (`uploadthing: ^7.7.4`, `@uploadthing/react: ^7.3.3`) — field `res[0].url` di callback `onClientUploadComplete` sudah **deprecated dan sering kosong/undefined**. URL yang valid ada di field **`res[0].ufsUrl`**, bukan `res[0].url`.

**Fix — di SEMUA form yang pakai `UploadButton`, ganti:**
```typescript
onClientUploadComplete={(res) => setXxxUrl(res[0].url)}
```
jadi:
```typescript
onClientUploadComplete={(res) => {
  if (res?.[0]?.ufsUrl) setXxxUrl(res[0].ufsUrl);
}}
```

**Titik yang harus dicek di 4 file** (endpoint & state setter tidak boleh ketuker antar file — ini sempat jadi bug turunan waktu perbaikan manual):

| File | `endpoint` | State setter |
|---|---|---|
| `src/components/admin/boygroup-form.tsx` | `"boyGroupLogo"` | `setLogoUrl` |
| `src/components/admin/idol-form.tsx` | `"idolPhoto"` | `setPhotoUrl` |
| `src/components/admin/concert-form.tsx` | `"concertPoster"` | `setPosterUrl` |
| `src/components/admin/album-form.tsx` | `"albumCover"` | `setCoverUrl` |

**Pelajaran:** kalau copy-paste blok `<UploadButton>` antar form untuk hemat waktu, WAJIB cek ulang `endpoint` dan nama state setter-nya sesuai tabel di atas — jangan asumsi sama.

**Data lama yang sudah kadung tersimpan `null`** tidak otomatis ke-update sendiri setelah fix ini — harus di-submit ulang manual lewat halaman edit masing-masing (upload ulang foto, klik Simpan).

---

### 2.3 — Error `Argument 'user' is missing` saat checkout tiket/album (`userId: undefined`)

**Gejala:** `PrismaClientValidationError` saat `prisma.ticketOrder.create()` — `userId` terkirim `undefined` padahal user sudah login.

**Penyebab:** Di `src/lib/auth.config.ts`, callback `jwt()` sudah benar menyimpan `token.id = user.id`, tapi callback `session()` **tidak memindahkan `token.id` ke `session.user.id`** — jadi `session.user.id` selalu `undefined` walau token-nya sendiri sudah punya `id`.

**Fix di `src/lib/auth.config.ts`:**
```typescript
session({ session, token }) {
  if (session.user) {
    session.user.role = token.role as string;
    session.user.id = token.id as string;   // baris yang hilang
  }
  return session;
},
```

Pastikan juga `src/types/next-auth.d.ts` sudah augmentasi `id: string` di interface `Session["user"]`.

**Penting — session lama tidak otomatis ter-refresh.** Setelah fix ini, WAJIB logout / clear cookie session lalu login ulang, karena JWT yang sedang aktif dibuat sebelum perbaikan dan tidak akan otomatis punya `id` di dalamnya. Cara clear manual (belum ada tombol logout di UI): DevTools (F12) → Application → Cookies → `localhost:3000` → hapus cookie `authjs.session-token`, lalu login ulang.

---

### 2.4 — Login admin tanpa form/route terpisah (auto-promote by email)

**Keputusan desain baru:** tidak ada halaman/form login admin terpisah. Kalau user login dengan **email persis `"admin123"`** (bukan format email asli) dan password valid, role otomatis di-upgrade jadi `ADMIN` di database saat itu juga (sekali update, permanen).

**Implementasi di `src/lib/auth.ts`, dalam `authorize()`:**
```typescript
let role = user.role;

if (email === "admin123" && role !== "ADMIN") {
  const updated = await prisma.user.update({
    where: { id: user.id },
    data: { role: "ADMIN" },
  });
  role = updated.role;
}
```

**Syarat pendukung:**
- Input email di form login (`src/app/(auth)/login/page.tsx`) harus `type="text"`, bukan `type="email"` — karena `"admin123"` bukan format email valid, browser akan block submit kalau masih `type="email"`.
- Karena `email` di schema `User` bersifat `@unique`, cuma bisa ada satu akun dengan email `"admin123"` — otomatis jadi satu-satunya pintu admin.
- Register akun ini seperti biasa lewat `/register` dengan email diisi persis `admin123`, password bebas.

**Belum dikerjakan:** auto-redirect ke `/admin` setelah login sukses sebagai ADMIN (sekarang redirect tetap ke `/` untuk semua role — desain lama, belum disesuaikan dengan fitur auto-promote ini).

---

## 3. Progress Saat Ini

Step 1-14 selesai (lihat checkpoint sebelumnya untuk detail lengkap tiap step). Setelah Step 14, ditemukan & diperbaiki 4 bug di atas (routing homepage, upload foto 4 form, session user id, auto-promote admin).

**Belum dikerjakan dari roadmap awal:**

| Step | Fitur |
|---|---|
| 15 | Audio preview lagu (opsional) |
| 16 | Seed data dummy + dokumen PRD |

---

## 4. Fitur yang Ingin Dikembangkan Lebih Lanjut

Rencana penambahan di luar 16 step awal, urutan belum final:

- **FandomPhoto** — galeri foto fandom per BoyGroup (schema sudah direncanakan: `id, boyGroupId, imageUrl, caption`)
- **ComebackSchedule** — jadwal comeback per BoyGroup (schema sudah direncanakan: `id, boyGroupId, title, date, type`)
- **Halaman/tombol logout di UI** — mekanisme `signOut()` sudah ada di `lib/auth.ts`, tapi belum pernah dipanggil dari komponen manapun
- **Auto-redirect ke `/admin` setelah login sebagai ADMIN** — saat ini semua role redirect ke `/` setelah login sukses
- **Audio preview lagu** (Step 15 lama) — pemutaran preview singkat per `Song`, field `previewUrl` di schema `Song` sudah tersedia tapi belum dipakai di UI manapun
- **Seed data dummy + dokumen PRD** (Step 16 lama)

---

## 5. Prompt untuk Melanjutkan di AI Lain

```
Saya sedang mengerjakan project tugas kuliah bernama "daebaklog" — platform jual tiket
konser & album K-Pop digabung ensiklopedia idol K-Pop, dikerjakan bertahap supaya saya
paham alurnya untuk presentasi, bukan langsung jadi sekaligus.

TECH STACK (WAJIB, JANGAN DIGANTI):
- Next.js 16 (App Router, TypeScript, Turbopack default, src-dir, alias "@/*")
- Prisma 7 (BUKAN Prisma 6 — provider "prisma-client", datasource TANPA url,
  driver adapter @prisma/adapter-pg wajib, import PrismaClient dari
  "@/generated/prisma/client")
- Database: PostgreSQL via Neon (DATABASE_URL pooled untuk runtime,
  DIRECT_URL tanpa -pooler untuk migrate, prisma.config.ts pakai DIRECT_URL)
- Auth: NextAuth.js v5 (Auth.js), Credentials + role USER/ADMIN — SUDAH
  diimplementasi, TERMASUK fitur: login dengan email persis "admin123" otomatis
  upgrade role jadi ADMIN (lihat detail di bawah)
- Upload: UploadThing v7.x — SUDAH diimplementasi untuk 4 entity (BoyGroup logo,
  Idol/Member photo, Concert poster, Album cover). PENTING: pakai field
  res[0].ufsUrl di onClientUploadComplete, BUKAN res[0].url (deprecated & sering
  kosong di versi ini)
- Payment: Simulasi manual (tombol "Simulasikan Bayar Berhasil/Gagal"), BUKAN
  payment gateway asli
- Styling: Tailwind CSS + shadcn/ui, tema hijau neon (#39FF14) + dark mode
- Package manager: pnpm
- OS saya: Windows (pakai `dir`, `type`, `rmdir /s /q`, bukan perintah Unix)

GOTCHA PENTING YANG SUDAH DITEMUKAN (WAJIB DIHINDARI):

1. UploadThing v7.x: SELALU pakai res[0].ufsUrl, bukan res[0].url, di semua
   onClientUploadComplete. Kalau salah, upload terlihat sukses (status 200,
   file muncul di dashboard UploadThing) tapi URL tidak pernah tersimpan ke
   database (tetap null).

2. Route group (public) di Next.js App Router: file page.tsx di root
   src/app/page.tsx SELALU menang dibanding src/app/(public)/page.tsx untuk
   resolve route "/". Kalau homepage custom tidak muncul dan malah landing
   page default Next.js yang tampil, cek dulu apakah src/app/page.tsx (bawaan
   create-next-app) masih ada dan belum dihapus. JANGAN hapus folder (public)
   itu sendiri — folder ini penting karena layout.tsx di dalamnya yang pasang
   Navbar untuk semua halaman publik.

3. NextAuth v5 session callback: kalau butuh session.user.id (misalnya untuk
   userId di Prisma create), pastikan KEDUA callback berikut ada di
   auth.config.ts — jwt() menyimpan token.id = user.id, DAN session() memindahkan
   session.user.id = token.id. Sering kejadian cuma jwt() yang benar tapi
   session() lupa ditambahkan, menyebabkan session.user.id selalu undefined
   walau token-nya sendiri sudah benar. Setelah fix, WAJIB clear cookie session
   lama (authjs.session-token) dan login ulang — JWT lama tidak otomatis
   ter-refresh.

4. Kalau copy-paste blok <UploadButton> antar form (BoyGroup/Idol/Concert/Album)
   untuk hemat waktu, WAJIB cek ulang endpoint dan nama state setter-nya —
   jangan asumsi sama. Endpoint & setter yang benar per form:
   - boygroup-form.tsx  → endpoint "boyGroupLogo"   → setLogoUrl
   - idol-form.tsx      → endpoint "idolPhoto"       → setPhotoUrl
   - concert-form.tsx   → endpoint "concertPoster"   → setPosterUrl
   - album-form.tsx     → endpoint "albumCover"      → setCoverUrl

5. Folder src/generated/prisma harus di-generate ulang (`pnpm dlx prisma
   generate`) setelah clone ulang dari git, karena ada di .gitignore.

6. proxy.ts (pengganti middleware.ts) WAJIB di ROOT PROJECT (sejajar
   package.json), BUKAN di src/ — meskipun project pakai struktur src/.

7. Kalau ada instruksi step yang melibatkan banyak file sekaligus, SELALU
   double-check dengan `dir` di terminal bahwa tiap file benar-benar tersimpan
   sebelum testing di browser. Sudah kejadian dua kali: (a) folder
   [id]/edit untuk idol yang sempat tidak ke-apply, (b) src/app/page.tsx
   default yang tidak dihapus.

SCHEMA YANG SUDAH ADA & SUDAH DI-MIGRATE KE NEON:
model User (id, name, email unique, password hash, role, createdAt)
model BoyGroup (id, name, agency, debutYear, description?, logoUrl?, createdAt)
model Member (id, boyGroupId, stageName, realName, birthDate, position,
  favoriteFood?, funFact?, photoUrl?, createdAt)
model Concert (id, boyGroupId, title, date, location, price, quota, posterUrl?,
  createdAt)
model Album (id, boyGroupId, title, coverUrl?, price, stock, releaseDate,
  createdAt)
model Song (id, albumId, title, previewUrl?, duration)
model TicketOrder (id, userId, concertId, quantity, totalPrice, status,
  createdAt)
model AlbumOrder (id, userId, albumId, quantity, totalPrice, status, createdAt)
enum Role { USER ADMIN }
enum OrderStatus { PENDING PAID FAILED CANCELLED }

SCHEMA YANG BELUM DIBUAT (rencana ke depan):
FandomPhoto (id, boyGroupId, imageUrl, caption)
ComebackSchedule (id, boyGroupId, title, date, type)

FITUR YANG SUDAH SELESAI (Step 1-14, lihat checkpoint sebelumnya untuk detail
lengkap tiap step): setup project, schema & CRUD BoyGroup/Member/Concert/
Album/Song, upload foto 4 entity, auth + proteksi admin, halaman publik
lengkap, checkout tiket & album (simulasi manual), riwayat order user,
homepage (hero, boygroup populer, jadwal konser, album terbaru).

FITUR YANG BELUM DIKERJAKAN:
- Audio preview lagu (field previewUrl di Song sudah ada, UI belum dibuat)
- Seed data dummy + dokumen PRD
- Halaman/tombol logout di UI (mekanisme signOut() sudah ada, belum dipanggil
  dari manapun)
- Auto-redirect ke /admin setelah login sebagai ADMIN (sekarang semua role
  redirect ke "/" setelah login)
- FandomPhoto (galeri foto fandom per BoyGroup) — belum ada schema/CRUD sama
  sekali
- ComebackSchedule (jadwal comeback per BoyGroup) — belum ada schema/CRUD sama
  sekali

GAYA KERJA YANG SAYA MAU:
- Jelasin tiap step secukupnya (tidak bertele-tele) tapi saya harus tetap paham
  logikanya untuk presentasi.
- JANGAN kasih semua fitur sekaligus / kirim project jadi dalam bentuk zip.
- Kerjakan bertahap, satu step selesai dulu (saya jalankan & konfirmasi) baru
  lanjut.
- Sebelum bilang sesuatu "sudah selesai", ingatkan saya untuk cek dengan `dir`
  di terminal bahwa file/foldernya beneran tersimpan.

Tolong lanjutkan dari: [isi sesuai step/fitur berikutnya yang mau dikerjakan]
```

---

Simpan file ini kalau mau lanjut di AI lain — tinggal salin bagian "Prompt untuk Melanjutkan di AI Lain" di atas.
