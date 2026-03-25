const productTones = {
  netflix: 'bg-[#fff0f1] text-[#d51f35]',
  spotify: 'bg-[#ebfff3] text-[#1f9d55]',
  canva: 'bg-[#f3efff] text-[#6f55ff]',
  youtube: 'bg-[#fff1ef] text-[#e44733]',
  disney: 'bg-[#eef2ff] text-[#3451d1]',
}

function StatusBadge({
  children,
  tone = 'neutral',
  productTone,
  className = '',
}) {
  const tones = {
    success: 'bg-nara-green-soft text-nara-green',
    pending: 'bg-nara-amber-soft text-nara-amber',
    danger: 'bg-nara-red-soft text-nara-red',
    stock: 'bg-nara-accent-soft text-nara-accent',
    neutral: 'bg-nara-accent-soft text-[#c36c34]',
  }

  const resolvedTone = productTone ? productTones[productTone] ?? tones[tone] : tones[tone]

  return (
    <span
      className={`inline-flex items-center justify-center rounded-full px-3 py-1 text-[11px] font-bold leading-none ${resolvedTone} ${className}`}
    >
      {children}
    </span>
  )
}

export default StatusBadge
