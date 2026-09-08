"use client";

import Link from "next/link";
import { useEffect, useState } from "react";
import { Logo } from "./Logo";
import { getOrCreateBurnerAccount } from "@/lib/wallet";

const NAV = [
  { href: "/", label: "The Docket" },
  { href: "/submit", label: "Submit" },
  { href: "/rulebook", label: "Rulebook" },
];

function shortenAddress(address: string) {
  return `${address.slice(0, 6)}…${address.slice(-4)}`;
}

export function Header() {
  const [address, setAddress] = useState<string | null>(null);

  useEffect(() => {
    try {
      const account = getOrCreateBurnerAccount();
      setAddress((account as { address: string }).address);
    } catch {
      // Ignore — address badge is a nice-to-have, not load-bearing.
    }
  }, []);

  return (
    <header className="border-b border-hairline">
      <div className="mx-auto flex max-w-5xl items-center justify-between px-6 py-5">
        <Link href="/" className="text-ink no-underline">
          <Logo withWordmark className="h-7 w-7 text-ink" />
        </Link>
        <div className="flex items-center gap-6">
          <nav className="flex items-center gap-6 font-sans text-sm text-ink-muted">
            {NAV.map((item) => (
              <Link key={item.href} href={item.href} className="no-underline hover:text-ink">
                {item.label}
              </Link>
            ))}
          </nav>
          {address && (
            <span
              className="rounded-sm border border-hairline px-2.5 py-1 font-mono text-xs text-ink-muted"
              title={address}
            >
              {shortenAddress(address)}
            </span>
          )}
        </div>
      </div>
    </header>
  );
}
