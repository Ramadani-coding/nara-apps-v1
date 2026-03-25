import { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import EmptyState from "../components/common/EmptyState";
import InvoiceInput from "../components/common/InvoiceInput";
import SearchInput from "../components/common/SearchInput";
import BrandMark from "../components/layout/BrandMark";
import PhoneHero from "../components/layout/PhoneHero";
import CategoryChips from "../components/product/CategoryChips";
import ProductCard from "../components/product/ProductCard";
import { CATEGORIES } from "../utils/constants";
import { normalizeInvoice } from "../utils/normalizeInvoice";
import { getStorefrontProducts } from "../utils/storefrontApi";

function HomePage() {
  const navigate = useNavigate();
  const [products, setProducts] = useState([]);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState("");
  const [search, setSearch] = useState("");
  const [invoice, setInvoice] = useState("");
  const [category, setCategory] = useState("Semua");

  useEffect(() => {
    let isMounted = true;

    async function loadProducts() {
      setIsLoading(true);
      setError("");

      try {
        const data = await getStorefrontProducts();
        if (!isMounted) return;
        setProducts(Array.isArray(data) ? data : []);
      } catch (loadError) {
        if (!isMounted) return;
        setError(
          loadError.message ||
            "Katalog premium belum bisa dimuat dari backend.",
        );
      } finally {
        if (isMounted) {
          setIsLoading(false);
        }
      }
    }

    loadProducts();
    return () => {
      isMounted = false;
    };
  }, []);

  const filteredProducts = products.filter((product) => {
    const matchesSearch = product.name
      .toLowerCase()
      .includes(search.toLowerCase());
    const matchesCategory =
      category === "Semua" || product.category === category;
    return matchesSearch && matchesCategory;
  });

  function handleInvoiceLookup() {
    if (!invoice.trim()) return;
    navigate(
      `/order-status?invoice=${encodeURIComponent(normalizeInvoice(invoice))}`,
    );
  }

  return (
    <div className="space-y-6 pb-10 md:space-y-7">
      <PhoneHero
        title=""
        subtitle=""
        hideTextBlock
      >
        <div className="space-y-4 sm:space-y-5">
          <div className="flex items-center gap-3 sm:gap-4">
            <BrandMark className="h-14 w-14 rounded-[20px] bg-white text-nara-accent shadow-[0_14px_30px_rgba(24,32,56,0.12)]" />
            <div className="min-w-0">
              <p className="text-[11px] font-semibold uppercase tracking-[0.18em] text-white/80 sm:text-[12px]">
                Premium Store
              </p>
              <h1 className="mt-1 text-[32px] font-extrabold leading-none tracking-[-0.04em] text-white sm:text-[38px]">
                Nara Premium
              </h1>
            </div>
          </div>

          <p className="max-w-[430px] text-[15px] leading-7 text-white/90 sm:text-[16px]">
            Transaksi kilat dan akses ribuan layanan favorit dalam satu tempat.
          </p>
        </div>
      </PhoneHero>

      <div className="space-y-4 px-1 sm:space-y-5">
        <InvoiceInput
          value={invoice}
          onChange={(event) => setInvoice(event.target.value)}
          onSubmit={handleInvoiceLookup}
        />
        <SearchInput
          placeholder="Cari aplikasi, musik, atau video..."
          value={search}
          onChange={(event) => setSearch(event.target.value)}
        />
        <CategoryChips
          categories={CATEGORIES}
          activeCategory={category}
          onSelect={setCategory}
        />

        <section className="pt-1">
          {isLoading ? (
            <div className="rounded-[24px] border border-[#e7e9f1] bg-white px-5 py-8 text-center text-sm text-nara-muted shadow-[0_18px_40px_rgba(24,32,56,0.04)]">
              Memuat katalog dari server...
            </div>
          ) : error ? (
            <div className="rounded-[24px] border border-nara-red/20 bg-nara-red-soft px-5 py-6 text-center text-sm font-medium text-nara-red">
              {error}
            </div>
          ) : filteredProducts.length ? (
            <div className="grid grid-cols-2 gap-4 sm:gap-5">
              {filteredProducts.map((product) => (
                <ProductCard
                  key={product.id}
                  product={product}
                  onClick={() => navigate(`/product/${product.slug}`)}
                />
              ))}
            </div>
          ) : (
            <EmptyState
              title="Belum ada hasil"
              description="Coba ganti kata kunci atau kategori agar hasilnya muncul lagi."
            />
          )}
        </section>
      </div>
    </div>
  );
}

export default HomePage;
