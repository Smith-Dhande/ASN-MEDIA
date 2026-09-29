import React, { useRef } from 'react';
import { QRCodeSVG } from 'qrcode.react';
import { Download, Copy, Printer, Check, ExternalLink } from 'lucide-react';

export const QrCodeRenderer = ({ url, clientName = 'Client', scannerName = 'Review Scanner', size = 220 }) => {
  const [copied, setCopied] = React.useState(false);
  const qrRef = useRef(null);

  const handleCopyLink = () => {
    navigator.clipboard.writeText(url);
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  };

  const handleDownloadSvg = () => {
    const svgElement = qrRef.current?.querySelector('svg');
    if (!svgElement) return;

    const svgData = new XMLSerializer().serializeToString(svgElement);
    const svgBlob = new Blob([svgData], { type: 'image/svg+xml;charset=utf-8' });
    const svgUrl = URL.createObjectURL(svgBlob);

    const downloadLink = document.createElement('a');
    downloadLink.href = svgUrl;
    downloadLink.download = `${clientName.toLowerCase().replace(/[^a-z0-9]/g, '-')}-qr.svg`;
    document.body.appendChild(downloadLink);
    downloadLink.click();
    document.body.removeChild(downloadLink);
    URL.revokeObjectURL(svgUrl);
  };

  const handlePrint = () => {
    const printWindow = window.open('', '_blank');
    const svgElement = qrRef.current?.querySelector('svg')?.outerHTML;
    if (!printWindow || !svgElement) return;

    printWindow.document.write(`
      <!DOCTYPE html>
      <html>
        <head>
          <title>QR Code - ${clientName}</title>
          <style>
            body { font-family: sans-serif; display: flex; flex-direction: column; align-items: center; justify-content: center; height: 90vh; text-align: center; }
            .card { border: 2px solid #8E722A; padding: 40px; border-radius: 12px; max-width: 400px; }
            h2 { color: #111; margin-bottom: 8px; }
            p { color: #666; font-size: 14px; margin-bottom: 24px; }
            .url { font-family: monospace; font-size: 12px; color: #888; margin-top: 20px; }
          </style>
        </head>
        <body>
          <div class="card">
            <h2>${clientName}</h2>
            <p>Scan to leave us a quick review!</p>
            ${svgElement}
            <div class="url">${url}</div>
          </div>
          <script>window.print(); setTimeout(() => window.close(), 1000);</script>
        </body>
      </html>
    `);
    printWindow.document.close();
  };

  return (
    <div className="flex flex-col items-center justify-center p-6 bg-[#FAF8F3] border border-[#0A0A0A]/10 rounded-lg space-y-4">
      {/* QR Display Frame */}
      <div
        ref={qrRef}
        className="p-4 bg-white rounded-xl shadow-md border border-[#8E722A]/20 flex items-center justify-center transition-transform hover:scale-[1.02]"
      >
        <QRCodeSVG
          value={url}
          size={size}
          level="H"
          includeMargin={true}
          fgColor="#111111"
          bgColor="#FFFFFF"
          imageSettings={{
            src: 'https://asnmedia.in/favicon.ico',
            x: undefined,
            y: undefined,
            height: 24,
            width: 24,
            excavate: true,
          }}
        />
      </div>

      <div className="text-center space-y-1">
        <h4 className="font-display font-semibold text-sm text-[#111111]">{clientName}</h4>
        <p className="font-mono text-xs text-[#685C43]">{scannerName}</p>
        <p className="font-mono text-[11px] text-[#8E722A] break-all px-2 select-all">{url}</p>
      </div>

      {/* Action Buttons */}
      <div className="flex flex-wrap items-center justify-center gap-2 pt-2 w-full">
        <button
          onClick={handleCopyLink}
          className="flex items-center gap-1.5 px-3 py-1.5 text-xs font-mono font-medium bg-white border border-[#0A0A0A]/15 hover:bg-[#111111] hover:text-white rounded transition-colors"
        >
          {copied ? <Check className="w-3.5 h-3.5 text-emerald-500" /> : <Copy className="w-3.5 h-3.5" />}
          <span>{copied ? 'Copied' : 'Copy URL'}</span>
        </button>

        <button
          onClick={handleDownloadSvg}
          className="flex items-center gap-1.5 px-3 py-1.5 text-xs font-mono font-medium bg-[#8E722A] text-white hover:bg-[#725B20] rounded transition-colors"
        >
          <Download className="w-3.5 h-3.5" />
          <span>Download SVG</span>
        </button>

        <button
          onClick={handlePrint}
          className="flex items-center gap-1.5 px-3 py-1.5 text-xs font-mono font-medium bg-white border border-[#0A0A0A]/15 hover:bg-[#111111] hover:text-white rounded transition-colors"
        >
          <Printer className="w-3.5 h-3.5" />
          <span>Print</span>
        </button>

        <a
          href={url}
          target="_blank"
          rel="noopener noreferrer"
          className="flex items-center gap-1.5 px-3 py-1.5 text-xs font-mono font-medium bg-white border border-[#0A0A0A]/15 hover:bg-[#111111] hover:text-white rounded transition-colors"
        >
          <ExternalLink className="w-3.5 h-3.5 text-[#8E722A]" />
          <span>Preview</span>
        </a>
      </div>
    </div>
  );
};
