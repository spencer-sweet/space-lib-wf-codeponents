import { useCallback, useEffect, useRef, useState } from "react";

type DitherImageProps = {
  image?: { src: string; alt?: string };
  src?: string | { src?: string; alt?: string };
  dither?: number;
  backgroundColor?: string;
  width?: number;
};

// Floyd-Steinberg error diffusion dither on a grayscale buffer.
// `amount` is 0-100 and scales how much error is propagated.
function applyDither(
  pixels: Uint8ClampedArray,
  width: number,
  height: number,
  amount: number
) {
  const buf = new Float32Array(width * height);
  for (let i = 0; i < buf.length; i++) {
    buf[i] =
      0.299 * pixels[i * 4] +
      0.587 * pixels[i * 4 + 1] +
      0.114 * pixels[i * 4 + 2];
  }

  const spread = amount / 100;
  for (let y = 0; y < height; y++) {
    for (let x = 0; x < width; x++) {
      const i = y * width + x;
      const oldPixel = buf[i];
      const next = oldPixel < 128 ? 0 : 255;
      buf[i] = next;
      const err = (oldPixel - next) * spread;

      if (x + 1 < width) buf[i + 1] += err * (7 / 16);
      if (y + 1 < height) {
        if (x > 0) buf[i + width - 1] += err * (3 / 16);
        buf[i + width] += err * (5 / 16);
        if (x + 1 < width) buf[i + width + 1] += err * (1 / 16);
      }
    }
  }

  const out = new Uint8Array(buf.length);
  for (let i = 0; i < out.length; i++) out[i] = buf[i] < 128 ? 0 : 255;
  return out;
}

function hexToRgb(hex: string) {
  const h = hex.replace("#", "");
  return [
    parseInt(h.slice(0, 2), 16),
    parseInt(h.slice(2, 4), 16),
    parseInt(h.slice(4, 6), 16)
  ] as const;
}

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

function isLikelyRenderableAsset(src: string | undefined) {
  if (!src) return false;
  const normalized = src.trim().toLowerCase();
  if (!normalized) return false;
  return (
    normalized.startsWith("http://") ||
    normalized.startsWith("https://") ||
    normalized.startsWith("data:") ||
    normalized.startsWith("blob:")
  );
}

function pickImageSource(
  imageSrc: string | undefined,
  fallbackSrc: string | undefined
) {
  const hasFallback = Boolean(fallbackSrc?.trim());
  const hasRealImage =
    !isPlaceholderAsset(imageSrc) && isLikelyRenderableAsset(imageSrc);

  if (hasRealImage) return imageSrc;
  if (hasFallback) return fallbackSrc;
  return imageSrc;
}

/**
 * DitherImage
 *
 * Props:
 *   image           - Webflow Image prop ({ src, alt }); preferred when present
 *   src             - image URL (supports crossOrigin: anonymous)
 *   dither          - 0-100, controls Floyd-Steinberg spread (default 97)
 *   backgroundColor - hex color behind the dithered layer (default #000000)
 *   width           - processing width cap for source image (default 800)
 *
 * The component fills its container (100% x 100%) and renders the image
 * with object-fit: cover semantics.
 */
export function DitherImage({
  image,
  src,
  dither = 97,
  backgroundColor = "#000000",
  width = 800
}: DitherImageProps) {
  const canvasRef = useRef<HTMLCanvasElement | null>(null);
  const sourceImageRef = useRef<HTMLImageElement | null>(null);
  const ditheredRef = useRef<HTMLCanvasElement | null>(null);
  const [imageVersion, setImageVersion] = useState(0);

  // Draw dithered image to display canvas with object-fit: cover semantics.
  const draw = useCallback(() => {
    const canvas = canvasRef.current;
    const dithered = ditheredRef.current;
    if (!canvas) return;

    const ctx = canvas.getContext("2d");
    if (!ctx) return;

    const dpr = window.devicePixelRatio || 1;
    const w = Math.round(canvas.clientWidth * dpr);
    const h = Math.round(canvas.clientHeight * dpr);
    if (w === 0 || h === 0) {
      requestAnimationFrame(draw);
      return;
    }

    if (canvas.width !== w || canvas.height !== h) {
      canvas.width = w;
      canvas.height = h;
    }

    const [bgR, bgG, bgB] = hexToRgb(backgroundColor);
    ctx.clearRect(0, 0, w, h);
    ctx.fillStyle = `rgb(${bgR}, ${bgG}, ${bgB})`;
    ctx.fillRect(0, 0, w, h);

    if (!dithered) return;

    const iw = dithered.width;
    const ih = dithered.height;
    if (iw === 0 || ih === 0) return;

    const scale = Math.max(w / iw, h / ih);
    const dw = iw * scale;
    const dh = ih * scale;
    const dx = (w - dw) / 2;
    const dy = (h - dh) / 2;

    ctx.imageSmoothingEnabled = false;
    ctx.drawImage(dithered, dx, dy, dw, dh);
  }, [backgroundColor]);

  // Load source image whenever src changes.
  useEffect(() => {
    const fallbackSrc = typeof src === "string" ? src : src?.src;
    const imageSrc = pickImageSource(image?.src, fallbackSrc);
    sourceImageRef.current = null;
    ditheredRef.current = null;
    if (!imageSrc) return;
    let cancelled = false;

    const img = new Image();
    img.crossOrigin = "anonymous";
    img.onload = () => {
      if (cancelled) return;
      sourceImageRef.current = img;
      setImageVersion((current) => current + 1);
    };

    img.src = imageSrc;
    return () => {
      cancelled = true;
    };
  }, [image, src]);

  // Process source image whenever controls change.
  useEffect(() => {
    const img = sourceImageRef.current;
    if (!img) return;

    const safeWidth = Math.max(1, Math.round(width));
    const pw = Math.min(safeWidth, img.naturalWidth);
    const ph = Math.round(img.naturalHeight * (pw / img.naturalWidth));

    const off = document.createElement("canvas");
    off.width = pw;
    off.height = ph;

    const ctx = off.getContext("2d", { willReadFrequently: true });
    if (!ctx) return;

    ctx.drawImage(img, 0, 0, pw, ph);
    const { data } = ctx.getImageData(0, 0, pw, ph);

    const clampedDither = Math.min(100, Math.max(0, dither));
    const pixels = applyDither(data, pw, ph, clampedDither);

    const outImage = ctx.createImageData(pw, ph);
    const out = outImage.data;
    const [bgR, bgG, bgB] = hexToRgb(backgroundColor);
    for (let i = 0; i < pixels.length; i++) {
      const g = pixels[i];
      const p = i * 4;
      // Match "lighten over background": max(gray, bg) per channel.
      out[p] = Math.max(g, bgR);
      out[p + 1] = Math.max(g, bgG);
      out[p + 2] = Math.max(g, bgB);
      out[p + 3] = 255;
    }
    ctx.putImageData(outImage, 0, 0);

    ditheredRef.current = off;
    draw();
    requestAnimationFrame(draw);
  }, [imageVersion, dither, width, backgroundColor, draw]);

  // Redraw when only background color changes.
  useEffect(() => {
    draw();
  }, [backgroundColor, draw]);

  // Redraw on container resize (window resize and layout reflows).
  useEffect(() => {
    const canvas = canvasRef.current;
    if (!canvas) return;

    const obs = new ResizeObserver(draw);
    obs.observe(canvas);
    draw();
    requestAnimationFrame(draw);
    return () => obs.disconnect();
  }, [draw]);

  return (
    <canvas
      ref={canvasRef}
      style={{ display: "block", width: "100%", height: "100%" }}
    />
  );
}

export type { DitherImageProps };
