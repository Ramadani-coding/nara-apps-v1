import StatusBadge from '../common/StatusBadge'

function OrderStatusCard({ status, title, description, dateLabel }) {
  const tone =
    status === 'success' ? 'success' : status === 'pending' ? 'pending' : 'danger'
  const iconTone =
    status === 'success'
      ? 'bg-nara-green-soft text-nara-green'
      : status === 'pending'
        ? 'bg-nara-amber-soft text-nara-amber'
        : 'bg-nara-red-soft text-nara-red'

  const icon = status === 'success' ? 'OK' : status === 'pending' ? '!' : 'X'

  return (
    <div className="nara-card flex gap-4 px-5 py-5 sm:px-6">
      <div
        className={`flex h-12 w-12 shrink-0 items-center justify-center rounded-full text-[18px] font-bold ${iconTone}`}
      >
        {icon}
      </div>
      <div className="min-w-0 flex-1">
        <h2 className="text-[17px] font-bold text-nara-ink">{title}</h2>
        <p className="mt-2 text-sm leading-6 text-nara-muted">{description}</p>
        <div className="mt-4 flex flex-wrap items-center gap-3">
          <StatusBadge tone={tone}>
            {status === 'success'
              ? 'Success'
              : status === 'pending'
                ? 'Pending'
                : 'Not Found'}
          </StatusBadge>
          {dateLabel ? (
            <span className="text-xs leading-5 text-nara-muted">{dateLabel}</span>
          ) : null}
        </div>
      </div>
    </div>
  )
}

export default OrderStatusCard
