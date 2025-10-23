import { useEffect } from "react";
import { useKalkulatorRootdata } from "~/root";

export function UxsignalsWidget() {
  const uxsignalId = "panel-kridpplpc8";
  const { uxSignalsEnabled, uxSignalsMode } = useKalkulatorRootdata();
  const erAktivert = uxSignalsEnabled === "true";
  const mode = uxSignalsMode;

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
