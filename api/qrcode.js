const QRCode = require("qrcode");

// CORS headers pre-applied on every response
const CORS = {
  "Access-Control-Allow-Origin": "*",
  "Access-Control-Allow-Methods": "GET, OPTIONS",
  "Access-Control-Allow-Headers": "Content-Type",
};

// ── Helpers ──────────────────────────────────────────────────────────

/**
 * Validate & clamp a size parameter (min 50, max 4000, default 300).
 */
function parseSize(raw) {
  const n = parseInt(raw, 10);
  if (isNaN(n) || n < 50) return 300;
  if (n > 4000) return 4000;
  return n;
}

/**
 * Validate a hex color string (6 hex digits, no #).
 * Returns the (optionally defaulted) valid hex, or null.
 */
function parseColor(raw, defaultHex) {
  if (!raw || typeof raw !== "string") return defaultHex;
  const m = raw.match(/^[0-9A-Fa-f]{6}$/);
  return m ? m[0] : null;
}

/**
 * Validate error correction level.
 */
const EC_LEVELS = new Set(["L", "M", "Q", "H"]);
function parseErrorCorrection(raw) {
  if (!raw) return "M";
  const upper = raw.toUpperCase();
  return EC_LEVELS.has(upper) ? upper : null;
}

// ── Handler ──────────────────────────────────────────────────────────

module.exports = async function handler(req, res) {
  // OPTIONS preflight
  if (req.method === "OPTIONS") {
    res.writeHead(204, CORS);
    return res.end();
  }

  if (req.method !== "GET") {
    res.writeHead(405, { ...CORS, "Content-Type": "application/json" });
    return res.end(JSON.stringify({ error: "Method not allowed. Use GET." }));
  }

  // ── Parse query parameters ────────────────────────────────────
  const { searchParams } = new URL(req.url, "http://localhost");

  const text = searchParams.get("text");
  if (!text || text.trim().length === 0) {
    res.writeHead(400, { ...CORS, "Content-Type": "application/json" });
    return res.end(JSON.stringify({ error: "Missing required parameter: text" }));
  }

  const size = parseSize(searchParams.get("size"));
  const color = parseColor(searchParams.get("color"), "000000");
  if (color === null) {
    res.writeHead(400, { ...CORS, "Content-Type": "application/json" });
    return res.end(JSON.stringify({ error: "Invalid color format. Use 6 hex digits, e.g. FF0000" }));
  }
  const bg = parseColor(searchParams.get("bg"), "ffffff");
  if (bg === null) {
    res.writeHead(400, { ...CORS, "Content-Type": "application/json" });
    return res.end(JSON.stringify({ error: "Invalid bg format. Use 6 hex digits, e.g. FFFFFF" }));
  }
  const ec = parseErrorCorrection(searchParams.get("ec"));
  if (ec === null) {
    res.writeHead(400, { ...CORS, "Content-Type": "application/json" });
    return res.end(JSON.stringify({ error: "Invalid errorCorrection. Use L, M, Q, or H." }));
  }

  const opts = {
    width: size,
    margin: searchParams.has("margin") ? Math.max(0, Math.min(10, parseInt(searchParams.get("margin"), 10) || 4)) : 4,
    color: { dark: `#${color}`, light: `#${bg}` },
    errorCorrectionLevel: ec,
  };

  try {
    const pngBuffer = await QRCode.toBuffer(text, { ...opts, type: "png" });

    res.writeHead(200, {
      ...CORS,
      "Content-Type": "image/png",
      "Content-Length": pngBuffer.length,
      "Cache-Control": "public, max-age=86400, s-maxage=86400",
    });
    res.end(pngBuffer);
  } catch (err) {
    res.writeHead(500, { ...CORS, "Content-Type": "application/json" });
    res.end(JSON.stringify({ error: "QR code generation failed", detail: err.message }));
  }
};
