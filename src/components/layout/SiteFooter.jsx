import { useNavigate } from "react-router-dom";

const socialLinks = [
  {
    label: "Instagram",
    href: "https://www.instagram.com/herama.topup/",
    icon: "instagram",
  },
  {
    label: "WhatsApp",
    href: "https://api.whatsapp.com/send/?phone=6285750231336&text=Halo%20Admin%20Nara%20Premium&source=&data=&source=text&type=phone_number&app_absent=0",
    icon: "whatsapp",
  },
];

const serviceLinks = [
  { label: "Pricelist" },
  { label: "Klaim Garansi", to: "/klaim-garansi" },
  { label: "Syarat & Ketentuan", to: "/syarat-ketentuan" },
  { label: "Cara Order", to: "/cara-order" },
];

const contactItems = [
  {
    label: "Kalimantan Selatan, Kota Banjarbaru",
    icon: "location",
  },
  {
    label: "heraammaa@gmail.com",
    icon: "mail",
  },
  {
    label: "0857-5023-1336",
    icon: "phone",
  },
];

function BrandMark() {
  return (
    <div className="flex h-12 w-12 items-center justify-center rounded-[18px] bg-nara-accent-soft text-nara-accent shadow-sm">
      <svg
        viewBox="0 0 32 32"
        className="h-7 w-7"
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
  );
}

function SocialIcon({ type }) {
  if (type === "whatsapp") {
    return (
      <svg
        viewBox="0 0 24 24"
        className="h-5 w-5"
        fill="none"
        aria-hidden="true"
      >
        <path
          d="M12 4a8 8 0 0 0-6.9 12l-1 4 4-1A8 8 0 1 0 12 4Z"
          stroke="currentColor"
          strokeWidth="1.8"
          strokeLinecap="round"
          strokeLinejoin="round"
        />
        <path
          d="M9.3 9.4c.2-.5.4-.5.6-.5h.5c.2 0 .4 0 .6.6.2.5.6 1.5.6 1.7 0 .2.1.4 0 .5l-.4.5c-.1.2-.2.3-.1.5.2.4.6 1 1.1 1.4.6.6 1.2 1 1.8 1.2.2.1.4 0 .5-.1l.6-.7c.1-.2.3-.2.5-.1l1.6.7c.2.1.4.2.4.4 0 .3-.1 1.3-.8 1.8-.5.4-1.1.4-1.4.3-.4-.1-1.8-.7-3.3-2.1-1.8-1.7-2.4-3.4-2.6-3.8-.2-.4-.2-1 .1-1.4.4-.4.8-.9 1-.8Z"
          fill="currentColor"
        />
      </svg>
    );
  }

  return (
    <svg viewBox="0 0 24 24" className="h-5 w-5" fill="none" aria-hidden="true">
      <rect
        x="4.2"
        y="4.2"
        width="15.6"
        height="15.6"
        rx="4.4"
        stroke="currentColor"
        strokeWidth="1.8"
      />
      <circle cx="12" cy="12" r="3.7" stroke="currentColor" strokeWidth="1.8" />
      <circle cx="17.3" cy="6.7" r="1.1" fill="currentColor" />
    </svg>
  );
}

function ContactIcon({ type }) {
  if (type === "mail") {
    return (
      <svg
        viewBox="0 0 24 24"
        className="h-5 w-5"
        fill="none"
        aria-hidden="true"
      >
        <path
          d="M4 7.5A1.5 1.5 0 0 1 5.5 6h13A1.5 1.5 0 0 1 20 7.5v9a1.5 1.5 0 0 1-1.5 1.5h-13A1.5 1.5 0 0 1 4 16.5v-9Z"
          stroke="currentColor"
          strokeWidth="1.8"
        />
        <path
          d="m5 8 7 5 7-5"
          stroke="currentColor"
          strokeWidth="1.8"
          strokeLinecap="round"
          strokeLinejoin="round"
        />
      </svg>
    );
  }

  if (type === "phone") {
    return (
      <svg
        viewBox="0 0 24 24"
        className="h-5 w-5"
        fill="none"
        aria-hidden="true"
      >
        <path
          d="M7 5.5c0-.8.7-1.5 1.5-1.5h1.3c.7 0 1.3.5 1.5 1.2l.8 3.1c.1.5 0 1-.4 1.4l-1.3 1.3a14 14 0 0 0 5.2 5.2l1.3-1.3c.4-.4 1-.5 1.4-.4l3.1.8c.7.2 1.2.8 1.2 1.5v1.3c0 .8-.7 1.5-1.5 1.5H21c-8.8 0-16-7.2-16-16V5.5H7Z"
          stroke="currentColor"
          strokeWidth="1.8"
          strokeLinecap="round"
          strokeLinejoin="round"
        />
      </svg>
    );
  }

  return (
    <svg viewBox="0 0 24 24" className="h-5 w-5" fill="none" aria-hidden="true">
      <path
        d="M12 20c4-4.3 6-7.4 6-10a6 6 0 1 0-12 0c0 2.6 2 5.7 6 10Z"
        stroke="currentColor"
        strokeWidth="1.8"
        strokeLinecap="round"
        strokeLinejoin="round"
      />
      <circle cx="12" cy="10" r="2.2" fill="currentColor" />
    </svg>
  );
}

function ArrowUpIcon() {
  return (
    <svg viewBox="0 0 24 24" className="h-5 w-5" fill="none" aria-hidden="true">
      <path
        d="M12 18V6m0 0-5 5m5-5 5 5"
        stroke="currentColor"
        strokeWidth="2"
        strokeLinecap="round"
        strokeLinejoin="round"
      />
    </svg>
  );
}

function SiteFooter() {
  const navigate = useNavigate();

  function handleScrollTop() {
    window.scrollTo({ top: 0, behavior: "smooth" });
  }

  return (
    <footer className="mt-10 overflow-hidden rounded-[32px] border border-nara-line/80 bg-white shadow-[var(--shadow-nara-card)]">
      <div className="nara-hero px-5 py-4 text-white sm:px-6">
        <div className="flex items-center gap-3">
          <BrandMark />
          <div>
            <p className="text-[11px] font-semibold uppercase tracking-[0.18em] text-white/80">
              Premium Store
            </p>
            <h2 className="text-[22px] font-bold leading-none">Nara Premium</h2>
          </div>
        </div>
      </div>

      <div className="bg-gradient-to-b from-[#fffdf9] to-white px-5 py-7 sm:px-6 sm:py-8">
        <section className="max-w-[470px]">
          <div className="flex items-center gap-3">
            <BrandMark />
            <h3 className="text-[28px] font-extrabold tracking-[-0.03em] text-nara-ink">
              narapremium.store
            </h3>
          </div>
          <p className="mt-5 text-[15px] leading-8 text-nara-muted">
            Platform digital andalan untuk upgrade produktivitas dan hiburan
            tanpa ribet. Nikmati pengalaman belanja akun premium yang aman,
            cepat, dan tetap nyaman dipakai di mobile.
          </p>

          <div className="mt-6 flex gap-3">
            {socialLinks.map((item) => (
              <a
                key={item.label}
                href={item.href}
                aria-label={item.label}
                target="_blank"
                className="inline-flex h-12 w-12 items-center justify-center rounded-full border border-nara-line bg-white text-nara-accent shadow-sm transition hover:border-nara-accent/50 hover:bg-nara-accent-soft"
              >
                <SocialIcon type={item.icon} />
              </a>
            ))}
          </div>
        </section>

        <div className="mt-8 border-t border-nara-line/70 pt-7">
          <section>
            <h4 className="text-[18px] font-bold text-nara-ink">Layanan</h4>
            <div className="mt-5 grid gap-4">
              {serviceLinks.map((item) => (
                <button
                  key={item.label}
                  type="button"
                  onClick={item.to ? () => navigate(item.to) : undefined}
                  className="w-fit text-left text-[16px] font-medium text-nara-muted transition hover:text-nara-accent"
                >
                  {item.label}
                </button>
              ))}
            </div>
          </section>

          <section className="mt-10">
            <h4 className="text-[18px] font-bold text-nara-ink">
              Hubungi Kami
            </h4>
            <div className="mt-5 space-y-4">
              {contactItems.map((item) => (
                <div
                  key={item.label}
                  className="flex items-start gap-3 text-nara-muted"
                >
                  <span className="mt-0.5 inline-flex h-8 w-8 shrink-0 items-center justify-center rounded-full bg-nara-accent-soft text-nara-accent">
                    <ContactIcon type={item.icon} />
                  </span>
                  <p className="min-w-0 pt-1 text-[15px] leading-7">
                    {item.label}
                  </p>
                </div>
              ))}
            </div>

            <div className="mt-8 flex justify-end">
              <button
                type="button"
                aria-label="Kembali ke atas"
                onClick={handleScrollTop}
                className="inline-flex h-14 w-14 items-center justify-center rounded-full bg-nara-accent text-white shadow-[0_14px_30px_rgba(255,98,77,0.28)] transition hover:brightness-105"
              >
                <ArrowUpIcon />
              </button>
            </div>
          </section>
        </div>
      </div>

      <div className="border-t border-nara-line/70 bg-[#fff9f4] px-5 py-4 text-center sm:px-6">
        <p className="text-[12px] font-semibold tracking-[0.08em] text-nara-muted">
          narapremium.store
        </p>
      </div>
    </footer>
  );
}

export default SiteFooter;
