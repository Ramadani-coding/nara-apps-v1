import StatusBadge from '../common/StatusBadge'
import ProductArtwork from './ProductArtwork'

function ProductHero({ product }) {
  return (
    <div className="nara-card grid justify-items-center gap-5 px-4 py-5 text-center sm:grid-cols-[168px_minmax(0,1fr)] sm:items-center sm:justify-items-stretch sm:px-5 sm:py-5 sm:text-left">
      <div className="flex h-[156px] w-full items-center justify-center bg-white sm:h-[168px]">
        <ProductArtwork
          image={product.image}
          imageUrl={product.imageUrl}
          name={product.name}
          variant="hero"
        />
      </div>
      <div className="min-w-0">
        <StatusBadge
          productTone={product.image}
          className="px-2.5 py-1 text-[10px] uppercase tracking-[0.04em]"
        >
          {product.category}
        </StatusBadge>
        <h2 className="mt-3 text-[22px] font-bold leading-[1.2] text-nara-ink">
          {product.name}
        </h2>
        <p className="mt-3 max-w-[44ch] text-sm leading-6 text-nara-muted sm:max-w-none">
          {product.description}
        </p>
      </div>
    </div>
  )
}

export default ProductHero
