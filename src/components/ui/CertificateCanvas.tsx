"use client";

import { useEffect, useRef, useState } from "react";
import QRCode from "qrcode";

interface CertificateCanvasProps {
  studentName: string;
  courseTitle: string;
  courseLevel: string;
  issuedAt: string | Date;
  certificateUid: string;
  readOnly?: boolean;
}

export default function CertificateCanvas({
  studentName,
  courseTitle,
  courseLevel,
  issuedAt,
  certificateUid,
  readOnly = false,
}: CertificateCanvasProps) {
  const canvasRef = useRef<HTMLCanvasElement>(null);
  const [qrCodeUrl, setQrCodeUrl] = useState<string | null>(null);
  const [fontsLoaded, setFontsLoaded] = useState(false);

  // Generate QR Code
  useEffect(() => {
    if (!certificateUid) return;
    const origin = typeof window !== "undefined" ? window.location.origin : "";
    const verifyUrl = `${origin}/verify/${certificateUid}`;
    QRCode.toDataURL(verifyUrl, {
      margin: 1,
      width: 120,
      color: {
        dark: "#060814",
        light: "#ffffff",
      },
    })
      .then((url) => setQrCodeUrl(url))
      .catch((err) => console.error("QR Code generation error:", err));
  }, [certificateUid]);

  // Ensure Google Fonts are active
  useEffect(() => {
    if (typeof document !== "undefined") {
      // Check if fonts are loaded
      document.fonts.ready.then(() => {
        setFontsLoaded(true);
      });
    }
  }, []);

  // Draw Certificate
  useEffect(() => {
    const canvas = canvasRef.current;
    if (!canvas) return;

    const ctx = canvas.getContext("2d");
    if (!ctx) return;

    // Set high-DPI scaling (canvas internal dimensions 1000x700)
    canvas.width = 1000;
    canvas.height = 700;

    // ─── 1. Deep Space Nebula Background ───
    const grad = ctx.createLinearGradient(0, 0, 1000, 700);
    grad.addColorStop(0, "#050610");
    grad.addColorStop(0.5, "#0b0c1b");
    grad.addColorStop(1, "#050610");
    ctx.fillStyle = grad;
    ctx.fillRect(0, 0, 1000, 700);

    // Draw Nebula Glow Circles
    const drawNebula = (x: number, y: number, r: number, color: string) => {
      const g = ctx.createRadialGradient(x, y, 10, x, y, r);
      g.addColorStop(0, color);
      g.addColorStop(1, "transparent");
      ctx.fillStyle = g;
      ctx.beginPath();
      ctx.arc(x, y, r, 0, Math.PI * 2);
      ctx.fill();
    };

    drawNebula(200, 350, 250, "rgba(123, 47, 247, 0.12)"); // Purple left
    drawNebula(800, 350, 250, "rgba(0, 217, 255, 0.08)");  // Cyan right
    drawNebula(500, 100, 150, "rgba(150, 50, 250, 0.08)");  // Violet center

    // Draw twinkling background stars
    ctx.fillStyle = "rgba(255, 255, 255, 0.4)";
    const starCoords = [
      [120, 80], [150, 250], [90, 480], [800, 100], [880, 220],
      [920, 500], [450, 80], [550, 600], [280, 620], [750, 620]
    ];
    starCoords.forEach(([x, y]) => {
      ctx.beginPath();
      ctx.arc(x, y, Math.random() * 1.5 + 0.5, 0, Math.PI * 2);
      ctx.fill();
    });

    // ─── 2. Golden Framed Borders ───
    // Outer Border
    ctx.strokeStyle = "rgba(255, 184, 0, 0.2)";
    ctx.lineWidth = 2;
    ctx.strokeRect(20, 20, 960, 660);

    // Inner Double-Line Border
    ctx.strokeStyle = "rgba(255, 184, 0, 0.45)";
    ctx.lineWidth = 1;
    ctx.strokeRect(30, 30, 940, 640);
    ctx.strokeStyle = "rgba(255, 184, 0, 0.6)";
    ctx.lineWidth = 3;
    ctx.strokeRect(34, 34, 932, 632);

    // Corner Ornaments
    const drawCorner = (x: number, y: number, xDir: number, yDir: number) => {
      ctx.strokeStyle = "#ffb800";
      ctx.lineWidth = 3;
      ctx.beginPath();
      ctx.moveTo(x, y + yDir * 30);
      ctx.lineTo(x, y);
      ctx.lineTo(x + xDir * 30, y);
      ctx.stroke();

      ctx.beginPath();
      ctx.arc(x + xDir * 12, y + yDir * 12, 4, 0, Math.PI * 2);
      ctx.fillStyle = "#ffb800";
      ctx.fill();
    };
    drawCorner(34, 34, 1, 1);
    drawCorner(966, 34, -1, 1);
    drawCorner(34, 666, 1, -1);
    drawCorner(966, 666, -1, -1);

    // ─── 3. Header Logo & Academy Name ───
    // Draw Logo Symbol
    ctx.strokeStyle = "rgba(0, 217, 255, 0.6)";
    ctx.lineWidth = 2;
    ctx.beginPath();
    ctx.arc(500, 90, 22, 0, Math.PI * 2);
    ctx.stroke();
    // Orbit ellipse
    ctx.strokeStyle = "rgba(255, 184, 0, 0.8)";
    ctx.beginPath();
    ctx.ellipse(500, 90, 32, 10, Math.PI / 6, 0, Math.PI * 2);
    ctx.stroke();
    // Center glow star
    ctx.fillStyle = "#ffffff";
    ctx.beginPath();
    ctx.arc(500, 90, 4, 0, Math.PI * 2);
    ctx.fill();

    // Academy Name
    ctx.fillStyle = "#ffffff";
    ctx.textAlign = "center";
    ctx.font = "24px 'Orbitron', 'Inter', sans-serif";
    ctx.fillText("NEXUS ORBIT ACADEMY", 500, 150);

    // Subtitle
    ctx.fillStyle = "#8b8fa8";
    ctx.font = "11px 'Inter', sans-serif";
    ctx.fillText("DEPARTMENT OF ADVANCED COSMIC STUDY & TECHNOLOGY", 500, 172);

    // ─── 4. Certificate Content ───
    // Title
    ctx.fillStyle = "#ffb800";
    ctx.font = "bold 32px 'Orbitron', 'Inter', sans-serif";
    ctx.fillText("CERTIFICATE OF COMPLETION", 500, 235);

    // Presentation text
    ctx.fillStyle = "#e8e8f0";
    ctx.font = "italic 16px 'Inter', sans-serif";
    ctx.fillText("This certificate is proudly awarded to", 500, 290);

    // Student Name
    ctx.fillStyle = "#ffffff";
    ctx.font = "bold 40px 'Orbitron', 'Inter', sans-serif";
    ctx.fillText(studentName, 500, 345);

    // Name separator line
    ctx.strokeStyle = "rgba(255, 255, 255, 0.15)";
    ctx.lineWidth = 1;
    ctx.beginPath();
    ctx.moveTo(350, 365);
    ctx.lineTo(650, 365);
    ctx.stroke();

    // Accomplishment Description
    ctx.fillStyle = "#8b8fa8";
    ctx.font = "14px 'Inter', sans-serif";
    ctx.fillText("for outstanding performance and successful completion of the academic course", 500, 398);

    // Course Title
    ctx.fillStyle = "#00d9ff";
    ctx.font = "bold 26px 'Orbitron', 'Inter', sans-serif";
    ctx.fillText(courseTitle, 500, 442);

    // Level
    ctx.fillStyle = "#e8e8f0";
    ctx.font = "13px 'Inter', sans-serif";
    ctx.fillText(`Course Level: ${courseLevel}`, 500, 475);

    // ─── 5. Signatures and Date ───
    // Date of issue (Left)
    const dateStr = new Date(issuedAt).toLocaleDateString("en-US", {
      year: "numeric",
      month: "long",
      day: "numeric",
    });
    ctx.fillStyle = "#8b8fa8";
    ctx.font = "12px 'Inter', sans-serif";
    ctx.fillText("DATE OF ISSUE", 220, 588);
    ctx.fillStyle = "#ffffff";
    ctx.font = "bold 13px 'Inter', sans-serif";
    ctx.fillText(dateStr, 220, 560);
    ctx.strokeStyle = "rgba(255, 255, 255, 0.2)";
    ctx.lineWidth = 1;
    ctx.beginPath();
    ctx.moveTo(130, 572);
    ctx.lineTo(310, 572);
    ctx.stroke();

    // Signatures (Right)
    ctx.fillStyle = "#8b8fa8";
    ctx.font = "12px 'Inter', sans-serif";
    ctx.fillText("ACADEMY DIRECTOR", 780, 588);
    // Draw signature vector path
    ctx.strokeStyle = "rgba(0, 217, 255, 0.6)";
    ctx.lineWidth = 2;
    ctx.beginPath();
    ctx.moveTo(700, 560);
    ctx.quadraticCurveTo(730, 530, 760, 555);
    ctx.quadraticCurveTo(790, 575, 820, 545);
    ctx.quadraticCurveTo(830, 535, 850, 558);
    ctx.stroke();
    ctx.strokeStyle = "rgba(255, 255, 255, 0.2)";
    ctx.lineWidth = 1;
    ctx.beginPath();
    ctx.moveTo(690, 572);
    ctx.lineTo(870, 572);
    ctx.stroke();

    // ─── 6. Verification Details & QR Code ───
    // Certificate UID at bottom
    ctx.fillStyle = "#8b8fa8";
    ctx.font = "11px 'Inter', sans-serif";
    ctx.fillText(`VERIFICATION UID: ${certificateUid}`, 500, 650);

    // Draw QR code image
    if (qrCodeUrl) {
      const qrImg = new Image();
      qrImg.src = qrCodeUrl;
      qrImg.onload = () => {
        // Draw centered QR Code above date/sigs, size 80x80
        ctx.drawImage(qrImg, 460, 510, 80, 80);
      };
    }
  }, [studentName, courseTitle, courseLevel, issuedAt, certificateUid, qrCodeUrl, fontsLoaded]);

  // Export Canvas as image download
  const handleDownload = () => {
    const canvas = canvasRef.current;
    if (!canvas) return;
    const url = canvas.toDataURL("image/png");
    const link = document.createElement("a");
    link.download = `Certificate_${courseTitle.replace(/\s+/g, "_")}.png`;
    link.href = url;
    link.click();
  };

  return (
    <div className="flex flex-col items-center gap-5 w-full">
      {/* Canvas visual preview with scaling bounds */}
      <div className="w-full max-w-3xl overflow-hidden rounded-xl border border-white/10 shadow-2xl relative" style={{ aspectRatio: "10/7" }}>
        <canvas
          ref={canvasRef}
          className="w-full h-full block bg-gray-950"
          style={{ width: "100%", height: "auto" }}
        />
      </div>

      {!readOnly && (
        <div className="flex gap-3">
          <button
            onClick={handleDownload}
            className="btn-gold px-6 py-2.5 flex items-center gap-2 shadow-lg cursor-pointer"
          >
            <span>📥</span> Download Certificate (PNG)
          </button>
        </div>
      )}
    </div>
  );
}
