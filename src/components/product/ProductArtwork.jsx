const imageSrcMap = {
  netflix: '/netflix.png',
  spotify: '/spotify.png',
  canva: '/canva.png',
  youtube: '/youtube.png',
}

function ProductArtwork({ image, imageUrl = '', name, variant = 'card' }) {
  const imageSrc = imageUrl || imageSrcMap[image]
  const mediaClass =
    variant === 'hero'
      ? 'h-[146px] w-[146px] p-1 sm:h-[154px] sm:w-[154px]'
      : variant === 'variant-card'
        ? 'h-[92px] w-[92px] p-1'
        : 'h-[118px] w-[118px] p-1'

  if (imageSrc) {
    return (
      <div className="flex h-full w-full items-center justify-center bg-white">
        <img
          src={imageSrc}
          alt={name}
          className={`${mediaClass} object-contain`}
          loading="lazy"
          referrerPolicy="no-referrer"
        />
      </div>
    )
  }

  return (
    <div className="flex h-full w-full items-center justify-center bg-white">
      <div className="text-center text-[#2a49c7]">
        <span className="block text-[40px] font-bold leading-none tracking-[-0.04em]">
          {name
            .split(' ')
            .slice(0, 2)
            .map((part) => part[0])
            .join('')
            .toUpperCase()}
        </span>
        <span className="mt-2 block text-[13px] font-semibold leading-none">
          {name.replace('+', '').split(' ')[0]}
        </span>
      </div>
    </div>
  )
}

export default ProductArtwork
