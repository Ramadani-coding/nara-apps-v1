import CopyField from '../common/CopyField'

function AccountCredentialCard({ username, password }) {
  return (
    <section className="overflow-hidden rounded-[28px] border border-nara-line/80 bg-white shadow-[0_20px_44px_rgba(24,32,56,0.08)]">
      <div className="h-1.5 w-full bg-[#6f55ff]" />
      <div className="px-5 py-5 sm:px-6 sm:py-6">
        <div className="flex items-center gap-3">
          <span className="inline-flex h-10 w-1 rounded-full bg-[#6f55ff]" />
          <div>
            <h2 className="text-[23px] font-bold tracking-[-0.03em] text-nara-ink">
              Detail Akun
            </h2>
            <p className="mt-1 text-[13px] leading-6 text-nara-muted">
              Simpan data akun ini dan jangan dibagikan ke orang lain.
            </p>
          </div>
        </div>

        <div className="mt-5 space-y-3">
        <CopyField
          label="Username"
          value={username || 'Data username belum tersedia'}
        />
        <CopyField
          label="Password"
          value={password || 'Data password belum tersedia'}
        />
      </div>
      </div>
    </section>
  )
}

export default AccountCredentialCard
