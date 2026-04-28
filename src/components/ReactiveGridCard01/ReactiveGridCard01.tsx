import { useCallback, useEffect, useRef, useState } from "react";
import "./ReactiveGridCard01.css";

type ReactiveGridCard01Props = {
  eyebrowText?: string;
  title: string;
  description: string;
  cols?: number;
  rows?: number;
  highlightColor?: string;
  overlayImage?: { src: string; alt?: string };
  overlayImageSrc?: string;
};

const DEFAULT_OVERLAY_IMAGE_SRC =
  "https://cdn.creazilla.com/cliparts/10000065703/olympic-rings-white-xl.png";

function isPlaceholderAsset(src: string | undefined) {
  if (!src) return true;
  const normalized = src.trim().toLowerCase();
  if (!normalized) return true;
  return (
    normalized.includes("placeholder.svg") ||
    normalized.includes("/placeholder") ||
    normalized.includes("placeholder-image") ||
    normalized.includes("image_placeholder")
  );
}

function pickOverlaySrc(
  imageSrc: string | undefined,
  fallbackSrc: string | undefined
) {
  if (imageSrc && !isPlaceholderAsset(imageSrc)) return imageSrc;
  return fallbackSrc || DEFAULT_OVERLAY_IMAGE_SRC;
}

export function ReactiveGridCard01({
  eyebrowText = "1.3",
  title,
  description,
  cols = 32,
  rows = 19,
  highlightColor = "#88dc00",
  overlayImage,
  overlayImageSrc
}: ReactiveGridCard01Props) {
  const gridRef = useRef<HTMLDivElement>(null);
  const [mouse, setMouse] = useState<{ x: number; y: number } | null>(null);
  const [hovering, setHovering] = useState(false);

  const [imgPos, setImgPos] = useState({ x: 0, y: 0 });
  const targetRef = useRef({ x: 0, y: 0 });
  const rafRef = useRef<number | null>(null);

  const handleMove = useCallback((e: React.MouseEvent<HTMLDivElement>) => {
    const rect = gridRef.current?.getBoundingClientRect();
    if (!rect) return;
    const x = e.clientX - rect.left;
    const y = e.clientY - rect.top;
    setMouse({ x, y });

    const normX = (x / rect.width) * 2 - 1;
    const normY = (y / rect.height) * 2 - 1;
    targetRef.current = { x: normX * 32, y: normY * 20 };
  }, []);

  const handleEnter = useCallback(() => setHovering(true), []);
  const handleLeave = useCallback(() => {
    setHovering(false);
    setMouse(null);
    targetRef.current = { x: 0, y: 0 };
  }, []);

  useEffect(() => {
    const tick = () => {
      setImgPos((prev) => {
        const t = targetRef.current;
        const nx = prev.x + (t.x - prev.x) * 0.08;
        const ny = prev.y + (t.y - prev.y) * 0.08;
        const settled = Math.abs(nx - t.x) < 0.05 && Math.abs(ny - t.y) < 0.05;
        return settled ? t : { x: nx, y: ny };
      });
      rafRef.current = requestAnimationFrame(tick);
    };
    rafRef.current = requestAnimationFrame(tick);
    return () => {
      if (rafRef.current) cancelAnimationFrame(rafRef.current);
    };
  }, []);

  const radius = 130;
  const safeCols = Math.max(1, Math.floor(cols));
  const safeRows = Math.max(1, Math.floor(rows));
  const resolvedOverlaySrc = pickOverlaySrc(overlayImage?.src, overlayImageSrc);
  const resolvedOverlayAlt = overlayImage?.alt || "Overlay image";

  return (
    <div className="reactive-grid-card">
      <div
        ref={gridRef}
        onMouseMove={handleMove}
        onMouseEnter={handleEnter}
        onMouseLeave={handleLeave}
        className="reactive-grid-card-left"
      >
        <div className="reactive-grid-card-number">{eyebrowText}</div>

        <div
          className="reactive-grid-card-grid"
          style={{ gridTemplateColumns: `repeat(${safeCols}, 1fr)` }}
        >
          {Array.from({ length: safeCols * safeRows }).map((_, i) => {
            const col = i % safeCols;
            const row = Math.floor(i / safeCols);
            let scale = 1;
            let opacity = 0.14;
            let isHighlight = false;

            if (mouse && gridRef.current) {
              const rect = gridRef.current.getBoundingClientRect();
              const cellW = (rect.width - 64) / safeCols;
              const cellH = cellW;
              const cx = 32 + col * cellW + cellW / 2;
              const cy = 64 + row * cellH + cellH / 2;
              const dx = mouse.x - cx;
              const dy = mouse.y - cy;
              const dist = Math.sqrt(dx * dx + dy * dy);

              if (dist < radius) {
                const t = 1 - dist / radius;
                scale = 0.6 + t * 1.4;
                opacity = 0.2 + t * 0.8;
                isHighlight = true;
              }
            }

            return (
              <div
                key={i}
                className="reactive-grid-card-cell"
                style={{
                  backgroundColor: isHighlight ? highlightColor : "#8a8a8a",
                  transform: `scale(${scale})`,
                  opacity
                }}
              />
            );
          })}
        </div>

        <div className="reactive-grid-card-overlay">
          <img
            src={resolvedOverlaySrc}
            alt={resolvedOverlayAlt}
            className="reactive-grid-card-image"
            style={{
              transform: `translate3d(${imgPos.x}px, ${imgPos.y}px, 0)`,
              filter: hovering
                ? "drop-shadow(0 8px 24px rgba(0,0,0,0.35))"
                : "none"
            }}
            draggable={false}
          />
        </div>
      </div>

      <div className="reactive-grid-card-right">
        <h3>{title}</h3>
        <p>{description}</p>
      </div>
    </div>
  );
}

export type { ReactiveGridCard01Props };
