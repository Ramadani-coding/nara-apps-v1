import CopyField from '../common/CopyField'

function InvoiceCard({ invoice }) {
  return (
    <div className="nara-card px-4 py-4 sm:px-5">
      <CopyField label="Invoice" value={invoice} />
    </div>
  )
}

export default InvoiceCard
