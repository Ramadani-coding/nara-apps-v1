import PhoneHero from '../components/layout/PhoneHero'

const terms = [
  {
    number: '1',
    title: 'Penerimaan Syarat',
    description:
      'Dengan mengakses dan menggunakan layanan di Nara Premium, kamu dianggap telah membaca, memahami, dan menyetujui syarat yang berlaku sebelum melakukan transaksi.',
  },
  {
    number: '2',
    title: 'Perubahan Syarat',
    description:
      'Kami berhak menyesuaikan isi syarat dan ketentuan sewaktu-waktu. Perubahan berlaku setelah ditampilkan di situs ini dan menjadi acuan untuk transaksi berikutnya.',
  },
  {
    number: '3',
    title: 'Pembelian Produk Digital',
    description:
      'Setelah memilih produk dan varian, kamu perlu mengisi qty, nomor WhatsApp aktif, dan metode pembayaran di popup konfirmasi. Invoice dibuat saat checkout, lalu detail akun muncul di halaman status ketika pembayaran sudah berhasil. Kesalahan nomor WhatsApp yang diisi pembeli menjadi tanggung jawab pembeli.',
    bullets: [
      'Semua harga yang tampil adalah harga produk digital sesuai varian yang dipilih.',
      'Qty minimum pembelian adalah 1 dan total pembayaran dihitung dari harga varian dikali jumlah pesanan.',
      'Metode pembayaran yang tersedia untuk MVP adalah QRIS, DANA, GoPay, dan ShopeePay.',
    ],
  },
  {
    number: '4',
    title: 'Pengembalian Dana & Garansi',
    description:
      'Kebijakan pengembalian dana dan garansi mengikuti ketentuan layanan masing-masing produk. Informasi lanjutan terkait garansi akan dijelaskan lebih detail pada halaman Klaim Garansi saat halaman tersebut tersedia.',
  },
  {
    number: '5',
    title: 'Larangan Penggunaan',
    description:
      'Dilarang menyalahgunakan akun, membagikan akses tanpa izin, atau menggunakan layanan untuk aktivitas yang melanggar aturan platform terkait. Pelanggaran dapat menyebabkan garansi tidak berlaku.',
  },
]

function TermSection({ item }) {
  return (
    <section className="flex gap-3">
      <span className="inline-flex h-8 w-8 shrink-0 items-center justify-center rounded-full bg-[#efe7ff] text-sm font-extrabold text-[#6f55ff]">
        {item.number}
      </span>
      <div className="min-w-0">
        <h2 className="text-[22px] font-bold tracking-[-0.02em] text-nara-ink">
          {item.title}
        </h2>
        <p className="mt-3 text-[15px] leading-8 text-nara-muted">{item.description}</p>
        {item.bullets ? (
          <ul className="mt-4 space-y-3 pl-5 text-[15px] leading-8 text-nara-muted">
            {item.bullets.map((bullet) => (
              <li key={bullet}>{bullet}</li>
            ))}
          </ul>
        ) : null}
      </div>
    </section>
  )
}

function SyaratKetentuanPage() {
  return (
    <div className="space-y-6 pb-10 md:space-y-7">
      <PhoneHero
        compact
        showBackButton
        title="Syarat & Ketentuan"
        subtitle="Terakhir diperbarui: 2026"
      />

      <div className="space-y-6 px-1 sm:space-y-7">
        <section className="nara-card px-5 py-5 sm:px-6 sm:py-6">
          <div className="rounded-[22px] bg-[#fffaf5] px-4 py-4 text-[15px] leading-8 text-nara-muted">
            Selamat datang di <span className="font-bold text-nara-ink">narapremium.store</span>.
            Dengan mengakses atau menggunakan layanan kami, kamu setuju untuk terikat pada
            syarat dan ketentuan yang berlaku sebelum melakukan transaksi.
          </div>

          <div className="mt-6 space-y-8">
            {terms.map((item) => (
              <TermSection key={item.number} item={item} />
            ))}
          </div>

          <div className="mt-8 rounded-[22px] border border-nara-line/80 bg-[#fffdfb] px-4 py-4">
            <h2 className="text-[18px] font-bold text-nara-ink">Butuh Bantuan?</h2>
            <p className="mt-2 text-[15px] leading-7 text-nara-muted">
              Jika ada pertanyaan terkait syarat dan ketentuan ini, silakan hubungi admin
              melalui WhatsApp yang tersedia di bagian footer.
            </p>
          </div>
        </section>
      </div>
    </div>
  )
}

export default SyaratKetentuanPage
