const fs = require("fs");
const path = require("path");
const test = require("node:test");
const assert = require("node:assert/strict");
const vm = require("vm");
const ts = require(
  "C:\\Users\\User\\Documents\\Personal Projects\\portfolio\\node_modules\\typescript",
);
const jose = require(
  "C:\\Users\\User\\Documents\\Personal Projects\\portfolio\\node_modules\\jose",
);

const root = "C:\\Users\\User\\Documents\\Personal Projects\\portfolio";
const sessionSource = fs
  .readFileSync(path.join(root, "lib", "admin-session.ts"), "utf8")
  .replace(/^import .*?;\r?\n/gm, "")
  .replace(/export /g, "");
const middlewareSource = fs
  .readFileSync(path.join(root, "proxy.ts"), "utf8")
  .replace(/^import .*?;\r?\n/gm, "")
  .replace(/export /g, "");
const source = `
const { jwtVerify } = require("jose");
const NextResponse = {
  next: () => ({ type: "next", status: 200 }),
  json: (body, init) => ({ type: "json", body, status: init.status }),
  redirect: (url) => ({ type: "redirect", url: url.toString(), status: 307 }),
};
${sessionSource}
${middlewareSource}
module.exports = { proxy, config };
`;
const compiled = ts.transpileModule(source, {
  compilerOptions: {
    module: ts.ModuleKind.CommonJS,
    target: ts.ScriptTarget.ES2020,
  },
}).outputText;

const runtimeProcess = { env: {} };
const context = {
  console,
  process: runtimeProcess,
  TextEncoder,
  crypto: globalThis.crypto,
  require(name) {
    if (name === "jose") return jose;
    throw new Error(`Unexpected module: ${name}`);
  },
  module: { exports: {} },
};
context.exports = context.module.exports;
vm.runInNewContext(compiled, context, { filename: path.join(root, "proxy.ts") });
const { proxy, config } = context.module.exports;

const secret = "test-admin-session-secret";
const issuer = "akio-portfolio-admin";
const audience = "akio-portfolio-admin";

async function createToken(expiration = "1h") {
  return new jose.SignJWT({})
    .setProtectedHeader({ alg: "HS256" })
    .setIssuedAt()
    .setIssuer(issuer)
    .setAudience(audience)
    .setExpirationTime(expiration)
    .sign(new TextEncoder().encode(secret));
}

function request(pathname, token) {
  const url = new URL(`https://example.com${pathname}`);
  return {
    nextUrl: {
      pathname: url.pathname,
      clone() {
        const clone = new URL(url);
        return clone;
      },
    },
    cookies: {
      get(name) {
        return token && name === "admin_session" ? { value: token } : undefined;
      },
    },
  };
}

test("uses the narrow admin matcher", () => {
  assert.equal(
    JSON.stringify(config.matcher),
    JSON.stringify(["/admin/:path*", "/api/admin/:path*"]),
  );
});

test("allows login and logout entrypoints without a session", async () => {
  for (const pathname of ["/admin/login", "/api/admin/login", "/api/admin/logout"]) {
    const response = await proxy(request(pathname));
    assert.equal(response.type, "next");
    assert.equal(response.status, 200);
  }
});

test("redirects unauthenticated admin pages and rejects admin APIs", async () => {
  const pageResponse = await proxy(request("/admin/inbox"));
  assert.equal(pageResponse.type, "redirect");
  assert.equal(pageResponse.status, 307);
  assert.equal(pageResponse.url, "https://example.com/admin/login");

  const apiResponse = await proxy(request("/api/admin/messages/test/read"));
  assert.equal(apiResponse.type, "json");
  assert.equal(apiResponse.status, 401);
  assert.equal(JSON.stringify(apiResponse.body), '{"error":"Unauthorized"}');
});

test("rejects forged and expired sessions", async () => {
  runtimeProcess.env = { ADMIN_SESSION_SECRET: secret };
  const forgedResponse = await proxy(request("/admin/inbox", "not-a-token"));
  assert.equal(forgedResponse.status, 307);
  assert.equal(
    (await proxy(request("/api/admin/messages/test/read", await createToken("0s"))))
      .status,
    401,
  );
});

test("allows a valid session through", async () => {
  runtimeProcess.env = { ADMIN_SESSION_SECRET: secret };
  const response = await proxy(
    request("/admin/inbox", await createToken()),
  );
  assert.equal(response.type, "next");
  assert.equal(response.status, 200);
});
