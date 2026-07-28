import React, { useState } from "react";

// ── Íconos SVG ───────────────────────────────────────────────────────────────
function IconLS() {
  return (
    <svg width="28" height="28" viewBox="0 0 50 50" fill="none" xmlns="http://www.w3.org/2000/svg">
      <circle cx="25" cy="25" r="25" fill="#FFC233"/>
      <path d="M14 26c0-6.075 4.925-11 11-11s11 4.925 11 11" stroke="#222" strokeWidth="3.5" strokeLinecap="round"/>
      <circle cx="25" cy="26" r="4" fill="#222"/>
    </svg>
  );
}
function IconMP() {
  return (
    <svg width="28" height="28" viewBox="0 0 50 50" fill="none" xmlns="http://www.w3.org/2000/svg">
      <circle cx="25" cy="25" r="25" fill="#00BCFF"/>
      <path d="M10 25c0-8.28 6.72-15 15-15s15 6.72 15 15" stroke="white" strokeWidth="4" strokeLinecap="round"/>
      <circle cx="25" cy="25" r="5" fill="white"/>
    </svg>
  );
}

const BODY_FONT = '"IBM Plex Sans", Calibri, Arial, sans-serif';
const MONO_FONT = '"IBM Plex Mono", "SFMono-Regular", Consolas, monospace';
const DISPLAY_FONT = '"Archivo Expanded", "Archivo", Arial, sans-serif';

// ── CÓDIGOS DE DESCUENTO ─────────────────────────────────────────────────────
// Para agregar/quitar códigos, editá este objeto.
// El descuento es un porcentaje (ej: 20 = 20% off).
const DISCOUNT_CODES = {
  "COLR3":  { pct: 20, label: "Colaboradores" },
  "PREM50": { pct: 50, label: "VIP" },
};

// ── LINKS DE PAGO ────────────────────────────────────────────────────────────
// Lemon Squeezy soporta códigos de descuento nativos via URL.
// Mercado Pago: los links del cliente ya tienen el precio actualizado.
export const PAYMENT_LINKS = {
  starter: {
    lemonsqueezy: "https://visualpromptstudio.lemonsqueezy.com/checkout/buy/1e94d1e6-eac9-4f2c-be16-42a5c0c92cc7",
    mercadopago:  "https://mpago.la/2BbmUfj",
    mercadopago_discounts: {
      "COLR3":  "https://mpago.la/29Bw7Nn",
      "PREM50": "https://mpago.la/1DZYruH",
    },
  },
  professional: {
    lemonsqueezy: "https://visualpromptstudio.lemonsqueezy.com/checkout/buy/b121937b-9f08-441c-b61e-7b98adda7fec",
    mercadopago:  "https://mpago.la/28TYKdV",
    mercadopago_discounts: {
      "COLR3":  "https://mpago.la/2etASZ8",
      "PREM50": "https://mpago.la/1hiXr4s",
    },
  },
  studio_pro: {
    lemonsqueezy: "https://visualpromptstudio.lemonsqueezy.com/checkout/buy/d1aed8c0-7546-4fa5-82c3-a4b6935376bc",
    mercadopago:  "https://mpago.la/2pAoRAo",
    mercadopago_discounts: {
      "COLR3":  "https://mpago.la/1vhW85j",
      "PREM50": "https://mpago.la/2sAivxW",
    },
  },
};

// ── Textos por idioma ────────────────────────────────────────────────────────
const COPY = {
  es: {
    title: "Elegí cómo pagar",
    ctaLS: "Pagar con Lemon Squeezy",
    ctaMP: "Pagar con Mercado Pago",
    lsDesc: "USD · Visa, Mastercard, Amex",
    mpDesc: "ARS · Tarjeta, transferencia o efectivo",
    close: "Cancelar",
    secureNote: "Pago 100% seguro · No almacenamos datos de tu tarjeta",
    includes: "Incluye:",
    appNote: "Recibirás el enlace de acceso a la app por email al completar el pago.",
    filesNote: "Recibirás los archivos PDF por email al completar el pago.",
    couponLabel: "¿Tenés un código de descuento?",
    couponPlaceholder: "Ej: LAUNCH20",
    couponApply: "Aplicar",
    couponValid: "✓ Código válido",
    couponInvalid: "Código no válido",
    discountApplied: "off aplicado",
  },
  en: {
    title: "Choose how to pay",
    ctaLS: "Pay with Lemon Squeezy",
    ctaMP: "Pay with Mercado Pago",
    lsDesc: "USD · Visa, Mastercard, Amex",
    mpDesc: "ARS · Card, transfer or cash",
    close: "Cancel",
    secureNote: "100% secure payment · We don't store your card data",
    includes: "Includes:",
    appNote: "You will receive the app access link by email upon completing payment.",
    filesNote: "You will receive the PDF files by email upon completing payment.",
    couponLabel: "Have a discount code?",
    couponPlaceholder: "E.g: LAUNCH20",
    couponApply: "Apply",
    couponValid: "✓ Valid code",
    couponInvalid: "Invalid code",
    discountApplied: "off applied",
  },
  pt: {
    title: "Escolha como pagar",
    ctaLS: "Pagar com Lemon Squeezy",
    ctaMP: "Pagar com Mercado Pago",
    lsDesc: "USD · Visa, Mastercard, Amex",
    mpDesc: "ARS · Cartão, transferência ou dinheiro",
    close: "Cancelar",
    secureNote: "Pagamento 100% seguro · Não armazenamos dados do cartão",
    includes: "Inclui:",
    appNote: "Você receberá o link de acesso à app por e-mail ao concluir o pagamento.",
    filesNote: "Você receberá os arquivos PDF por e-mail ao concluir o pagamento.",
    couponLabel: "Tem um código de desconto?",
    couponPlaceholder: "Ex: LAUNCH20",
    couponApply: "Aplicar",
    couponValid: "✓ Código válido",
    couponInvalid: "Código inválido",
    discountApplied: "off aplicado",
  },
};

// ── Helpers ──────────────────────────────────────────────────────────────────
function applyDiscount(price, pct) {
  const num = parseFloat(price.replace(/[^0-9.]/g, ""));
  const prefix = price.replace(/[0-9.,]+/, "").trim();
  const discounted = Math.round(num * (1 - pct / 100));
  return `${prefix}${discounted}`;
}

// ── Componente principal ─────────────────────────────────────────────────────
export default function PaymentModal({ pack, lang = "es", onClose }) {
  const [coupon, setCoupon] = useState("");
  const [couponStatus, setCouponStatus] = useState("idle"); // idle | valid | invalid
  const [discount, setDiscount] = useState(null); // { pct, label } | null

  const t = COPY[lang] || COPY.es;
  const links = PAYMENT_LINKS[pack?.slug] || {};
  const isAppPlan = pack?.slug === "studio_pro";

  if (!pack) return null;

  // Precio mostrado (con o sin descuento)
  const displayUsd = discount ? applyDiscount(pack.currentUsd, discount.pct) : pack.currentUsd;
  const displayArs = discount ? applyDiscount(pack.currentArs, discount.pct) : pack.currentArs;

  function applyCoupon() {
    const code = coupon.trim().toUpperCase();
    if (DISCOUNT_CODES[code]) {
      setDiscount(DISCOUNT_CODES[code]);
      setCouponStatus("valid");
    } else {
      setDiscount(null);
      setCouponStatus("invalid");
    }
  }

  function handleLS() {
    let url = links.lemonsqueezy;
    if (!url) return;
    // Si hay código válido, lo pasamos nativamente a Lemon Squeezy
    if (discount && coupon) {
      url += `?checkout[discount_code]=${coupon.trim().toUpperCase()}`;
    }
    window.open(url, "_blank", "noopener");
  }

  function handleMP() {
    const code = coupon.trim().toUpperCase();
    const discountedUrl = discount && links.mercadopago_discounts?.[code];
    const url = discountedUrl || links.mercadopago;
    if (url) window.open(url, "_blank", "noopener");
  }

  return (
    <div
      style={{ position:"fixed", inset:0, zIndex:9999, background:"rgba(0,0,0,0.72)", backdropFilter:"blur(6px)", display:"flex", alignItems:"center", justifyContent:"center", padding:"16px" }}
      onClick={onClose}
    >
      <style>{`
        @keyframes pmSlideUp { from{opacity:0;transform:translateY(24px)} to{opacity:1;transform:translateY(0)} }
        .pm-card { animation: pmSlideUp .35s cubic-bezier(.2,.8,.2,1) both; }
        .pm-btn-ls:hover  { background:#e6a800 !important; transform:translateY(-2px); box-shadow:0 12px 28px rgba(255,194,51,0.3) !important; }
        .pm-btn-mp:hover  { background:#00bcff !important; color:white !important; transform:translateY(-2px); box-shadow:0 12px 28px rgba(0,188,255,0.32) !important; }
        .pm-coupon-input:focus { outline:none; border-color:rgba(255,152,0,0.6) !important; }
      `}</style>

      <div className="pm-card" onClick={e => e.stopPropagation()} style={{ background:"linear-gradient(180deg,#17191f 0%,#0f1115 100%)", border:"1px solid rgba(255,255,255,0.12)", borderRadius:"20px", padding:"28px", maxWidth:"480px", width:"100%", boxShadow:"0 32px 80px rgba(0,0,0,0.6)" }}>

        {/* Header */}
        <div style={{ marginBottom:"18px" }}>
          <div style={{ fontFamily:MONO_FONT, fontSize:"10px", letterSpacing:"0.16em", color:"#ff9800", marginBottom:"5px", textTransform:"uppercase" }}>{pack.eyebrow}</div>
          <div style={{ fontFamily:DISPLAY_FONT, fontSize:"21px", color:"#fff", fontWeight:700, marginBottom:"8px" }}>{pack.name}</div>

          {/* Precio con/sin descuento */}
          <div style={{ display:"flex", alignItems:"baseline", gap:"10px", flexWrap:"wrap" }}>
            {discount && (
              <span style={{ fontFamily:DISPLAY_FONT, fontSize:"22px", color:"#9ca2ad", textDecoration:"line-through", letterSpacing:"-0.04em" }}>{pack.currentUsd}</span>
            )}
            <span style={{ fontFamily:DISPLAY_FONT, fontSize:"38px", color: discount ? "#4ade80" : "#fff", fontWeight:900, letterSpacing:"-0.04em" }}>{displayUsd}</span>
            <span style={{ fontFamily:MONO_FONT, fontSize:"11px", color:"#9ca2ad", textDecoration:"line-through" }}>{pack.oldUsd}</span>
            <span style={{ fontFamily:MONO_FONT, fontSize:"11px", color:"#8a8f99" }}>· {displayArs} ARS</span>
          </div>

          {discount && (
            <div style={{ display:"inline-flex", alignItems:"center", gap:"6px", background:"rgba(74,222,128,0.12)", border:"1px solid rgba(74,222,128,0.3)", borderRadius:"999px", padding:"4px 10px", marginTop:"6px" }}>
              <span style={{ fontSize:"11px", fontWeight:800, color:"#4ade80", fontFamily:MONO_FONT }}>🎉 {discount.pct}% {t.discountApplied} — {t.couponValid}</span>
            </div>
          )}
        </div>

        {/* Features */}
        <div style={{ background:"rgba(255,255,255,0.04)", border:"1px solid rgba(255,255,255,0.08)", borderRadius:"12px", padding:"12px", marginBottom:"16px" }}>
          <div style={{ fontFamily:MONO_FONT, fontSize:"9px", letterSpacing:"0.14em", color:"#ff9800", marginBottom:"8px", textTransform:"uppercase" }}>{t.includes}</div>
          {pack.features.map(f => (
            <div key={f} style={{ display:"flex", gap:"8px", alignItems:"flex-start", fontSize:"12px", color:"#d7dbe2", marginBottom:"5px", lineHeight:1.4 }}>
              <span style={{ color:"#ff9800", fontWeight:900, flexShrink:0 }}>✓</span><span>{f}</span>
            </div>
          ))}
        </div>

        {/* Nota entrega */}
        <div style={{ fontFamily:MONO_FONT, fontSize:"10.5px", color:"#8a8f99", marginBottom:"16px", background:"rgba(255,152,0,0.06)", border:"1px solid rgba(255,152,0,0.16)", borderRadius:"10px", padding:"9px 12px" }}>
          📧 {isAppPlan ? t.appNote : t.filesNote}
        </div>

        {/* ── Código de descuento ── */}
        <div style={{ marginBottom:"16px" }}>
          <div style={{ fontFamily:MONO_FONT, fontSize:"10px", color:"#8a8f99", letterSpacing:"0.08em", marginBottom:"7px" }}>{t.couponLabel}</div>
          <div style={{ display:"flex", gap:"8px" }}>
            <input
              className="pm-coupon-input"
              type="text"
              value={coupon}
              onChange={e => { setCoupon(e.target.value.toUpperCase()); setCouponStatus("idle"); setDiscount(null); }}
              onKeyDown={e => e.key === "Enter" && applyCoupon()}
              placeholder={t.couponPlaceholder}
              style={{ flex:1, background:"rgba(255,255,255,0.06)", border:`1.5px solid ${couponStatus === "valid" ? "rgba(74,222,128,0.5)" : couponStatus === "invalid" ? "rgba(248,113,113,0.5)" : "rgba(255,255,255,0.14)"}`, borderRadius:"10px", padding:"10px 12px", fontFamily:MONO_FONT, fontSize:"12px", color:"#fff", letterSpacing:"0.1em" }}
            />
            <button
              onClick={applyCoupon}
              style={{ background:"rgba(255,152,0,0.15)", border:"1.5px solid rgba(255,152,0,0.35)", borderRadius:"10px", padding:"10px 14px", cursor:"pointer", fontFamily:MONO_FONT, fontSize:"11px", fontWeight:800, color:"#ff9800", whiteSpace:"nowrap" }}
            >
              {t.couponApply}
            </button>
          </div>
          {couponStatus === "invalid" && (
            <div style={{ fontFamily:MONO_FONT, fontSize:"10px", color:"#f87171", marginTop:"5px" }}>{t.couponInvalid}</div>
          )}
        </div>

        {/* Botones de pago */}
        <div style={{ display:"flex", flexDirection:"column", gap:"10px", marginBottom:"18px" }}>
          {/* Lemon Squeezy */}
          <button className="pm-btn-ls" onClick={handleLS} style={{ display:"flex", alignItems:"center", justifyContent:"space-between", background:"rgba(255,194,51,0.13)", border:"1.5px solid rgba(255,194,51,0.4)", borderRadius:"14px", padding:"15px 18px", cursor:"pointer", fontFamily:BODY_FONT, transition:"all .22s ease", color:"#ffd966" }}>
            <div style={{ display:"flex", flexDirection:"column", alignItems:"flex-start", gap:"2px" }}>
              <span style={{ fontWeight:800, fontSize:"13.5px" }}>{t.ctaLS}</span>
              <span style={{ fontSize:"11px", opacity:0.75 }}>{t.lsDesc}</span>
            </div>
            <IconLS />
          </button>

          {/* Mercado Pago */}
          <button className="pm-btn-mp" onClick={handleMP} style={{ display:"flex", alignItems:"center", justifyContent:"space-between", background:"rgba(0,188,255,0.08)", border:"1.5px solid rgba(0,188,255,0.28)", borderRadius:"14px", padding:"15px 18px", cursor:"pointer", fontFamily:BODY_FONT, transition:"all .22s ease", color:"#7ce8ff" }}>
            <div style={{ display:"flex", flexDirection:"column", alignItems:"flex-start", gap:"2px" }}>
              <span style={{ fontWeight:800, fontSize:"13.5px" }}>{t.ctaMP}</span>
              <span style={{ fontSize:"11px", opacity:0.75 }}>{t.mpDesc}</span>
            </div>
            <IconMP />
          </button>
        </div>

        {/* Footer */}
        <div style={{ display:"flex", justifyContent:"space-between", alignItems:"center" }}>
          <span style={{ fontFamily:MONO_FONT, fontSize:"9.5px", color:"#5a5f6a", letterSpacing:"0.06em" }}>🔒 {t.secureNote}</span>
          <button onClick={onClose} style={{ background:"transparent", border:"none", color:"#5a5f6a", cursor:"pointer", fontFamily:BODY_FONT, fontSize:"12px", padding:"4px 8px" }}>{t.close}</button>
        </div>
      </div>
    </div>
  );
}
