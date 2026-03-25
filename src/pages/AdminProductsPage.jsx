import { useCallback, useEffect, useMemo, useState } from "react";
import { useAdminToast } from "../context/useAdminToast";
import { clearAdminSession } from "../utils/adminAuth";
import {
  getAdminProducts,
  syncAdminCatalog,
  updateAdminMargin,
} from "../utils/adminApi";
import { formatRupiah } from "../utils/formatPrice";

function AdminProductsPage() {
  const toast = useAdminToast();
  const [products, setProducts] = useState([]);
  const [search, setSearch] = useState("");
  const [error, setError] = useState("");
  const [isLoading, setIsLoading] = useState(true);
  const [isSyncing, setIsSyncing] = useState(false);
  const [savingId, setSavingId] = useState("");
  const [draftMargins, setDraftMargins] = useState({});

  const loadProducts = useCallback(async () => {
    setIsLoading(true);
    setError("");

    try {
      const data = await getAdminProducts();
      setProducts(Array.isArray(data) ? data : []);
      setDraftMargins(
        Object.fromEntries(
          (Array.isArray(data) ? data : []).map((product) => [
            product.id,
            String(product.marginAmount ?? 0),
          ]),
        ),
      );
    } catch (loadError) {
      if (loadError.status === 401) {
        clearAdminSession();
        window.location.replace("/admin/login");
        return;
      }
      setError(loadError.message || "Gagal memuat katalog admin.");
      toast.error(
        "Gagal memuat katalog",
        loadError.message || "Coba muat ulang halaman admin.",
      );
    } finally {
      setIsLoading(false);
    }
  }, [toast]);

  useEffect(() => {
    loadProducts();
  }, [loadProducts]);

  const filteredProducts = useMemo(() => {
    const query = search.trim().toLowerCase();
    if (!query) return products;

    return products.filter((product) => {
      return (
        product.name.toLowerCase().includes(query) ||
        String(product.providerProductId).includes(query)
      );
    });
  }, [products, search]);

  async function handleSyncCatalog() {
    setIsSyncing(true);
    setError("");

    try {
      const data = await syncAdminCatalog();
      setProducts(Array.isArray(data) ? data : []);
      setDraftMargins(
        Object.fromEntries(
          (Array.isArray(data) ? data : []).map((product) => [
            product.id,
            String(product.marginAmount ?? 0),
          ]),
        ),
      );
      toast.success(
        "Katalog berhasil disinkronkan",
        `${Array.isArray(data) ? data.length : 0} produk provider sudah diperbarui.`,
      );
    } catch (syncError) {
      if (syncError.status === 401) {
        clearAdminSession();
        window.location.replace("/admin/login");
        return;
      }
      setError(syncError.message || "Gagal sinkron katalog dari Premku.");
      toast.error(
        "Sinkron katalog gagal",
        syncError.message ||
          "Backend tidak berhasil menarik data terbaru dari Premku.",
      );
    } finally {
      setIsSyncing(false);
    }
  }

  async function handleSaveMargin(product) {
    const rawValue = draftMargins[product.id] ?? "0";
    const marginAmount = Math.max(0, Number(rawValue || 0));
    setSavingId(product.id);
    setError("");

    try {
      const updatedProduct = await updateAdminMargin(product.id, marginAmount);
      setProducts((current) =>
        current.map((item) =>
          item.id === product.id
            ? {
                ...item,
                ...updatedProduct,
              }
            : item,
        ),
      );
      setDraftMargins((current) => ({
        ...current,
        [product.id]: String(updatedProduct.marginAmount ?? 0),
      }));
      toast.success(
        "Margin berhasil diperbarui",
        `Harga jual ${updatedProduct.name} sudah memakai margin terbaru.`,
      );
    } catch (saveError) {
      if (saveError.status === 401) {
        clearAdminSession();
        window.location.replace("/admin/login");
        return;
      }
      setError(saveError.message || "Gagal menyimpan margin produk.");
      toast.error(
        "Simpan margin gagal",
        saveError.message || "Perubahan margin belum tersimpan ke backend.",
      );
    } finally {
      setSavingId("");
    }
  }

  return (
    <div className="space-y-6">
      <section className="rounded-[30px] border border-[#e7e9f1] bg-white px-5 py-5 shadow-[0_18px_40px_rgba(24,32,56,0.06)] md:px-6">
        <div className="flex flex-wrap items-start justify-between gap-4">
          <div className="max-w-[70ch]">
            <p className="text-[11px] font-bold uppercase tracking-[0.16em] text-nara-muted">
              Pricing Control
            </p>
            <h1 className="mt-1 text-[28px] font-extrabold tracking-[-0.03em] text-nara-ink">
              Kelola harga jual dari katalog provider
            </h1>
            <p className="mt-3 text-[15px] leading-7 text-nara-muted">
              Harga dasar datang dari API Premku. Admin tinggal menambahkan
              margin nominal rupiah agar backend menghitung harga jual final
              yang dibayar user.
            </p>
          </div>

          <button
            type="button"
            onClick={handleSyncCatalog}
            disabled={isSyncing}
            className="inline-flex items-center justify-center rounded-[20px] bg-nara-navy px-5 py-3 text-sm font-bold text-white shadow-[0_18px_40px_rgba(28,37,59,0.2)] transition hover:opacity-95 disabled:cursor-not-allowed disabled:opacity-70"
          >
            {isSyncing ? "Sinkron..." : "Sync dari Premku"}
          </button>
        </div>

        <div className="mt-5">
          <input
            type="text"
            value={search}
            onChange={(event) => setSearch(event.target.value)}
            placeholder="Cari nama produk atau ID provider..."
            className="w-full rounded-[20px] border border-[#e5e7ef] bg-[#fbfbfe] px-4 py-3 text-[15px] text-nara-ink outline-none transition placeholder:text-nara-muted focus:border-nara-accent/45"
          />
        </div>

        {error ? (
          <div className="mt-4 rounded-[18px] border border-nara-red/20 bg-nara-red-soft px-4 py-3 text-sm font-medium text-nara-red">
            {error}
          </div>
        ) : null}
      </section>

      {isLoading ? (
        <div className="rounded-[30px] border border-[#e7e9f1] bg-white px-6 py-8 text-sm text-nara-muted shadow-[0_18px_40px_rgba(24,32,56,0.06)]">
          Memuat katalog server...
        </div>
      ) : (
        <div className="space-y-5">
          {filteredProducts.length ? (
            filteredProducts.map((product) => (
              <section
                key={product.id}
                className="rounded-[30px] border border-[#e7e9f1] bg-white px-5 py-5 shadow-[0_18px_40px_rgba(24,32,56,0.06)] md:px-6"
              >
                <div className="flex flex-wrap items-center justify-between gap-4">
                  <div>
                    <h2 className="text-[24px] font-extrabold tracking-[-0.03em] text-nara-ink">
                      {product.name}
                    </h2>
                    <p className="mt-2 max-w-[72ch] text-sm leading-6 text-nara-muted">
                      {product.description ||
                        "Deskripsi produk belum tersedia dari provider."}
                    </p>
                  </div>
                  <div className="text-right text-sm text-nara-muted">
                    <p>ID provider {product.providerProductId}</p>
                    <p className="mt-1">Stok {product.stock ?? 0}</p>
                  </div>
                </div>

                <div className="mt-5 grid gap-3 md:grid-cols-[1fr_1fr_1.2fr_auto]">
                  <div className="rounded-[20px] border border-[#e9ebf3] bg-white px-4 py-3">
                    <p className="text-[12px] font-semibold uppercase tracking-[0.08em] text-nara-muted">
                      Harga Dasar
                    </p>
                    <p className="mt-2 text-[20px] font-extrabold tracking-[-0.03em] text-nara-ink">
                      {formatRupiah(product.basePrice || 0)}
                    </p>
                  </div>

                  <label className="rounded-[20px] border border-[#e9ebf3] bg-white px-4 py-3">
                    <span className="text-[12px] font-semibold uppercase tracking-[0.08em] text-nara-muted">
                      Margin Admin
                    </span>
                    <div className="mt-2 flex items-center gap-2">
                      <span className="text-sm font-bold text-nara-muted">
                        Rp
                      </span>
                      <input
                        type="number"
                        min="0"
                        step="1000"
                        value={draftMargins[product.id] ?? "0"}
                        onChange={(event) =>
                          setDraftMargins((current) => ({
                            ...current,
                            [product.id]: event.target.value,
                          }))
                        }
                        className="w-full rounded-[14px] border border-[#e3e6ee] bg-[#fbfbfe] px-3 py-2 text-[15px] font-bold text-nara-ink outline-none transition focus:border-nara-accent/45"
                      />
                    </div>
                  </label>

                  <div className="rounded-[20px] border border-[#e9ebf3] bg-white px-4 py-3">
                    <p className="text-[12px] font-semibold uppercase tracking-[0.08em] text-nara-muted">
                      Harga Jual
                    </p>
                    <p className="mt-2 text-[20px] font-extrabold tracking-[-0.03em] text-nara-accent">
                      {formatRupiah(
                        (product.basePrice || 0) +
                          Math.max(
                            0,
                            Number(
                              draftMargins[product.id] ??
                                product.marginAmount ??
                                0,
                            ),
                          ),
                      )}
                    </p>
                  </div>

                  <button
                    type="button"
                    onClick={() => handleSaveMargin(product)}
                    disabled={savingId === product.id}
                    className="inline-flex items-center justify-center rounded-[20px] bg-[#fff4ee] px-5 py-3 text-sm font-bold text-nara-accent transition hover:bg-[#ffe7db] disabled:cursor-not-allowed disabled:opacity-70"
                  >
                    {savingId === product.id ? "Menyimpan..." : "Simpan Margin"}
                  </button>
                </div>
              </section>
            ))
          ) : (
            <div className="rounded-[30px] border border-dashed border-[#d9deea] bg-white px-6 py-10 text-center text-nara-muted shadow-[0_18px_40px_rgba(24,32,56,0.04)]">
              Belum ada produk di backend. Klik `Sync dari Premku` untuk menarik
              katalog.
            </div>
          )}
        </div>
      )}
    </div>
  );
}

export default AdminProductsPage;
