// eslint-disable-next-line import/no-unresolved
import { GridClient, NetworkEnv } from "grid3_client";

// eslint-disable-next-line import/no-unresolved
import { HTTPMessageBusClient } from "ts-rmb-http-client";

export function required(msg: string) {
  return (value: unknown) => (value === "" || value === null || value === undefined ? msg : true);
}

export function minLength(min: number, msg: string) {
  return (value: string) => (`${value}`.length < min ? msg : true);
}

export function maxLength(max: number, msg: string) {
  return (value: string) => (`${value}`.length > max ? msg : true);
}

// prettier-ignore
export async function testMnemonicOnGrid(network: NetworkEnv, mnemonics: string): Promise<boolean> {
  const grid = new GridClient(
    network,
    mnemonics,
    "storeSecret",
    new HTTPMessageBusClient(0, "", "", ""),
  );

  try {
    await grid.connect();
    await grid.disconnect();
    return true;
  } catch {
    return false;
  }
}
