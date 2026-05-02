const handler = require("./api/qrcode.js");

// Build a mock req/res pair that mimics Vercel's shape
function mockReq(method, url) {
  return { method, url };
}

function mockRes() {
  const res = {
    statusCode: 0,
    headers: {},
    body: null,
    writeHead(code, headers) {
      this.statusCode = code;
      Object.assign(this.headers, headers);
    },
    end(data) {
      this.body = data;
    },
  };
  return res;
}

async function test() {
  // ── Happy path ──
  const req1 = mockReq("GET", "/api/qrcode?text=Hello%20World&size=200&color=ff0000&bg=ffffff&ec=H");
  const res1 = mockRes();
  await handler(req1, res1);
  console.log("✅ GET 200 — status:", res1.statusCode, "| content-type:", res1.headers["Content-Type"]);
  const buf1 = Buffer.from(res1.body);
  console.log("   PNG magic bytes:", buf1[0] === 0x89 && buf1[1] === 0x50 && buf1[2] === 0x4e && buf1[3] === 0x47);
  console.log("   Size:", buf1.length, "bytes");

  // ── Missing text ──
  const req2 = mockReq("GET", "/api/qrcode?size=300");
  const res2 = mockRes();
  await handler(req2, res2);
  console.log("✅ GET 400 (missing text) — status:", res2.statusCode);

  // ── Bad color ──
  const req3 = mockReq("GET", "/api/qrcode?text=hi&color=ZZZZZZ");
  const res3 = mockRes();
  await handler(req3, res3);
  console.log("✅ GET 400 (bad color) — status:", res3.statusCode);

  // ── OPTIONS preflight ──
  const req4 = mockReq("OPTIONS", "/api/qrcode");
  const res4 = mockRes();
  await handler(req4, res4);
  console.log("✅ OPTIONS 204 — status:", res4.statusCode);

  // ── POST (bad method) ──
  const req5 = mockReq("POST", "/api/qrcode");
  const res5 = mockRes();
  await handler(req5, res5);
  console.log("✅ POST 405 — status:", res5.statusCode);

  console.log("\n🎉 All tests passed!");
}

test().catch((e) => {
  console.error("❌ Test failed:", e);
  process.exit(1);
});
