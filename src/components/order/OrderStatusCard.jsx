import StatusBadge from '../common/StatusBadge'
import { formatRupiah } from '../../utils/formatPrice'

const statusConfig = {
  success: {
    tone: 'success',
    bar: 'bg-nara-green',
    badge: 'Lunas',
    iconTone: 'bg-nara-green-soft text-nara-green',
    icon: '✓',
  },
  pending: {
    tone: 'pending',
    bar: 'bg-nara-amber',
    badge: 'Pending',
    iconTone: 'bg-nara-amber-soft text-nara-amber',
    icon: '!',
  },
  'not-found': {
    tone: 'danger',
    bar: 'bg-nara-red',
    badge: 'Tidak Ditemukan',
    iconTone: 'bg-nara-red-soft text-nara-red',
    icon: 'X',
  },
}

function SummaryRow({ label, value, emphasize = false, valueClassName = '' }) {
  return (
    <div className="flex items-start justify-between gap-4 text-sm">
      <span className={emphasize ? 'font-semibold text-nara-ink' : 'text-nara-muted'}>{label}</span>
      <span
        className={`text-right ${emphasize ? 'font-extrabold text-[24px] tracking-[-0.03em] text-[#6f55ff]' : 'font-semibold text-nara-ink'} ${valueClassName}`}
      >
        {value}
      </span>
    </div>
  )
}

function OrderStatusCard({ status, invoice, title, description, order }) {
  const config = statusConfig[status] ?? statusConfig.pending
  const hasOrder = Boolean(order)

  return (
    <section className="overflow-hidden rounded-[28px] border border-nara-line/80 bg-white shadow-[0_20px_44px_rgba(24,32,56,0.08)]">
      <div className={`h-1.5 w-full ${config.bar}`} />
      <div className="px-5 py-5 sm:px-6 sm:py-6">
        <div className="flex flex-wrap items-start justify-between gap-4">
          <div className="min-w-0">
            <p className="text-[13px] font-semibold text-nara-muted">Invoice</p>
            <h2 className="mt-1 text-[28px] font-extrabold tracking-[-0.04em] text-nara-ink">
              {invoice || title}
            </h2>
            {invoice ? (
              <p className="mt-2 break-all text-[13px] leading-6 text-nara-muted">
                Order ID: {invoice}
              </p>
            ) : null}
          </div>
          <div className="flex items-center gap-3">
            <span
              className={`inline-flex h-11 w-11 shrink-0 items-center justify-center rounded-full text-[18px] font-extrabold ${config.iconTone}`}
            >
              {config.icon}
            </span>
            <StatusBadge tone={config.tone} className="px-4 py-2 text-[12px]">
              {config.badge}
            </StatusBadge>
          </div>
        </div>

        <p className="mt-4 text-[14px] leading-7 text-nara-muted">{description}</p>

        {hasOrder ? (
          <div className="mt-6 space-y-5">
            <div className="rounded-[22px] border border-nara-line/70 bg-[#fffdfb] px-4 py-4 shadow-[0_12px_30px_rgba(24,32,56,0.05)]">
              <div className="flex items-start justify-between gap-4">
                <div className="min-w-0">
                  <h3 className="text-[19px] font-bold leading-7 text-nara-ink">
                    {order.product?.name} {order.variant?.label}
                  </h3>
                  <p className="mt-1 text-[13px] font-medium text-nara-muted">
                    Qty: {order.qty}x
                  </p>
                </div>
                <span className="shrink-0 text-right text-[24px] font-extrabold leading-none tracking-[-0.03em] text-nara-ink">
                  {formatRupiah(order.sellUnitPrice)}
                </span>
              </div>

              <div className="mt-5 space-y-3 border-t border-nara-line/70 pt-4">
                <SummaryRow label="Harga Satuan" value={formatRupiah(order.sellUnitPrice)} />
                <SummaryRow label="Subtotal" value={formatRupiah(order.subtotal)} />
                <SummaryRow label="Metode Bayar" value={order.paymentMethod || '-'} />
                <SummaryRow label="No WhatsApp" value={order.phoneNumber || '-'} />
                <div className="border-t border-nara-line/70 pt-3">
                  <SummaryRow
                    label="Total Bayar"
                    value={formatRupiah(order.subtotal)}
                    emphasize
                  />
                </div>
              </div>
            </div>
          </div>
        ) : null}
      </div>
    </section>
  )
}

export default OrderStatusCard
