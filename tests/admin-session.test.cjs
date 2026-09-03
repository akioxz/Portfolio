const fs = require("fs");
const path = require("path");
const test = require("node:test");
const assert = require("node:assert/strict");
const vm = require("vm");
const ts = require(
  "C:\\Users\\User\\Documents\\Personal Projects\\portfolio\\node_modules\\typescript",
);

const sessionPath = path.resolve(
  "C:\\Users\\User\\Documents\\Personal Projects\\portfolio\\lib\\admin-session.ts",
);
const source = fs
  .readFileSync(sessionPath, "utf8")
  .replace(/^import .*?;\r?\n/gm, "")
  .replace(/export /g, "");
const compiled =
  ts.transpileModule(
    `const { jwtVerify } = require("jose");\n${source}\nmodule.exports = { verifyAdminSessionToken, getAdminSessionSecret };`,
    {
      compilerOptions: {
        module: ts.ModuleKind.CommonJS,
        target: ts.ScriptTarget.ES2020,
      },
    },
  ).outputText;

const jose = require(
  "C:\\Users\\User\\Documents\\Personal Projects\\portfolio\\node_modules\\jose",
);
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
vm.runInNewContext(compiled, context, { filename: sessionPath });
const { verifyAdminSessionToken } = context.module.exports;

const secret = "test-admin-session-secret";
const issuer = "akio-portfolio-admin";
const audience = "akio-portfolio-admin";

async function createToken(overrides = {}) {
  return new jose.SignJWT({})
    .setProtectedHeader({ alg: "HS256" })
    .setIssuedAt()
    .setIssuer(overrides.issuer || issuer)
    .setAudience(overrides.audience || audience)
    .setExpirationTime(overrides.expiration || "1h")
    .sign(new TextEncoder().encode(secret));
}

test("rejects sessions when the secret is missing", async () => {
  runtimeProcess.env = {};
  assert.equal(await verifyAdminSessionToken("not-a-token"), false);
});

test("rejects malformed, expired, and wrong-audience sessions", async () => {
  runtimeProcess.env = { ADMIN_SESSION_SECRET: secret };
  assert.equal(await verifyAdminSessionToken("not-a-token"), false);
  assert.equal(
    await verifyAdminSessionToken(
      await createToken({ expiration: "0s" }),
    ),
    false,
  );
  assert.equal(
    await verifyAdminSessionToken(
      await createToken({ audience: "wrong-audience" }),
    ),
    false,
  );
});

test("accepts a valid session with the expected claims", async () => {
  runtimeProcess.env = { ADMIN_SESSION_SECRET: secret };
  assert.equal(await verifyAdminSessionToken(await createToken()), true);
});
