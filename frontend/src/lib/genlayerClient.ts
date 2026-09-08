import { createClient } from "genlayer-js";
import { studionet } from "genlayer-js/chains";
import type { Account, Address } from "viem";
import { getOrCreateBurnerAccount } from "./wallet";

/**
 * Set this after deploying contracts/rule_of_law.py in GenLayer Studio.
 * Kept as an env var (not hardcoded) so redeploying the contract never
 * requires touching application code.
 */
export const CONTRACT_ADDRESS = (process.env.NEXT_PUBLIC_CONTRACT_ADDRESS ??
  "0x0D9E8a769432b4A07182147fDcaFF41e93d4d93C") as Address;

export const client = createClient({ chain: studionet });

/**
 * Thin wrapper around readContract for our contract's view methods.
 * `args` order must match the Python method signature exactly.
 *
 * Importantly, this attaches the burner wallet's address as the sender
 * even for read calls. Leaving it unset causes genlayer-js to default
 * the sender to the zero address (0x000...000), which GenLayer's network
 * rejects outright with a generic "missing or invalid parameters" error
 * — for every method, regardless of arguments.
 */
export async function readRuleOfLaw<T = unknown>(
  functionName: string,
  args: (string | number | boolean | bigint)[] = []
): Promise<T> {
  const account = typeof window !== "undefined" ? getOrCreateBurnerAccount() : undefined;
  return client.readContract({
    address: CONTRACT_ADDRESS,
    account,
    functionName,
    args,
  }) as Promise<T>;
}

/**
 * Thin wrapper around writeContract + waitForTransactionReceipt for our
 * contract's write methods. Returns the finalized receipt once consensus
 * settles. The method's own return value is NOT reliably decoded here —
 * callers should re-read contract state (e.g. get_rulings_count) after
 * this resolves rather than trying to parse the receipt directly.
 */
export async function writeRuleOfLaw(
  account: Account,
  functionName: string,
  args: (string | number | boolean | bigint)[] = []
) {
  const txHash = await client.writeContract({
    account,
    address: CONTRACT_ADDRESS,
    functionName,
    args,
    value: BigInt(0),
  });

  return client.waitForTransactionReceipt({ hash: txHash });
}
