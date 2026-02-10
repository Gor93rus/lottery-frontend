import { QRCodeSVG } from 'qrcode.react';

interface TicketQRCodeProps {
  ticketId: string;
  lotteryName: string;
}

export default function TicketQRCode({ ticketId, lotteryName }: TicketQRCodeProps) {
  const verificationUrl = `${window.location.origin}/verify/${ticketId}`;

  const downloadQR = () => {
    const svg = document.getElementById('ticket-qr-code');
    if (!svg) return;

    const svgData = new XMLSerializer().serializeToString(svg);
    const canvas = document.createElement('canvas');
    const ctx = canvas.getContext('2d');
    const img = new Image();

    img.onload = () => {
      canvas.width = img.width;
      canvas.height = img.height;
      ctx?.drawImage(img, 0, 0);
      const pngFile = canvas.toDataURL('image/png');

      const downloadLink = document.createElement('a');
      downloadLink.download = `ticket-${ticketId}-qr.png`;
      downloadLink.href = pngFile;
      downloadLink.click();
    };

    img.src = `data:image/svg+xml;base64,${btoa(svgData)}`;
  };

  return (
    <div className="ticket-qr-code glass-card">
      <div className="qr-header">
        <h3 className="qr-title">📱 Share Your Ticket</h3>
        <p className="qr-subtitle">{lotteryName}</p>
      </div>

      <div className="qr-wrapper">
        <QRCodeSVG
          id="ticket-qr-code"
          value={verificationUrl}
          size={200}
          level="H"
          includeMargin={true}
        />
      </div>

      <button onClick={downloadQR} className="download-qr-btn">
        Download QR Code
      </button>
    </div>
  );
}
