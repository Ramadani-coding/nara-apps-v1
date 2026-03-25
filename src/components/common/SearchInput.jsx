function SearchInput({ value, onChange, placeholder }) {
  return (
    <label className="nara-card flex items-center gap-3 px-4 py-3 sm:px-5">
      <span className="inline-flex h-5 w-5 shrink-0 items-center justify-center text-nara-muted">
        <svg
          viewBox="0 0 24 24"
          className="h-4.5 w-4.5"
          fill="none"
          aria-hidden="true"
        >
          <circle
            cx="11"
            cy="11"
            r="6.5"
            stroke="currentColor"
            strokeWidth="1.8"
          />
          <path
            d="m16 16 4 4"
            stroke="currentColor"
            strokeWidth="1.8"
            strokeLinecap="round"
          />
        </svg>
      </span>
      <input
        className="min-w-0 w-full border-0 bg-transparent text-sm text-nara-ink outline-none placeholder:text-nara-muted"
        placeholder={placeholder}
        value={value}
        onChange={onChange}
      />
    </label>
  )
}

export default SearchInput
