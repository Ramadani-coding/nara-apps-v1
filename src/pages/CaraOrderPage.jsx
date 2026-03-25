import { useNavigate } from 'react-router-dom'
import PrimaryButton from '../components/common/PrimaryButton'
import PhoneHero from '../components/layout/PhoneHero'

const steps = [
  {
    number: '1',
    title: 'Pilih Produk',
    description:
      'Buka halaman utama lalu pilih layanan premium yang ingin kamu beli.',
    tone: {
      badge: 'bg-[#efe7ff] text-[#6f55ff]',
      glow: 'bg-[#efe7ff]/70',
    },
  },
  {
    number: '2',
    title: 'Pilih Varian',
    description:
      'Masuk ke detail produk, lalu pilih paket yang masih tersedia dan paling cocok buat kebutuhanmu.',
    tone: {
      badge: 'bg-[#e8f4ff] text-[#3f78d7]',
      glow: 'bg-[#e8f4ff]/70',
    },
  },
  {
    number: '3',
    title: 'Konfirmasi Pesanan',
    description:
      'Setelah klik pilih paket, akan muncul popup konfirmasi untuk isi jumlah, nomor WhatsApp aktif, dan metode pembayaran.',
    tone: {
      badge: 'bg-[#e7fbef] text-[#22a85a]',
      glow: 'bg-[#e7fbef]/70',
    },
  },
  {
    number: '4',
    title: 'Checkout & Bayar',
    description:
      'Setelah tekan beli sekarang, kamu masuk ke halaman checkout untuk lihat invoice, ringkasan pesanan, dan total pembayaran.',
    tone: {
      badge: 'bg-[#fff3df] text-[#d88b00]',
      glow: 'bg-[#fff3df]/70',
    },
  },
  {
    number: '5',
    title: 'Cek Status & Ambil Akun',
    description:
      'Kalau pembayaran berhasil, buka halaman status order untuk melihat email dan password akun premium kamu.',
    tone: {
      badge: 'bg-[#ffe8e1] text-[#ff624d]',
      glow: 'bg-[#ffe8e1]/70',
    },
  },
]

const faqs = [
  {
    icon: '?',
    title: 'Berapa lama prosesnya?',
    description:
      'Di MVP ini prosesnya cepat. Setelah simulasi pembayaran berhasil, status order langsung bisa dicek di halaman status.',
    tone: 'bg-[#efe7ff] text-[#6f55ff]',
  },
  {
    icon: '!',
    title: 'Nomor WhatsApp dipakai untuk apa?',
    description:
      'Nomor WhatsApp aktif dipakai admin untuk menghubungi kamu kalau ada kendala atau perlu konfirmasi pesanan.',
    tone: 'bg-[#fff3df] text-[#d88b00]',
  },
  {
    icon: 'i',
    title: 'Apakah jumlah pesanan bisa diubah?',
    description:
      'Bisa. Saat popup konfirmasi muncul, kamu bisa atur qty mulai dari 1 sebelum lanjut ke checkout.',
    tone: 'bg-[#e8f4ff] text-[#3f78d7]',
  },
  {
    icon: '$',
    title: 'Bisa pilih metode pembayaran?',
    description:
      'Bisa. Di popup konfirmasi kamu bisa pilih QRIS, DANA, GoPay, atau ShopeePay sebelum menekan beli sekarang.',
    tone: 'bg-[#e9fff1] text-[#22a85a]',
  },
  {
    icon: '@',
    title: 'Kalau invoice belum ketemu bagaimana?',
    description:
      'Pastikan nomor invoice yang dimasukkan sama seperti yang muncul saat checkout. Simpan invoice agar lebih mudah cek ulang nanti.',
    tone: 'bg-[#ffecec] text-[#eb5757]',
  },
]

function StepCard({ step }) {
  return (
    <article className="nara-card relative overflow-hidden px-5 py-5 sm:px-6 sm:py-6">
      <div className={`absolute right-[-28px] top-[-26px] h-24 w-24 rounded-full blur-2xl ${step.tone.glow}`} />
      <div className="relative z-10">
        <span
          className={`inline-flex h-11 w-11 items-center justify-center rounded-2xl text-base font-extrabold shadow-sm ${step.tone.badge}`}
        >
          {step.number}
        </span>
        <h2 className="mt-5 text-[22px] font-bold tracking-[-0.02em] text-nara-ink">
          {step.title}
        </h2>
        <p className="mt-3 max-w-[420px] text-[15px] leading-7 text-nara-muted">
          {step.description}
        </p>
      </div>
    </article>
  )
}

function FaqCard({ item }) {
  return (
    <article className="rounded-[24px] border border-nara-line/80 bg-white px-4 py-4 shadow-[0_12px_26px_rgba(26,29,47,0.06)]">
      <div className="flex items-start gap-3">
        <span
          className={`inline-flex h-8 w-8 shrink-0 items-center justify-center rounded-full text-sm font-extrabold ${item.tone}`}
        >
          {item.icon}
        </span>
        <div className="min-w-0">
          <h3 className="text-[15px] font-bold leading-6 text-nara-ink">{item.title}</h3>
          <p className="mt-1.5 text-sm leading-6 text-nara-muted">{item.description}</p>
        </div>
      </div>
    </article>
  )
}

function CaraOrderPage() {
  const navigate = useNavigate()

  return (
    <div className="space-y-6 pb-10 md:space-y-7">
      <PhoneHero
        showBackButton
        title="Cara Order"
        subtitle="Ikuti alur singkat ini supaya proses beli akun premium lebih gampang dipahami, termasuk langkah konfirmasi pesanan sebelum checkout."
      />

      <div className="space-y-6 px-1 sm:space-y-7">
        <section className="space-y-4 sm:space-y-5">
          {steps.map((step) => (
            <StepCard key={step.number} step={step} />
          ))}
        </section>

        <section className="nara-card px-5 py-5 sm:px-6 sm:py-6">
          <div className="text-center">
            <h2 className="text-[24px] font-bold tracking-[-0.02em] text-nara-ink">
              Pertanyaan Umum
            </h2>
            <p className="mt-3 text-[15px] leading-7 text-nara-muted">
              Beberapa hal yang paling sering ditanyakan sebelum checkout.
            </p>
          </div>

          <div className="mt-6 space-y-4">
            {faqs.map((item) => (
              <FaqCard key={item.title} item={item} />
            ))}
          </div>

          <PrimaryButton
            className="mt-7 w-full rounded-[22px] py-4 text-[15px]"
            onClick={() => navigate('/')}
          >
            Mulai Belanja Sekarang
          </PrimaryButton>
        </section>
      </div>
    </div>
  )
}

export default CaraOrderPage
