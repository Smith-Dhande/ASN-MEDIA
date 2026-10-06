import React, { useRef, useState } from 'react';
import { QRCodeSVG } from 'qrcode.react';
import { toPng } from 'html-to-image';
import { Download, Copy, Printer, Check, ExternalLink, Timer, Sparkles, Image, RefreshCw, Star } from 'lucide-react';

export const QrCodeRenderer = ({
  url,
  clientName = 'Asn Photography',
  scannerName = 'Review Scanner',
  size = 190,
  defaultTimer = 0,
  onTimerChange,
  onClose
}) => {
  const [copied, setCopied] = useState(false);
  const [selectedTimer, setSelectedTimer] = useState(defaultTimer);
  const [isDownloading, setIsDownloading] = useState(false);
  const standeeRef = useRef(null);
  const qrRef = useRef(null);

  const getEffectiveUrl = () => {
    if (!url) return '';
    try {
      const u = new URL(url, window.location.origin);
      if (selectedTimer > 0) {
        u.searchParams.set('timer', selectedTimer);
      } else {
        u.searchParams.delete('timer');
      }
      return u.toString();
    } catch (e) {
      return selectedTimer > 0 ? `${url}${url.includes('?') ? '&' : '?'}timer=${selectedTimer}` : url;
    }
  };

  const effectiveUrl = getEffectiveUrl();

  const handleTimerSelect = (val) => {
    setSelectedTimer(val);
    if (onTimerChange) onTimerChange(val);
  };

  const handleCopyLink = () => {
    navigator.clipboard.writeText(effectiveUrl);
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  };

  // Download High-Resolution Standee PNG Image
  const handleDownloadPng = async () => {
    if (!standeeRef.current) return;
    setIsDownloading(true);
    try {
      const dataUrl = await toPng(standeeRef.current, {
        cacheBust: true,
        pixelRatio: 3, // Crisp high-res 300dpi print quality
        backgroundColor: '#FFFFFF',
      });
      const link = document.createElement('a');
      link.download = `${(clientName || 'google-review').toLowerCase().replace(/[^a-z0-9]/g, '-')}-standee.png`;
      link.href = dataUrl;
      link.click();
    } catch (err) {
      console.error('Failed to export standee image:', err);
    } finally {
      setIsDownloading(false);
    }
  };

  // Download Raw SVG QR Code
  const handleDownloadSvg = () => {
    const svgElement = qrRef.current?.querySelector('svg');
    if (!svgElement) return;

    const svgData = new XMLSerializer().serializeToString(svgElement);
    const svgBlob = new Blob([svgData], { type: 'image/svg+xml;charset=utf-8' });
    const svgUrl = URL.createObjectURL(svgBlob);

    const downloadLink = document.createElement('a');
    downloadLink.href = svgUrl;
    downloadLink.download = `${(clientName || 'google-review').toLowerCase().replace(/[^a-z0-9]/g, '-')}-qr.svg`;
    document.body.appendChild(downloadLink);
    downloadLink.click();
    document.body.removeChild(downloadLink);
    URL.revokeObjectURL(svgUrl);
  };

  // Print exact physical tabletop standee template
  const handlePrint = () => {
    const printWindow = window.open('', '_blank');
    const svgElement = qrRef.current?.querySelector('svg')?.outerHTML;
    if (!printWindow || !svgElement) return;

    printWindow.document.write(`
      <!DOCTYPE html>
      <html>
        <head>
          <title>Google Review Standee - ${clientName}</title>
          <link rel="preconnect" href="https://fonts.googleapis.com">
          <link rel="preconnect" href="https://fonts.gstatic.com" crossorigin>
          <link href="https://fonts.googleapis.com/css2?family=Dancing+Script:wght@700&family=Playfair+Display:ital,wght@0,600;1,500&display=swap" rel="stylesheet">
          <style>
            @page {
              size: 4in 6in;
              margin: 0;
            }
            body {
              margin: 0;
              padding: 0;
              display: flex;
              align-items: center;
              justify-content: center;
              min-height: 100vh;
              background: #F4F4F4;
              font-family: -apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, sans-serif;
            }
            .standee-frame {
              width: 380px;
              height: 560px;
              position: relative;
              background: #FFFFFF;
              border-radius: 12px;
              overflow: hidden;
              box-shadow: 0 10px 30px rgba(0,0,0,0.15);
              display: flex;
              flex-direction: column;
              align-items: center;
              text-align: center;
            }
            /* Multi-color Google perimeter borders */
            .border-top-arc {
              position: absolute;
              top: 0;
              left: 0;
              right: 0;
              height: 120px;
              background: #FBBC05;
              border-bottom-left-radius: 50% 30px;
              border-bottom-right-radius: 50% 30px;
              z-index: 1;
            }
            .side-green {
              position: absolute;
              top: 0;
              left: 0;
              width: 24px;
              height: 160px;
              background: #34A853;
              z-index: 2;
            }
            .side-blue {
              position: absolute;
              bottom: 0;
              left: 0;
              width: 24px;
              height: 220px;
              background: #4285F4;
              z-index: 2;
            }
            .side-red {
              position: absolute;
              top: 100px;
              right: 0;
              width: 24px;
              height: 180px;
              background: #EA4335;
              z-index: 2;
            }
            .side-bottom-red {
              position: absolute;
              bottom: 0;
              right: 0;
              width: 24px;
              height: 220px;
              background: #EA4335;
              z-index: 2;
            }
            .inner-card {
              position: relative;
              z-index: 5;
              background: #FFFFFF;
              width: calc(100% - 48px);
              height: 100%;
              display: flex;
              flex-direction: column;
              align-items: center;
              justify-content: space-between;
              padding: 24px 16px 20px 16px;
              box-sizing: border-box;
            }
            .google-badge {
              width: 68px;
              height: 68px;
              background: #FFFFFF;
              border-radius: 50%;
              box-shadow: 0 4px 14px rgba(0,0,0,0.12);
              display: flex;
              align-items: center;
              justify-content: center;
              margin-top: -6px;
              margin-bottom: 8px;
            }
            .review-title {
              font-family: 'Playfair Display', Georgia, serif;
              font-size: 24px;
              font-style: italic;
              color: #111111;
              margin: 0;
              font-weight: 500;
            }
            .client-name {
              font-size: 23px;
              font-weight: 800;
              color: #111111;
              margin: 4px 0 16px 0;
              letter-spacing: -0.3px;
            }
            .qr-wrapper {
              position: relative;
              padding: 16px;
              display: flex;
              align-items: center;
              justify-content: center;
            }
            .bracket {
              position: absolute;
              width: 32px;
              height: 32px;
              border-color: #34A853;
              border-style: solid;
              border-width: 0;
            }
            .b-tl { top: 0; left: 0; border-top-width: 5px; border-left-width: 5px; border-top-left-radius: 12px; }
            .b-tr { top: 0; right: 0; border-top-width: 5px; border-right-width: 5px; border-top-right-radius: 12px; }
            .b-bl { bottom: 0; left: 0; border-bottom-width: 5px; border-left-width: 5px; border-bottom-left-radius: 12px; }
            .b-br { bottom: 0; right: 0; border-bottom-width: 5px; border-right-width: 5px; border-bottom-right-radius: 12px; }
            .stars-wrapper {
              display: flex;
              gap: 4px;
              justify-content: center;
              margin-top: 14px;
              margin-bottom: 2px;
            }
            .star {
              color: #F9AB00;
              font-size: 24px;
              filter: drop-shadow(0 2px 4px rgba(249,171,0,0.4));
            }
            .thank-you {
              font-family: 'Dancing Script', cursive;
              font-size: 30px;
              font-weight: 700;
              color: #111111;
              margin: 0;
            }
          </style>
        </head>
        <body>
          <div class="standee-frame">
            <div class="border-top-arc"></div>
            <div class="side-green"></div>
            <div class="side-blue"></div>
            <div class="side-red"></div>
            <div class="side-bottom-red"></div>

            <div class="inner-card">
              <!-- Top Google Logo Badge -->
              <div class="google-badge">
                <svg viewBox="0 0 24 24" width="38" height="38">
                  <path fill="#4285F4" d="M23.745 12.27c0-.7-.06-1.4-.19-2.07H12v4.51h6.6c-.29 1.52-1.14 2.82-2.4 3.68v3.05h3.88c2.27-2.09 3.665-5.17 3.665-9.17z"/>
                  <path fill="#34A853" d="M12 24c3.24 0 5.95-1.08 7.93-2.91l-3.88-3.05c-1.08.72-2.45 1.16-4.05 1.16-3.12 0-5.77-2.1-6.72-4.93H1.25v3.15C3.26 21.36 7.33 24 12 24z"/>
                  <path fill="#FBBC05" d="M5.28 14.27c-.25-.72-.38-1.49-.38-2.27s.13-1.55.38-2.27V6.58H1.25C.45 8.18 0 10.03 0 12s.45 3.82 1.25 5.42l4.03-3.15z"/>
                  <path fill="#EA4335" d="M12 4.75c1.77 0 3.35.61 4.6 1.8l3.42-3.42C17.95 1.19 15.24 0 12 0 7.33 0 3.26 2.64 1.25 6.58l4.03 3.15c.95-2.83 3.6-4.98 6.72-4.98z"/>
                </svg>
              </div>

              <!-- Header Texts -->
              <div>
                <h2 class="review-title">Review us on...</h2>
                <h1 class="client-name">${clientName}</h1>
              </div>

              <!-- QR Code with Scanner Brackets -->
              <div class="qr-wrapper">
                <div class="bracket b-tl"></div>
                <div class="bracket b-tr"></div>
                <div class="bracket b-bl"></div>
                <div class="bracket b-br"></div>
                ${svgElement}
              </div>

              <!-- Footer with 5 Gold Stars & Cursive Thank You -->
              <div>
                <div class="stars-wrapper">
                  <span class="star">★</span>
                  <span class="star">★</span>
                  <span class="star">★</span>
                  <span class="star">★</span>
                  <span class="star">★</span>
                </div>
                <div class="thank-you">Thank You</div>
              </div>
            </div>
          </div>
          <script>
            window.onload = function() {
              window.print();
              setTimeout(() => window.close(), 1200);
            };
          </script>
        </body>
      </html>
    `);
    printWindow.document.close();
  };

  return (
    <div className="flex flex-col items-center justify-center p-3 sm:p-5 bg-[#FAF8F3] border border-[#0A0A0A]/10 rounded-2xl space-y-4 sm:space-y-5 max-w-full w-full mx-auto">
      {/* THE GOOGLE REVIEW STANDEE CARD CONTAINER (Matching user reference image) */}
      <div
        ref={standeeRef}
        className="w-full max-w-[330px] sm:max-w-[360px] h-[490px] sm:h-[530px] relative bg-white rounded-2xl shadow-2xl overflow-hidden flex flex-col items-center select-none border border-gray-200 shrink-0"
      >
        {/* Top Yellow/Gold Arc Background */}
        <div className="absolute top-0 left-0 right-0 h-28 bg-[#FBBC05] rounded-b-[40px] z-1" />

        {/* Left Google Accents: Green top-left, Blue bottom-left */}
        <div className="absolute top-0 left-0 w-5 h-36 bg-[#34A853] z-2" />
        <div className="absolute bottom-0 left-0 w-5 h-48 bg-[#4285F4] z-2" />

        {/* Right Google Accents: Red top/mid-right, Red bottom-right */}
        <div className="absolute top-20 right-0 w-5 h-40 bg-[#EA4335] z-2" />
        <div className="absolute bottom-0 right-0 w-5 h-48 bg-[#EA4335] z-2" />

        {/* Central White Content Card */}
        <div className="relative z-10 w-[calc(100%-40px)] h-full bg-white flex flex-col items-center justify-between py-5 px-3">
          {/* Top Google "G" Badge */}
          <div className="w-16 h-16 bg-white rounded-full shadow-lg border border-gray-100 flex items-center justify-center -mt-2">
            <svg viewBox="0 0 24 24" className="w-9 h-9">
              <path fill="#4285F4" d="M23.745 12.27c0-.7-.06-1.4-.19-2.07H12v4.51h6.6c-.29 1.52-1.14 2.82-2.4 3.68v3.05h3.88c2.27-2.09 3.665-5.17 3.665-9.17z"/>
              <path fill="#34A853" d="M12 24c3.24 0 5.95-1.08 7.93-2.91l-3.88-3.05c-1.08.72-2.45 1.16-4.05 1.16-3.12 0-5.77-2.1-6.72-4.93H1.25v3.15C3.26 21.36 7.33 24 12 24z"/>
              <path fill="#FBBC05" d="M5.28 14.27c-.25-.72-.38-1.49-.38-2.27s.13-1.55.38-2.27V6.58H1.25C.45 8.18 0 10.03 0 12s.45 3.82 1.25 5.42l4.03-3.15z"/>
              <path fill="#EA4335" d="M12 4.75c1.77 0 3.35.61 4.6 1.8l3.42-3.42C17.95 1.19 15.24 0 12 0 7.33 0 3.26 2.64 1.25 6.58l4.03 3.15c.95-2.83 3.6-4.98 6.72-4.98z"/>
            </svg>
          </div>

          {/* Heading with Client Name */}
          <div className="text-center px-2 space-y-1">
            <h2 className="font-serif italic text-[#111111] text-xl sm:text-2xl font-medium tracking-wide">
              Review us on...
            </h2>
            <h1 className="font-sans font-extrabold text-xl sm:text-2xl text-[#111111] tracking-tight leading-tight line-clamp-2">
              {clientName}
            </h1>
          </div>

          {/* QR Code with 4 Green Rounded Corner Brackets */}
          <div ref={qrRef} className="relative p-3 flex items-center justify-center my-1">
            {/* Top-Left Bracket */}
            <div className="absolute top-0 left-0 w-7 h-7 border-t-[4px] border-l-[4px] border-[#34A853] rounded-tl-xl" />
            {/* Top-Right Bracket */}
            <div className="absolute top-0 right-0 w-7 h-7 border-t-[4px] border-r-[4px] border-[#34A853] rounded-tr-xl" />
            {/* Bottom-Left Bracket */}
            <div className="absolute bottom-0 left-0 w-7 h-7 border-b-[4px] border-l-[4px] border-[#34A853] rounded-bl-xl" />
            {/* Bottom-Right Bracket */}
            <div className="absolute bottom-0 right-0 w-7 h-7 border-b-[4px] border-r-[4px] border-[#34A853] rounded-br-xl" />

            <QRCodeSVG
              value={effectiveUrl || 'https://asnmedia.in'}
              size={size}
              level="H"
              includeMargin={false}
              fgColor="#111111"
              bgColor="#FFFFFF"
            />
          </div>

          {/* Bottom Stars & "Thank You" Calligraphy */}
          <div className="text-center space-y-0.5 pb-1">
            {/* 5 Golden Gradient Glowing Stars */}
            <div className="flex items-center justify-center gap-1 text-[#F9AB00]">
              {[1, 2, 3, 4, 5].map((s) => (
                <Star
                  key={s}
                  className="w-6 h-6 fill-[#F9AB00] text-[#F9AB00] drop-shadow-[0_2px_4px_rgba(249,171,0,0.5)]"
                />
              ))}
            </div>

            {/* Cursive Thank You */}
            <div
              style={{ fontFamily: "'Dancing Script', 'Brush Script MT', 'Great Vibes', cursive" }}
              className="text-2xl sm:text-3xl font-bold text-[#111111] tracking-wide"
            >
              Thank You
            </div>
          </div>
        </div>
      </div>

      {/* URL Link and Quick Info */}
      <div className="text-center space-y-1 w-full max-w-sm">
        <p className="font-mono text-[11px] text-[#685C43] truncate">Target Link: <span className="text-[#8E722A]">{effectiveUrl}</span></p>
      </div>

      {/* Auto-Redirect Timer Control Option */}
      <div className="w-full max-w-sm p-3 bg-white border border-[#0A0A0A]/10 rounded-xl space-y-2">
        <div className="flex items-center justify-between text-xs font-mono">
          <span className="flex items-center gap-1.5 font-bold text-[#111111]">
            <Timer className="w-3.5 h-3.5 text-[#8E722A]" />
            <span>Auto-Redirect Countdown</span>
          </span>
          <span className="text-[10px] text-[#8E722A] font-bold">
            {selectedTimer > 0 ? `${selectedTimer}s Countdown` : 'Direct Web / Manual'}
          </span>
        </div>

        {/* Timer Presets */}
        <div className="grid grid-cols-5 gap-1.5 pt-1">
          {[
            { label: 'Off', val: 0 },
            { label: '3s', val: 3 },
            { label: '5s', val: 5 },
            { label: '10s', val: 10 },
            { label: '15s', val: 15 }
          ].map((t) => (
            <button
              key={t.val}
              type="button"
              onClick={() => handleTimerSelect(t.val)}
              className={`py-1.5 text-xs font-mono font-bold rounded-lg transition-all cursor-pointer ${
                selectedTimer === t.val
                  ? 'bg-[#111111] text-[#F7F5EF] shadow-xs'
                  : 'bg-[#FAF8F3] text-[#685C43] hover:bg-[#8E722A] hover:text-white border border-[#0A0A0A]/08'
              }`}
            >
              {t.label}
            </button>
          ))}
        </div>
      </div>

      {/* Action Buttons: High-Res PNG, SVG, Print, Copy URL */}
      <div className="grid grid-cols-2 sm:grid-cols-4 gap-2 w-full max-w-sm">
        <button
          type="button"
          onClick={handleDownloadPng}
          disabled={isDownloading}
          className="flex items-center justify-center gap-1.5 px-3 py-2 text-xs font-mono font-bold bg-[#8E722A] text-white hover:bg-[#725B20] rounded-xl transition-all shadow-sm cursor-pointer"
          title="Download full Google Standee as PNG"
        >
          {isDownloading ? (
            <RefreshCw className="w-3.5 h-3.5 animate-spin" />
          ) : (
            <Image className="w-3.5 h-3.5" />
          )}
          <span>{isDownloading ? 'Exporting...' : 'PNG Standee'}</span>
        </button>

        <button
          type="button"
          onClick={handlePrint}
          className="flex items-center justify-center gap-1.5 px-3 py-2 text-xs font-mono font-bold bg-[#111111] text-white hover:bg-[#8E722A] rounded-xl transition-all shadow-sm cursor-pointer"
          title="Print official tabletop standee"
        >
          <Printer className="w-3.5 h-3.5" />
          <span>Print Card</span>
        </button>

        <button
          type="button"
          onClick={handleDownloadSvg}
          className="flex items-center justify-center gap-1.5 px-3 py-2 text-xs font-mono font-semibold bg-white border border-[#0A0A0A]/15 hover:bg-[#FAF8F3] text-[#111111] rounded-xl transition-all cursor-pointer"
          title="Download vector SVG QR code"
        >
          <Download className="w-3.5 h-3.5 text-[#8E722A]" />
          <span>Raw SVG</span>
        </button>

        <button
          type="button"
          onClick={handleCopyLink}
          className="flex items-center justify-center gap-1.5 px-3 py-2 text-xs font-mono font-semibold bg-white border border-[#0A0A0A]/15 hover:bg-[#FAF8F3] text-[#111111] rounded-xl transition-all cursor-pointer"
        >
          {copied ? <Check className="w-3.5 h-3.5 text-emerald-500" /> : <Copy className="w-3.5 h-3.5 text-[#685C43]" />}
          <span>{copied ? 'Copied' : 'Copy Link'}</span>
        </button>
      </div>
    </div>
  );
};

export default QrCodeRenderer;

