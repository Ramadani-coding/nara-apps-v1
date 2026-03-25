function EmptyState({ title, description }) {
  return (
    <div className="nara-card px-5 py-8 text-center">
      <p className="text-lg font-bold text-nara-ink">{title}</p>
      <p className="mt-2 text-sm leading-6 text-nara-muted">{description}</p>
    </div>
  )
}

export default EmptyState
