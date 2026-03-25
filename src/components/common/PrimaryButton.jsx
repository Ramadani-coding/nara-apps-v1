function PrimaryButton({
  children,
  className = '',
  tone = 'accent',
  disabled = false,
  ...props
}) {
  const tones = {
    accent:
      'bg-nara-accent text-white hover:brightness-105 disabled:bg-nara-line disabled:text-nara-muted',
    navy:
      'bg-nara-navy text-white hover:brightness-105 disabled:bg-nara-line disabled:text-nara-muted',
  }

  return (
    <button
      className={`inline-flex items-center justify-center rounded-[20px] px-5 py-3 text-sm font-bold transition ${tones[tone]} ${className}`}
      disabled={disabled}
      {...props}
    >
      {children}
    </button>
  )
}

export default PrimaryButton
