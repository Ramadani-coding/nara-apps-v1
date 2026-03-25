function StickyCTA({ children }) {
  return (
    <div className="sticky bottom-0 z-20 mt-8 bg-gradient-to-t from-[#fffdf9] via-[#fffdf9]/95 to-transparent px-1 pb-4 pt-5 md:static md:bg-none md:px-0 md:pb-0 md:pt-0">
      <div className="nara-card px-4 py-4 sm:px-5 md:px-6">{children}</div>
    </div>
  )
}

export default StickyCTA
