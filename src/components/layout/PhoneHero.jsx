import { useNavigate } from 'react-router-dom'

function PhoneHero({
  title,
  subtitle,
  children,
  compact = false,
  showBackButton = false,
}) {
  const navigate = useNavigate()

  function handleBack() {
    if (window.history.length > 1) {
      navigate(-1)
      return
    }

    navigate('/')
  }

  return (
    <header
      className={`nara-hero relative overflow-hidden rounded-[32px] px-5 text-white shadow-[var(--shadow-nara-soft)] sm:px-6 ${
        compact ? 'py-6' : 'py-7'
      }`}
    >
      <div className="absolute -left-10 bottom-[-44px] h-36 w-36 rounded-full bg-white/8" />
      <div className="absolute right-[-28px] top-[-36px] h-40 w-40 rounded-full bg-white/12" />
      <div className="absolute right-16 top-9 h-16 w-16 rounded-full border border-white/10 bg-white/5" />

      <div className="relative z-10">
        {showBackButton ? (
          <button
            type="button"
            onClick={handleBack}
            className="inline-flex items-center gap-2 rounded-full border border-white/20 bg-white/14 px-4 py-2 text-[13px] font-semibold text-white shadow-[0_10px_24px_rgba(24,32,56,0.12)] backdrop-blur-sm transition hover:bg-white/20"
          >
            <span aria-hidden="true">←</span>
            <span>Kembali</span>
          </button>
        ) : null}

        {children}

        <div className={compact ? 'pt-3' : 'pt-4'}>
          <h1 className="max-w-[360px] text-[28px] font-extrabold leading-[1.15] sm:text-[32px]">
            {title}
          </h1>
          {subtitle ? (
            <p className="mt-3 max-w-[420px] text-sm leading-6 text-white/90 sm:text-[15px]">
              {subtitle}
            </p>
          ) : null}
        </div>
      </div>
    </header>
  )
}

export default PhoneHero
