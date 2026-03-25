import StatusBadge from '../common/StatusBadge'
import PrimaryButton from '../common/PrimaryButton'
import ProductArtwork from './ProductArtwork'
import { formatPrice } from '../../utils/formatPrice'
import { getVariantSellPrice } from '../../utils/pricing'

const toneMap = {
  netflix: 'bg-[#fff0f1] text-[#d51f35]',
  spotify: 'bg-[#ebfff3] text-[#1f9d55]',
  canva: 'bg-[#f3efff] text-[#6f55ff]',
  youtube: 'bg-[#fff1ef] text-[#e44733]',
  'alight-motion': 'bg-[#ecfbf6] text-[#0e9f7f]',
  capcut: 'bg-[#eef2ff] text-[#3451d1]',
  viu: 'bg-[#fff7df] text-[#d88b00]',
  ai: 'bg-[#eef4ff] text-[#3451d1]',
  streaming: 'bg-[#eef4ff] text-[#3451d1]',
  'prime-video': 'bg-[#eef4ff] text-[#3451d1]',
  vidio: 'bg-[#fff0f6] text-[#f04283]',
  wink: 'bg-[#f1f1f1] text-[#181818]',
  nitro: 'bg-[#ecebff] text-[#6b5cff]',
  scribd: 'bg-[#fff1ef] text-[#e44733]',
  zoom: 'bg-[#eef4ff] text-[#3451d1]',
}

function formatVariantPrice(value) {
  const formattedPrice = formatPrice(value)
  return formattedPrice === 'Hubungi admin' ? formattedPrice : `Rp. ${formattedPrice}`
}

function resolveToneClasses(productImage, soldOut) {
  if (soldOut) {
    return 'bg-[#e3e3e3] text-[#a1a1a1]'
  }

  return toneMap[productImage] ?? 'bg-[#eef2ff] text-[#3451d1]'
}

function VariantCard({ variant, product, onChoose }) {
  const soldOut = variant.stock <= 0
  const sellPrice = getVariantSellPrice(variant)
  const toneClasses = resolveToneClasses(product.image, soldOut)

  return (
    <div
      className={`flex min-h-[266px] w-full flex-col rounded-[24px] border px-4 py-4 text-center shadow-[var(--shadow-nara-card)] transition duration-200 sm:px-5 ${
        soldOut
          ? 'border-[#e4e4e4] bg-[#f3f3f3] text-[#9f9f9f]'
          : 'border-nara-line bg-white hover:-translate-y-[1px] hover:border-nara-accent/70 hover:shadow-[0_20px_50px_rgba(255,111,76,0.12)] focus-within:border-nara-accent/70 focus-within:shadow-[0_20px_50px_rgba(255,111,76,0.12)]'
      }`}
    >
      <div className="relative flex h-[120px] items-start justify-center">
        <div className="absolute inset-x-0 top-0 z-10 flex items-center justify-between gap-2">
          <span className={`inline-flex rounded-full px-2 py-1 text-[9px] font-bold uppercase leading-none shadow-sm ${toneClasses}`}>
            {soldOut ? 'Habis' : `Ada ${variant.stock}`}
          </span>
          <span className={`inline-flex rounded-full px-2 py-1 text-[9px] font-bold uppercase leading-none shadow-sm ${soldOut ? 'bg-[#efefef] text-[#a6a6a6]' : toneClasses}`}>
            {soldOut ? 'Stock 0' : 'Ready'}
          </span>
        </div>

        <div
          className={`mt-4 flex h-[104px] items-center justify-center ${
            soldOut ? 'opacity-45 grayscale' : ''
          }`}
        >
          <ProductArtwork
            image={product.image}
            imageUrl={product.imageUrl}
            name={product.name}
            variant="variant-card"
          />
        </div>
      </div>

      <div className="mt-3 flex flex-1 flex-col items-center">
        <StatusBadge
          productTone={soldOut ? undefined : product.image}
          className={`px-2.5 py-1 text-[9px] uppercase tracking-[0.08em] ${
            soldOut ? 'bg-[#ebebeb] text-[#a1a1a1]' : ''
          }`}
        >
          {product.category}
        </StatusBadge>
        <p
          className={`mt-3 min-h-[40px] text-[14px] font-semibold leading-[1.35] ${
            soldOut ? 'text-[#8f8f8f]' : 'text-nara-ink'
          }`}
        >
          {`${product.name} ${variant.label}`}
        </p>
        <p
          className={`mt-3.5 text-[20px] font-bold leading-none sm:text-[21px] ${
            soldOut ? 'text-[#979797]' : 'text-[#6f55ff]'
          }`}
        >
          {formatVariantPrice(sellPrice)}
        </p>

        <PrimaryButton
          className="mt-4 w-full rounded-[16px] py-2.5 text-[12px] font-semibold"
          disabled={soldOut}
          onClick={() => {
            if (soldOut) return
            onChoose()
          }}
        >
          Pilih Paket
        </PrimaryButton>
      </div>
    </div>
  )
}

export default VariantCard
