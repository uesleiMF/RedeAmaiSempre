import QRCode from "react-qr-code";
import { toPng } from "html-to-image";
import { useRef, useState } from "react";

export default function QrCode({
  path = "",
  size = 200,
  label = "QR Code",
  showModal = true,
  showDownload = true
}) {
  const baseUrl = process.env.REACT_APP_SITE_URL;

  const fullUrl = `${baseUrl}${path}`;

  const ref = useRef();
  const [open, setOpen] = useState(false);

  const baixar = async () => {
    const dataUrl = await toPng(ref.current, {
      skipFonts: true
    });

    const link = document.createElement("a");
    link.download = "qrcode.png";
    link.href = dataUrl;
    link.click();
  };

  const ConteudoQr = () => (
    <div
      ref={ref}
      style={{
        fontFamily: "Arial, sans-serif",
        background: "#fff",
        padding: 16,
        borderRadius: 8,
        textAlign: "center"
      }}
    >
      <QRCode value={fullUrl} size={size} />
      <p style={{ fontSize: 12, marginTop: 8 }}>
        {fullUrl}
      </p>
    </div>
  );

  return (
    <>
      {showModal ? (
        <>
          <button onClick={() => setOpen(true)}>
            {label}
          </button>

          {open && (
            <div className="qr-modal" onClick={() => setOpen(false)}>
              <div
                className="qr-modal-content"
                onClick={(e) => e.stopPropagation()}
              >
                <button onClick={() => setOpen(false)}>×</button>
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
