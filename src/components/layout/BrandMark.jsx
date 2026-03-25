function BrandMark({ className = '', iconClassName = '' }) {
  return (
    <div
      className={`flex h-12 w-12 items-center justify-center rounded-[18px] bg-nara-accent-soft text-nara-accent shadow-sm ${className}`}
    >
      <svg
        viewBox="0 0 32 32"
        className={`h-7 w-7 ${iconClassName}`}
        fill="none"
        aria-hidden="true"
      >
        <path
          d="M16 5 7 14.2c-3.2 3.3-3.2 8.7 0 12 3.3 3.2 8.7 3.2 12 0l6.7-6.8c2.2-2.3 2.2-6 0-8.2-2.2-2.2-5.9-2.2-8.1 0l-7 7.1"
          stroke="currentColor"
          strokeWidth="2.7"
          strokeLinecap="round"
          strokeLinejoin="round"
        />
      </svg>
    </div>
  )
}

export default BrandMark
