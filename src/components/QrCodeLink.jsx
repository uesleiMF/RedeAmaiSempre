import QRCode from "react-qr-code";
import { toPng } from "html-to-image";
import { useRef, useState } from "react";
import "./QrCode.css";

export default function QrCode({
  path = "",
  size = 200,
  label = "📲 Acesse nosso site pelo QR Code",
  showModal = true,
  showDownload = true
}) {
  const baseUrl =
    process.env.REACT_APP_SITE_URL || window.location.origin;

  const fullUrl = `${baseUrl}${path}`;

  const ref = useRef(null);
  const [open, setOpen] = useState(false);

  const baixar = async () => {
    try {
      const dataUrl = await toPng(ref.current, {
        skipFonts: true
      });

      const link = document.createElement("a");
      link.download = "qrcode.png";
      link.href = dataUrl;
      link.click();
    } catch (err) {
      console.error("Erro ao gerar QR Code:", err);
    }
  };

  const ConteudoQr = () => (
    <div className="qr-box" ref={ref}>
      <QRCode value={fullUrl} size={size} />
      <p className="qr-link">{fullUrl}</p>

      {showDownload && (
        <button className="qr-download" onClick={baixar}>
          💾 Baixar QR Code
        </button>
      )}
    </div>
  );

  return (
    <>
      {showModal ? (
        <>
          <button
            className="qr-open-button"
            onClick={() => setOpen(true)}
          >
            {label}
          </button>

          {open && (
            <div className="qr-modal" onClick={() => setOpen(false)}>
              <div
                className="qr-modal-content"
                onClick={(e) => e.stopPropagation()}
              >
                <button
                  className="qr-close"
                  onClick={() => setOpen(false)}
                >
                  ×
                </button>

                <ConteudoQr />
              </div>
            </div>
          )}
        </>
      ) : (
        <ConteudoQr />
      )}
    </>
  );
}
