import StatusBadge from '../common/StatusBadge'
import ProductArtwork from './ProductArtwork'

function ProductCard({ product, onClick }) {
  return (
    <button
      type="button"
      className="nara-card flex min-h-[232px] w-full flex-col items-center overflow-hidden bg-white px-4 pb-4 pt-4 text-center transition hover:-translate-y-0.5"
      onClick={onClick}
    >
      <div className="flex h-[134px] w-full shrink-0 items-center justify-center bg-white">
        <ProductArtwork
          image={product.image}
          imageUrl={product.imageUrl}
          name={product.name}
          variant="card"
        />
      </div>
      <div className="flex min-h-0 flex-1 flex-col items-center px-1 pb-1 pt-3">
        <StatusBadge
          productTone={product.image}
          className="px-2.5 py-1 text-[10px] uppercase tracking-[0.04em]"
        >
          {product.category}
        </StatusBadge>
        <p className="mt-2.5 min-h-[40px] text-[15px] font-bold leading-5 text-nara-ink">
          {product.name}
        </p>
      </div>
    </button>
  )
}

export default ProductCard
