import { describe, it, expect } from "vitest";
import { readFileSync, readdirSync, statSync, existsSync } from "fs";
import { join, relative } from "path";
import { INTEREST_SETTING_DISCLOSURE, HERO_NOT_INVESTMENT_LINE } from "@/lib/complianceCopy";
import { TRN_MINT_ADDRESS } from "@/lib/airdropConstants";
import * as airdropConstants from "@/lib/airdropConstants";

const ROOT = join(__dirname, "..", "..", "..");
const SRC = join(ROOT, "src");

// User-facing source: everything under src except generated types, tests, and archived files.
const SKIP = [/[\\/]integrations[\\/]/, /[\\/]__tests__[\\/]/, /[\\/]_archive[\\/]/, /complianceCopy\.ts$/];
function walk(dir: string, out: string[] = []): string[] {
  for (const name of readdirSync(dir)) {
    const p = join(dir, name);
    if (statSync(p).isDirectory()) walk(p, out);
    else if (/\.(tsx?|json)$/.test(name) && !SKIP.some((r) => r.test(p))) out.push(p);
  }
  return out;
}
const files = [...walk(SRC), join(ROOT, "index.html"), join(ROOT, "public", "token-metadata.json")];
const corpus = files.map((f) => ({ f: relative(ROOT, f), text: readFileSync(f, "utf8") }));

function offenders(pattern: RegExp) {
  return corpus.filter(({ text }) => pattern.test(text)).map(({ f }) => f);
}

describe("compliance copy", () => {
  it("uses the exact owner-approved interest-setting sentence", () => {
    expect(INTEREST_SETTING_DISCLOSURE).toBe(
      "The token has a display-only interest setting from its creation. It does not create or pay tokens."
    );
  });

  it("uses the exact owner-approved hero line", () => {
    expect(HERO_NOT_INVESTMENT_LINE).toBe(
      "$TRN rewards verified physical work. It is not an investment and carries no expectation of profit."
    );
  });

  it("keeps the official contract address", () => {
    expect(TRN_MINT_ADDRESS).toBe("Dm7FAcF4kzVgsrn6VPEp2C5bN3tGPkydpWaR26wtDR8m");
  });

  it("no longer exports the 15% / 1500 BPS rate constants", () => {
    expect("TRN_APY_RATE" in airdropConstants).toBe(false);
    expect("TRN_APY_BPS" in airdropConstants).toBe(false);
  });

  it("never mentions APY", () => expect(offenders(/\bAPY\b/)).toEqual([]));
  it("never describes the interest-bearing extension as a feature", () =>
    expect(offenders(/interest[- ]bearing/i)).toEqual([]));
  it("never uses the word yield", () => expect(offenders(/\byield(s|ing)?\b/i)).toEqual([]));
  it("never claims operations since 2019", () => expect(offenders(/since 2019/i)).toEqual([]));
  it("never claims the business is bonded", () => expect(offenders(/\bbonded\b/i)).toEqual([]));
  it("never uses the word growth", () => expect(offenders(/\bgrowth\b/i)).toEqual([]));
  it("never shows a market cap figure", () => expect(offenders(/market cap/i)).toEqual([]));
  it("never says a third-party audit is pending", () => expect(offenders(/audit pending/i)).toEqual([]));
  it("never uses mint-to-earn or minted-to-reward copy", () =>
    expect(offenders(/mint\s*=\s*earn|minted to reward|burn[- ]and[- ]mint/i)).toEqual([]));
  it("never claims token value grows with adoption", () => expect(offenders(/value grows/i)).toEqual([]));
  it("never offers staking for discounts", () => expect(offenders(/staking for discounts/i)).toEqual([]));
  it("never allocates revenue to buybacks", () =>
    expect(offenders(/strategic buybacks?|of revenue allocated|revenue\s*→\s*.*buyback/i)).toEqual([]));
});

describe("retired routes and files", () => {
  const app = readFileSync(join(SRC, "App.tsx"), "utf8");

  it("redirects /investors to the home page", () => {
    expect(app).toMatch(/path="\/investors" element=\{<Navigate to="\/" replace \/>\}/);
  });

  it("redirects /goblin-cave to the home page", () => {
    expect(app).toMatch(/path="\/goblin-cave" element=\{<Navigate to="\/" replace \/>\}/);
  });

  it("redirects the old /market price page to the token dashboard", () => {
    expect(app).toMatch(/path="\/market" element=\{<Navigate to="\/dashboard" replace \/>\}/);
  });

  it("no longer links to /investors anywhere", () => {
    expect(corpus.filter(({ f, text }) => f !== "src/App.tsx" && /["'`]\/investors["'`]/.test(text)).map((c) => c.f)).toEqual([]);
  });

  it("has removed the investor components and investors page", () => {
    expect(existsSync(join(SRC, "components", "investor"))).toBe(false);
    expect(existsSync(join(SRC, "pages", "Investors.tsx"))).toBe(false);
  });

  it("has removed the rate banner, growth counter, and Burn Band widget", () => {
    expect(existsSync(join(SRC, "components", "dashboard", "APYHeroBanner.tsx"))).toBe(false);
    expect(existsSync(join(SRC, "components", "dashboard", "TRNGrowthCard.tsx"))).toBe(false);
    expect(existsSync(join(SRC, "components", "ecosystem", "BurnBandIndicator.tsx"))).toBe(false);
    expect(existsSync(join(SRC, "components", "market", "DexScreenerChart.tsx"))).toBe(false);
  });
});
