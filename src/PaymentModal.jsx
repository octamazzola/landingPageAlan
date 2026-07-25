import React, { useState } from "react";

// ── Íconos SVG inline ────────────────────────────────────────────────────────
function IconStripe() {
  return (
    <svg width="52" height="22" viewBox="0 0 52 22" fill="none" xmlns="http://www.w3.org/2000/svg" aria-label="Stripe">
      <path d="M4.76 8.97C4.76 7.96 5.6 7.56 7.01 7.56c1.77 0 4.01.53 5.78 1.47V4.55C11.15 3.85 9.43 3.6 7.7 3.6 3.43 3.6.8 5.79.8 9.13c0 5.3 7.3 4.45 7.3 6.74 0 1.19-.96 1.56-2.44 1.56-2.11 0-4.8-.87-6.93-2.03v4.53c2.36 1.02 4.74 1.45 6.93 1.45 4.38 0 7.39-2.16 7.39-5.55 0-5.72-7.29-4.7-7.29-6.86zM20.47 1.1l-5.04 1.06-.02 16.42 5.04-1.05V1.1zm6.48 5.12h-5.04v12.36h5.04V6.22zm-2.5-3.93c-1.61 0-2.92 1.3-2.92 2.92 0 1.61 1.3 2.91 2.92 2.91s2.92-1.3 2.92-2.91c0-1.62-1.3-2.92-2.92-2.92zm15.83 6.69l-.31-1.76h-4.34v12.36h5.04v-8.3c1.2-1.56 3.22-1.27 3.85-1.05V6.22c-.66-.24-3.07-.68-4.24 1.76zm7.36-4.24l-5.04 1.06v14.68h5.04V5.84zm-2.52-3.2c-1.61 0-2.92 1.3-2.92 2.92 0 1.61 1.31 2.91 2.92 2.91 1.62 0 2.93-1.3 2.93-2.91 0-1.62-1.31-2.92-2.93-2.92z" fill="currentColor"/>
    </svg>
  );
}

function IconMP() {
  return (
    <svg width="28" height="28" viewBox="0 0 50 50" fill="none" xmlns="http://www.w3.org/2000/svg" aria-label="Mercado Pago">
      <circle cx="25" cy="25" r="25" fill="#00BCFF"/>
      <path d="M10 25c0-8.28 6.72-15 15-15s15 6.72 15 15" stroke="white" strokeWidth="4" strokeLinecap="round"/>
      <circle cx="25" cy="25" r="5" fill="white"/>
    </svg>
  );
}

const BODY_FONT = '"IBM Plex Sans", Calibri, Arial, sans-serif';
const MONO_FONT = '"IBM Plex Mono", "SFMono-Regular", Consolas, monospace';
const DISPLAY_FONT = '"Archivo Expanded", "Archivo", Arial, sans-serif';

// ── Textos por idioma ────────────────────────────────────────────────────────
const COPY = {
  es: {
    title: "Elegí cómo pagar",
    subtitle: "Seleccioná el método de pago que más te convenga.",
    stripeLabel: "Tarjeta internacional · USD",
    stripeDesc: "Visa, Mastercard, Amex. Procesado por Lemon Squeezy.",
    mpLabel: "Mercado Pago · ARS",
    mpDesc: "Tarjeta, transferencia o efectivo. Procesado por Mercado Pago.",
    ctaStripe: "Pagar con Lemon Squeezy",
    ctaMP: "Pagar con Mercado Pago",
    close: "Cancelar",
    secureNote: "Pago 100% seguro · No almacenamos datos de tu tarjeta",
    includes: "Incluye:",
    appNote: "Recibirás el enlace de acceso a la app por email al completar el pago.",
    filesNote: "Recibirás los archivos PDF por email al completar el pago.",
  },
  en: {
    title: "Choose how to pay",
    subtitle: "Select the payment method that suits you best.",
    stripeLabel: "International card · USD",
    stripeDesc: "Visa, Mastercard, Amex. Processed by Lemon Squeezy.",
    mpLabel: "Mercado Pago · ARS",
    mpDesc: "Card, transfer or cash. Processed by Mercado Pago.",
    ctaStripe: "Pay with Lemon Squeezy",
    ctaMP: "Pay with Mercado Pago",
    close: "Cancel",
    secureNote: "100% secure payment · We don't store your card data",
    includes: "Includes:",
    appNote: "You will receive the app access link by email upon completing payment.",
    filesNote: "You will receive the PDF files by email upon completing payment.",
  },
  pt: {
    title: "Escolha como pagar",
    subtitle: "Selecione o método de pagamento que mais lhe convém.",
    stripeLabel: "Cartão internacional · USD",
    stripeDesc: "Visa, Mastercard, Amex. Processado pelo Lemon Squeezy.",
    mpLabel: "Mercado Pago · ARS",
    mpDesc: "Cartão, transferência ou dinheiro. Processado pelo Mercado Pago.",
    ctaStripe: "Pagar com Lemon Squeezy",
    ctaMP: "Pagar com Mercado Pago",
    close: "Cancelar",
    secureNote: "Pagamento 100% seguro · Não armazenamos dados do cartão",
    includes: "Inclui:",
    appNote: "Você receberá o link de acesso à app por e-mail ao concluir o pagamento.",
    filesNote: "Você receberá os arquivos PDF por e-mail ao concluir o pagamento.",
  },
};

// ── Links de pago (reemplazá con los reales de Stripe y MP) ─────────────────
// IMPORTANTE: Reemplazá estas URLs con las de tus productos reales.
// Stripe → stripe.com/dashboard → Payment Links
// Mercado Pago → mercadopago.com.ar → Cobrar → Link de pago
export const PAYMENT_LINKS = {
  starter: {
    lemonsqueezy: "https://visualpromptstudio.lemonsqueezy.com/checkout/buy/1e94d1e6-eac9-4f2c-be16-42a5c0c92cc7",
    mercadopago: "https://mpago.la/237ZSfP",
  },
  professional: {
    lemonsqueezy: "https://visualpromptstudio.lemonsqueezy.com/checkout/buy/b121937b-9f08-441c-b61e-7b98adda7fec",
    mercadopago: "https://mpago.la/32YnMte",
  },
  studio_pro: {
    lemonsqueezy: "https://visualpromptstudio.lemonsqueezy.com/checkout/buy/d1aed8c0-7546-4fa5-82c3-a4b6935376bc",
    mercadopago: "https://mpago.la/2FsD9XH",
  },
};

// ── Componente principal ─────────────────────────────────────────────────────
export default function PaymentModal({ pack, lang = "es", onClose }) {
  const [hoveredMethod, setHoveredMethod] = useState(null);
  const t = COPY[lang] || COPY.es;
  const links = PAYMENT_LINKS[pack?.slug] || {};
  const isAppPlan = pack?.slug === "studio_pro";

  if (!pack) return null;

  function handleStripe() {
    if (links.lemonsqueezy && !links.lemonsqueezy.includes("PENDIENTE")) {
      window.open(links.lemonsqueezy, "_blank", "noopener");
    } else {
      alert("El link de Lemon Squeezy todavía no está configurado.");
    }
  }

  function handleMP() {
    if (links.mercadopago && !links.mercadopago.includes("PENDIENTE")) {
      window.open(links.mercadopago, "_blank", "noopener");
    } else {
      alert("El link de Mercado Pago todavía no está configurado. Contactá al administrador.");
    }
  }

  const price = pack.currentUsd;
  const priceArs = pack.currentArs;

  return (
    <div
      style={{
        position: "fixed", inset: 0, zIndex: 9999,
        background: "rgba(0,0,0,0.72)", backdropFilter: "blur(6px)",
        display: "flex", alignItems: "center", justifyContent: "center",
        padding: "16px",
      }}
      onClick={onClose}
    >
      <style>{`
        @keyframes pmSlideUp { from { opacity:0; transform:translateY(24px) } to { opacity:1; transform:translateY(0) } }
        .pm-card { animation: pmSlideUp .35s cubic-bezier(.2,.8,.2,1) both; }
        .pm-method:hover { border-color: rgba(255,152,0,0.7) !important; background: rgba(255,152,0,0.06) !important; }
        .pm-btn-stripe:hover { background: #635bff !important; color: white !important; transform: translateY(-2px); box-shadow: 0 12px 28px rgba(99,91,255,0.32) !important; }
        .pm-btn-mp:hover { background: #00bcff !important; color: white !important; transform: translateY(-2px); box-shadow: 0 12px 28px rgba(0,188,255,0.32) !important; }
      `}</style>

      <div
        className="pm-card"
        onClick={e => e.stopPropagation()}
        style={{
          background: "linear-gradient(180deg,#17191f 0%,#0f1115 100%)",
          border: "1px solid rgba(255,255,255,0.12)",
          borderRadius: "20px",
          padding: "32px",
          maxWidth: "480px",
          width: "100%",
          boxShadow: "0 32px 80px rgba(0,0,0,0.6)",
          position: "relative",
        }}
      >
        {/* Header */}
        <div style={{ marginBottom: "20px" }}>
          <div style={{ fontFamily: MONO_FONT, fontSize: "10px", letterSpacing: "0.16em", color: "#ff9800", marginBottom: "6px", textTransform: "uppercase" }}>
            {pack.eyebrow}
          </div>
          <div style={{ fontFamily: DISPLAY_FONT, fontSize: "22px", color: "#fff", fontWeight: 700, marginBottom: "4px" }}>
            {pack.name}
          </div>
          <div style={{ display: "flex", alignItems: "baseline", gap: "10px" }}>
            <span style={{ fontFamily: DISPLAY_FONT, fontSize: "36px", color: "#fff", fontWeight: 900, letterSpacing: "-0.04em" }}>{price}</span>
            <span style={{ fontFamily: MONO_FONT, fontSize: "11px", color: "#9ca2ad", textDecoration: "line-through" }}>{pack.oldUsd}</span>
            <span style={{ fontFamily: MONO_FONT, fontSize: "11px", color: "#8a8f99" }}>· {priceArs} ARS</span>
          </div>
        </div>

        {/* Incluye */}
        <div style={{ background: "rgba(255,255,255,0.04)", border: "1px solid rgba(255,255,255,0.08)", borderRadius: "12px", padding: "14px", marginBottom: "20px" }}>
          <div style={{ fontFamily: MONO_FONT, fontSize: "9px", letterSpacing: "0.14em", color: "#ff9800", marginBottom: "10px", textTransform: "uppercase" }}>{t.includes}</div>
          {pack.features.map(f => (
            <div key={f} style={{ display: "flex", gap: "8px", alignItems: "flex-start", fontSize: "12.5px", color: "#d7dbe2", marginBottom: "6px", lineHeight: 1.4 }}>
              <span style={{ color: "#ff9800", fontWeight: 900, flexShrink: 0 }}>✓</span>
              <span>{f}</span>
            </div>
          ))}
        </div>

        {/* Nota entrega */}
        <div style={{ fontFamily: MONO_FONT, fontSize: "10.5px", color: "#8a8f99", marginBottom: "20px", background: "rgba(255,152,0,0.06)", border: "1px solid rgba(255,152,0,0.16)", borderRadius: "10px", padding: "10px 12px" }}>
          📧 {isAppPlan ? t.appNote : t.filesNote}
        </div>

        {/* Métodos de pago */}
        <div style={{ display: "flex", flexDirection: "column", gap: "10px", marginBottom: "20px" }}>
          {/* Stripe */}
          <button
            className="pm-btn-stripe"
            onClick={handleStripe}
            style={{
              display: "flex", alignItems: "center", justifyContent: "space-between",
              background: "rgba(99,91,255,0.10)", border: "1.5px solid rgba(99,91,255,0.35)",
              borderRadius: "14px", padding: "16px 18px", cursor: "pointer",
              fontFamily: BODY_FONT, transition: "all .22s ease", color: "#c5c1ff",
            }}
          >
            <div style={{ display: "flex", flexDirection: "column", alignItems: "flex-start", gap: "2px" }}>
              <span style={{ fontWeight: 800, fontSize: "13.5px" }}>{t.ctaStripe}</span>
              <span style={{ fontSize: "11px", opacity: 0.75 }}>USD · Visa, Mastercard, Amex</span>
            </div>
            <svg width="28" height="28" viewBox="0 0 50 50" fill="none" xmlns="http://www.w3.org/2000/svg">
              <circle cx="25" cy="25" r="25" fill="#FFC233"/>
              <path d="M14 26c0-6.075 4.925-11 11-11s11 4.925 11 11" stroke="#222" strokeWidth="3.5" strokeLinecap="round"/>
              <circle cx="25" cy="26" r="4" fill="#222"/>
            </svg>
          </button>

          {/* Mercado Pago */}
          <button
            className="pm-btn-mp"
            onClick={handleMP}
            style={{
              display: "flex", alignItems: "center", justifyContent: "space-between",
              background: "rgba(0,188,255,0.08)", border: "1.5px solid rgba(0,188,255,0.28)",
              borderRadius: "14px", padding: "16px 18px", cursor: "pointer",
              fontFamily: BODY_FONT, transition: "all .22s ease", color: "#7ce8ff",
            }}
          >
            <div style={{ display: "flex", flexDirection: "column", alignItems: "flex-start", gap: "2px" }}>
              <span style={{ fontWeight: 800, fontSize: "13.5px" }}>{t.ctaMP}</span>
              <span style={{ fontSize: "11px", opacity: 0.75 }}>{t.mpDesc}</span>
            </div>
            <IconMP />
          </button>
        </div>

        {/* Footer */}
        <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center" }}>
          <span style={{ fontFamily: MONO_FONT, fontSize: "9.5px", color: "#5a5f6a", letterSpacing: "0.06em" }}>🔒 {t.secureNote}</span>
          <button
            onClick={onClose}
            style={{ background: "transparent", border: "none", color: "#5a5f6a", cursor: "pointer", fontFamily: BODY_FONT, fontSize: "12px", padding: "4px 8px", borderRadius: "6px" }}
          >
            {t.close}
          </button>
        </div>
      </div>
    </div>
  );
}
