import { useCallback, useEffect, useState } from "react";
import { useNavigate, useParams } from "react-router-dom";
import EmptyState from "../components/common/EmptyState";
import PhoneHero from "../components/layout/PhoneHero";
import OrderConfirmationModal from "../components/product/OrderConfirmationModal";
import ProductHero from "../components/product/ProductHero";
import VariantCard from "../components/product/VariantCard";
import { useCheckout } from "../context/useCheckout";
import { getStorefrontProductBySlug } from "../utils/storefrontApi";

function ProductDetailPage() {
  const { slug } = useParams();
  const navigate = useNavigate();
  const { setCheckout } = useCheckout();
  const [product, setProduct] = useState(null);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState("");
  const [selectedVariant, setSelectedVariant] = useState(null);

  const handleCloseModal = useCallback(() => {
    setSelectedVariant(null);
  }, []);

  useEffect(() => {
    let isMounted = true;

    async function loadProduct() {
      setIsLoading(true);
      setError("");

      try {
        const data = await getStorefrontProductBySlug(slug);
        if (!isMounted) return;
        setProduct(data);
      } catch (loadError) {
        if (!isMounted) return;
        setError(loadError.message || "Produk storefront tidak ditemukan.");
        setProduct(null);
      } finally {
        if (isMounted) {
          setIsLoading(false);
        }
      }
    }

    loadProduct();
    return () => {
      isMounted = false;
    };
  }, [slug]);

  if (isLoading) {
    return (
      <div className="px-6 py-10">
        <EmptyState
          title="Memuat produk"
          description="Sedang mengambil detail paket dari server."
        />
      </div>
    );
  }

  if (!product) {
    return (
      <div className="px-6 py-10">
        <EmptyState
          title="Produk tidak ditemukan"
          description={
            error ||
            "Slug produk tidak valid. Kembali ke Home untuk pilih produk lain."
          }
        />
      </div>
    );
  }

  return (
    <div className="space-y-6 pb-28 md:space-y-7 md:pb-10">
      <PhoneHero
        compact
        showBackButton
        title="Detail Paket"
        subtitle="Pilih durasi yang paling pas untuk kebutuhanmu."
      />

      <div className="space-y-5 px-1 sm:space-y-6">
        <ProductHero product={product} />
        <section>
          <h2 className="text-[18px] font-bold text-nara-ink text-center">
            PILIH PAKET
          </h2>
          <div className="mt-6 grid grid-cols-2 gap-4 sm:gap-5">
            {product.variants.map((variant) => (
              <VariantCard
                key={variant.id}
                variant={variant}
                product={product}
                onChoose={() => {
                  if (variant.stock <= 0) return;
                  setSelectedVariant(variant);
                }}
              />
            ))}
          </div>
        </section>

        {/* <div className="rounded-[18px] bg-nara-accent-soft px-4 py-3">
          <p className="text-sm font-medium text-[#b45c31]">
            Invoice nyata akan dibuat saat simulasi pembayaran di halaman
            checkout.
          </p>
        </div> */}
      </div>

      {selectedVariant ? (
        <OrderConfirmationModal
          product={product}
          variant={selectedVariant}
          onClose={handleCloseModal}
          onConfirm={({ quantity, paymentMethod, phoneNumber, subtotal }) => {
            setCheckout({
              product,
              variant: selectedVariant,
              quantity,
              paymentMethod,
              phoneNumber,
              subtotal,
            });
            handleCloseModal();
            navigate("/checkout");
          }}
        />
      ) : null}
    </div>
  );
}

export default ProductDetailPage;
