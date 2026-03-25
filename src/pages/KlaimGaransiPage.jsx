import PrimaryButton from "../components/common/PrimaryButton";
import PhoneHero from "../components/layout/PhoneHero";

const warrantyRows = [
  { product: "Netflix Premium", duration: "Garansi 30 Hari", tone: "green" },
  { product: "Spotify Premium", duration: "Garansi Backfree", tone: "blue" },
  { product: "Canva Pro / Edu", duration: "Garansi 3 Bulan", tone: "purple" },
  { product: "Disney+ Hotstar", duration: "Garansi 30 Hari", tone: "green" },
  { product: "YouTube Premium", duration: "Garansi 30 Hari", tone: "green" },
  { product: "CapCut Pro", duration: "Garansi 7 Hari", tone: "amber" },
  { product: "Alight Motion", duration: "Garansi 3 Bulan", tone: "purple" },
  { product: "Viu Premium", duration: "Garansi 3 Bulan", tone: "purple" },
  { product: "Prime Video", duration: "Garansi Backfree", tone: "blue" },
];

const warrantyToneClasses = {
  green: "bg-[#e9fff1] text-[#22a85a]",
  blue: "bg-[#e8f1ff] text-[#3f78d7]",
  purple: "bg-[#efe7ff] text-[#6f55ff]",
  amber: "bg-[#fff3df] text-[#d88b00]",
};

const warrantyRules = [
  "Garansi hangus jika pembeli mengubah data akun pada produk yang tidak boleh diubah.",
  "Klaim hanya berlaku untuk pembeli asli dan tidak dapat dipindahkan ke pihak lain.",
  "Nomor invoice atau bukti transaksi wajib disertakan saat mengajukan komplain.",
  "Klaim harus diajukan selama masa aktif garansi produk masih berlaku.",
  "Spam chat atau komunikasi yang tidak sopan dapat membatalkan prioritas bantuan.",
];

const complaintSteps = [
  "Screenshot kendala yang terjadi pada aplikasi atau akun.",
  "Siapkan nomor invoice yang dipakai saat checkout.",
  "Hubungi admin lewat WhatsApp dengan penjelasan yang singkat dan jelas.",
  "Tunggu proses pengecekan. Estimasi respon antara 10 menit sampai 24 jam.",
];

function WarrantyTable() {
  return (
    <div className="overflow-hidden rounded-[22px] border border-nara-line/80">
      <div className="grid grid-cols-[1.45fr_1fr] bg-[#fffaf5] text-[13px] font-bold text-nara-ink">
        <div className="border-r border-nara-line/70 px-4 py-3">
          Nama Produk
        </div>
        <div className="px-4 py-3">Durasi Garansi</div>
      </div>

      {warrantyRows.map((row) => (
        <div
          key={row.product}
          className="grid grid-cols-[1.45fr_1fr] border-t border-nara-line/60 bg-white text-[14px] text-nara-ink"
        >
          <div className="border-r border-nara-line/60 px-4 py-4 leading-6">
            {row.product}
          </div>
          <div className="flex items-center px-4 py-4">
            <span
              className={`inline-flex rounded-full px-3 py-1 text-[11px] font-bold leading-none ${warrantyToneClasses[row.tone]}`}
            >
              {row.duration}
            </span>
          </div>
        </div>
      ))}
    </div>
  );
}

function SectionTitle({ icon, title, tone }) {
  return (
    <div className="flex items-center gap-3">
      <span
        className={`inline-flex h-9 w-9 items-center justify-center rounded-full text-sm font-extrabold ${tone}`}
      >
        {icon}
      </span>
      <h2 className="text-[22px] font-bold tracking-[-0.02em] text-nara-ink">
        {title}
      </h2>
    </div>
  );
}

function KlaimGaransiPage() {
  return (
    <div className="space-y-6 pb-10 md:space-y-7">
      <PhoneHero
        compact
        showBackButton
        title="Kebijakan Garansi"
        subtitle="Kami menjamin kualitas beberapa produk digital yang Anda beli sesuai masa aktif garansi masing-masing."
      />

      <div className="space-y-6 px-1 sm:space-y-7">
        <section className="nara-card px-5 py-5 sm:px-6 sm:py-6">
          <SectionTitle
            icon="G"
            title="Masa Berlaku Garansi"
            tone="bg-[#efe7ff] text-[#6f55ff]"
          />
          <div className="mt-6">
            <WarrantyTable />
          </div>
          <p className="mt-4 text-[13px] leading-6 text-nara-muted">
            Garansi backfree berarti jika masa aktif garansi masih berlaku dan
            produk bermasalah, akun akan dibantu penggantian atau penanganan
            ulang sesuai kondisi.
          </p>
        </section>

        <section className="nara-card px-5 py-5 sm:px-6 sm:py-6">
          <SectionTitle
            icon="!"
            title="Syarat Klaim Garansi"
            tone="bg-[#fff3df] text-[#d88b00]"
          />
          <ul className="mt-5 space-y-3 pl-5 text-[15px] leading-8 text-nara-muted">
            {warrantyRules.map((rule) => (
              <li key={rule}>{rule}</li>
            ))}
          </ul>
        </section>

        <section className="nara-card px-5 py-5 sm:px-6 sm:py-6">
          <SectionTitle
            icon="i"
            title="Cara Mengajukan Komplain"
            tone="bg-[#e8f1ff] text-[#3f78d7]"
          />
          <p className="mt-4 text-[15px] leading-7 text-nara-muted">
            Jika produk yang Anda beli mengalami kendala, ikuti langkah berikut:
          </p>
          <ol className="mt-5 space-y-3 pl-5 text-[15px] leading-8 text-nara-muted">
            {complaintSteps.map((step) => (
              <li key={step}>{step}</li>
            ))}
          </ol>

          <PrimaryButton
            className="mt-7 w-full rounded-[22px] py-4 text-[15px]"
            onClick={() => {
              window.open(
                "https://wa.me/6285750231336",
                "_blank",
                "noopener,noreferrer",
              );
            }}
          >
            Hubungi Admin
          </PrimaryButton>
        </section>
      </div>
    </div>
  );
}

export default KlaimGaransiPage;
