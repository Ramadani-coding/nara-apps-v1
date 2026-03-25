import { useState } from "react";
import PrimaryButton from "./PrimaryButton";

function InvoiceInput({
  label,
  value,
  onChange,
  onSubmit,
  buttonLabel = "Cek",
  placeholder = "Invoice",
  readOnly = false,
}) {
  const [copied, setCopied] = useState(false);

  async function handleCopy() {
    try {
      await navigator.clipboard.writeText(value || "");
      setCopied(true);
      window.setTimeout(() => setCopied(false), 1400);
    } catch {
      setCopied(false);
    }
  }

  function handleButtonClick() {
    if (readOnly) {
      handleCopy();
      return;
    }

    onSubmit?.();
  }

  return (
    <div className="nara-card px-4 py-4 sm:px-5">
      {label ? <p className="text-xs text-nara-muted">{label}</p> : null}
      <div className="mt-3 flex items-center gap-3">
        <label className="relative min-w-0 flex-1">
          <span className="pointer-events-none absolute inset-y-0 left-0 inline-flex items-center pl-4 text-nara-muted">
            <svg
              viewBox="0 0 24 24"
              className="h-4.5 w-4.5"
              fill="none"
              aria-hidden="true"
            >
              <path
                d="M7 4.5h7l4 4v10a2 2 0 0 1-2 2H7a2 2 0 0 1-2-2v-12a2 2 0 0 1 2-2Z"
                stroke="currentColor"
                strokeWidth="1.8"
                strokeLinejoin="round"
              />
              <path
                d="M14 4.5V9h4"
                stroke="currentColor"
                strokeWidth="1.8"
                strokeLinejoin="round"
              />
              <path
                d="M8.5 12.5h7M8.5 16h5"
                stroke="currentColor"
                strokeWidth="1.8"
                strokeLinecap="round"
              />
            </svg>
          </span>
          <input
            className={`h-11 min-w-0 w-full rounded-2xl border pl-11 pr-4 text-sm text-nara-ink placeholder:text-nara-muted ${
              readOnly
                ? "border-nara-line/80 bg-[#fffdf9] font-medium outline-none"
                : "border-nara-line bg-[#fff8f1] outline-none"
            }`}
            value={value}
            onChange={onChange}
            placeholder={placeholder}
            readOnly={readOnly}
          />
        </label>
        <PrimaryButton
          className="h-11 min-w-[84px] rounded-2xl px-4 py-0"
          onClick={handleButtonClick}
        >
          {readOnly ? (copied ? "Copied" : "Copy") : buttonLabel}
        </PrimaryButton>
      </div>
    </div>
  );
}

export default InvoiceInput;
