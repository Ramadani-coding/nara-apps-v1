function SearchInput({ value, onChange, placeholder }) {
  return (
    <label className="nara-card flex items-center gap-3 px-4 py-3 sm:px-5">
      <span className="inline-block h-2.5 w-2.5 shrink-0 rounded-full bg-nara-accent/20" />
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
