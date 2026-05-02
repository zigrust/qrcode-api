# QR Code API

**Minimal, fast QR code generation API built for Vercel serverless functions.**

> `GET /api/qrcode?text=Hello+World` → 🖼️ PNG

---

## 🚀 Quick Start

```bash
npm install
vercel dev
```

Opens at `http://localhost:3000` — the root path serves a live demo page.

---

## 📖 API Reference

### `GET /api/qrcode`

Generate a QR code PNG image.

#### Required Parameter

| Param  | Type   | Description              |
|--------|--------|--------------------------|
| `text` | string | Text or URL to encode    |

#### Optional Parameters

| Param    | Type   | Default  | Description                                    |
|----------|--------|----------|------------------------------------------------|
| `size`   | number | `300`    | Image dimensions in pixels (50–4000)            |
| `color`  | hex    | `000000` | Foreground color — 6 hex digits, no `#`        |
| `bg`     | hex    | `ffffff` | Background color — 6 hex digits, no `#`        |
| `ec`     | string | `M`      | Error correction: `L`, `M`, `Q`, or `H`        |
| `margin` | number | `4`      | Quiet zone margin (0–10)                       |

#### Response

- **200** — `image/png` binary
- **400** — `{ "error": "…" }` (missing or invalid parameters)
- **405** — Method not allowed
- **500** — Generation failure

#### Examples

```bash
# Basic QR code
curl -o qr.png "https://your-domain.vercel.app/api/qrcode?text=https://example.com"

# Custom size & colors
curl -o qr.png "https://your-domain.vercel.app/api/qrcode?text=Hello&size=512&color=FF0000&bg=FFFF00"

# High error correction (useful when overlaying logos)
curl -o qr.png "https://your-domain.vercel.app/api/qrcode?text=https://long-url.example&ec=H"
```

```html
<!-- In an <img> tag -->
<img src="https://your-domain.vercel.app/api/qrcode?text=https://example.com&size=200&color=4F46E5" />
```

---

## 💰 Pricing & API Keys

The public endpoint is rate-limited by Vercel's fair-use policy.

For **unlimited production usage**, purchase an API key:

- **50 USDT** (one-time payment, unlimited requests forever)

### How to get a key

1. Send **50 USDT** on the **Polygon (MATIC)** network to:
   ```
   0xa817391A3D3530E034294A66232481bd77978775
   ```
2. Email your **transaction hash** to `api@qrcode.xyz`
3. Receive your API key within 24 hours

API keys are passed via the `Authorization: Bearer <key>` header or `?key=<key>` query parameter.

---

## 📁 Project Structure

```
qrcode-api/
├── api/
│   └── qrcode.js          # Serverless function (GET /api/qrcode)
├── public/
│   └── index.html          # Landing page + live demo
├── vercel.json             # Vercel deployment config
├── package.json
└── README.md
```

---

## 🛠 Deployment

### One-click Vercel

[![Deploy with Vercel](https://vercel.com/button)](https://vercel.com/new/clone?repository-url=https://github.com/your-org/qrcode-api)

### Manual

```bash
npm install -g vercel
vercel login
vercel
```

---

## 🔧 Tech Stack

- **Runtime:** Node.js 20
- **QR Library:** [`qrcode`](https://www.npmjs.com/package/qrcode) v1.5.x
- **Platform:** Vercel serverless functions
- **No framework** — zero overhead, maximum cold-start performance

---

## 📜 License

MIT
