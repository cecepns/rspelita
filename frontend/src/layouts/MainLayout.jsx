import { useEffect, useState } from "react";
import { NavLink, Outlet } from "react-router-dom";
import { Link, Menu, MessageCircle, Phone, X } from "lucide-react";

import Logo from "../assets/logo.png";
import apiClient from "../lib/apiClient.js";
import { buildTelHref, buildWhatsAppHref } from "../utils/phone.js";

const navItems = [
  { to: "/", label: "Home" },
  { to: "/tentang-kami", label: "Tentang Kami" },
  { to: "/layanan", label: "Layanan" },
  { to: "/berita", label: "Berita" },
  { to: "/kontak-kami", label: "Kontak Kami" },
];

function MainLayout() {
  const [mobileOpen, setMobileOpen] = useState(false);
  const [contact, setContact] = useState(null);

  useEffect(() => {
    let cancelled = false;

    async function load() {
      try {
        const res = await apiClient.get("/contact");
        if (!cancelled) {
          setContact(res.data);
        }
      } catch (error) {
        console.error("Failed to load contact for header", error);
      }
    }

    load();
    return () => {
      cancelled = true;
    };
  }, []);

  const emergencyHref = buildTelHref(contact?.phone) || "tel:+620000000000";
  const whatsappHref = buildWhatsAppHref(
    contact?.whatsapp_number || contact?.phone,
  );

  return (
    <div className="flex min-h-screen flex-col bg-slate-50">
      <header className="sticky top-0 z-30 border-b border-slate-200 bg-white/70 backdrop-blur">
        <div className="mx-auto flex max-w-6xl items-center justify-between px-4 py-3 lg:px-6">
          <div className="flex items-center gap-3">
            <NavLink to="/">
              <img src={Logo} alt="RS Pelita" className="h-24 w-auto" />
            </NavLink>
          </div>

          <nav className="hidden items-center gap-6 text-sm font-medium text-slate-700 md:flex">
            {navItems.map((item) => (
              <NavLink
                key={item.to}
                to={item.to}
                className={({ isActive }) =>
                  `hover:text-pelitaGreen ${isActive ? "text-pelitaGreen" : ""}`
                }
              >
                {item.label}
              </NavLink>
            ))}
            <a
              href={emergencyHref}
              className="inline-flex items-center gap-2 rounded-full bg-pelitaGreen px-4 py-2 text-xs font-semibold text-white shadow-sm hover:bg-emerald-700"
            >
              <Phone className="h-4 w-4" />
              <span>Emergency Call</span>
            </a>
          </nav>

          <button
            type="button"
            onClick={() => setMobileOpen((open) => !open)}
            className="inline-flex items-center justify-center rounded-full border border-slate-200 p-2 text-slate-700 md:hidden"
          >
            {mobileOpen ? (
              <X className="h-5 w-5" />
            ) : (
              <Menu className="h-5 w-5" />
            )}
          </button>
        </div>

        {mobileOpen && (
          <div className="border-t border-slate-200 bg-white md:hidden">
            <nav className="mx-auto flex max-w-6xl flex-col gap-1 px-4 py-3 text-sm font-medium text-slate-700">
              {navItems.map((item) => (
                <NavLink
                  key={item.to}
                  to={item.to}
                  onClick={() => setMobileOpen(false)}
                  className={({ isActive }) =>
                    `rounded-md px-3 py-2 hover:bg-slate-50 hover:text-pelitaGreen ${
                      isActive ? "bg-slate-100 text-pelitaGreen" : ""
                    }`
                  }
                >
                  {item.label}
                </NavLink>
              ))}
            </nav>
          </div>
        )}
      </header>

      <main className="flex-1 overflow-hidden">
        <Outlet />
      </main>

      <footer className="mt-8 border-t border-slate-200 bg-white">
        <div className="mx-auto flex max-w-6xl flex-col gap-4 px-4 py-6 text-sm text-slate-500 md:flex-row md:items-center md:justify-between lg:px-6">
          <p>© {new Date().getFullYear()} RS Pelita. All rights reserved.</p>
          <p className="text-xs">
            Placeholder alamat &amp; informasi kontak. Silakan sesuaikan di
            pengaturan admin.
          </p>
        </div>
      </footer>

      {whatsappHref && (
        <a
          href={whatsappHref}
          target="_blank"
          rel="noopener noreferrer"
          className="fixed bottom-6 right-4 z-40 inline-flex items-center justify-center"
        >
          <span className="absolute inline-flex h-16 w-16 animate-ping rounded-full bg-emerald-500/40" />
          <span className="relative inline-flex h-14 w-14 items-center justify-center rounded-full bg-emerald-500 text-white shadow-lg transition hover:scale-105">
            <MessageCircle className="h-7 w-7" />
          </span>
        </a>
      )}
    </div>
  );
}

export default MainLayout;
