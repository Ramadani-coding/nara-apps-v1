function CategoryChips({ categories, activeCategory, onSelect }) {
  return (
    <div className="-mx-1 overflow-x-auto px-1 pb-2 [scrollbar-width:none] [&::-webkit-scrollbar]:hidden">
      <div className="flex min-w-max justify-center gap-3">
      {categories.map((category) => {
        const active = category === activeCategory
        return (
          <button
            key={category}
            type="button"
            className={`shrink-0 rounded-full border px-5 py-2.5 text-[12px] font-semibold transition ${
              active
                ? 'border-[#7754e6] bg-[#7754e6] text-white shadow-[0_12px_24px_rgba(119,84,230,0.28)]'
                : 'border-[#dde2ee] bg-white text-nara-ink hover:border-[#c9d0e1] hover:bg-[#fafbff]'
            }`}
            onClick={() => onSelect(category)}
          >
            {category}
          </button>
        )
      })}
      </div>
    </div>
  )
}

export default CategoryChips
