# PRD - Nara Premium (Frontend Only)

## 1. Ringkasan Produk
**Nara Premium** adalah website penjualan akun premium digital seperti Netflix, Spotify, Canva, Disney+, dan YouTube Premium. Website difokuskan untuk pembelian cepat tanpa login, dengan alur sederhana, tampilan mobile-first, dan halaman informasional pendukung agar user baru tetap mudah memahami proses beli.

Cakupan PRD ini **hanya frontend**, tanpa backend, menggunakan **dummy/local JSON** dan `localStorage` untuk data produk, varian, checkout, dan order.

---

## 2. Tujuan Produk
### Tujuan utama
- Memungkinkan user membeli akun premium dengan cepat dan jelas.
- Mengurangi friksi pembelian dengan alur tanpa login dan form yang tetap ringkas.
- Menampilkan UI yang modern, clean, dan mudah dipahami di mobile.
- Menyediakan halaman pendukung seperti Cara Order, Syarat & Ketentuan, dan Klaim Garansi.

### Non-goals
- Tidak mencakup login/register.
- Tidak mencakup payment gateway asli.
- Tidak mencakup admin panel.
- Tidak mencakup backend/database/API real.

---

## 3. Target User
- User yang ingin membeli akun premium dengan cepat.
- User mobile yang mencari produk digital murah dan praktis.
- User yang sudah tahu produk yang ingin dibeli maupun yang masih browsing kategori.
- User baru yang perlu penjelasan langkah pembelian sebelum checkout.

---

## 4. Prinsip UX
- **Fast purchase:** alur beli tetap ringkas walau sekarang memakai step konfirmasi sebelum checkout.
- **Mobile-first web:** layout diprioritaskan untuk layar mobile, tetapi tampil sebagai website modern, bukan frame mockup HP.
- **Low friction:** tanpa login, tanpa form panjang, tanpa setup rumit.
- **Clear hierarchy:** produk, varian, popup konfirmasi, total pembayaran, dan status order harus langsung jelas.
- **Trust simulation:** invoice, status order, data akun dummy, dan halaman pendukung harus terasa rapi dan meyakinkan.

---

## 5. User Flow
### Flow utama pembelian
1. **Home** -> user cari atau pilih produk.
2. **Product Detail** -> user pilih varian lalu klik **Pilih Paket**.
3. Muncul **popup konfirmasi pesanan** berisi:
   - produk dan varian yang dipilih
   - qty minimum 1
   - nomor WhatsApp aktif
   - metode pembayaran
   - total pembayaran
4. User klik **Beli Sekarang** -> masuk ke **Checkout**.
5. Di **Checkout**, user melihat invoice, ringkasan pesanan, QR dummy, lalu klik **Simulasikan Berhasil**.
6. Setelah simulasi berhasil, user diarahkan ke **Order Status** dengan status sukses.

### Flow cek invoice
1. User masuk ke **Home** atau **Order Status**.
2. User input nomor invoice.
3. Sistem menampilkan salah satu status:
   - Pending
   - Success
   - Tidak ditemukan
4. Jika success, tampilkan akun dummy berupa email dan password.

### Flow pencarian produk
1. User membuka Home.
2. User menggunakan search input atau category filter.
3. Grid produk terfilter secara real-time.
4. User klik card produk untuk masuk ke detail.

### Flow halaman informasional
1. User dapat membuka halaman **Cara Order**, **Syarat & Ketentuan**, dan **Klaim Garansi** dari footer global.
2. Halaman ini membantu user memahami proses beli, aturan layanan, dan kebijakan garansi tanpa mengganggu flow utama pembelian.

---

## 6. Scope Halaman
### 6.1 Home Page
#### Tujuan
Menjadi pintu masuk utama untuk browsing produk dan cek invoice.

#### Elemen utama
- Hero ringkas berisi brand **Nara Premium**.
- Input **cek invoice**.
- Input **search product**.
- **Category filter** seperti `All`, `Streaming`, `Music`, `Tools`, `Video`.
- **Product grid** 2 kolom di mobile.
- Card produk berisi:
  - gambar/logo produk
  - nama produk
  - badge kategori

#### Perilaku
- Search memfilter berdasarkan nama produk.
- Category filter memfilter produk berdasarkan kategori.
- Default category saat first load adalah `All`.
- Invoice input dapat mengarahkan user ke halaman status order.
- Klik card produk membuka halaman detail produk.

---

### 6.2 Product Detail Page
#### Tujuan
Membantu user memilih varian produk dan membuka popup konfirmasi sebelum checkout.

#### Elemen utama
- Hero/detail singkat produk:
  - gambar
  - nama produk
  - category badge
  - deskripsi singkat
- Section **List Varian** dalam bentuk grid 2 kolom mobile.
- Tiap card varian berisi:
  - artwork/logo produk
  - badge stok
  - badge status
  - badge kategori
  - nama varian
  - harga
  - tombol **Pilih Paket**
- Card varian stok habis tampil abu-abu dan tidak bisa dipilih.

#### Perilaku
- Klik **Pilih Paket** pada varian tersedia membuka popup konfirmasi pesanan.
- Tidak ada selected state permanen pada variant card.
- Popup konfirmasi menjadi CTA utama sebelum user masuk checkout.

---

### 6.3 Popup Konfirmasi Pesanan
#### Tujuan
Memberi satu langkah verifikasi singkat sebelum checkout.

#### Elemen utama
- Produk dan varian terpilih.
- Harga satuan.
- Stepper qty minimum 1.
- Input **Nomor WhatsApp (Aktif)**.
- Pilihan metode pembayaran:
  - `QRIS`
  - `DANA`
  - `GoPay`
  - `ShopeePay`
- Total pembayaran.
- Tombol **Batal** dan **Beli Sekarang**.

#### Perilaku
- Qty tidak boleh kurang dari 1.
- Nomor WhatsApp wajib diisi sebelum user bisa lanjut.
- Saat klik **Beli Sekarang**, data checkout disimpan ke shared state/localStorage lalu user diarahkan ke Checkout.

---

### 6.4 Checkout Page (Simulasi)
#### Tujuan
Mensimulasikan proses pembayaran secara sederhana.

#### Elemen utama
- Ringkasan pesanan:
  - nama produk
  - varian
  - qty
  - metode pembayaran
  - nomor WhatsApp
  - total pembayaran
- Generate **invoice dummy otomatis**.
- QR dummy untuk simulasi pembayaran.
- Informasi status awal: **Pending Payment**.
- Tombol **Simulasikan Berhasil**.

#### Perilaku
- Saat halaman dibuka, invoice otomatis dibuat dari mock logic frontend.
- Saat tombol simulasi berhasil ditekan:
  - order mock dianggap sukses
  - user diarahkan ke halaman Order Status
  - invoice terkait menampilkan status success

---

### 6.5 Order Status Page
#### Tujuan
Memberi user kemampuan mengecek status order dengan invoice.

#### Elemen utama
- Input invoice.
- Tombol cek status.
- Hasil status card:
  - **Pending**
  - **Success**
  - **Tidak ditemukan**
- Jika success, tampilkan data akun dummy:
  - email
  - password
  - catatan penggunaan

#### Perilaku
- Invoice dicocokkan dengan mock orders JSON / localStorage.
- Jika invoice ada dan pending -> tampilkan pending.
- Jika invoice ada dan success -> tampilkan akun dummy.
- Jika invoice tidak ada -> tampilkan empty/not found state.

---

### 6.6 Cara Order Page
#### Tujuan
Menjelaskan langkah pembelian dengan bahasa sederhana untuk user baru.

#### Elemen utama
- Hero ringkas.
- Section langkah pembelian.
- Section FAQ.
- CTA kembali ke Home.

#### Isi flow
1. Pilih Produk
2. Pilih Varian
3. Konfirmasi Pesanan
4. Checkout & Bayar
5. Cek Status & Ambil Akun

---

### 6.7 Syarat & Ketentuan Page
#### Tujuan
Menjadi halaman legal ringan yang menjelaskan aturan penggunaan layanan.

#### Elemen utama
- Hero ringkas.
- Judul `Syarat & Ketentuan`.
- Info `Terakhir diperbarui: 2026`.
- Card utama berisi poin syarat.
- Card bantuan singkat.

#### Isi utama
- Penerimaan syarat
- Perubahan syarat
- Pembelian produk digital
- Pengembalian dana & garansi
- Larangan penggunaan

---

### 6.8 Klaim Garansi Page
#### Tujuan
Menjelaskan masa berlaku garansi, aturan klaim, dan cara komplain.

#### Elemen utama
- Hero ringkas.
- Tabel masa berlaku garansi.
- Section syarat klaim.
- Section cara mengajukan komplain.
- Tombol **Hubungi Admin** ke WhatsApp.

#### Catatan
- Isi tabel bersifat statis dan curated.
- Produk di tabel dapat berupa campuran produk katalog dan referensi.

---

## 7. Functional Requirements
### 7.1 Home
- User dapat mengetik invoice pada input cek invoice.
- User dapat mengetik kata kunci pada input pencarian produk.
- User dapat memilih category filter.
- User dapat melihat minimal 5 produk pada grid.
- User dapat klik produk untuk membuka detail.

### 7.2 Product Detail
- User dapat melihat detail produk.
- User dapat melihat list varian produk.
- User dapat klik **Pilih Paket** pada varian tersedia.
- User dapat membuka popup konfirmasi sebelum checkout.

### 7.3 Popup Konfirmasi Pesanan
- Sistem menampilkan item yang dipilih.
- User dapat mengatur qty.
- User dapat memilih metode pembayaran.
- User wajib mengisi nomor WhatsApp aktif.
- Sistem menampilkan total pembayaran.
- User dapat membatalkan atau melanjutkan ke checkout.

### 7.4 Checkout
- Sistem menampilkan ringkasan produk dan total.
- Sistem membuat invoice dummy otomatis.
- Sistem menampilkan QR dummy.
- User dapat menekan tombol simulasi pembayaran berhasil.

### 7.5 Order Status
- User dapat memasukkan invoice.
- Sistem menampilkan status order yang sesuai.
- Sistem menampilkan data akun dummy jika status success.

### 7.6 Informational Pages
- User dapat membuka **Cara Order**, **Syarat & Ketentuan**, dan **Klaim Garansi** dari footer.
- User dapat membaca konten tanpa login.
- CTA WhatsApp di halaman garansi harus bisa dibuka.

---

## 8. Non-Functional Requirements
- Dibangun dengan **React + Vite**.
- Styling menggunakan **Tailwind CSS**.
- Semua data berasal dari **local JSON / mock data** dan `localStorage`.
- Layout harus **mobile-first**.
- Grid utama pada mobile menggunakan **2 kolom**.
- Performa ringan, tanpa dependensi berat yang tidak perlu.
- Navigasi antar halaman cepat dan sederhana.
- Komponen reusable dan mudah dikembangkan.

---

## 9. Dummy Data Requirements
### 9.1 Produk minimal
Minimal 5 produk:
- Netflix
- Spotify
- Canva
- Disney+
- YouTube Premium

### 9.2 Struktur data produk
Setiap produk minimal memiliki:
- `id`
- `slug`
- `name`
- `category`
- `image`
- `description`
- `variants`

Setiap variant minimal memiliki:
- `id`
- `label`
- `duration`
- `price`
- `stock`
- `description` (opsional)

### 9.3 Checkout state
State checkout minimal harus mencakup:
- `productId`
- `variantId`
- `quantity`
- `paymentMethod`
- `phoneNumber`
- `subtotal`
- `invoice`
- `status`

### 9.4 Mock orders
Setiap order minimal memiliki:
- `invoice`
- `productId`
- `variantId`
- `quantity`
- `paymentMethod`
- `phoneNumber`
- `subtotal`
- `status` (`pending` / `success`)
- `accountEmail` (untuk success)
- `accountPassword` (untuk success)

### 9.5 Contoh struktur dummy JSON
```json
{
  "products": [
    {
      "id": "netflix",
      "slug": "netflix-premium",
      "name": "Netflix Premium",
      "category": "Streaming",
      "image": "netflix",
      "description": "Akun premium Netflix untuk streaming film dan series.",
      "variants": [
        {
          "id": "netflix-1b",
          "label": "1 Bulan",
          "duration": "1 bulan",
          "price": 45000,
          "stock": 15
        }
      ]
    }
  ],
  "checkout": {
    "productId": "netflix",
    "variantId": "netflix-1b",
    "quantity": 1,
    "paymentMethod": "QRIS",
    "phoneNumber": "081234567890",
    "subtotal": 45000,
    "invoice": "NARA-INV-240325",
    "status": "pending"
  },
  "orders": [
    {
      "invoice": "NARA-INV-1001",
      "productId": "spotify",
      "variantId": "spotify-1b",
      "quantity": 1,
      "paymentMethod": "QRIS",
      "phoneNumber": "081234567890",
      "subtotal": 22000,
      "status": "pending"
    },
    {
      "invoice": "NARA-INV-1002",
      "productId": "canva",
      "variantId": "canva-1t",
      "quantity": 1,
      "paymentMethod": "DANA",
      "phoneNumber": "081298765432",
      "subtotal": 249000,
      "status": "success",
      "accountEmail": "dummy.canva@mail.com",
      "accountPassword": "Canva123!"
    }
  ]
}
```

---

## 10. Informasi Arsitektur Frontend
### Tech stack
- React
- Vite
- Tailwind CSS
- React Router DOM
- Local JSON / localStorage

### Routing aktual
- `/` -> Home Page
- `/product/:slug` -> Product Detail Page
- `/checkout` -> Checkout Page
- `/order-status` -> Order Status Page
- `/order-status?invoice=...` -> Prefill invoice dari Home/Checkout
- `/cara-order` -> Cara Order Page
- `/syarat-ketentuan` -> Syarat & Ketentuan Page
- `/klaim-garansi` -> Klaim Garansi Page

---

## 11. State Management yang Dibutuhkan
Karena proyek ini frontend-only, state management cukup sederhana.

### Shared state
Menggunakan **React Context** untuk checkout ringan dan persistence sederhana ke `localStorage`.

### State yang perlu dikelola
1. **Product state**
   - list produk
   - active search query
   - active category

2. **Product detail state**
   - produk yang sedang dibuka
   - popup konfirmasi terbuka atau tertutup
   - varian yang sedang dipilih untuk popup

3. **Checkout state**
   - selected product
   - selected variant
   - quantity
   - paymentMethod
   - phoneNumber
   - subtotal
   - generated invoice
   - payment status simulasi

4. **Order status state**
   - invoice input
   - hasil pencarian invoice
   - order detail/result state

5. **Persistence state**
   - mock orders yang telah diupdate statusnya disimpan ke `localStorage`
   - checkout snapshot disimpan agar aman saat refresh ringan

### Rekomendasi
- Produk: load dari local JSON statis.
- Orders: seed dari JSON, lalu sinkronisasi ke localStorage saat simulasi pembayaran dilakukan.

---

## 12. Daftar Komponen Reusable
### Layout & navigation
- `AppLayout`
- `PhoneHero`
- `StickyCTA`
- `SiteFooter`

### Inputs & controls
- `SearchInput`
- `InvoiceInput`
- `CategoryChips`
- `PrimaryButton`
- `StatusBadge`

### Product components
- `ProductCard`
- `ProductHero`
- `VariantCard`
- `OrderConfirmationModal`

### Checkout components
- `OrderSummaryCard`
- `InvoiceCard`
- `QRCodeCard`

### Order status components
- `OrderStatusCard`
- `AccountCredentialCard`
- `EmptyState`

### Utility components
- `CopyField`

---

## 13. Struktur Folder React
```bash
src/
  components/
    common/
      PrimaryButton.jsx
      SearchInput.jsx
      InvoiceInput.jsx
      StatusBadge.jsx
      EmptyState.jsx
    layout/
      AppLayout.jsx
      PhoneHero.jsx
      StickyCTA.jsx
      SiteFooter.jsx
    product/
      ProductCard.jsx
      ProductHero.jsx
      VariantCard.jsx
      OrderConfirmationModal.jsx
      CategoryChips.jsx
    checkout/
      OrderSummaryCard.jsx
      InvoiceCard.jsx
      QRCodeCard.jsx
    order/
      OrderStatusCard.jsx
      AccountCredentialCard.jsx
  context/
    CheckoutContext.jsx
    useCheckout.js
  data/
    products.json
    orders.json
  pages/
    HomePage.jsx
    ProductDetailPage.jsx
    CheckoutPage.jsx
    OrderStatusPage.jsx
    CaraOrderPage.jsx
    SyaratKetentuanPage.jsx
    KlaimGaransiPage.jsx
  router/
    index.jsx
  utils/
    formatPrice.js
    generateInvoice.js
    normalizeInvoice.js
    orders.js
    products.js
  App.jsx
  main.jsx
```

---

## 14. UX Detail per Halaman
### Home Page UX
- Search product diletakkan di atas grid.
- Category filter berbentuk chip horizontal scroll.
- Product grid 2 kolom dengan gap cukup lega.
- Card menonjolkan image/logo dan nama, category badge kecil sebagai secondary info.
- Invoice checker diletakkan di atas sebagai quick utility.

### Product Detail UX
- Hero produk di atas.
- Variant card langsung terlihat tanpa scroll terlalu jauh.
- Tiap card varian punya CTA sendiri berupa tombol **Pilih Paket**.
- Tidak ada selected outline permanen.
- Varian stok habis terlihat abu-abu.

### Popup Konfirmasi UX
- Muncul sebagai modal di atas halaman detail.
- Menampilkan ringkasan item yang dipilih dengan jelas.
- Qty, nomor WhatsApp, metode pembayaran, dan total harus mudah dipahami dalam 1 layar.
- Tombol **Batal** dan **Beli Sekarang** harus jelas.

### Checkout UX
- Ringkasan pesanan mudah dibaca.
- Invoice tampil menonjol agar user bisa salin.
- QR dummy cukup besar untuk simulasi visual.
- Tombol simulasi sukses menjadi CTA utama.

### Order Status UX
- Input invoice di atas.
- Hasil status muncul tepat di bawah input.
- Jika success, kredensial akun tampil dalam card terpisah.
- Tambahkan tombol copy untuk email/password.

### Informational Pages UX
- Halaman informasional mengikuti gaya hero + card content + footer global.
- Konten legal/help harus mudah discan di mobile.
- CTA WhatsApp hanya muncul di halaman Klaim Garansi.

---

## 15. Edge Cases
### Home
- Search kosong -> tampilkan semua produk.
- Search tidak menemukan hasil -> tampilkan empty state.
- Category dipilih tapi tidak ada hasil -> tampilkan empty state.
- Kombinasi search + category tidak cocok -> tampilkan empty state.

### Product Detail
- Slug produk tidak valid -> tampilkan not found state.
- Produk tidak punya varian -> semua CTA disable dan tampilkan info tidak tersedia.
- User klik varian stok habis -> tidak membuka popup.

### Popup Konfirmasi
- Qty tidak boleh kurang dari 1.
- Qty tidak boleh melebihi stok varian.
- Nomor WhatsApp kosong -> tombol **Beli Sekarang** disable.
- User klik **Batal** -> popup menutup tanpa mengubah checkout state.

### Checkout
- User masuk checkout tanpa data checkout -> redirect ke Home.
- Invoice gagal dibuat -> fallback ke invoice random sederhana.
- User refresh halaman -> checkout snapshot tetap aman via localStorage.

### Order Status
- Invoice kosong -> tampilkan validasi input.
- Invoice tidak ditemukan -> tampilkan state `Tidak ditemukan`.
- Invoice pending -> tampilkan status pending tanpa kredensial akun.
- Invoice success tapi data akun tidak lengkap -> tampilkan fallback yang aman.
- Format invoice berbeda huruf besar/kecil -> lakukan normalisasi string.

### General
- Gambar produk gagal load -> tampilkan placeholder/fallback.
- Harga invalid -> tampilkan fallback `Hubungi admin`.
- localStorage kosong atau rusak -> fallback ke seed JSON.

---

## 16. Success Criteria
### Product/UX success criteria
- User dapat menyelesaikan simulasi pembelian dengan alur yang jelas dari Home sampai Order Status.
- User dapat menemukan produk dengan search/filter dalam beberapa detik.
- User dapat mengecek invoice tanpa login.
- Status order dan akun dummy ditampilkan dengan jelas.
- User baru bisa memahami proses beli lewat halaman Cara Order dan halaman legal/help yang tersedia.

### Frontend delivery success criteria
- Semua halaman utama dan informasional berjalan dengan data dummy.
- Routing antar halaman lancar.
- Search, filter, popup konfirmasi, generate invoice, dan simulasi status berfungsi.
- Layout mobile terlihat rapi dan usable.

---

## 17. Prioritas Implementasi
### P0
- Home Page
- Product Detail Page
- Popup konfirmasi pesanan
- Checkout Page
- Order Status Page
- Dummy data products + orders
- Search + category filter
- Invoice generation dummy
- Simulasi pembayaran berhasil

### P1
- Copy button untuk invoice/email/password
- Persist checkout dan order ke localStorage
- Halaman Cara Order
- Halaman Syarat & Ketentuan
- Halaman Klaim Garansi
- Empty states yang polished

### P2
- Animasi ringan
- Skeleton loading dummy
- Pricelist page
- Dark mode (opsional)

---

## 18. Rekomendasi Implementasi Singkat
- Simpan semua produk di `products.json`.
- Simpan seed order di `orders.json`.
- Simpan snapshot checkout di context + `localStorage`.
- Saat user menekan **Beli Sekarang** di popup, tulis state checkout yang lengkap.
- Saat checkout dibuka, generate invoice via helper `generateInvoice()`.
- Saat tombol simulasi sukses ditekan, tulis/update order ke localStorage.
- Halaman status membaca data order dari localStorage terlebih dahulu, lalu fallback ke seed JSON.
- Gunakan Tailwind utility class untuk menjaga UI tetap clean, ringan, dan konsisten.

---

## 19. Ringkasan Alur
1. **Pilih produk** dari Home.
2. **Pilih varian** di Product Detail.
3. **Konfirmasi pesanan** di popup.
4. **Checkout** dan lihat invoice + QR dummy.
5. **Cek hasil** di Order Status.

PRD ini disusun agar tetap sinkron dengan implementasi frontend-only saat ini, termasuk popup konfirmasi pesanan, state checkout yang lebih lengkap, dan halaman informasional yang sudah tersedia di website.
