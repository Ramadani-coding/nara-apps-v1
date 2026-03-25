import { useState } from 'react'
import StatusBadge from './StatusBadge'

function CopyField({ label, value }) {
  const [copied, setCopied] = useState(false)

  async function handleCopy() {
    try {
      await navigator.clipboard.writeText(value)
      setCopied(true)
      window.setTimeout(() => setCopied(false), 1400)
    } catch {
      setCopied(false)
    }
  }

  return (
    <div className="rounded-[20px] border border-nara-line bg-[#fff8f1] px-4 py-3">
      <div className="flex items-start justify-between gap-3">
        <div className="min-w-0 flex-1">
          <p className="text-[11px] text-nara-muted">{label}</p>
          <p className="truncate pt-1 text-sm font-bold text-nara-ink">{value}</p>
        </div>
        <button type="button" className="shrink-0" onClick={handleCopy}>
          <StatusBadge tone={copied ? 'success' : 'neutral'}>
            {copied ? 'Copied' : 'Copy'}
          </StatusBadge>
        </button>
      </div>
    </div>
  )
}

export default CopyField
