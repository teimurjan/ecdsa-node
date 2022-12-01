import { useMemo } from "react";
import * as secp from "ethereum-cryptography/secp256k1";
import { toHex } from "ethereum-cryptography/utils";

export const useAddress = (privateKey) => {
  const address = useMemo(() => {
    try {
      return toHex(secp.getPublicKey(privateKey));
    } catch (e) {
      return undefined;
    }
  }, [privateKey]);

  return address;
};
