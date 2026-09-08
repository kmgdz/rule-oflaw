import { createAccount, generatePrivateKey } from "genlayer-js";

const STORAGE_KEY = "rule-of-law:burner-pk";

/**
 * Zero-friction demo wallet: generates a private key in the browser and
 * persists it in localStorage so judges (or you, in a demo) never need
 * to install or fund an external wallet extension to try the app.
 *
 * Note: genlayer-js's createAccount() does not return the private key on
 * the account object it hands back, so the key has to be generated
 * separately with generatePrivateKey() and stored ourselves, then passed
 * into createAccount(privateKey) to reconstruct the same signer next time.
 *
 * This is intentionally NOT how you'd handle keys in production — it's
 * a hackathon-appropriate tradeoff, called out explicitly in the README.
 * Swap this for a real wallet connection (MetaMask/Rabby via genlayer-js's
 * external signer support) before this touches real value.
 */
export function getOrCreateBurnerAccount() {
  if (typeof window === "undefined") {
    throw new Error("getOrCreateBurnerAccount can only run in the browser");
  }

  let privateKey = window.localStorage.getItem(STORAGE_KEY) as `0x${string}` | null;
  if (!privateKey) {
    privateKey = generatePrivateKey();
    window.localStorage.setItem(STORAGE_KEY, privateKey);
  }
  return createAccount(privateKey);
}

export function resetBurnerAccount() {
  if (typeof window !== "undefined") {
    window.localStorage.removeItem(STORAGE_KEY);
  }
}
