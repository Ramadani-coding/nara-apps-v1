import CopyField from '../common/CopyField'

function AccountCredentialCard({ username, password }) {
  return (
    <div className="nara-card px-4 py-5 sm:px-5">
      <h2 className="text-[16px] font-bold text-nara-ink">Kredensial Akun</h2>
      <div className="mt-4 space-y-3">
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
  )
}

export default AccountCredentialCard
