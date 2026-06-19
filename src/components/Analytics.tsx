// حقن أدوات تتبّع Google (GA4 + Google Tag Manager) مع Google Consent Mode.
// يُفعَّل فقط عند ضبط المعرّفات في البيئة؛ وإلا لا يُحقن شيء (لا يكسر الموقع).
// المعرّفات عامة بطبيعتها (تظهر في كود الصفحة)، لذا تُقرأ من البيئة وتُحقن في السكربت.
import Script from "next/script";

const GA4 = process.env.GA4_MEASUREMENT_ID?.trim();
const GTM = process.env.GTM_CONTAINER_ID?.trim();

export function analyticsEnabled(): boolean {
  return Boolean(GA4 || GTM);
}

// سكربت Consent Mode الافتراضي (منع حتى موافقة الزائر) + سكربتات GA4/GTM.
export function AnalyticsScripts() {
  if (!GA4 && !GTM) return null;
  return (
    <>
      {/* Consent Mode الافتراضي — سكربت سطري يُنفَّذ أولاً قبل تحميل GA/GTM */}
      <script
        dangerouslySetInnerHTML={{
          __html:
            "window.dataLayer=window.dataLayer||[];function gtag(){dataLayer.push(arguments);}window.gtag=gtag;" +
            "gtag('consent','default',{ad_storage:'denied',analytics_storage:'denied',ad_user_data:'denied',ad_personalization:'denied',wait_for_update:500});",
        }}
      />

      {GTM && (
        <Script id="gtm-loader" strategy="afterInteractive">
          {`(function(w,d,s,l,i){w[l]=w[l]||[];w[l].push({'gtm.start':new Date().getTime(),event:'gtm.js'});var f=d.getElementsByTagName(s)[0],j=d.createElement(s),dl=l!='dataLayer'?'&l='+l:'';j.async=true;j.src='https://www.googletagmanager.com/gtm.js?id='+i+dl;f.parentNode.insertBefore(j,f);})(window,document,'script','dataLayer','${GTM}');`}
        </Script>
      )}

      {GA4 && (
        <>
          <Script
            src={`https://www.googletagmanager.com/gtag/js?id=${GA4}`}
            strategy="afterInteractive"
          />
          <Script id="ga4-init" strategy="afterInteractive">
            {`window.dataLayer=window.dataLayer||[];function gtag(){dataLayer.push(arguments);}window.gtag=window.gtag||gtag;gtag('js',new Date());gtag('config','${GA4}');`}
          </Script>
        </>
      )}
    </>
  );
}

// إطار GTM لغير المدعومين بالـ JavaScript (يوضع مباشرة بعد فتح <body>).
export function GtmNoScript() {
  if (!GTM) return null;
  return (
    <noscript>
      <iframe
        src={`https://www.googletagmanager.com/ns.html?id=${GTM}`}
        height="0"
        width="0"
        style={{ display: "none", visibility: "hidden" }}
        title="gtm"
      />
    </noscript>
  );
}
