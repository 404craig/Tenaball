// A tiny test runner: named checks, a pass/fail summary, and a non-zero exit code when anything fails.
const results = [];
export async function test(name, fn){
  if (process.env.ONLY && !name.includes(process.env.ONLY)) return; // ONLY=text runs just the checks whose names contain it
  const t0 = Date.now();
  try { await fn(); results.push({ name, ok: true }); console.log(`  ✓ ${name} (${Date.now() - t0}ms)`); }
  catch (e) { results.push({ name, ok: false, e }); console.log(`  ✗ ${name}\n    ${String(e && e.stack || e).split("\n").slice(0, 4).join("\n    ")}`); }
}
export function assert(cond, msg){ if (!cond) throw new Error(msg || "assertion failed"); }
export function eq(a, b, msg){ if (JSON.stringify(a) !== JSON.stringify(b)) throw new Error(`${msg || "not equal"}: got ${JSON.stringify(a)}, expected ${JSON.stringify(b)}`); }
export function report(){
  const bad = results.filter(r => !r.ok);
  console.log(`\n${results.length - bad.length} passed, ${bad.length} failed`);
  if (bad.length) process.exitCode = 1;
  return bad.length;
}
