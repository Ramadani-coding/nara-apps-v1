import StatusBadge from '../common/StatusBadge'

function Pixel({ active }) {
  return active ? (
    <span className="block h-2.5 w-2.5 rounded-[2px] bg-[#111111]" />
  ) : (
    <span />
  )
}

function QRCodeCard() {
  const activeCells = new Set([
    0, 1, 2, 4, 5, 6, 8, 9, 11, 12, 14, 16, 18, 20, 23, 24, 25, 26, 28, 29, 30,
    32, 33, 34, 35, 40, 44, 46, 48, 49, 50, 51, 52, 54, 56, 57, 58, 59, 60, 64,
    68, 71, 72, 74, 75, 76, 78, 80, 81, 82, 83, 90, 92, 94, 96, 98, 100, 101,
    102, 103, 108, 112, 113, 114, 116, 118, 120, 121, 122, 123, 124, 126, 128,
    130, 132, 135, 136, 137, 138, 140, 141, 143,
  ])

  return (
    <div className="nara-card px-5 py-5 sm:px-6">
      <div className="flex flex-wrap items-start justify-between gap-3">
        <h2 className="text-[16px] font-bold leading-6 text-nara-ink">
          QR Pembayaran Dummy
        </h2>
        <StatusBadge tone="pending">Pending Payment</StatusBadge>
      </div>

      <div className="mx-auto mt-5 grid h-[184px] w-[184px] max-w-full grid-cols-12 gap-[3px] rounded-[28px] border border-[#e8e8e8] bg-white p-5">
        {Array.from({ length: 144 }).map((_, index) => (
          <Pixel key={index} active={activeCells.has(index)} />
        ))}
      </div>

      <p className="mt-4 text-center text-sm leading-6 text-nara-muted">
        Scan untuk simulasi visual. Setelah itu tekan tombol sukses di bawah.
      </p>
    </div>
  )
}

export default QRCodeCard
