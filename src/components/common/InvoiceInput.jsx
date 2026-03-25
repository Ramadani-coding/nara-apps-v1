import PrimaryButton from './PrimaryButton'

function InvoiceInput({
  label,
  value,
  onChange,
  onSubmit,
  buttonLabel = 'Cek',
  placeholder = 'NARA-INV-1001',
}) {
  return (
    <div className="nara-card px-4 py-4 sm:px-5">
      {label ? <p className="text-xs text-nara-muted">{label}</p> : null}
      <div className="mt-3 flex items-center gap-3">
        <input
          className="h-11 min-w-0 flex-1 rounded-2xl border border-nara-line bg-[#fff8f1] px-4 text-sm text-nara-ink outline-none placeholder:text-nara-muted"
          value={value}
          onChange={onChange}
          placeholder={placeholder}
        />
        <PrimaryButton
          className="h-11 min-w-[84px] rounded-2xl px-4 py-0"
          onClick={onSubmit}
        >
          {buttonLabel}
        </PrimaryButton>
      </div>
    </div>
  )
}

export default InvoiceInput
