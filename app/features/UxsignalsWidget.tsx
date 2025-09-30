import { useEffect } from "react";
import { useKalkulatorRootdata } from "~/root";

export function UxsignalsWidget() {
  const uxsignalId = "uxsignals-bidrag-barnebidragskalkulator";
  const { uxSignalsEnabled, uxSignalsMode } = useKalkulatorRootdata();
  const erAktivert = uxSignalsEnabled === "true";
  console.log("🚀 ~ UxsignalsWidget ~ erAktivert:", erAktivert);
  const mode = uxSignalsMode;
  console.log("🚀 ~ UxsignalsWidget ~ mode:", mode);

  useEffect(() => {
    if (erAktivert) {
      const script = document.createElement("script");
      script.src = "https://widget.uxsignals.com/embed.js";
      script.async = true;
      document.body.appendChild(script);
      return () => {
        document.body.removeChild(script);
      };
    }
  }, [erAktivert]);

  if (!erAktivert || !uxsignalId) return null;

  return (
    <section>
      <div
        data-uxsignals-embed={uxsignalId}
        data-uxsignals-mode={mode}
        style={{ maxWidth: 630 }}
      />
    </section>
  );
}
